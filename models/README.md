# NutriVision AI – Models Directory

This directory stores trained deep learning model artifacts, checkpoints, and benchmarking experiment logs.

## Folder Organization:
- `trained/`: Active and candidate production model weights (`.keras`, `.h5`, `.onnx`).
- `experiments/`: Comparative benchmark models (MobileNetV2, ResNet50, EfficientNetB0, Custom CNN) evaluated during Phase 15.

## Dynamic Model Loading:
The FastAPI AI service dynamically registers and loads models configured in `ACTIVE_MODEL_VERSION`. Swapping active models can be triggered via the Spring Boot Admin portal (`POST /api/admin/models/{id}/activate`) without recompiling application code.
