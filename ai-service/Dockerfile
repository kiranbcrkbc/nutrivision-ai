# ==============================================================================
# NutriVision AI - FastAPI & ONNX Inference Microservice Dockerfile
# ==============================================================================

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OpenCV headless
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/
COPY models/ ./models/

ENV HOST=0.0.0.0
ENV PORT=8000
ENV MODELS_DIR=/app/models/trained

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/ai/health || exit 1

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
