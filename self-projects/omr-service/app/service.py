# -*- coding: utf-8 -*-
"""Business logic of the OMR HTTP service (framework independent, unit-testable).

Every public function returns ``(http_status, json_envelope)``. All user-facing
messages are Vietnamese; code identifiers stay English so a client can branch on
``error.errors[].code``.
"""

import base64
import json
import os
import tempfile
from typing import Optional, Tuple

import cv2
import numpy as np

from .omr_detector import (
    LAYOUT,
    SCHEMA_VERSION,
    error_envelope,
    make_issue,
    process_sheet,
    validate_answer_keys,
)

MAX_UPLOAD_BYTES = 12 * 1024 * 1024  # 12 MB camera photo limit
GRADING_IMAGE_MAX_WIDTH = 1100  # keeps a saved result around 100-200 KB
GRADING_IMAGE_QUALITY = 80
SERVICE_VERSION = "1.0.0"


def layout_info() -> dict:
    """What a client needs to draw the camera guide and the answer-key form."""
    return {
        "schema_version": SCHEMA_VERSION,
        "success": True,
        "layout": {
            "ref_size": LAYOUT["ref_size"],
            "corner_markers": LAYOUT["corner_markers"],  # TL, TR, BL, BR (reference px)
            "corner_marker_size": LAYOUT["corner_marker_size"],
            "capture_region": LAYOUT["capture_region"],  # crop the client must upload
            "multiple_choice_questions": [
                blk["first_q"] + i
                for blk in LAYOUT["mc_blocks"]
                for i in range(blk["n"])
            ],
            "true_false_questions": [blk["question"] for blk in LAYOUT["tf_blocks"]],
            "true_false_rows": LAYOUT["tf_rows"],
            "exam_code_length": len(LAYOUT["id_blocks"][-1]["x"]),
            "student_id_length": len(LAYOUT["id_blocks"][0]["x"]),
        },
    }


def _compact(env: dict) -> dict:
    """Drop the heavy per-bubble measurements (kept for detail='full')."""
    res = env.get("result") or env.get("partial_result")
    if not res:
        return env
    for sec in res.get("answers", {}).values():
        for item in sec:
            item.pop("options", None)
    for col in res.get("student", {}).get("columns", []) + res.get("exam", {}).get(
        "columns", []
    ):
        col.pop("options", None)
    res.pop("thresholds", None)
    res.pop("measurements", None)
    return env


def _grading_data_url(path: str) -> Optional[str]:
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        return None
    h, w = img.shape[:2]
    if w > GRADING_IMAGE_MAX_WIDTH:
        img = cv2.resize(
            img,
            (GRADING_IMAGE_MAX_WIDTH, int(h * GRADING_IMAGE_MAX_WIDTH / w)),
            interpolation=cv2.INTER_AREA,
        )
    ok, buf = cv2.imencode(
        ".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, GRADING_IMAGE_QUALITY]
    )
    if not ok:
        return None
    return "data:image/jpeg;base64," + base64.b64encode(buf.tobytes()).decode("ascii")


def validate_keys(payload) -> Tuple[int, dict]:
    keys, issues = validate_answer_keys(payload, LAYOUT)
    if issues:
        return 422, error_envelope(
            "Đáp án không hợp lệ", 422, issues, "answer-key-validation"
        )
    return 200, {
        "schema_version": SCHEMA_VERSION,
        "success": True,
        "result": {"exam_codes": sorted(keys), "count": len(keys)},
    }


def scan(
    image_bytes: bytes,
    answer_keys_json: Optional[str] = None,
    exam_code: Optional[str] = None,
    mode: str = "camera",
    detail: str = "compact",
) -> Tuple[int, dict]:
    """Detect + grade one photographed sheet."""
    if not image_bytes:
        return 400, error_envelope(
            "Yêu cầu không hợp lệ",
            400,
            [make_issue("EMPTY_IMAGE", "Tệp ảnh trống.", "/image")],
            "invalid-request",
        )
    if len(image_bytes) > MAX_UPLOAD_BYTES:
        return 413, error_envelope(
            "Ảnh quá lớn",
            413,
            [
                make_issue(
                    "IMAGE_TOO_LARGE",
                    f"Ảnh vượt quá giới hạn {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.",
                    "/image",
                )
            ],
            "invalid-request",
        )
    if mode not in ("camera", "full"):
        return 400, error_envelope(
            "Yêu cầu không hợp lệ",
            400,
            [
                make_issue(
                    "INVALID_MODE",
                    'Tham số mode phải là "camera" hoặc "full".',
                    "/mode",
                    value=mode,
                    allowed=["camera", "full"],
                )
            ],
            "invalid-request",
        )

    keys_data = None
    if answer_keys_json:
        try:
            keys_data = json.loads(answer_keys_json)
        except json.JSONDecodeError as e:
            return 422, error_envelope(
                "Đáp án không hợp lệ",
                422,
                [
                    make_issue(
                        "ANSWER_KEY_INVALID_JSON",
                        f"JSON đáp án không hợp lệ: {e.msg} (dòng {e.lineno}, cột {e.colno}).",
                        "/answer_keys",
                        line=e.lineno,
                        column=e.colno,
                    )
                ],
                "answer-key-validation",
            )

    with tempfile.TemporaryDirectory(prefix="omr_") as tmp:
        img_path = os.path.join(tmp, "sheet.jpg")
        with open(img_path, "wb") as f:
            f.write(image_bytes)
        env = process_sheet(
            img_path,
            tmp,
            answer_keys_data=keys_data,
            exam_code_override=exam_code or None,
            region=LAYOUT["capture_region"] if mode == "camera" else None,
            show_console=False,
            save_debug=False,
            grading_scale=4.0,
        )
        res = env.get("result") or env.get("partial_result")
        if res is not None:
            grading_path = os.path.join(tmp, "grading_result.png")
            url = (
                _grading_data_url(grading_path)
                if os.path.isfile(grading_path)
                else None
            )
            res["images"] = {"grading": url}
            res.pop("artifacts", None)
            res.pop("input", None)
    if detail != "full":
        _compact(env)
    status = 200 if env["success"] else env["error"]["status"]
    return status, env
