# -*- coding: utf-8 -*-
"""Excel template generation + import for answer keys (framework independent).

Workbook layout
  Sheet 1 "Cấu hình"   : exam settings shared by every exam sheet (editable)
  Sheet 2.. "Mã đề N"  : exam code + answers (one sheet per exam code)

Both public entry points return ``(http_status, body)``:
  * build_template_response(payload) -> (200, xlsx bytes) | (4xx, error envelope)
  * import_response(xlsx bytes)      -> (200, success envelope) | (4xx, error envelope)

User-facing messages are Vietnamese; identifiers and comments stay English.
"""

import io
from typing import Dict, List, Optional, Tuple

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

from .omr_detector import (
    LAYOUT,
    MC_OPTIONS,
    POINTS_MAX,
    SCHEMA_VERSION,
    _parse_exam_config,
    error_envelope,
    make_issue,
    normalize_tf,
    validate_answer_keys,
)

XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
MAX_EXAM_SHEETS = 50
MAX_IMPORT_BYTES = 5 * 1024 * 1024
MAX_LISTED_CELLS = 10  # cap for "missing cells" lists inside one message

CONFIG_SHEET = "Cấu hình"
EXAM_SHEET_PREFIX = "Mã đề"

# Fixed cell addresses (the importer reads these exact cells)
CFG_MC_COUNT, CFG_MC_POINTS = "B5", "B6"
CFG_TF_COUNT = "B9"
CFG_TF_POINTS = ["B10", "B11", "B12", "B13"]  # points when 1/2/3/4 items are correct
CODE_CELL = "B1"
FIRST_ROW = 5  # first answer row on exam sheets
MC_COL = "B"
TF_COLS = ["E", "F", "G", "H"]  # items a..d
TF_LABEL = {"TRUE": "Đúng", "FALSE": "Sai"}

# ----------------------------------------------------------------------------- styles
_SIDE = Side(style="thin", color="B7BDC6")
_BORDER = Border(left=_SIDE, right=_SIDE, top=_SIDE, bottom=_SIDE)
_HEAD_FILL = PatternFill("solid", fgColor="1F4E79")
_HEAD_FONT = Font(bold=True, color="FFFFFF")
_SUB_FILL = PatternFill("solid", fgColor="DCE6F1")
_INPUT_FILL = PatternFill("solid", fgColor="FFF8DC")
_HINT_FONT = Font(italic=True, color="6B7280", size=10)
_CENTER = Alignment(horizontal="center", vertical="center")
_LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)


def _limits() -> Tuple[int, int, int, List[str]]:
    """(max MC questions, max TF questions, exam-code length, TF item letters)."""
    max_mc = sum(b["n"] for b in LAYOUT["mc_blocks"])
    max_tf = len(LAYOUT["tf_blocks"])
    code_len = len(LAYOUT["id_blocks"][-1]["x"])
    return max_mc, max_tf, code_len, list(LAYOUT["tf_rows"])


def _fmt_pts(v: float) -> str:
    return f"{v:g}".replace(".", ",")


# ============================================================================ template
def _style_header(ws, rng: str, text: str) -> None:
    first = rng.split(":")[0]
    ws.merge_cells(rng)
    ws[first] = text
    ws[first].font = _HEAD_FONT
    ws[first].alignment = _CENTER
    for row in ws[rng]:
        for c in row:
            c.fill = _HEAD_FILL
            c.border = _BORDER


def _input_cell(ws, addr: str, value=None, number_format: Optional[str] = None) -> None:
    c = ws[addr]
    c.value = value
    c.fill = _INPUT_FILL
    c.border = _BORDER
    c.alignment = _CENTER
    if number_format:
        c.number_format = number_format


def _add_dv(ws, dv: DataValidation, rng: str) -> None:
    dv.showErrorMessage = True
    dv.errorTitle = "Giá trị không hợp lệ"
    ws.add_data_validation(dv)
    dv.add(rng)


def _build_config_sheet(ws, cfg: dict) -> None:
    max_mc, max_tf, _, _ = _limits()
    ws.title = CONFIG_SHEET
    ws.merge_cells("A1:C1")
    ws["A1"] = "CẤU HÌNH ĐỀ THI"
    ws["A1"].font = Font(bold=True, size=14)
    ws.merge_cells("A2:C2")
    ws["A2"] = (
        "Ô màu vàng có thể chỉnh sửa. Cấu hình này áp dụng cho tất cả các sheet mã đề."
    )
    ws["A2"].font = _HINT_FONT

    def label(row: int, text: str, hint: str) -> None:
        ws[f"A{row}"] = text
        ws[f"A{row}"].fill = _SUB_FILL
        ws[f"A{row}"].border = _BORDER
        ws[f"C{row}"] = hint
        ws[f"C{row}"].font = _HINT_FONT

    _style_header(ws, "A4:C4", "PHẦN 1 - TRẮC NGHIỆM")
    label(5, "Số câu", f"Số nguyên từ 1 đến {max_mc}")
    _input_cell(ws, CFG_MC_COUNT, cfg["mc_count"], "0")
    label(
        6, "Tổng điểm", f"Số dương, tối đa 2 chữ số thập phân, không quá {POINTS_MAX:g}"
    )
    _input_cell(ws, CFG_MC_POINTS, cfg["mc_points"], "0.00")

    _style_header(ws, "A8:C8", "PHẦN 2 - ĐÚNG / SAI")
    label(9, "Số câu", f"Số nguyên từ 1 đến {max_tf}")
    _input_cell(ws, CFG_TF_COUNT, cfg["tf_count"], "0")
    for i, addr in enumerate(CFG_TF_POINTS):
        label(
            10 + i,
            f"Điểm khi đúng {i + 1} ý",
            f"Điểm của 1 câu khi đúng {i + 1} ý (tối đa {POINTS_MAX:g}, 2 chữ số thập phân)",
        )
        _input_cell(ws, addr, cfg["tf_points"][i], "0.00")

    ws.merge_cells("A15:C16")
    ws["A15"] = (
        "Lưu ý: giảm số câu thì các dòng thừa ở sheet mã đề sẽ bị bỏ qua; "
        "tăng số câu thì cần bổ sung thêm dòng đáp án tương ứng ở từng sheet mã đề."
    )
    ws["A15"].font = _HINT_FONT
    ws["A15"].alignment = _LEFT

    for addr, hi in ((CFG_MC_COUNT, max_mc), (CFG_TF_COUNT, max_tf)):
        dv = DataValidation(
            type="whole",
            operator="between",
            formula1="1",
            formula2=str(hi),
            error=f"Nhập số nguyên từ 1 đến {hi}.",
        )
        _add_dv(ws, dv, addr)
    for addr in [CFG_MC_POINTS] + CFG_TF_POINTS:
        # custom rule: positive, <= max, at most 2 decimals
        dv = DataValidation(
            type="custom",
            formula1=f"=AND(ISNUMBER({addr}),{addr}>0,{addr}<={POINTS_MAX:g},ROUND({addr},2)={addr})",
            error=f"Nhập số dương, tối đa 2 chữ số thập phân, không quá {POINTS_MAX:g}.",
        )
        _add_dv(ws, dv, addr)

    ws.column_dimensions["A"].width = 24
    ws.column_dimensions["B"].width = 14
    ws.column_dimensions["C"].width = 62


def _build_exam_sheet(ws, cfg: dict) -> None:
    _, _, code_len, rows = _limits()
    ws["A1"] = "Mã đề"
    ws["A1"].font = Font(bold=True)
    ws["A1"].fill = _SUB_FILL
    ws["A1"].border = _BORDER
    _input_cell(ws, CODE_CELL, None, "@")  # text format keeps leading zeros
    ws["C1"] = f"Gồm đúng {code_len} chữ số"
    ws["C1"].font = _HINT_FONT
    _add_dv(
        ws,
        DataValidation(
            type="custom",
            formula1=f"=AND(LEN({CODE_CELL})={code_len},ISNUMBER(VALUE({CODE_CELL})))",
            error=f"Mã đề phải gồm đúng {code_len} chữ số.",
        ),
        CODE_CELL,
    )

    _style_header(ws, "A3:B3", "PHẦN 1 - TRẮC NGHIỆM")
    _style_header(ws, "D3:H3", "PHẦN 2 - ĐÚNG / SAI")
    for addr, text in (("A4", "Câu"), ("B4", "Đáp án"), ("D4", "Câu")):
        ws[addr] = text
    for col, r in zip(TF_COLS, rows):
        ws[f"{col}4"] = r
    for addr in ["A4", "B4", "D4"] + [f"{c}4" for c in TF_COLS]:
        ws[addr].font = Font(bold=True)
        ws[addr].fill = _SUB_FILL
        ws[addr].border = _BORDER
        ws[addr].alignment = _CENTER

    for n in range(1, cfg["mc_count"] + 1):
        r = FIRST_ROW + n - 1
        ws[f"A{r}"] = n
        ws[f"A{r}"].fill = _SUB_FILL
        ws[f"A{r}"].border = _BORDER
        ws[f"A{r}"].alignment = _CENTER
        _input_cell(ws, f"{MC_COL}{r}")
    for n in range(1, cfg["tf_count"] + 1):
        r = FIRST_ROW + n - 1
        ws[f"D{r}"] = n
        ws[f"D{r}"].fill = _SUB_FILL
        ws[f"D{r}"].border = _BORDER
        ws[f"D{r}"].alignment = _CENTER
        for col in TF_COLS:
            _input_cell(ws, f"{col}{r}")

    last_mc = FIRST_ROW + cfg["mc_count"] - 1
    last_tf = FIRST_ROW + cfg["tf_count"] - 1
    _add_dv(
        ws,
        DataValidation(
            type="list",
            formula1='"' + ",".join(MC_OPTIONS) + '"',
            error="Chỉ chọn A, B, C hoặc D.",
        ),
        f"{MC_COL}{FIRST_ROW}:{MC_COL}{last_mc}",
    )
    _add_dv(
        ws,
        DataValidation(
            type="list", formula1='"Đúng,Sai"', error="Chỉ chọn Đúng hoặc Sai."
        ),
        f"{TF_COLS[0]}{FIRST_ROW}:{TF_COLS[-1]}{last_tf}",
    )

    for col, w in (
        ("A", 10),
        ("B", 14),
        ("C", 24),
        ("D", 10),
        ("E", 10),
        ("F", 10),
        ("G", 10),
        ("H", 10),
    ):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = f"A{FIRST_ROW}"


def build_template(exam_count: int, cfg: dict) -> bytes:
    wb = Workbook()
    _build_config_sheet(wb.active, cfg)
    for i in range(1, exam_count + 1):
        _build_exam_sheet(wb.create_sheet(f"{EXAM_SHEET_PREFIX} {i}"), cfg)
    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


def build_template_response(payload) -> Tuple[int, object]:
    """Validate the request {exam_count, config:{...}} and build the workbook."""
    max_mc, max_tf, _, rows = _limits()
    issues: List[dict] = []
    if not isinstance(payload, dict):
        issues.append(
            make_issue("INVALID_TYPE", "Yêu cầu phải là một đối tượng JSON.", "")
        )
        return 422, error_envelope(
            "Yêu cầu không hợp lệ", 422, issues, "template-request"
        )

    n = payload.get("exam_count")
    if isinstance(n, bool) or not isinstance(n, int) or not (1 <= n <= MAX_EXAM_SHEETS):
        issues.append(
            make_issue(
                "INVALID_EXAM_COUNT",
                f"Số lượng mã đề phải là số nguyên từ 1 đến {MAX_EXAM_SHEETS}.",
                "/exam_count",
                value=n,
                min=1,
                max=MAX_EXAM_SHEETS,
            )
        )
    raw = payload.get("config")
    cfg = _parse_exam_config(
        {"config": raw if raw is not None else {}},
        "",
        max_mc,
        max_tf,
        len(rows),
        issues,
    )
    if raw is None:
        issues.append(make_issue("MISSING_FIELD", "Thiếu cấu hình đề thi.", "/config"))
    if issues:
        return 422, error_envelope(
            "Yêu cầu không hợp lệ", 422, issues, "template-request"
        )
    return 200, build_template(n, cfg)


# ============================================================================= import
def _issue(code: str, sheet: str, cell: Optional[str], msg: str) -> dict:
    return make_issue(
        code,
        f"[{sheet}] {msg}",
        f"/{sheet}/{cell}" if cell else f"/{sheet}",
        sheet=sheet,
        cell=cell,
    )


def _blank(v) -> bool:
    return v is None or (isinstance(v, str) and not v.strip())


def _show(v) -> str:
    return f'"{str(v).strip()}"'


def _to_number(v) -> Optional[float]:
    """Cell value -> float (accepts numbers and text such as '0,25' / '0.25')."""
    if isinstance(v, bool) or v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    if isinstance(v, str):
        s = v.strip().replace(",", ".")
        try:
            return float(s) if s.replace(".", "", 1).isdigit() else None
        except ValueError:
            return None
    return None


def _join(items: List[str]) -> str:
    shown = items[:MAX_LISTED_CELLS]
    extra = len(items) - len(shown)
    return ", ".join(shown) + (f" … và {extra} ô khác" if extra > 0 else "")


def _read_int(ws, addr, label, lo, hi, issues) -> Optional[int]:
    v = ws[addr].value
    if _blank(v):
        issues.append(
            _issue(
                "MISSING_VALUE",
                ws.title,
                addr,
                f"Ô {addr} ({label}): chưa nhập giá trị.",
            )
        )
        return None
    x = _to_number(v)
    if x is None or not x.is_integer() or not (lo <= x <= hi):
        issues.append(
            _issue(
                "INVALID_VALUE",
                ws.title,
                addr,
                f"Ô {addr} ({label}): {_show(v)} không hợp lệ, phải là số nguyên từ {lo} đến {hi}.",
            )
        )
        return None
    return int(x)


def _read_points(ws, addr, label, issues) -> Optional[float]:
    v = ws[addr].value
    if _blank(v):
        issues.append(
            _issue(
                "MISSING_VALUE",
                ws.title,
                addr,
                f"Ô {addr} ({label}): chưa nhập giá trị.",
            )
        )
        return None
    x = _to_number(v)
    if x is None or not (0 < x <= POINTS_MAX) or abs(round(x, 2) - x) > 1e-9:
        issues.append(
            _issue(
                "INVALID_VALUE",
                ws.title,
                addr,
                f"Ô {addr} ({label}): {_show(v)} không hợp lệ, phải là số dương, tối đa 2 chữ số thập phân, không quá {POINTS_MAX:g}.",
            )
        )
        return None
    return round(x, 2)


def _read_config(ws, issues) -> dict:
    """Values that failed validation are returned as None (and reported)."""
    max_mc, max_tf, _, _ = _limits()
    return {
        "mc_count": _read_int(
            ws, CFG_MC_COUNT, "Trắc nghiệm - Số câu", 1, max_mc, issues
        ),
        "mc_points": _read_points(ws, CFG_MC_POINTS, "Trắc nghiệm - Tổng điểm", issues),
        "tf_count": _read_int(ws, CFG_TF_COUNT, "Đúng/Sai - Số câu", 1, max_tf, issues),
        "tf_points": [
            _read_points(ws, a, f"Đúng/Sai - Điểm khi đúng {i + 1} ý", issues)
            for i, a in enumerate(CFG_TF_POINTS)
        ],
    }


def _read_code(ws, code_len: int, issues) -> Optional[str]:
    v = ws[CODE_CELL].value
    if _blank(v):
        issues.append(
            _issue(
                "MISSING_EXAM_CODE",
                ws.title,
                CODE_CELL,
                f"Ô {CODE_CELL} (Mã đề): chưa nhập mã đề.",
            )
        )
        return None
    if isinstance(v, bool):
        s = ""
    else:
        if isinstance(v, float) and v.is_integer():
            v = int(v)
        s = str(v).strip()
        if isinstance(v, int) and len(s) < code_len:
            s = s.zfill(code_len)  # Excel drops leading zeros of numeric cells
    if not (s.isdigit() and len(s) == code_len):
        issues.append(
            _issue(
                "INVALID_EXAM_CODE",
                ws.title,
                CODE_CELL,
                f"Ô {CODE_CELL} (Mã đề): {_show(ws[CODE_CELL].value)} không hợp lệ, mã đề phải gồm đúng {code_len} chữ số.",
            )
        )
        return None
    return s


def _read_mc(ws, count: int, issues) -> Dict[str, str]:
    out: Dict[str, str] = {}
    missing: List[str] = []
    for n in range(1, count + 1):
        addr = f"{MC_COL}{FIRST_ROW + n - 1}"
        v = ws[addr].value
        if _blank(v):
            missing.append(f"Câu {n} ({addr})")
            continue
        val = v.strip().upper() if isinstance(v, str) else None
        if val not in MC_OPTIONS:
            issues.append(
                _issue(
                    "INVALID_ANSWER_VALUE",
                    ws.title,
                    addr,
                    f"Ô {addr} (Trắc nghiệm - Câu {n}): {_show(v)} không hợp lệ, chỉ nhận A, B, C hoặc D.",
                )
            )
        else:
            out[str(n)] = val
    if missing:
        issues.append(
            _issue(
                "MISSING_ANSWER",
                ws.title,
                None,
                f"Trắc nghiệm - thiếu đáp án: {_join(missing)}.",
            )
        )
    return out


def _read_tf(ws, count: int, issues) -> Dict[str, Dict[str, str]]:
    _, _, _, rows = _limits()
    out: Dict[str, Dict[str, str]] = {}
    missing: List[str] = []
    for n in range(1, count + 1):
        out[str(n)] = {}
        for col, item in zip(TF_COLS, rows):
            addr = f"{col}{FIRST_ROW + n - 1}"
            v = ws[addr].value
            if _blank(v):
                missing.append(f"Câu {n} ý {item} ({addr})")
                continue
            val = normalize_tf(v)
            if val is None:
                issues.append(
                    _issue(
                        "INVALID_ANSWER_VALUE",
                        ws.title,
                        addr,
                        f"Ô {addr} (Đúng/Sai - Câu {n} ý {item}): {_show(v)} không hợp lệ, chỉ nhận Đúng hoặc Sai.",
                    )
                )
            else:
                out[str(n)][item] = val
    if missing:
        issues.append(
            _issue(
                "MISSING_ANSWER",
                ws.title,
                None,
                f"Đúng/Sai - thiếu đáp án: {_join(missing)}.",
            )
        )
    return out


def _sheet_is_empty(ws, mc_count, tf_count) -> bool:
    _, _, _, rows = _limits()
    cells = [CODE_CELL]
    cells += [f"{MC_COL}{FIRST_ROW + i}" for i in range(mc_count or 0)]
    cells += [
        f"{c}{FIRST_ROW + i}"
        for i in range(tf_count or 0)
        for c in TF_COLS[: len(rows)]
    ]
    return all(_blank(ws[a].value) for a in cells)


def parse_workbook(data: bytes) -> Tuple[List[dict], List[dict]]:
    """Return (exams, issues). `exams` is only meaningful when `issues` is empty."""
    issues: List[dict] = []
    try:
        wb = load_workbook(io.BytesIO(data), data_only=True)
    except Exception:
        return [], [
            make_issue(
                "INVALID_WORKBOOK",
                "Không đọc được file. Hãy dùng file Excel (.xlsx) tải từ mẫu của hệ thống.",
                "",
            )
        ]
    sheets = wb.worksheets
    if len(sheets) < 2:
        return [], [
            make_issue(
                "MISSING_SHEETS",
                "File cần có sheet cấu hình và ít nhất một sheet mã đề.",
                "",
            )
        ]

    cfg = _read_config(sheets[0], issues)
    _, _, code_len, _ = _limits()
    exams: List[dict] = []
    seen: Dict[str, str] = {}
    for ws in sheets[1:]:
        if _sheet_is_empty(ws, cfg["mc_count"], cfg["tf_count"]):
            issues.append(
                _issue(
                    "EMPTY_SHEET",
                    ws.title,
                    None,
                    "Sheet trống: hãy nhập mã đề và đáp án, hoặc xóa sheet này.",
                )
            )
            continue
        code = _read_code(ws, code_len, issues)
        if code is not None:
            if code in seen:
                issues.append(
                    _issue(
                        "DUPLICATE_EXAM_CODE",
                        ws.title,
                        CODE_CELL,
                        f'Ô {CODE_CELL} (Mã đề): mã đề "{code}" bị trùng với sheet "{seen[code]}".',
                    )
                )
                code = None
            else:
                seen[code] = ws.title
        mc = _read_mc(ws, cfg["mc_count"], issues) if cfg["mc_count"] else {}
        tf = _read_tf(ws, cfg["tf_count"], issues) if cfg["tf_count"] else {}
        exams.append(
            {
                "exam_code": code,
                "config": {
                    k: cfg[k]
                    for k in ("mc_count", "tf_count", "mc_points", "tf_points")
                },
                "multiple_choice": mc,
                "true_false": tf,
            }
        )

    if not issues:  # final safety net: the same validator the scan endpoint uses
        _, problems = validate_answer_keys({"exams": exams}, LAYOUT)
        for p in problems:
            issues.append(
                make_issue(p["code"], f"[Dữ liệu] {p['message']}", p.get("path", ""))
            )
    return exams, issues


def import_response(data: bytes) -> Tuple[int, dict]:
    if not data:
        return 400, error_envelope(
            "Yêu cầu không hợp lệ",
            400,
            [make_issue("EMPTY_FILE", "Tệp trống.", "/file")],
            "invalid-request",
        )
    if len(data) > MAX_IMPORT_BYTES:
        return 413, error_envelope(
            "Tệp quá lớn",
            413,
            [
                make_issue(
                    "FILE_TOO_LARGE",
                    f"Tệp vượt quá giới hạn {MAX_IMPORT_BYTES // (1024 * 1024)} MB.",
                    "/file",
                )
            ],
            "invalid-request",
        )
    exams, issues = parse_workbook(data)
    if issues:
        return 422, error_envelope(
            "File Excel không hợp lệ", 422, issues, "answer-key-import"
        )
    return 200, {
        "schema_version": SCHEMA_VERSION,
        "success": True,
        "result": {"exams": exams, "count": len(exams)},
    }
