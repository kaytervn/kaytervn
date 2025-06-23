from fastapi import APIRouter
from fastapi import Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import mimetypes
from utils.api_utils import verify_api_key, response
from utils.rag_utils import load_and_split_pdf, create_vector_db, get_qa_chain

router = APIRouter(prefix="/v1/rag", dependencies=[Depends(verify_api_key)])
PDF_FILE_PATH = "uploaded.pdf"

class Question(BaseModel):
    message: str

@router.post("/upload-pdf")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    with open("uploaded.pdf", "wb") as f:
        f.write(contents)
    docs = load_and_split_pdf("uploaded.pdf")
    create_vector_db(docs)
    return response(True, "Processed and saved vector successfully")

@router.post("/ask")
def ask_bot(q: Question):
    if not q.message:
        return response(False, "Question is required")
    try:
        chain = get_qa_chain()
        result = chain.run(q.message)
        return response(True, "Request success", data={"answer": result})
    except Exception:
        return response(False, "No data to ask")

@router.get("/check-pdf")
async def check_status():
    message = "PDF file is uploaded" if os.path.exists(PDF_FILE_PATH) else "No PDF file uploaded"
    return response(True, message)

@router.get("/download-pdf")
async def download_pdf():
    if not os.path.exists(PDF_FILE_PATH):
        raise HTTPException(status_code=404, detail="PDF file not found")
    mime_type, _ = mimetypes.guess_type(PDF_FILE_PATH)
    return FileResponse(PDF_FILE_PATH, media_type=mime_type)
