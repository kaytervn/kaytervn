import uuid, os, base64
from typing import Optional
from fastapi import  HTTPException, Header

API_KEY = os.getenv("X_API_KEY")
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_base64_image(image_data: str) -> str:
    header, encoded = image_data.split(",", 1)
    binary = base64.b64decode(encoded)
    fname = f"{uuid.uuid4().hex}.jpg"
    fpath = os.path.join(UPLOAD_DIR, fname)
    with open(fpath, "wb") as f:
        f.write(binary)
    return fpath

def response(result: bool, message: str, data: dict = None) -> dict:
    return {"result": result, "message": message, "data": data or {}}

def validate_api_key(api_key):
    if not API_KEY:
        return True
    return api_key == API_KEY

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    if not validate_api_key(x_api_key):
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key"
        )
    return x_api_key