# Vitamin Deficiency

An educational nutrition prototype with a React/Vite frontend, Spring Boot API, TiDB/MySQL storage, and a FastAPI image-quality service.

## Current model limitation

The bundled MobileNetV2 model was trained on programmatically drawn synthetic images. Its synthetic benchmark is **not** evidence of clinical accuracy or performance on real photographs. Photo-based deficiency classification remains unavailable. A separate fixed-taxonomy CLIP model checks body-area suitability and rejects unrelated images. It is a provisional upload filter, not a diagnostic model or a guarantee of anatomy recognition; see `ai-service/models/content/README.md`.

There is no 100% accuracy claim. The previous delivery reports and test counts describe an older implementation and must not be used as acceptance evidence for this revision.

## Supported workflows

- Registration/login and account-scoped assessments and images.
- JPG/PNG/WebP upload, size/resolution/corruption checks, lighting and sharpness feedback.
- Recording selected symptoms separately from image findings.
- Saving actual screening outcomes; no fabricated completion, risk, confidence, or report results.
- Real assessment-activity charts, history, and printable records.
- Educational food guidance with dietary filters, including vitamin D; contextual rule-based Q&A.
- Bengaluru care searches through Google Maps, without unverified ratings or contact details.

Language support is partial. The question assistant is rule-based, not an LLM or medical professional. Activity charts do not measure vitamin levels or clinical improvement. Grad-CAM, clinical risk scoring, validated top-three predictions, lab integration, and bias evaluation are not available.

## Local setup

1. Install Node 22.13+ (24.16 used for verification), Java 17, Maven, and Python 3.11.
2. Create a Python environment and install `ai-service/requirements.txt`. From `ai-service`, run `python scripts/prepare_content_model.py`, then `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000`.
3. Set backend environment variables using `backend/.env.example` as a reference. Spring does not automatically read that file. Configure a local MySQL database, then run `mvn spring-boot:run` in `backend`.
4. In `frontend`, run `npm ci`, then `npm run dev`. Copy `frontend/.env.example` to `.env.local` only if overriding API URLs.

For isolated database integration checks, the Maven tests use H2 and mocked AI transport. AI multipart/inference behavior is independently tested in Python. These are not production TiDB or clinical validation tests.

## Verification

- `cd frontend && npm run lint`
- `cd frontend && npm run build` (TypeScript check and production bundle)
- `cd backend && mvn test`
- `python -m pytest tests/test_screening_safety.py tests/test_photo_content.py -q` from the repository root with AI dependencies and content model installed.

See `docs/REPAIR_STATUS.md` for the actual checks and remaining deployment gates.

## Deployment requirements

- `APP_JWT_SECRET`: a private Base64-encoded random signing key with at least 32 decoded bytes; required in production. Replacing it signs out existing sessions.
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`: cloud database configuration; use TLS.
- `APP_CORS_ALLOWED_ORIGINS`: exact frontend origin(s).
- `AI_SERVICE_BASE_URL`: deployed AI service origin.
- New images also have a database-backed byte copy (`assessment_images.image_data`) and remain readable when the temporary disk copy is lost. Apply the supplied migration if automatic schema updates are disabled. Existing historical images without this copy still depend on their original files. Monitor TiDB storage/transfer quotas; this is suitable for a small project, not unbounded image storage.
- `VITE_API_BASE_URL`: backend HTTPS URL ending in `/api`; required for a frontend on a separate host.
- Optional admin bootstrap is disabled by default. Set `APP_ADMIN_BOOTSTRAP_ENABLED`, `APP_ADMIN_BOOTSTRAP_EMAIL`, and `APP_ADMIN_BOOTSTRAP_PASSWORD` explicitly for controlled first-time provisioning.

The old code published an administrator password and a signing-key fallback. Startup disables the known legacy admin only if it still uses that published password. Render now generates a private `APP_JWT_SECRET` through the Blueprint (existing values are preserved), invalidating tokens signed with the old fallback. Verify the deployed configuration. Never paste secrets into issues or chat.

`render.yaml` defines the existing services. `frontend/vercel.json` provides SPA routing for an alternative frontend deployment; a frontend host cannot run the Java and Python services. Existing Render services may need environment changes manually applied: a blueprint edit is not proof that production configuration changed.

A new model requires licensed, labelled real photographs, patient-separated training and evaluation, independent body-area and unrelated-image testing, calibration/abstention analysis, and clinical review. Merely replacing weights or setting a metadata flag cannot enable classification in this revision.
