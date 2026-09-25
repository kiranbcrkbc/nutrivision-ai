"""
Vitamin Deficiency - AI/ML Microservice Entry Point
FastAPI service providing image quality analysis, deep learning inference, and Grad-CAM explainability.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, quality, inference

app = FastAPI(
    title="Vitamin Deficiency - Image Quality & AI Engine",
    description="Microservice for image quality evaluation, deficiency classification, and Grad-CAM explainability.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router)
app.include_router(quality.router)
app.include_router(quality.router, prefix="/api/ai")
app.include_router(inference.router)
app.include_router(inference.router, prefix="/api/ai")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)

