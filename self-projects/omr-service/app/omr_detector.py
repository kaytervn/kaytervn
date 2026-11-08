#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
omr_detector.py - Vietnamese OMR answer-sheet bubble detector (detection only).

Template: "PHIEU TO TRAC NGHIEM" with six black square alignment markers.
Detects:
  * Multiple choice Q1-10 and Q11-20 (options A-D)
  * True/False Cau 1-4, sub-questions a-d, options Dung (Đ) / Sai (S)
  * Student ID (SBD): 2 digit columns, each column has rows 0-9
  * Exam code (Ma de thi): 3 digit columns, each column has rows 0-9
Ignores: name/class and the essay area.

Grading: compares detected answers with a per-exam-code answer-key JSON, writes
result.json (stable schema for a UI) and grading_result.png.

Usage:
    python omr_detector.py sheet.png                                  # detection only
    python omr_detector.py sheet.png --answer-keys keys.json --out-dir out
    python omr_detector.py sheet.png --answer-keys keys.json --json-only --show-correct
    python omr_detector.py --dump-answer-key-example keys.json        # key file template
    python omr_detector.py sheet.jpg --out-dir debug --verbose
    python omr_detector.py sheet.jpg --filled 30 --empty 10 --dark-delta 50
    python omr_detector.py sheet.png --dump-layout layout.json   # edit, then:
    python omr_detector.py sheet.png --layout layout.json

Pipeline
    1. load + validate  2. grayscale + blur  3. Otsu binarisation (markers only)
    4. alignment marker detection / matching  5. homography warp to a normalised
    canvas (REF layout x SCALE) + illumination flattening  6. per-block ring-template
    calibration of bubble positions  7. measurement of the INNER bubble area
    (printed outline excluded), faint-mark, tick and scribble signals
    8. classification  9. console report + debug images.

Coordinates: every layout number is in "reference pixels", i.e. pixels of the
template image (599 x 710). The warped sheet is that reference frame multiplied
by CONFIG["scale"]. To adapt to another sheet change LAYOUT only - detection
code never contains coordinates.
"""

import argparse
import copy
import json
import os
import sys
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np

# --------------------------------------------------------------------------- #
# 1. LAYOUT (coordinates, reference pixels of the sample image)               #
# --------------------------------------------------------------------------- #
LAYOUT = {
    "ref_size": [607, 652],  # width, height of the reference sheet
    "bubble_radius": 5.6,  # radius of the printed circle (centre-line)
    # Only the 4 big corner squares are used for alignment.
    "markers": [
        [49.0, 109.9],
        [553.0, 109.9],
        [48.9, 368.0],
        [553.5, 368.0],
    ],
    # The 4 corner squares (top-left, top-right, bottom-left, bottom-right) and their size.
    "corner_markers": [[49.0, 109.9], [553.0, 109.9], [48.9, 368.0], [553.5, 368.0]],
    "corner_marker_size": 15.0,
    # Reference-px rectangle a camera client must crop (corners + margin) before upload.
    "capture_region": [33.0, 94.0, 570.0, 384.0],
    # Multiple choice: bubble (row i, option j) is at (x[j], y0 + i*dy)
    "mc_blocks": [
        {
            "name": "MC-1",
            "first_q": 1,
            "n": 10,
            "options": ["A", "B", "C", "D"],
            "x": [71.4, 91.6, 112.4, 133.4],
            "y0": 152.75,
            "dy": 21.33,
        },
        {
            "name": "MC-2",
            "first_q": 11,
            "n": 10,
            "options": ["A", "B", "C", "D"],
            "x": [186.4, 206.6, 227.4, 247.6],
            "y0": 152.75,
            "dy": 21.33,
        },
    ],
    # True/False: x = [Dung, Sai]; y = rows a, b, c, d
    "tf_blocks": [
        {"question": 1, "x": [305.6, 331.6], "y": [173.9, 195.2, 216.6, 237.9]},
        {"question": 2, "x": [357.6, 383.6], "y": [173.9, 195.2, 216.6, 237.9]},
        {"question": 3, "x": [305.6, 331.6], "y": [303.9, 325.2, 346.6, 367.9]},
        {"question": 4, "x": [357.6, 383.6], "y": [303.9, 325.2, 346.6, 367.9]},
    ],
    "tf_options": ["Đ", "S"],
    "tf_rows": ["a", "b", "c", "d"],
    # Digit-column blocks: each x is one digit column, rows are digits 0..9.
    "id_blocks": [
        {
            "name": "SBD",
            "title": "STUDENT ID (SBD)",
            "x": [436.6, 457.4],
            "y0": 152.75,
            "dy": 21.33,
            "digits": list("0123456789"),
        },
        {
            "name": "MADE",
            "title": "EXAM CODE (MÃ ĐỀ)",
            "x": [510.4, 531.4, 553.4],
            "y0": 152.75,
            "dy": 21.33,
            "digits": list("0123456789"),
        },
    ],
    # Area (reference px) cropped for debug / grading images
    "debug_crop": [38, 120, 566, 384],
}

# --------------------------------------------------------------------------- #
# 2. CONFIG (all tunable parameters)                                          #
# --------------------------------------------------------------------------- #
CONFIG = {
    "scale": 4,  # warped canvas = reference size * scale
    "work_width": 1122,  # width used for marker detection only
    "blur_ksize": 3,  # Gaussian blur on gray before marker detection
    "warp_blur_ksize": 5,  # light blur on warped gray (odd, keep small!)
    # marker detection (measured in work-image pixels)
    "marker_min_delta": 12,  # min gray drop vs paper to count as marker (faint squares)
    "marker_min_extent": 0.65,  # contour area / bounding-box area
    "marker_max_aspect": 2.2,  # bbox long/short side
    "marker_match_radius": 60.0,  # reference px; initial match tolerance
    "marker_min_matches": 4,
    "marker_max_rms": 3.0,  # reference px; alignment rejected above this
    # bubble measurement
    "inner_frac": 0.55,  # inner ROI radius = frac * bubble radius
    "snap_px": 3.0,  # max block-level position correction (ref px)
    "snap_min_score": 0.25,  # min ring-template correlation to be trusted
    # paper level / dark pixel threshold
    "dark_delta": 60,  # pixel is dark if gray < paper - dark_delta
    "dark_min": 60,  # clamp of the dark threshold
    "dark_max": 200,
    # classification (percentages of dark pixels in the inner ROI)
    "filled_thr": 35.0,  # >= FILLED
    "empty_thr": 12.0,  # <  EMPTY ; in between -> AMBIGUOUS
    "min_contrast": 8.0,  # FILLED needs mean-gray drop (%) >= this
    "rel_promote_margin": 25.0,  # ambiguous bubble this far above all others
    "rel_promote_min": 20.0,  #   and at least this dark -> treated as FILLED
    # illumination flattening (photos with shadows / gray paper)
    "flatten_kernel": 31,  # reference px; must be larger than a filled bubble
    "flatten_blur": 21,  # reference px; smoothing of the paper-level map
    # faint marks / erased residue
    "light_delta": 25,  # pixel is "tinted" if gray < paper - light_delta
    "tint_thr": 40.0,  # % tinted pixels -> light mark (AMBIGUOUS)
    "ignore_faint_when_solid": True,  # faint-only bubbles ignored if one solid mark exists
    # scribble / smear (ink outside the bubble, between the options)
    "bleed_delta": 45,  # pixel is "ink" in a gap if gray < paper - bleed_delta
    "bleed_thr": 15.0,  # % ink in a gap between two options -> SCRIBBLE/SMEAR
    # tick / cross / uneven fill
    "solid_thr": 75.0,  # fill >= this is always accepted as a solid mark
    "quad_thr": 30.0,  # max-min fill between the 4 quadrants -> uneven
}

COLORS = {  # BGR
    "valid": (0, 170, 0),  # green
    "multiple": (0, 0, 230),  # red
    "ambiguous": (0, 140, 255),  # orange
    "blank": (230, 100, 0),  # blue
    "unselected": (150, 150, 150),  # gray
}

EMPTY, FILLED, AMBIG = "EMPTY", "FILLED", "AMBIGUOUS"


# --------------------------------------------------------------------------- #
# Data containers                                                              #
# --------------------------------------------------------------------------- #
@dataclass
class Bubble:
    option: str
    cx: float  # warped-canvas coordinates (after calibration)
    cy: float
    r: float
    fill: float = 0.0  # % dark pixels in inner ROI
    contrast: float = 0.0  # % mean-gray drop vs paper
    mean_gray: float = 0.0
    tint: float = 0.0  # % pixels slightly darker than paper (light marks)
    quad_spread: float = 0.0  # max-min fill over the 4 quadrants (tick/cross/uneven)
    state: str = EMPTY
    note: str = ""  # why the bubble is ambiguous / ignored


@dataclass
class Question:
    group: str  # "MC" or "TF"
    name: str  # e.g. "Q01" / "Q01-a"
    bubbles: List[Bubble] = field(default_factory=list)
    status: str = "BLANK"  # VALID / BLANK / MULTIPLE / AMBIGUOUS
    answer: str = ""  # selected option or "" / "MULTIPLE (A, B)" ...
    detail: str = ""
    bleed: float = 0.0  # max % ink found in the gaps between options
    ignored: str = ""  # faint residue ignored because a solid mark exists
    number: int = 0  # question number (MC / TF) or 1-based column (ID)
    item: Optional[str] = None  # TF sub-question letter a-d
    expected: Optional[str] = None  # answer key value (filled by grading)
    result: str = ""  # correct / wrong / blank / needs_review (filled by grading)


class OMRError(Exception):
    """Raised when the sheet cannot be read or aligned. `code` is machine readable."""

    def __init__(self, message: str, code: str = "OMR_ERROR"):
        super().__init__(message)
        self.message = message
        self.code = code


# --------------------------------------------------------------------------- #
# Detector                                                                     #
# --------------------------------------------------------------------------- #
class OMRDetector:
    def __init__(self, layout: dict = None, config: dict = None, verbose=False):
        self.layout = copy.deepcopy(layout or LAYOUT)
        self.cfg = copy.deepcopy(CONFIG)
        if config:
            self.cfg.update(config)
        self.verbose = verbose
        self.S = int(self.cfg["scale"])
        self.ref_w, self.ref_h = self.layout["ref_size"]
        self.original = None
        self.region = (
            None  # reference-px rectangle the input image covers (None = whole sheet)
        )
        self.warped = None  # BGR, normalised sheet
        self.warped_gray = None  # blurred gray
        self.paper_level = 255.0
        self.dark_thr = 150
        self.block_offsets: Dict[str, Tuple[float, float, int, int]] = {}
        self.questions: List[Question] = []

    # ------------------------------------------------------------------ #
    # 1. Load                                                             #
    # ------------------------------------------------------------------ #
    def load(self, path: str):
        if not os.path.isfile(path):
            raise OMRError(
                f"Không tìm thấy ảnh đầu vào: {path}", code="IMAGE_NOT_FOUND"
            )
        data = np.fromfile(path, dtype=np.uint8)  # also works with unicode paths
        img = cv2.imdecode(data, cv2.IMREAD_COLOR)
        if img is None or img.size == 0:
            raise OMRError(
                "Không đọc được ảnh (định dạng không hợp lệ hoặc ảnh bị hỏng).",
                code="IMAGE_DECODE_FAILED",
            )
        h, w = img.shape[:2]
        if w < 300 or h < 300:
            raise OMRError(
                f"Ảnh quá nhỏ ({w}x{h}); cần tối thiểu 300x300.", code="IMAGE_TOO_SMALL"
            )
        self.original = img
        return img

    # ------------------------------------------------------------------ #
    # 2-5. Marker detection + alignment                                   #
    # ------------------------------------------------------------------ #
    def _find_marker_candidates(
        self, work_gray: np.ndarray
    ) -> List[Tuple[float, float]]:
        """Square blobs darker than the paper (solid or faint), sized like the corner markers."""
        k = self.cfg["blur_ksize"]
        g = cv2.GaussianBlur(work_gray, (k, k), 0)
        bg = float(np.median(g))  # paper level (≈255 after flattening)
        delta = max(self.cfg["marker_min_delta"], bg * 0.12)
        binary = (g < bg - delta).astype(np.uint8) * 255
        binary = cv2.morphologyEx(
            binary, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)
        )  # fill pin-holes of faint squares

        # Expected marker side in work px (input may be a crop of the sheet).
        rx0, _, rx1, _ = self.region or (0.0, 0.0, float(self.ref_w), float(self.ref_h))
        exp = self.layout["corner_marker_size"] * work_gray.shape[1] / float(rx1 - rx0)
        min_area, max_area = (0.4 * exp) ** 2, (
            2.5 * exp
        ) ** 2  # also rejects bubbles / text

        cnts, _ = cv2.findContours(binary, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        out = []
        for c in cnts:
            area = cv2.contourArea(c)
            x, y, w, h = cv2.boundingRect(c)
            if w == 0 or h == 0:
                continue
            if not (min_area <= max(area, w * h * 0.5) <= max_area):
                continue
            extent = max(area, 1) / float(w * h)
            aspect = max(w, h) / float(min(w, h))
            if (
                extent < self.cfg["marker_min_extent"]
                or aspect > self.cfg["marker_max_aspect"]
            ):
                continue
            # Must be darker than paper inside (rejects holes of rings / frames).
            mask = np.zeros(g.shape, np.uint8)
            cv2.drawContours(mask, [c], -1, 255, -1)
            if bg - float(g[mask > 0].mean()) < 1.5 * delta:
                continue
            m = cv2.moments(c)
            if m["m00"] > 0:
                out.append((m["m10"] / m["m00"], m["m01"] / m["m00"]))
            else:
                out.append((x + w / 2.0, y + h / 2.0))
        return out

    @staticmethod
    def _fit_transform(src: np.ndarray, dst: np.ndarray) -> Optional[np.ndarray]:
        """3x3 matrix mapping src -> dst. Uses a perspective homography when the
        markers are well spread in 2-D; if (almost) all lie on one line (this
        template: five markers share the same row) a homography is degenerate, so
        a full affine transform (rotation, scale, shear, shift) is fitted instead."""
        # Line through the two most distant markers; count markers far from it.
        d2 = ((dst[:, None, :] - dst[None, :, :]) ** 2).sum(-1)
        i, j = np.unravel_index(np.argmax(d2), d2.shape)
        v = dst[j] - dst[i]
        v = v / (np.linalg.norm(v) + 1e-9)
        n = np.array([-v[1], v[0]])
        off_line = int(
            np.sum(np.abs((dst - dst[i]) @ n) > 20.0)
        )  # > 20 ref px off the line
        if off_line >= 2 and len(src) >= 4:
            H, _ = cv2.findHomography(src, dst, cv2.RANSAC if len(src) >= 5 else 0, 2.5)
            return H
        A, _ = cv2.estimateAffine2D(
            src, dst, method=cv2.LMEDS if len(src) >= 5 else cv2.RANSAC
        )
        if A is None:
            return None
        return np.vstack([A, [0.0, 0.0, 1.0]])

    def align(self):
        """Detect markers, fit a homography and warp the sheet. Raises on failure."""
        img = self.original
        h0, w0 = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Work image (fixed width) used only for marker finding.
        ws = self.cfg["work_width"] / float(w0)
        work = cv2.resize(gray, None, fx=ws, fy=ws, interpolation=cv2.INTER_CUBIC)
        # Even out shadows (photos): divide by a closing-based paper-level map.
        bg = cv2.morphologyEx(
            work,
            cv2.MORPH_CLOSE,
            cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)),
        )
        bg = cv2.GaussianBlur(bg, (41, 41), 0)
        work = np.clip(
            work.astype(np.float32) * 255.0 / np.maximum(bg.astype(np.float32), 1.0),
            0,
            255,
        ).astype(np.uint8)
        cands = np.array(self._find_marker_candidates(work), dtype=np.float32)
        if len(cands) < self.cfg["marker_min_matches"]:
            raise OMRError(
                code="ALIGNMENT_FAILED",
                message=f"Chỉ tìm thấy {len(cands)} mốc căn chỉnh nên không thể căn phiếu. Hãy chụp lại và đảm bảo thấy rõ 4 hình vuông ở góc.",
            )

        # Candidates expressed in reference coordinates (initial guess = uniform scale).
        # The input may be a crop of the sheet (camera): map it onto its reference region.
        rx0, ry0, rx1, ry1 = self.region or (
            0.0,
            0.0,
            float(self.ref_w),
            float(self.ref_h),
        )
        sx = (rx1 - rx0) / float(work.shape[1])
        sy = (ry1 - ry0) / float(work.shape[0])
        cands_ref = cands * np.array([sx, sy], dtype=np.float32) + np.array(
            [rx0, ry0], dtype=np.float32
        )
        ref_pts = np.array(self.layout["markers"], dtype=np.float32)

        radius = self.cfg["marker_match_radius"]
        H = None  # maps work px -> reference px
        src_m = dst_m = None
        for it in range(4):
            if H is None:
                cur = cands_ref
            else:
                cur = cv2.perspectiveTransform(cands.reshape(-1, 1, 2), H).reshape(
                    -1, 2
                )
            src, dst, used = [], [], set()
            for ri, rp in enumerate(ref_pts):
                d = np.linalg.norm(cur - rp, axis=1)
                j = int(np.argmin(d))
                if d[j] <= radius and j not in used:
                    used.add(j)
                    src.append(cands[j])
                    dst.append(rp)
            if len(src) < self.cfg["marker_min_matches"]:
                raise OMRError(
                    code="ALIGNMENT_FAILED",
                    message=f"Chỉ khớp được {len(src)}/{self.cfg['marker_min_matches']} mốc căn chỉnh. "
                    f"Hãy chụp lại sao cho thấy toàn bộ phần trắc nghiệm.",
                )
            src_m = np.array(src, dtype=np.float32)
            dst_m = np.array(dst, dtype=np.float32)
            H = self._fit_transform(src_m, dst_m)
            if H is None:
                raise OMRError(
                    code="ALIGNMENT_FAILED",
                    message="Không tính được phép căn chỉnh phiếu. Hãy chụp lại.",
                )
            radius = max(radius * 0.5, 4.0)

        # Verify alignment quality on all matched markers.
        proj = cv2.perspectiveTransform(src_m.reshape(-1, 1, 2), H).reshape(-1, 2)
        err = np.linalg.norm(proj - dst_m, axis=1)
        rms = float(np.sqrt(np.mean(err**2)))
        if rms > self.cfg["marker_max_rms"]:
            raise OMRError(
                code="ALIGNMENT_FAILED",
                message=f"Sai số căn chỉnh quá lớn ({rms:.2f} > {self.cfg['marker_max_rms']}). "
                f"Hãy chụp lại, giữ điện thoại thẳng và ổn định.",
            )
        self.align_info = {"markers_matched": len(src_m), "rms": rms}

        # Compose: original px -> work px -> reference px -> canvas px
        S = self.S
        A_work = np.array([[ws, 0, 0], [0, ws, 0], [0, 0, 1]], dtype=np.float64)
        A_canvas = np.array([[S, 0, 0], [0, S, 0], [0, 0, 1]], dtype=np.float64)
        Ht = A_canvas @ H @ A_work
        size = (int(self.ref_w * S), int(self.ref_h * S))
        self.warped = cv2.warpPerspective(
            img, Ht, size, flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
        )
        wg = cv2.cvtColor(self.warped, cv2.COLOR_BGR2GRAY)
        wg = self._flatten(wg)
        k = self.cfg["warp_blur_ksize"]
        self.warped_gray = cv2.GaussianBlur(wg, (k, k), 0) if k > 1 else wg

    def _flatten(self, gray: np.ndarray) -> np.ndarray:
        """Divide by a local paper-level map so shadows / gray paper become ~255.
        The map comes from a morphological closing (removes ink smaller than the
        kernel) computed at reference resolution, so it is fast."""
        S = self.S
        small = cv2.resize(
            gray, None, fx=1.0 / S, fy=1.0 / S, interpolation=cv2.INTER_AREA
        )
        k = int(self.cfg["flatten_kernel"]) | 1
        se = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
        bg = cv2.morphologyEx(small, cv2.MORPH_CLOSE, se)
        kb = int(self.cfg["flatten_blur"]) | 1
        bg = cv2.GaussianBlur(bg, (kb, kb), 0)
        bg = cv2.resize(
            bg, (gray.shape[1], gray.shape[0]), interpolation=cv2.INTER_CUBIC
        )
        flat = gray.astype(np.float32) * 255.0 / np.maximum(bg.astype(np.float32), 1.0)
        return np.clip(flat, 0, 255).astype(np.uint8)

    # ------------------------------------------------------------------ #
    # Layout -> bubble list                                               #
    # ------------------------------------------------------------------ #
    def _build_questions(self) -> List[Question]:
        S = self.S
        r = self.layout["bubble_radius"] * S
        qs: List[Question] = []
        for blk in self.layout["mc_blocks"]:
            for i in range(blk["n"]):
                q = Question(
                    "MC", f"Q{blk['first_q'] + i:02d}", number=blk["first_q"] + i
                )
                q.block = blk["name"]
                y = (blk["y0"] + i * blk["dy"]) * S
                for opt, x in zip(blk["options"], blk["x"]):
                    q.bubbles.append(Bubble(opt, x * S, y, r))
                qs.append(q)
        for blk in self.layout["tf_blocks"]:
            name = f"TF-C{blk['question']}"
            for row, y in zip(self.layout["tf_rows"], blk["y"]):
                q = Question(
                    "TF",
                    f"Q{blk['question']:02d}-{row}",
                    number=blk["question"],
                    item=row,
                )
                q.block = name
                for opt, x in zip(self.layout["tf_options"], blk["x"]):
                    q.bubbles.append(Bubble(opt, x * S, y * S, r))
                qs.append(q)
        for blk in self.layout.get("id_blocks", []):
            for ci, x in enumerate(blk["x"]):
                q = Question("ID", f"{blk['name']}-{ci + 1}", number=ci + 1)
                q.block = blk["name"]
                for di, d in enumerate(blk["digits"]):
                    q.bubbles.append(
                        Bubble(d, x * S, (blk["y0"] + di * blk["dy"]) * S, r)
                    )
                qs.append(q)
        return qs

    # ------------------------------------------------------------------ #
    # 6. Block-level position calibration (ring template matching)        #
    # ------------------------------------------------------------------ #
    def _calibrate_blocks(self, questions: List[Question]):
        S = self.S
        snap = self.cfg["snap_px"] * S
        inv = 255 - self.warped_gray
        R = int(round(self.layout["bubble_radius"] * S))
        T = max(2, int(round(S * 1.0)))
        size = 2 * (R + T + 2) + 1
        tpl = np.zeros((size, size), np.uint8)
        c = size // 2
        cv2.circle(tpl, (c, c), R, 255, T, cv2.LINE_AA)
        tpl = cv2.GaussianBlur(tpl, (3, 3), 0)
        half = size // 2
        pad = int(snap)

        by_block: Dict[str, List[Question]] = {}
        for q in questions:
            by_block.setdefault(q.block, []).append(q)

        for name, qlist in by_block.items():
            offs = []
            total = 0
            for q in qlist:
                for b in q.bubbles:
                    total += 1
                    x0, y0 = (
                        int(round(b.cx)) - half - pad,
                        int(round(b.cy)) - half - pad,
                    )
                    x1, y1 = x0 + size + 2 * pad, y0 + size + 2 * pad
                    if x0 < 0 or y0 < 0 or x1 > inv.shape[1] or y1 > inv.shape[0]:
                        continue
                    win = inv[y0:y1, x0:x1]
                    res = cv2.matchTemplate(win, tpl, cv2.TM_CCOEFF_NORMED)
                    _, mx, _, loc = cv2.minMaxLoc(res)
                    if mx >= self.cfg["snap_min_score"]:
                        offs.append((loc[0] - pad, loc[1] - pad))
            if len(offs) >= max(3, total // 2):
                dx = float(np.median([o[0] for o in offs]))
                dy = float(np.median([o[1] for o in offs]))
                dx = float(np.clip(dx, -snap, snap))
                dy = float(np.clip(dy, -snap, snap))
            else:
                dx = dy = 0.0
            self.block_offsets[name] = (dx / S, dy / S, len(offs), total)
            for q in qlist:
                for b in q.bubbles:
                    b.cx += dx
                    b.cy += dy

    # ------------------------------------------------------------------ #
    # 7. Measurement                                                      #
    # ------------------------------------------------------------------ #
    def _inner_mask_stats(self, b: Bubble):
        g = self.warped_gray
        rin = max(2.0, b.r * self.cfg["inner_frac"])
        x0, x1 = int(np.floor(b.cx - rin)) - 1, int(np.ceil(b.cx + rin)) + 2
        y0, y1 = int(np.floor(b.cy - rin)) - 1, int(np.ceil(b.cy + rin)) + 2
        x0, y0 = max(x0, 0), max(y0, 0)
        x1, y1 = min(x1, g.shape[1]), min(y1, g.shape[0])
        roi = g[y0:y1, x0:x1]
        yy, xx = np.mgrid[y0:y1, x0:x1]
        mask = (xx - b.cx) ** 2 + (yy - b.cy) ** 2 <= rin**2
        return roi[mask].astype(np.float32)

    def _gap_ink(self, x0, x1, y0, y1, thr) -> float:
        g = self.warped_gray
        x0, x1 = max(int(x0), 0), min(int(x1), g.shape[1])
        y0, y1 = max(int(y0), 0), min(int(y1), g.shape[0])
        if x1 - x0 < 2 or y1 - y0 < 2:
            return 0.0
        return float((g[y0:y1, x0:x1] < thr).mean() * 100.0)

    def _measure(self, questions: List[Question]):
        c = self.cfg
        # Paper level = upper-middle percentile of inner-ROI means (flattened
        # image, so this is ~250 on any sheet).
        means = []
        for q in questions:
            for b in q.bubbles:
                px = self._inner_mask_stats(b)
                b.mean_gray = float(px.mean()) if px.size else 255.0
                means.append(b.mean_gray)
        self.paper_level = float(np.percentile(means, 75))
        self.dark_thr = float(
            np.clip(self.paper_level - c["dark_delta"], c["dark_min"], c["dark_max"])
        )
        light_thr = self.paper_level - c["light_delta"]
        bleed_thr = self.paper_level - c["bleed_delta"]
        g = self.warped_gray

        for q in questions:
            for b in q.bubbles:
                px = self._inner_mask_stats(b)
                if px.size == 0:
                    continue
                b.fill = float((px < self.dark_thr).mean() * 100.0)
                b.tint = float((px < light_thr).mean() * 100.0)
                b.contrast = float(
                    max(
                        0.0,
                        (self.paper_level - px.mean())
                        / max(self.paper_level, 1.0)
                        * 100.0,
                    )
                )
                # Quadrant balance: ticks/crosses/strokes darken only some quadrants.
                rin = max(2.0, b.r * c["inner_frac"])
                x0, x1 = int(b.cx - rin) - 1, int(b.cx + rin) + 2
                y0, y1 = int(b.cy - rin) - 1, int(b.cy + rin) + 2
                x0, y0 = max(x0, 0), max(y0, 0)
                roi = g[y0:y1, x0:x1]
                yy, xx = np.mgrid[y0 : y0 + roi.shape[0], x0 : x0 + roi.shape[1]]
                inside = (xx - b.cx) ** 2 + (yy - b.cy) ** 2 <= rin**2
                quads = []
                for qx in (xx < b.cx, xx >= b.cx):
                    for qy in (yy < b.cy, yy >= b.cy):
                        m = inside & qx & qy
                        if m.any():
                            quads.append(float((roi[m] < self.dark_thr).mean() * 100.0))
                b.quad_spread = (max(quads) - min(quads)) if quads else 0.0
            # Ink in the gaps between neighbouring options of this question.
            q.bleed = 0.0
            for b1, b2 in zip(q.bubbles[:-1], q.bubbles[1:]):
                if abs(b2.cx - b1.cx) >= abs(b2.cy - b1.cy):  # neighbours side by side
                    gx0, gx1 = b1.cx + 1.25 * b1.r, b2.cx - 1.25 * b2.r
                    gy0, gy1 = (b1.cy + b2.cy) / 2 - 0.5 * b1.r, (
                        b1.cy + b2.cy
                    ) / 2 + 0.5 * b1.r
                else:  # neighbours stacked (digit columns)
                    gy0, gy1 = b1.cy + 1.25 * b1.r, b2.cy - 1.25 * b2.r
                    gx0, gx1 = (b1.cx + b2.cx) / 2 - 0.5 * b1.r, (
                        b1.cx + b2.cx
                    ) / 2 + 0.5 * b1.r
                q.bleed = max(q.bleed, self._gap_ink(gx0, gx1, gy0, gy1, bleed_thr))

    # ------------------------------------------------------------------ #
    # 8. Classification                                                   #
    # ------------------------------------------------------------------ #
    def _classify(self, q: Question):
        c = self.cfg
        for b in q.bubbles:
            b.note = ""
            solid = b.fill >= c["filled_thr"] and b.contrast >= c["min_contrast"]
            if solid and b.fill < c["solid_thr"] and b.quad_spread > c["quad_thr"]:
                b.state, b.note = AMBIG, "uneven/tick/cross"
            elif solid:
                b.state = FILLED
            elif b.fill < c["empty_thr"] and b.tint < c["tint_thr"]:
                b.state = EMPTY
            elif b.fill < c["empty_thr"]:
                b.state, b.note = AMBIG, "light mark/erased residue"
            else:
                b.state, b.note = AMBIG, "partial fill"
        # Relative signal: a lightly filled bubble that clearly stands out from
        # every other option of the same question is promoted to FILLED.
        for b in q.bubbles:
            if (
                b.state == AMBIG
                and b.note == "partial fill"
                and b.fill >= c["rel_promote_min"]
                and b.contrast >= c["min_contrast"]
                and b.quad_spread <= c["quad_thr"]
            ):
                others = [o.fill for o in q.bubbles if o is not b]
                if others and b.fill - max(others) >= c["rel_promote_margin"]:
                    b.state, b.note = FILLED, ""

        # Faint residue (e.g. an erased answer) next to exactly one solid mark is ignored.
        q.ignored = ""
        filled = [b for b in q.bubbles if b.state == FILLED]
        if c["ignore_faint_when_solid"] and len(filled) == 1:
            faint = [
                b for b in q.bubbles if b.state == AMBIG and b.note.startswith("light")
            ]
            for b in faint:
                b.state = EMPTY
            if faint:
                q.ignored = ", ".join(b.option for b in faint)

        filled = [b for b in q.bubbles if b.state == FILLED]
        amb = [b for b in q.bubbles if b.state == AMBIG]
        # Ink between options = scribble / smear / cross-out -> never guess.
        if q.bleed >= c["bleed_thr"] and (filled or amb):
            q.status = "AMBIGUOUS"
            q.answer = (
                "AMBIGUOUS (SCRIBBLE/SMEAR: "
                + ", ".join(b.option for b in filled + amb)
                + ")"
            )
            q.detail = f"ink between options {q.bleed:.0f}%"
            for b in filled:
                b.state, b.note = AMBIG, "scribble/smear"
            return
        if len(filled) >= 2:
            q.status = "MULTIPLE"
            q.answer = "MULTIPLE (" + ", ".join(b.option for b in filled) + ")"
        elif len(filled) == 1 and not amb:
            q.status = "VALID"
            q.answer = filled[0].option
        elif len(filled) == 0 and not amb:
            q.status = "BLANK"
            q.answer = "BLANK"
        else:  # unclear: never guess
            q.status = "AMBIGUOUS"
            parts = [
                f"{b.option}{'*' if b.state == FILLED else '?'}" for b in filled + amb
            ]
            q.answer = "AMBIGUOUS (" + ", ".join(parts) + ")"
            q.detail = "; ".join(f"{b.option}: {b.note}" for b in amb if b.note)

    # ------------------------------------------------------------------ #
    # Main entry                                                          #
    # ------------------------------------------------------------------ #
    def run(self, path: str) -> List[Question]:
        self.load(path)
        self.align()
        qs = self._build_questions()
        self._calibrate_blocks(qs)
        self._measure(qs)
        for q in qs:
            self._classify(q)
        self.questions = qs
        return qs

    # ------------------------------------------------------------------ #
    # 6. Console output                                                   #
    # ------------------------------------------------------------------ #
    def print_report(self):
        print(
            f"Alignment: {self.align_info['markers_matched']} markers matched, "
            f"RMS error {self.align_info['rms']:.2f} ref-px"
        )
        for n, (dx, dy, ok, tot) in self.block_offsets.items():
            print(
                f"Calibration {n}: offset dx={dx:+.2f} dy={dy:+.2f} ref-px "
                f"({ok}/{tot} rings located)"
            )
        print(
            f"Paper level: {self.paper_level:.1f} | dark threshold: gray < {self.dark_thr:.0f}"
        )
        print(
            f"Thresholds: filled>={self.cfg['filled_thr']}%  empty<{self.cfg['empty_thr']}%  "
            f"min_contrast>={self.cfg['min_contrast']}%\n"
        )

        def line(q: Question):
            cols = " | ".join(f"{b.option}: {b.fill:04.1f}%" for b in q.bubbles)
            print(f"{q.name} | {cols}")
            tag = " | VALID" if q.status == "VALID" else ""
            print(f"     DETECTED: {q.answer}{tag}")
            if q.detail:
                print(f"     REASON: {q.detail}")
            if q.ignored:
                print(f"     NOTE: faint residue ignored on {q.ignored}")
            if self.verbose:
                for b in q.bubbles:
                    print(
                        f"       [{b.option}] state={b.state:<9} fill={b.fill:5.1f}% "
                        f"tint={b.tint:5.1f}% contrast={b.contrast:5.1f}% quadSpread={b.quad_spread:5.1f} "
                        f"gap-ink(q)={q.bleed:4.1f}% "
                        f"center=({b.cx / self.S:.1f},{b.cy / self.S:.1f})"
                    )
            print()

        print("========== MULTIPLE CHOICE ==========\n")
        for q in self.questions:
            if q.group == "MC":
                line(q)
        print("========== TRUE / FALSE ==========\n")
        for q in self.questions:
            if q.group == "TF":
                line(q)
        for blk in self.layout.get("id_blocks", []):
            print(f"========== {blk['title']} ==========\n")
            cols = [
                q for q in self.questions if q.group == "ID" and q.block == blk["name"]
            ]
            for q in cols:
                line(q)
            print(
                f"{blk['name']} VALUE: {self.id_string(cols)}   "
                f"(_ = blank, * = multiple, ? = ambiguous)\n"
            )

        print("========== DETECTION SUMMARY ==========\n")
        groups = [("MC", "Multiple choice"), ("TF", "True/False")]
        for blk in self.layout.get("id_blocks", []):
            groups.append((blk["name"], blk["title"]))
        for grp, title in groups:
            qs = [
                q
                for q in self.questions
                if q.group == grp or (q.group == "ID" and q.block == grp)
            ]
            cnt = lambda st: sum(1 for q in qs if q.status == st)
            print(f"{title}:")
            print(f"Total: {len(qs)}")
            print(f"Valid: {cnt('VALID')}")
            print(f"Blank: {cnt('BLANK')}")
            print(f"Multiple: {cnt('MULTIPLE')}")
            print(f"Ambiguous: {cnt('AMBIGUOUS')}\n")

    @staticmethod
    def id_string(cols: List[Question]) -> str:
        """Digits of an ID/exam-code block; one character per column."""
        sym = {"BLANK": "_", "MULTIPLE": "*", "AMBIGUOUS": "?"}
        return "".join(q.answer if q.status == "VALID" else sym[q.status] for q in cols)

    # ------------------------------------------------------------------ #
    # 7. Debug images                                                     #
    # ------------------------------------------------------------------ #
    @staticmethod
    def _ascii(s: str) -> str:
        """cv2.putText cannot draw Đ; use plain ASCII on images."""
        return s.replace("Đ", "D")

    def _q_color(self, q: Question):
        return {
            "VALID": COLORS["valid"],
            "MULTIPLE": COLORS["multiple"],
            "AMBIGUOUS": COLORS["ambiguous"],
            "BLANK": COLORS["blank"],
        }[q.status]

    def _bubble_color(self, q: Question, b: Bubble):
        if q.status == "BLANK":
            return COLORS["blank"]
        if b.state == FILLED:
            return self._q_color(q)
        if b.state == AMBIG:
            return COLORS["ambiguous"]
        return COLORS["unselected"]

    def save_debug_images(self, out_dir: str):
        os.makedirs(out_dir, exist_ok=True)
        cv2.imwrite(os.path.join(out_dir, "debug_original.png"), self.original)
        cv2.imwrite(os.path.join(out_dir, "debug_warped.png"), self.warped)
        cv2.imwrite(
            os.path.join(out_dir, "debug_detection.png"), self._draw_detection()
        )
        cv2.imwrite(
            os.path.join(out_dir, "debug_bubbles.png"), self._draw_bubble_crops()
        )

    def _draw_detection(self) -> np.ndarray:
        """Answer area cropped from the warped sheet, enlarged and annotated."""
        S = self.S
        D = 6.0  # output pixels per reference pixel
        x0r, y0r, x1r, y1r = self.layout["debug_crop"]  # answer area (reference px)
        crop = self.warped[int(y0r * S) : int(y1r * S), int(x0r * S) : int(x1r * S)]
        f = D / S
        canvas = cv2.resize(crop, None, fx=f, fy=f, interpolation=cv2.INTER_CUBIC)
        ox, oy = x0r * S, y0r * S

        def P(x, y):
            return int(round((x - ox) * f)), int(round((y - oy) * f))

        for q in self.questions:
            col_q = self._q_color(q)
            last = q.bubbles[-1]
            for b in q.bubbles:
                col = self._bubble_color(q, b)
                cx, cy = P(b.cx, b.cy)
                rr = int(round(b.r * f))
                ri = int(round(b.r * self.cfg["inner_frac"] * f))
                thick = 3 if b.state == FILLED else 1
                cv2.circle(canvas, (cx, cy), rr + 2, col, thick, cv2.LINE_AA)
                cv2.circle(canvas, (cx, cy), ri, col, 1, cv2.LINE_AA)  # measured area
                cv2.putText(
                    canvas,
                    f"{b.fill:.0f}",
                    (cx + rr + 6, cy + 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    col,
                    1,
                    cv2.LINE_AA,
                )
            # Question tag after the last option (kept short to avoid clutter).
            short = {
                "VALID": q.answer,
                "BLANK": "BLK",
                "MULTIPLE": "MUL",
                "AMBIGUOUS": "AMB",
            }[q.status]
            lx, ly = P(last.cx, last.cy)
            if q.group == "ID":  # digit columns: tag below the last bubble
                cv2.putText(
                    canvas,
                    self._ascii(short),
                    (lx - 8, ly + int(last.r * f) + 26),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    col_q,
                    2,
                    cv2.LINE_AA,
                )
            else:
                name = q.name[1:] if q.group == "MC" else q.name[1:]
                cv2.putText(
                    canvas,
                    f"{name}:{self._ascii(short)}",
                    (lx + int(last.r * f) + 46, ly + 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.4,
                    col_q,
                    1,
                    cv2.LINE_AA,
                )

        # Legend
        legend = [
            ("Single selection", COLORS["valid"]),
            ("Multiple", COLORS["multiple"]),
            ("Ambiguous", COLORS["ambiguous"]),
            ("Blank", COLORS["blank"]),
            ("Unselected", COLORS["unselected"]),
        ]
        pad = 40
        bar = np.full((pad, canvas.shape[1], 3), 255, np.uint8)
        x = 10
        for text, col in legend:
            cv2.rectangle(bar, (x, 10), (x + 20, 30), col, -1)
            cv2.putText(
                bar,
                text,
                (x + 28, 26),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 0),
                1,
                cv2.LINE_AA,
            )
            x += 200
        return np.vstack([bar, canvas])

    def _draw_bubble_crops(self) -> np.ndarray:
        """One cell per question: enlarged crop of every bubble + metrics.
        MC/TF cells are tiled 3 per row; digit columns get one wide row each."""
        gray3 = cv2.cvtColor(self.warped_gray, cv2.COLOR_GRAY2BGR)
        label_w = 120

        def make_cell(q: Question, tile: int, width_slots: int) -> np.ndarray:
            cell_h = tile + 24
            cell = np.full(
                (cell_h, label_w + width_slots * (tile + 6), 3), 255, np.uint8
            )
            col_q = self._q_color(q)
            cv2.rectangle(cell, (0, 0), (cell.shape[1] - 1, cell_h - 1), col_q, 2)
            cv2.putText(
                cell,
                q.name,
                (6, 22),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 0),
                1,
                cv2.LINE_AA,
            )
            short = q.answer if q.status == "VALID" else q.status
            cv2.putText(
                cell,
                self._ascii(short)[:14],
                (6, 48),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                col_q,
                1,
                cv2.LINE_AA,
            )
            for i, b in enumerate(q.bubbles):
                half = int(b.r * 1.7)
                x0, y0 = max(int(b.cx) - half, 0), max(int(b.cy) - half, 0)
                crop = gray3[y0 : y0 + 2 * half, x0 : x0 + 2 * half]
                if crop.size == 0:
                    continue
                crop = cv2.resize(crop, (tile, tile), interpolation=cv2.INTER_CUBIC)
                col = self._bubble_color(q, b)
                c = tile // 2
                sc = tile / (2.0 * half)
                cv2.circle(crop, (c, c), int(b.r * sc), col, 1, cv2.LINE_AA)
                cv2.circle(
                    crop,
                    (c, c),
                    int(b.r * self.cfg["inner_frac"] * sc),
                    col,
                    1,
                    cv2.LINE_AA,
                )
                xo = label_w + i * (tile + 6)
                cell[2 : 2 + tile, xo : xo + tile] = crop
                cv2.rectangle(
                    cell,
                    (xo, 2),
                    (xo + tile - 1, 1 + tile),
                    col,
                    2 if b.state == FILLED else 1,
                )
                cv2.putText(
                    cell,
                    f"{self._ascii(b.option)} {b.fill:.0f}%",
                    (xo + 2, tile + 17),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.4,
                    col,
                    1,
                    cv2.LINE_AA,
                )
            return cell

        small = [make_cell(q, 96, 4) for q in self.questions if q.group != "ID"]
        wide = [make_cell(q, 64, 10) for q in self.questions if q.group == "ID"]
        rows = []
        ncols = 3
        for i in range(0, len(small), ncols):
            row = small[i : i + ncols]
            while len(row) < ncols:
                row.append(np.full_like(small[0], 255))
            rows.append(np.hstack(row))
        rows.extend(wide)
        W = max(r.shape[1] for r in rows)
        rows = [
            (
                r
                if r.shape[1] == W
                else np.hstack(
                    [r, np.full((r.shape[0], W - r.shape[1], 3), 255, np.uint8)]
                )
            )
            for r in rows
        ]
        return np.vstack(rows)


# --------------------------------------------------------------------------- #
# ANSWER KEYS: loading + validation                                            #
# --------------------------------------------------------------------------- #
SCHEMA_VERSION = "1.0"
MC_OPTIONS = ["A", "B", "C", "D"]
TRUE_ALIASES = {"TRUE", "T", "Đ", "D", "ĐÚNG", "DÚNG", "ĐUNG", "DUNG"}
FALSE_ALIASES = {"FALSE", "F", "S", "SAI"}
SHEET_TO_TF = {"Đ": "TRUE", "S": "FALSE"}  # printed option -> canonical value
TF_TO_SHEET = {v: k for k, v in SHEET_TO_TF.items()}

ANSWER_KEY_EXAMPLE = {
    "exams": [
        {
            "exam_code": "132",
            "multiple_choice": {str(i): MC_OPTIONS[(i - 1) % 4] for i in range(1, 21)},
            "true_false": {
                str(q): {"a": "TRUE", "b": "FALSE", "c": "TRUE", "d": "FALSE"}
                for q in range(1, 5)
            },
        }
    ]
}


def make_issue(
    code: str, message: str, path: str, severity: str = "error", **extra
) -> dict:
    """One validation / processing problem. `path` is an RFC 6901 JSON Pointer
    into the offending document ("" = whole document), so a UI can highlight it."""
    d = {"code": code, "message": message, "path": path, "severity": severity}
    d.update(extra)
    return d


def error_envelope(
    title: str,
    status: int,
    issues: List[dict],
    error_type: str,
    partial_result: Optional[dict] = None,
) -> dict:
    """Standard failure response (RFC 7807 problem-details style + `errors` list)."""
    env = {
        "schema_version": SCHEMA_VERSION,
        "success": False,
        "error": {
            "type": f"omr/errors/{error_type}",
            "title": title,
            "status": status,
            "detail": f"{len(issues)} error(s)",
            "errors": issues,
        },
    }
    if partial_result is not None:
        env["partial_result"] = partial_result
    return env


def normalize_tf(value) -> Optional[str]:
    v = str(value).strip().upper()
    if v in TRUE_ALIASES:
        return "TRUE"
    if v in FALSE_ALIASES:
        return "FALSE"
    return None


def load_json_file(path: str, what: str, code_prefix: str):
    """Returns (data, issues). Reports missing file / bad encoding / bad syntax."""
    if not os.path.isfile(path):
        return None, [
            make_issue(
                f"{code_prefix}_NOT_FOUND", f"Không tìm thấy tệp {what}: {path}", ""
            )
        ]
    try:
        with open(path, encoding="utf-8-sig") as f:
            return json.load(f), []
    except json.JSONDecodeError as e:
        return None, [
            make_issue(
                f"{code_prefix}_INVALID_JSON",
                f"JSON không hợp lệ: {e.msg} (dòng {e.lineno}, cột {e.colno})",
                "",
                line=e.lineno,
                column=e.colno,
            )
        ]
    except UnicodeDecodeError as e:
        return None, [
            make_issue(
                f"{code_prefix}_INVALID_ENCODING",
                "Tệp không phải mã hóa UTF-8 hợp lệ.",
                "",
            )
        ]


def validate_answer_keys(data, layout: dict):
    """Validate the answer-key document against the sheet layout.

    Expected shape (a bare top-level list of exams is accepted too):
      {"exams": [{"exam_code": "132",
                  "multiple_choice": {"1": "A", ... "20": "D"},      # or a list of 20 letters
                  "true_false": {"1": {"a": "TRUE", "b": "FALSE", "c": "TRUE", "d": "FALSE"}, ...}}]}
    TRUE/FALSE also accept T/F, Đ/S, DUNG/SAI (case-insensitive).
    Returns (keys, issues): keys = {exam_code: {"mc": {n: "A"}, "tf": {(n, "a"): "TRUE"}}}.
    """
    issues: List[dict] = []
    keys: Dict[str, dict] = {}
    code_len = len(layout["id_blocks"][-1]["x"])
    mc_numbers = [
        blk["first_q"] + i for blk in layout["mc_blocks"] for i in range(blk["n"])
    ]
    tf_numbers = [blk["question"] for blk in layout["tf_blocks"]]
    tf_rows = layout["tf_rows"]

    exams = data.get("exams") if isinstance(data, dict) else data
    if isinstance(data, dict) and "exams" not in data:
        return keys, [
            make_issue("MISSING_FIELD", 'Thiếu trường bắt buộc "exams".', "/exams")
        ]
    if not isinstance(exams, list):
        return keys, [
            make_issue(
                "INVALID_TYPE",
                '"exams" phải là danh sách các đề.',
                "/exams",
                expected="array",
                actual=type(exams).__name__,
            )
        ]
    if not exams:
        return keys, [
            make_issue(
                "EMPTY_LIST",
                "Cần có ít nhất một mã đề trong danh sách đáp án.",
                "/exams",
            )
        ]

    for i, exam in enumerate(exams):
        ep = f"/exams/{i}"
        if not isinstance(exam, dict):
            issues.append(
                make_issue(
                    "INVALID_TYPE",
                    "Mỗi mã đề phải là một đối tượng.",
                    ep,
                    expected="object",
                    actual=type(exam).__name__,
                )
            )
            continue
        # ---- exam_code
        code = None
        if "exam_code" not in exam:
            issues.append(
                make_issue(
                    "MISSING_FIELD", "Thiếu mã đề (exam_code).", f"{ep}/exam_code"
                )
            )
        else:
            raw = exam["exam_code"]
            code = (
                str(raw).strip()
                if isinstance(raw, (str, int)) and not isinstance(raw, bool)
                else None
            )
            if code is None or not (code.isdigit() and len(code) == code_len):
                issues.append(
                    make_issue(
                        "INVALID_EXAM_CODE",
                        f"Mã đề phải gồm đúng {code_len} chữ số (giữ số 0 đứng đầu).",
                        f"{ep}/exam_code",
                        value=raw,
                    )
                )
                code = None
            elif code in keys:
                issues.append(
                    make_issue(
                        "DUPLICATE_EXAM_CODE",
                        f'Mã đề "{code}" bị trùng.',
                        f"{ep}/exam_code",
                        value=code,
                    )
                )
                code = None
        entry = {"mc": {}, "tf": {}}

        # ---- multiple choice
        mp = f"{ep}/multiple_choice"
        sec = exam.get("multiple_choice")
        if "multiple_choice" not in exam:
            issues.append(
                make_issue(
                    "MISSING_FIELD",
                    "Thiếu phần đáp án trắc nghiệm (multiple_choice).",
                    mp,
                )
            )
        elif isinstance(sec, (dict, list)):
            if isinstance(sec, list):
                if len(sec) != len(mc_numbers):
                    issues.append(
                        make_issue(
                            "INVALID_LENGTH",
                            f"Danh sách trắc nghiệm phải có đúng {len(mc_numbers)} câu.",
                            mp,
                            expected=len(mc_numbers),
                            actual=len(sec),
                        )
                    )
                mapping = {
                    str(n): (v, f"{mp}/{k}")
                    for k, (n, v) in enumerate(zip(mc_numbers, sec))
                }
            else:
                mapping = {str(k).strip(): (v, f"{mp}/{k}") for k, v in sec.items()}
                for k in mapping:
                    if k not in {str(n) for n in mc_numbers}:
                        issues.append(
                            make_issue(
                                "UNKNOWN_QUESTION",
                                f"Câu {k} không tồn tại trên phiếu.",
                                mapping[k][1],
                                valid_range=f"{min(mc_numbers)}-{max(mc_numbers)}",
                            )
                        )
            for n in mc_numbers:
                if str(n) not in mapping:
                    if isinstance(sec, dict):
                        issues.append(
                            make_issue(
                                "MISSING_QUESTION",
                                f"Thiếu đáp án câu trắc nghiệm {n}.",
                                f"{mp}/{n}",
                            )
                        )
                    continue
                v, vp = mapping[str(n)]
                val = str(v).strip().upper() if isinstance(v, str) else None
                if val not in MC_OPTIONS:
                    issues.append(
                        make_issue(
                            "INVALID_ANSWER_VALUE",
                            f"Câu {n}: đáp án phải là A, B, C hoặc D.",
                            vp,
                            value=v,
                            allowed=MC_OPTIONS,
                        )
                    )
                else:
                    entry["mc"][n] = val
        elif "multiple_choice" in exam:
            issues.append(
                make_issue(
                    "INVALID_TYPE",
                    '"multiple_choice" phải là đối tượng hoặc danh sách.',
                    mp,
                    expected="object|array",
                    actual=type(sec).__name__,
                )
            )

        # ---- true / false
        tp = f"{ep}/true_false"
        sec = exam.get("true_false")
        if "true_false" not in exam:
            issues.append(
                make_issue(
                    "MISSING_FIELD", "Thiếu phần đáp án Đúng/Sai (true_false).", tp
                )
            )
        elif isinstance(sec, (dict, list)):
            if isinstance(sec, list):
                if len(sec) != len(tf_numbers):
                    issues.append(
                        make_issue(
                            "INVALID_LENGTH",
                            f"Danh sách Đúng/Sai phải có đúng {len(tf_numbers)} câu.",
                            tp,
                            expected=len(tf_numbers),
                            actual=len(sec),
                        )
                    )
                qmap = {
                    str(n): (v, f"{tp}/{k}")
                    for k, (n, v) in enumerate(zip(tf_numbers, sec))
                }
            else:
                qmap = {str(k).strip(): (v, f"{tp}/{k}") for k, v in sec.items()}
                for k in qmap:
                    if k not in {str(n) for n in tf_numbers}:
                        issues.append(
                            make_issue(
                                "UNKNOWN_QUESTION",
                                f"Câu Đúng/Sai {k} không tồn tại trên phiếu.",
                                qmap[k][1],
                                valid_questions=tf_numbers,
                            )
                        )
            for n in tf_numbers:
                if str(n) not in qmap:
                    if isinstance(sec, dict):
                        issues.append(
                            make_issue(
                                "MISSING_QUESTION",
                                f"Thiếu đáp án câu Đúng/Sai {n}.",
                                f"{tp}/{n}",
                            )
                        )
                    continue
                sub, sp = qmap[str(n)]
                if isinstance(sub, list):
                    if len(sub) != len(tf_rows):
                        issues.append(
                            make_issue(
                                "INVALID_LENGTH",
                                f"Câu Đúng/Sai {n} cần đủ {len(tf_rows)} ý.",
                                sp,
                                expected=len(tf_rows),
                                actual=len(sub),
                            )
                        )
                        continue
                    smap = {
                        r: (v, f"{sp}/{k}")
                        for k, (r, v) in enumerate(zip(tf_rows, sub))
                    }
                elif isinstance(sub, dict):
                    smap = {
                        str(k).strip().lower(): (v, f"{sp}/{k}") for k, v in sub.items()
                    }
                    for k in smap:
                        if k not in tf_rows:
                            issues.append(
                                make_issue(
                                    "UNKNOWN_SUBQUESTION",
                                    f"Ý '{k}' không tồn tại.",
                                    smap[k][1],
                                    allowed=tf_rows,
                                )
                            )
                else:
                    issues.append(
                        make_issue(
                            "INVALID_TYPE",
                            f"Câu Đúng/Sai {n} phải là đối tượng hoặc danh sách.",
                            sp,
                            expected="object|array",
                            actual=type(sub).__name__,
                        )
                    )
                    continue
                for r in tf_rows:
                    if r not in smap:
                        issues.append(
                            make_issue(
                                "MISSING_QUESTION",
                                f"Thiếu đáp án câu {n}{r}.",
                                f"{sp}/{r}",
                            )
                        )
                        continue
                    v, vp = smap[r]
                    canon = normalize_tf(v) if isinstance(v, (str, bool)) else None
                    if canon is None:
                        issues.append(
                            make_issue(
                                "INVALID_ANSWER_VALUE",
                                f"Câu {n}{r}: giá trị phải là Đúng hoặc Sai (TRUE/FALSE, T/F, Đ/S).",
                                vp,
                                value=v,
                                allowed=["TRUE", "FALSE"],
                            )
                        )
                    else:
                        entry["tf"][(n, r)] = canon
        elif "true_false" in exam:
            issues.append(
                make_issue(
                    "INVALID_TYPE",
                    '"true_false" phải là đối tượng hoặc danh sách.',
                    tp,
                    expected="object|array",
                    actual=type(sec).__name__,
                )
            )
        if code is not None:
            keys[code] = entry
    return keys, issues


# --------------------------------------------------------------------------- #
# GRADING + JSON RESULT                                                        #
# --------------------------------------------------------------------------- #
YELLOW = (0, 215, 255)  # BGR: ambiguous / multiple (needs review)
GREEN = (0, 170, 0)
RED = (0, 0, 230)
STRIKE = (0, 140, 255)  # BGR orange: blank strike-through line
ID_COLOR = (200, 120, 0)

REVIEW_REASONS = {
    "light mark/erased residue": "LIGHT_MARK",
    "partial fill": "PARTIAL_FILL",
    "uneven/tick/cross": "TICK_OR_CROSS",
    "scribble/smear": "SCRIBBLE_OR_SMEAR",
}


def _r(v: float, nd: int = 2) -> float:
    return round(float(v), nd)


REVIEW_TEXT_VI = {
    "MULTIPLE_MARKS": "Tô nhiều hơn một đáp án",
    "AMBIGUOUS_MARK": "Vết tô không rõ ràng",
    "LIGHT_MARK": "Tô quá mờ / tẩy chưa sạch",
    "PARTIAL_FILL": "Tô chưa kín",
    "TICK_OR_CROSS": "Dấu tick / gạch chéo",
    "SCRIBBLE_OR_SMEAR": "Bị bôi / gạch xóa",
}


def review_reason(q: Question) -> Optional[str]:
    if q.status == "MULTIPLE":
        return "MULTIPLE_MARKS"
    if q.status == "AMBIGUOUS":
        for b in q.bubbles:
            if b.note in REVIEW_REASONS:
                return REVIEW_REASONS[b.note]
        return "AMBIGUOUS_MARK"
    return None


def option_label(q: Question, opt: str) -> str:
    return SHEET_TO_TF[opt] if q.group == "TF" else opt


def detected_value(q: Question) -> Optional[str]:
    return option_label(q, q.answer) if q.status == "VALID" else None


def grade(det: "OMRDetector", key: dict) -> dict:
    """Compare detected answers with one exam's key. Fills q.expected / q.result."""
    sections = {
        "multiple_choice": dict(total=0, correct=0, wrong=0, blank=0, needs_review=0),
        "true_false": dict(total=0, correct=0, wrong=0, blank=0, needs_review=0),
    }
    for q in det.questions:
        if q.group == "ID":
            continue
        sec = sections["multiple_choice" if q.group == "MC" else "true_false"]
        q.expected = (
            key["mc"][q.number] if q.group == "MC" else key["tf"][(q.number, q.item)]
        )
        if q.status == "VALID":
            q.result = "correct" if detected_value(q) == q.expected else "wrong"
        elif q.status == "BLANK":
            q.result = "blank"
        else:
            q.result = "needs_review"
        sec["total"] += 1
        sec[q.result] += 1
    total = {
        k: sum(sec[k] for sec in sections.values()) for k in sections["multiple_choice"]
    }
    return {"summary": total, "sections": sections}


def _question_json(det: "OMRDetector", q: Question) -> dict:
    S = det.S
    d = {
        "question": q.number,
        "item": q.item,
        "expected": q.expected,
        "detected": detected_value(q),
        "detection_status": q.status,
        "result": q.result or None,
        "review_reason": review_reason(q),
        "review_detail": q.detail or None,
        "ignored_faint_options": [
            option_label(q, o.strip()) for o in q.ignored.split(",") if o.strip()
        ],
        "gap_ink_percent": _r(q.bleed),
        "options": [
            {
                "option": option_label(q, b.option),
                "state": b.state,
                "fill_percent": _r(b.fill),
                "tint_percent": _r(b.tint),
                "contrast_percent": _r(b.contrast),
                "quad_spread": _r(b.quad_spread),
                "note": b.note or None,
                "center": {"x": _r(b.cx / S), "y": _r(b.cy / S)},
                "radius": _r(b.r / S),
            }
            for b in q.bubbles
        ],
    }
    if q.group == "ID":
        d.pop("item")
        d.pop("expected")
        d.pop("result")
        d["column"] = d.pop("question")
    return d


def id_value(cols: List[Question]) -> Tuple[Optional[str], str]:
    """(digits or None when any column is not VALID, raw string with _ * ?)."""
    raw = OMRDetector.id_string(cols)
    return (raw if all(q.status == "VALID" for q in cols) else None), raw


def build_result(
    det: "OMRDetector",
    image_path: str,
    key_path: Optional[str],
    exam_code: Optional[str],
    exam_source: str,
    grading: Optional[dict],
    artifacts: dict,
    warnings: List[dict],
) -> dict:
    sbd_cols = [q for q in det.questions if q.group == "ID" and q.block == "SBD"]
    made_cols = [q for q in det.questions if q.group == "ID" and q.block == "MADE"]
    sid, sid_raw = id_value(sbd_cols)
    code_sheet, code_raw = id_value(made_cols)
    h0, w0 = det.original.shape[:2]
    result = {
        "input": {
            "image": os.path.basename(image_path),
            "answer_key": os.path.basename(key_path) if key_path else None,
        },
        "sheet": {
            "coordinate_space": {
                "unit": "reference_px",
                "width": det.ref_w,
                "height": det.ref_h,
                "note": "All 'center'/'radius' values are in template pixels; scale to your viewport.",
            },
            "source_image": {"width": w0, "height": h0},
            "warped_image": {
                "width": int(det.warped.shape[1]),
                "height": int(det.warped.shape[0]),
                "scale": det.S,
            },
            "alignment": {
                "markers_matched": det.align_info["markers_matched"],
                "rms_error": _r(det.align_info["rms"]),
            },
        },
        "student": {
            "student_id": sid,
            "raw": sid_raw,
            "status": "VALID" if sid is not None else "NEEDS_REVIEW",
            "columns": [_question_json(det, q) for q in sbd_cols],
        },
        "exam": {
            "exam_code": exam_code,
            "source": exam_source,
            "detected_on_sheet": code_sheet,
            "raw": code_raw,
            "status": "VALID" if code_sheet is not None else "NEEDS_REVIEW",
            "columns": [_question_json(det, q) for q in made_cols],
        },
        "grading": None,
        "answers": {
            "multiple_choice": [
                _question_json(det, q) for q in det.questions if q.group == "MC"
            ],
            "true_false": [
                _question_json(det, q) for q in det.questions if q.group == "TF"
            ],
        },
        "needs_review": [],
        "thresholds": {
            k: det.cfg[k]
            for k in (
                "filled_thr",
                "empty_thr",
                "min_contrast",
                "inner_frac",
                "dark_delta",
                "tint_thr",
                "bleed_thr",
                "solid_thr",
                "quad_thr",
            )
        },
        "measurements": {
            "paper_level": _r(det.paper_level, 1),
            "dark_threshold": _r(det.dark_thr, 1),
        },
        "artifacts": artifacts,
    }
    if grading is not None:
        result["grading"] = {
            "summary": {
                "total": grading["summary"]["total"],
                "correct": grading["summary"]["correct"],
                "wrong": grading["summary"]["wrong"],
                "blank": grading["summary"]["blank"],
                "needs_review": grading["summary"]["needs_review"],
            },
            "sections": grading["sections"],
            "definitions": {
                "total": "multiple-choice questions + true/false sub-questions",
                "wrong": "a single valid option was selected and it differs from the key",
                "blank": "no option selected",
                "needs_review": "multiple marks or an unclear/ambiguous mark; never auto-graded",
            },
        }
    # Everything a reviewer UI must look at, in one list.
    for q in det.questions:
        reason = review_reason(q) if q.status in ("MULTIPLE", "AMBIGUOUS") else None
        if reason:
            ref = {
                "group": q.group,
                "name": q.name,
                "reason": reason,
                "message": REVIEW_TEXT_VI.get(reason, reason),
                "detail": q.detail or None,
            }
            if q.group == "ID":
                ref["block"] = q.block
            result["needs_review"].append(ref)
    return {
        "schema_version": SCHEMA_VERSION,
        "success": True,
        "result": result,
        "warnings": warnings,
    }


# --------------------------------------------------------------------------- #
# Grading image                                                                #
# --------------------------------------------------------------------------- #
def save_grading_image(
    det: "OMRDetector",
    path: str,
    student_id: Optional[str],
    exam_code: Optional[str],
    grading: Optional[dict],
    show_correct: bool = False,
    D: float = 6.0,
):
    """Annotated sheet: green = correct, red = wrong, yellow = multiple/ambiguous,
    blank question = straight line through all of its bubbles (first to last)."""
    S = det.S
    x0r, y0r, x1r, y1r = det.layout["debug_crop"]
    crop = det.warped[int(y0r * S) : int(y1r * S), int(x0r * S) : int(x1r * S)]
    f = D / S
    canvas = cv2.resize(crop, None, fx=f, fy=f, interpolation=cv2.INTER_CUBIC)
    ox, oy = x0r * S, y0r * S
    P = lambda x, y: (int(round((x - ox) * f)), int(round((y - oy) * f)))

    def ring(b: Bubble, col, extra=3, thick=5):
        cv2.circle(
            canvas, P(b.cx, b.cy), int(round(b.r * f)) + extra, col, thick, cv2.LINE_AA
        )

    for q in det.questions:
        if q.group == "ID":
            for b in q.bubbles:
                if b.state == FILLED and q.status == "VALID":
                    ring(b, ID_COLOR)
                elif b.state != EMPTY:
                    ring(b, YELLOW)
            continue
        if grading is None:
            continue
        if q.result == "correct":
            for b in q.bubbles:
                if b.state == FILLED:
                    ring(b, GREEN)
        elif q.result == "wrong":
            for b in q.bubbles:
                if b.state == FILLED:
                    ring(b, RED)
        elif q.result == "needs_review":
            for b in q.bubbles:
                if b.state != EMPTY:
                    ring(b, YELLOW)
        elif q.result == "blank":
            b1, b2 = q.bubbles[0], q.bubbles[-1]
            (xa, ya), (xb, yb) = P(b1.cx, b1.cy), P(b2.cx, b2.cy)
            v = np.array([xb - xa, yb - ya], float)
            v /= np.linalg.norm(v) + 1e-9
            ext = b1.r * f + 6
            cv2.line(
                canvas,
                (int(xa - v[0] * ext), int(ya - v[1] * ext)),
                (int(xb + v[0] * ext), int(yb + v[1] * ext)),
                STRIKE,
                4,
                cv2.LINE_AA,
            )
        if (
            show_correct
            and q.result in ("wrong", "blank", "needs_review")
            and q.expected
        ):
            for b in q.bubbles:
                if option_label(q, b.option) == q.expected:
                    cv2.circle(
                        canvas,
                        P(b.cx, b.cy),
                        int(round(b.r * f)) + 10,
                        GREEN,
                        1,
                        cv2.LINE_AA,
                    )

    # Header: legend + summary.
    bar = np.full((78, canvas.shape[1], 3), 255, np.uint8)
    x = 10
    for text, col in (
        ("Correct", GREEN),
        ("Wrong", RED),
        ("Multiple / unclear", YELLOW),
        ("Digit (ID/code)", ID_COLOR),
    ):
        cv2.rectangle(bar, (x, 8), (x + 22, 28), col, -1)
        cv2.putText(
            bar,
            text,
            (x + 30, 25),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (0, 0, 0),
            1,
            cv2.LINE_AA,
        )
        x += 230
    cv2.line(bar, (x, 18), (x + 40, 18), STRIKE, 4, cv2.LINE_AA)
    cv2.putText(
        bar,
        "Blank (struck through)",
        (x + 50, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (0, 0, 0),
        1,
        cv2.LINE_AA,
    )
    sm = grading["summary"] if grading else None
    line = f"SBD: {student_id or '?'}   Exam code: {exam_code or '?'}"
    if sm:
        line += f"   Correct: {sm['correct']}   Wrong: {sm['wrong']}   Blank: {sm['blank']}   Review: {sm['needs_review']}   Total: {sm['total']}"
    cv2.putText(
        bar, line, (10, 62), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 0), 2, cv2.LINE_AA
    )
    cv2.imwrite(path, np.vstack([bar, canvas]))


# --------------------------------------------------------------------------- #
# Orchestration (usable from a UI/back-end as well as from the CLI)            #
# --------------------------------------------------------------------------- #
def process_sheet(
    image_path: str,
    out_dir: str = ".",
    answer_key_path: Optional[str] = None,
    exam_code_override: Optional[str] = None,
    layout: dict = None,
    config: dict = None,
    verbose: bool = False,
    show_console: bool = True,
    show_correct: bool = False,
    answer_keys_data=None,
    region: Optional[list] = None,
    save_debug: bool = True,
    grading_scale: float = 6.0,
) -> dict:
    """Run detection (+ grading when an answer key is given). Never raises for
    expected problems: always returns a JSON-serialisable envelope with
    success=True/False. See the README block at the top of this file."""
    layout = layout or LAYOUT
    os.makedirs(out_dir, exist_ok=True)
    out = lambda name: os.path.join(out_dir, name)

    # 1. Answer key first (cheap, and its errors are the user's to fix).
    #    Either a file path or an already-parsed document (API use) may be supplied.
    keys = None
    if answer_key_path or answer_keys_data is not None:
        if answer_keys_data is not None:
            data, issues = answer_keys_data, []
        else:
            data, issues = load_json_file(answer_key_path, "đáp án", "ANSWER_KEY")
        if not issues:
            keys, issues = validate_answer_keys(data, layout)
        if issues:
            return error_envelope(
                "Đáp án không hợp lệ", 422, issues, "answer-key-validation"
            )
    if exam_code_override is not None:
        L = len(layout["id_blocks"][-1]["x"])
        if not (
            str(exam_code_override).isdigit() and len(str(exam_code_override)) == L
        ):
            return error_envelope(
                "Tham số không hợp lệ",
                400,
                [
                    make_issue(
                        "INVALID_EXAM_CODE",
                        f"Mã đề nhập tay phải gồm đúng {L} chữ số.",
                        "/exam_code",
                        value=exam_code_override,
                    )
                ],
                "invalid-parameter",
            )

    # 2. Detection.
    det = OMRDetector(layout, config, verbose=verbose)
    det.region = (
        region  # reference-px rectangle covered by the image (None = whole sheet)
    )
    try:
        det.load(image_path)
        if save_debug:
            cv2.imwrite(out("debug_original.png"), det.original)
        det.run(image_path)
    except OMRError as e:
        status = 404 if e.code == "IMAGE_NOT_FOUND" else 422
        return error_envelope(
            "Không xử lý được ảnh phiếu",
            status,
            [make_issue(e.code, e.message, "/image")],
            "image-processing",
        )
    if show_console:
        det.print_report()
    artifacts = {}
    if save_debug:
        det.save_debug_images(out_dir)
        artifacts = {
            "debug_original": "debug_original.png",
            "debug_warped": "debug_warped.png",
            "debug_detection": "debug_detection.png",
            "debug_bubbles": "debug_bubbles.png",
        }

    made_cols = [q for q in det.questions if q.group == "ID" and q.block == "MADE"]
    sbd_cols = [q for q in det.questions if q.group == "ID" and q.block == "SBD"]
    sheet_code, _ = id_value(made_cols)
    sid, _ = id_value(sbd_cols)
    warnings: List[dict] = []
    if sid is None:
        warnings.append(
            make_issue(
                "STUDENT_ID_UNREADABLE",
                "Số báo danh có cột bỏ trống, tô nhiều ô hoặc không rõ; hãy kiểm tra lại.",
                "/result/student/student_id",
                severity="warning",
            )
        )
    exam_code = exam_code_override or sheet_code
    exam_source = "cli_override" if exam_code_override else "sheet"

    grading = None
    if keys is not None:
        if exam_code is None:
            partial = build_result(
                det,
                image_path,
                answer_key_path,
                None,
                exam_source,
                None,
                artifacts,
                warnings,
            )
            save_grading_image(
                det, out("grading_result.png"), sid, None, None, D=grading_scale
            )
            partial["result"]["artifacts"]["grading_image"] = "grading_result.png"
            return error_envelope(
                "Không đọc được mã đề trên phiếu",
                422,
                [
                    make_issue(
                        "EXAM_CODE_UNREADABLE",
                        "Mã đề có cột bỏ trống, tô nhiều ô hoặc tô không rõ. Hãy quét lại hoặc nhập mã đề thủ công.",
                        "/partial_result/exam/columns",
                        raw=partial["result"]["exam"]["raw"],
                    )
                ],
                "exam-code",
                partial["result"],
            )
        if exam_code not in keys:
            partial = build_result(
                det,
                image_path,
                answer_key_path,
                exam_code,
                exam_source,
                None,
                artifacts,
                warnings,
            )
            return error_envelope(
                "Chưa có đáp án cho mã đề này",
                422,
                [
                    make_issue(
                        "EXAM_CODE_NOT_IN_ANSWER_KEY",
                        f'Mã đề "{exam_code}" chưa có trong danh sách đáp án. Hãy thêm đáp án cho mã đề này ở mục "Nhập đáp án".',
                        "/exams",
                        value=exam_code,
                        available=sorted(keys),
                    )
                ],
                "exam-code",
                partial["result"],
            )
        grading = grade(det, keys[exam_code])
        artifacts["grading_image"] = "grading_result.png"
        save_grading_image(
            det,
            out("grading_result.png"),
            sid,
            exam_code,
            grading,
            show_correct,
            D=grading_scale,
        )
    else:
        warnings.append(
            make_issue(
                "NO_ANSWER_KEY",
                "Chưa có đáp án: chỉ nhận dạng, chưa chấm điểm.",
                "/result/grading",
                severity="warning",
            )
        )

    env = build_result(
        det,
        image_path,
        answer_key_path,
        exam_code,
        exam_source,
        grading,
        artifacts,
        warnings,
    )
    n_review = len(env["result"]["needs_review"])
    if n_review:
        env["warnings"].append(
            make_issue(
                "ITEMS_NEED_REVIEW",
                f"Có {n_review} mục cần kiểm tra lại.",
                "/result/needs_review",
                severity="warning",
                count=n_review,
            )
        )
    if show_console and grading is not None:
        print("========== GRADING ==========\n")
        for q in det.questions:
            if q.group != "ID":
                got = detected_value(q) or q.status
                print(
                    f"{q.name:<7} | expected {q.expected:<5} | detected {got:<9} | {q.result.upper()}"
                )
        sm = grading["summary"]
        print(f"\nSBD: {sid or '?'} | Exam code: {exam_code}")
        print(
            f"Total {sm['total']} | Correct {sm['correct']} | Wrong {sm['wrong']} | "
            f"Blank {sm['blank']} | Needs review {sm['needs_review']}\n"
        )
    return env


# --------------------------------------------------------------------------- #
# CLI                                                                          #
# --------------------------------------------------------------------------- #
def main():
    try:  # make Vietnamese letters printable on Windows consoles
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

    ap = argparse.ArgumentParser(description="Vietnamese OMR detector + grader.")
    ap.add_argument(
        "image", nargs="?", help="path to the sheet image (jpg/png/jfif...)"
    )
    ap.add_argument(
        "--answer-keys", help="JSON file with the answer keys of every exam code"
    )
    ap.add_argument(
        "--exam-code", help="override the exam code read from the sheet (3 digits)"
    )
    ap.add_argument(
        "--out-dir", default=".", help="where images and result.json are saved"
    )
    ap.add_argument(
        "--json-out", help="result JSON path (default: <out-dir>/result.json)"
    )
    ap.add_argument(
        "--json-only",
        action="store_true",
        help="print only the JSON envelope to stdout",
    )
    ap.add_argument(
        "--show-correct",
        action="store_true",
        help="grading image: thin green ring on the key answer of wrong/blank/unclear questions",
    )
    ap.add_argument(
        "--verbose", action="store_true", help="print per-bubble measurements"
    )
    ap.add_argument("--layout", help="JSON file overriding the bubble layout")
    ap.add_argument(
        "--dump-layout", help="write the built-in layout to this JSON file and exit"
    )
    ap.add_argument(
        "--dump-answer-key-example", help="write an example answer-key file and exit"
    )
    ap.add_argument("--filled", type=float, help="filled threshold (%%)")
    ap.add_argument("--empty", type=float, help="empty threshold (%%)")
    ap.add_argument("--inner", type=float, help="inner ROI radius fraction (0-1)")
    ap.add_argument(
        "--dark-delta", type=float, help="dark pixel = gray < paper - delta"
    )
    ap.add_argument(
        "--no-snap", action="store_true", help="disable block position calibration"
    )
    args = ap.parse_args()

    if args.dump_layout:
        with open(args.dump_layout, "w", encoding="utf-8") as f:
            json.dump(LAYOUT, f, ensure_ascii=False, indent=2)
        print(f"Layout written to {args.dump_layout}")
        return 0
    if args.dump_answer_key_example:
        with open(args.dump_answer_key_example, "w", encoding="utf-8") as f:
            json.dump(ANSWER_KEY_EXAMPLE, f, ensure_ascii=False, indent=2)
        print(f"Example answer key written to {args.dump_answer_key_example}")
        return 0
    if not args.image:
        ap.error("the image argument is required")

    layout = LAYOUT
    if args.layout:
        layout, issues = load_json_file(args.layout, "Layout", "LAYOUT")
        if issues:
            env = error_envelope("Tệp bố cục không hợp lệ", 400, issues, "layout")
            print(json.dumps(env, ensure_ascii=False, indent=2))
            return 1

    cfg = {}
    for arg, key in (
        (args.filled, "filled_thr"),
        (args.empty, "empty_thr"),
        (args.inner, "inner_frac"),
        (args.dark_delta, "dark_delta"),
    ):
        if arg is not None:
            cfg[key] = arg
    if args.no_snap:
        cfg["snap_px"] = 0.0
        cfg["snap_min_score"] = 2.0  # never accepted -> zero offset

    env = process_sheet(
        args.image,
        args.out_dir,
        args.answer_keys,
        args.exam_code,
        layout,
        cfg,
        verbose=args.verbose,
        show_console=not args.json_only,
        show_correct=args.show_correct,
    )

    os.makedirs(args.out_dir, exist_ok=True)
    json_path = args.json_out or os.path.join(args.out_dir, "result.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(env, f, ensure_ascii=False, indent=2)

    if args.json_only:
        print(json.dumps(env, ensure_ascii=False, indent=2))
    elif env["success"]:
        print(f"Result JSON: {os.path.abspath(json_path)}")
        print(f"Images in:   {os.path.abspath(args.out_dir)}")
        for w in env["warnings"]:
            print(f"WARNING [{w['code']}] {w['message']}", file=sys.stderr)
    else:
        err = env["error"]
        print(f"ERROR: {err['title']} (details in {json_path})", file=sys.stderr)
        for e in err["errors"]:
            loc = f" at {e['path']}" if e.get("path") else ""
            print(f"  [{e['code']}]{loc}: {e['message']}", file=sys.stderr)
    return 0 if env["success"] else 1


if __name__ == "__main__":
    sys.exit(main())
