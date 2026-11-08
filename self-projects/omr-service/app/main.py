# -*- coding: utf-8 -*-
"""FastAPI wiring for the OMR service + static single-page UI."""

import os
from typing import Optional

from fastapi import Body, FastAPI, File, Form, Request, Response, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import excel_io

from . import service
from .omr_detector import error_envelope, make_issue

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

app = FastAPI(
    title="OMR Service",
    version=service.SERVICE_VERSION,
    description="Nhận dạng và chấm phiếu trắc nghiệm.",
)

origins = [
    o.strip() for o in os.environ.get("OMR_CORS_ORIGINS", "*").split(",") if o.strip()
]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"]
)


def _json(status: int, body: dict) -> JSONResponse:
    return JSONResponse(status_code=status, content=body)


HTTP_TEXT = {
    400: "Yêu cầu không hợp lệ",
    404: "Không tìm thấy",
    405: "Phương thức không được hỗ trợ",
    413: "Dữ liệu quá lớn",
    415: "Định dạng không được hỗ trợ",
    500: "Lỗi hệ thống",
}


@app.exception_handler(RequestValidationError)
async def on_validation_error(_: Request, exc: RequestValidationError):
    issues = []
    for e in exc.errors():
        loc = [str(x) for x in e.get("loc", []) if x not in ("body", "query")]
        field = "/".join(loc)
        kind = e.get("type", "")
        msg = (
            f"Thiếu trường bắt buộc: {field}."
            if kind == "missing"
            else f"Giá trị không hợp lệ ở trường: {field or 'nội dung yêu cầu'}."
        )
        issues.append(
            make_issue(
                "MISSING_FIELD" if kind == "missing" else "INVALID_VALUE",
                msg,
                "/" + field,
            )
        )
    return _json(
        422, error_envelope("Yêu cầu không hợp lệ", 422, issues, "invalid-request")
    )


@app.exception_handler(StarletteHTTPException)
async def on_http_error(_: Request, exc: StarletteHTTPException):
    title = HTTP_TEXT.get(exc.status_code, "Lỗi")
    return _json(
        exc.status_code,
        error_envelope(
            title,
            exc.status_code,
            [make_issue(f"HTTP_{exc.status_code}", title + ".", "")],
            "http",
        ),
    )


@app.exception_handler(Exception)
async def on_unexpected(_: Request, exc: Exception):
    return _json(
        500,
        error_envelope(
            "Lỗi hệ thống",
            500,
            [
                make_issue(
                    "INTERNAL_ERROR",
                    "Máy chủ gặp lỗi không mong muốn. Vui lòng thử lại.",
                    "",
                )
            ],
            "internal",
        ),
    )


@app.get("/api/health")
def health():
    return {"status": "ok", "version": service.SERVICE_VERSION}


@app.get("/api/layout")
def layout():
    """Corner-marker geometry, capture region and question counts for the UI."""
    return service.layout_info()


@app.post("/api/answer-keys/validate")
def validate_answer_keys(payload=Body(...)):
    """Validate an answer-key document ({"exams": [...]})."""
    status, body = service.validate_keys(payload)
    return _json(status, body)


@app.post("/api/answer-keys/template")
def answer_key_template(payload=Body(...)):
    """Build the Excel answer-key template: {"exam_count": n, "config": {...}}."""
    status, body = excel_io.build_template_response(payload)
    if status != 200:
        return _json(status, body)
    return Response(
        content=body,
        media_type=excel_io.XLSX_MIME,
        headers={"Content-Disposition": 'attachment; filename="mau-dap-an.xlsx"'},
    )


@app.post("/api/answer-keys/import")
def import_answer_keys(
    file: UploadFile = File(..., description="File Excel (.xlsx) từ mẫu")
):
    """Validate a filled template; returns every error (sheet + cell) or the parsed exams."""
    data = file.file.read(excel_io.MAX_IMPORT_BYTES + 1)
    status, body = excel_io.import_response(data)
    return _json(status, body)


@app.post("/api/scan")
def scan(
    image: UploadFile = File(
        ..., description="Ảnh phiếu (JPEG/PNG), đã crop theo capture_region"
    ),
    answer_keys: Optional[str] = Form(None, description='JSON {"exams": [...]}'),
    exam_code: Optional[str] = Form(
        None, description="Mã đề nhập tay (ghi đè mã đọc từ phiếu)"
    ),
    mode: str = Form(
        "camera",
        description='"camera" = ảnh crop theo capture_region, "full" = ảnh cả phiếu',
    ),
    detail: str = Form(
        "compact", description='"compact" hoặc "full" (kèm số đo từng ô)'
    ),
):
    """Nhận dạng + chấm một phiếu. Trả về envelope JSON, kèm ảnh kết quả (data URL)."""
    data = image.file.read(service.MAX_UPLOAD_BYTES + 1)
    status, body = service.scan(data, answer_keys, exam_code, mode, detail)
    return _json(status, body)


app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="ui")
