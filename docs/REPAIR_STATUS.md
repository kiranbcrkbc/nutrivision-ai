# Repair checkpoint — 24 September 2026

## Release status: NOT READY FOR PRODUCTION DELIVERY

The current revision repairs fabrication and workflow defects. It does not supply a medically validated image classifier. The live deployment still runs the older code.

## Root causes verified in source

- The dataset preparation script draws class-specific shapes and colours. The bundled model benchmark is synthetic, not patient-photo validation.
- There is no anatomy/OOD validation. A softmax classifier always chooses a class for arbitrary inputs.
- The wizard marked records completed with moderate concern before inference and swallowed inference failures.
- Result rendering defaulted to a healthy label and 65% confidence when no prediction existed.
- Reports invented categories from the chosen body part and inserted fixed 96.2% scores; the report modal also had a 98.5% fallback.
- Progress and admin pages contained invented measurements/counts. User analytics counted other users' images.
- Symptoms and inference outcomes were not persisted. Nutrition could default to iron without a result.
- The seven-day food page did not apply its diet selector to its fixed meals.
- Provider contacts, ratings, review counts and hours were hard-coded without provenance.
- Public default admin credentials and a fixed JWT signing key were present.

## Implemented

- Production photo predictions fail closed. No metadata flag or model file replacement bypasses the integration gate.
- Bounded upload reads, decoded format/frame/resolution limits, EXIF orientation, corrupt-image handling, and explicit unavailable states.
- Outcomes and self-reported symptoms saved to the assessment; reports reload those records. Upload/removal invalidates the previous outcome.
- Completion is server-controlled; user requests cannot assign a medical risk level.
- Progress, dashboard, and admin figures come from real database records. User image counts are owner-scoped.
- Simplified homepage/dashboard/about/how-it-works, visible Vitamin Deficiency branding, keyboard-operable region cards, page-level lazy loading, and a less crowded navigation layout.
- Dietary food filtering used for weekly food ideas; vitamin D educational pathway and seed data added to existing databases.
- Distinct vitamin D, child-use, image-result and diagnostic-limit chatbot responses; fixed `prove` matching `improve`; removed health-query logging.
- Bengaluru neighbourhood/specialty map search replaces unverified directory facts.
- Random local JWT keys, required private production signing key, disabled default admin bootstrap, exact production CORS default, and fewer error details exposed.

## Verified on this machine

| Check | Result | Limits |
|---|---|---|
| Frontend `npm run build` | Passed | TypeScript and Vite 8 production bundle |
| Frontend `npm run lint` | Passed | ESLint structural checks |
| Frontend `npm audit` | 0 known vulnerabilities | npm advisory database only; not a complete security audit |
| Backend `mvn test` | 29/29 passed | Includes H2 DB-backed account/upload/history/ownership journey with mocked AI transport |
| AI `pytest tests/test_screening_safety.py -q` | 21/21 passed | Includes actual FastAPI multipart checks; no clinical accuracy measurement |
| Browser local registration | Passed | Disposable local account, isolated H2 runtime |
| Browser phone uploaded as eyes | Passed | Real React → Java → FastAPI flow; no prediction assigned; not an anatomy detector |
| Browser chart | Passed | One actual assessment/photo shown, no sample trend |
| Browser reopened report | Passed | Saved unavailable outcome and selected symptom retained |
| Browser doctor locality | Passed | Jayanagar updated the Maps search URL |
| Browser layout | Checked at available ~794px viewport | Requested 390px override did not take effect; full mobile coverage remains unverified |
| Added-code secret pattern scan | No high-confidence key patterns | Not a complete repository/history security audit |

One Python test-run deprecation warning remains (`httpx`/Starlette). Vite reports a harmless shared static/dynamic AccessDeniedPage import. The old broken lint command has been repaired. `npm run typecheck` is also available. Router, Vite, React plugin, and ESLint were upgraded; post-upgrade build, lint, audit, and browser navigation checks passed.

## Existing production observations (read-only)

- Frontend: HTTP 200.
- AI: health endpoint reports UP and MODEL_READY for the old synthetic model.
- Backend: first request timed out after 45 seconds; retry returned UP.
- Database health endpoint returned UP / MySQL on the existing backend. This confirms connectivity only, not repaired schema or restart persistence.
- Those checks are liveness only, not proof of end-to-end correctness or database durability.
- GitHub repository is public. GitHub CLI is authenticated.
- Render browser requires GitHub sign-in; no authenticated Render management session is available yet.

## Remaining gates

1. Client must supply/approve a licensed, clinically labelled dataset or independently evaluated model. No real-photo accuracy can be promised from the bundled synthetic model. Clinical evaluation, anatomy/OOD checks, calibration, and bias evaluation remain necessary.
2. Finish Render sign-in so deployment configuration can be reviewed and changed.
3. Rotate the deployed JWT secret and any administrator password created from the published defaults. Removing defaults from source does not revoke existing credentials or remove Git history.
4. Configure durable image storage. The current free Render blueprint uses an ephemeral filesystem; no persistent-upload guarantee is possible as configured. A paid volume requires a billing decision or an object-storage integration.
5. Apply the new result column (Hibernate update or the supplied migration, once), configure exact frontend origin/API URL, deploy, and repeat the complete production journey including restart persistence.
6. Complete a broader security/content review and real mobile/browser matrix before client handover.

## Feature-scope reality

| Requested scope | Current state |
|---|---|
| Multi-vitamin image detection, confidence, top-three, risk, explainability | Blocked by unvalidated model; deliberately not fabricated |
| Six body areas | Selectable; anatomy not verified |
| Multiple images | Backend supports multiple per record; wizard handles one current image |
| Quality checking | Implemented and regression-tested |
| Symptom assessment | Symptoms saved as self-report; no medical scoring |
| Food recommendations / weekly plan | Dietary filters and educational weekly food ideas |
| Chatbot / term explanations | Rule-based Q&A; not an LLM; not complete conversational memory |
| Doctor referral | Bengaluru Maps search; no booking or provider endorsement |
| Reports / history / progress | Saved outcomes, printable records, actual activity |
| Multilingual / speech | Partial legacy translations; no verified full-language or voice workflow |
| Mobile app / real-time camera | Responsive web UI and existing camera capture; no native app or real-time diagnosis |
| Dataset expansion / improvement / bias | Requires real data and separate evaluation work |
| Security / admin | Important repairs implemented; production rotation and full security review outstanding |
| Feedback / laboratory integration | Not implemented in this repair |
| Cloud deployment | Existing services inspected; repaired revision not deployed |
