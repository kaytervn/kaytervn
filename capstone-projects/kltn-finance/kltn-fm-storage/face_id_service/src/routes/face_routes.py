from fastapi import APIRouter
from fastapi import Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import os
from utils.face_utils import extract_embedding, save_embedding, match_embedding
from utils.api_utils import response, verify_api_key, save_base64_image

router = APIRouter(prefix="")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def webcam_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

class ImagePayload(BaseModel):
    image_data: str
    user_id: str = None

@router.post("/register_webcam", dependencies=[Depends(verify_api_key)])
async def register_webcam(data: ImagePayload):
    if not data.user_id or not data.image_data:
        return response(False, "User ID and image data are required")
    path = save_base64_image(data.image_data)
    embedding = extract_embedding(path)
    os.remove(path)

    if embedding is None:
        return response(False, "No face found")

    save_embedding(data.user_id, embedding)
    return response(True, f"Registered {data.user_id} success")

@router.post("/verify_webcam", dependencies=[Depends(verify_api_key)])
async def verify_webcam(data: ImagePayload):
    path = save_base64_image(data.image_data)
    embedding = extract_embedding(path)
    os.remove(path)

    if embedding is None:
        return response(False, "No face found")

    user_id, confidence = match_embedding(embedding)
    if user_id:
        return response(
            True,
            f"Verify success: {user_id}",
            data={"user_id": user_id, "conf": round(confidence, 2)}
        )
    return response(False, "No match found")
