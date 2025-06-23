from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes.rag_routes import router as rag_router
from routes.face_routes import router as face_router

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(rag_router)
app.include_router(face_router)