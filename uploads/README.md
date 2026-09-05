# NutriVision AI – Uploads Directory

This directory serves as local file storage during development and testing.

## Folder Organization:
- `temporary/`: Transient image uploads undergoing pre-processing and quality checking.
- `assessments/`: Persisted user assessment images, thumbnails, and generated Grad-CAM saliency heatmaps.

> [!IMPORTANT]
> All user image uploads stored here are access-controlled by the Spring Boot backend and are excluded from git version control by `.gitignore` to maintain user privacy.
