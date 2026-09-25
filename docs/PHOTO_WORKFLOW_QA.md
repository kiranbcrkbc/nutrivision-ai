# Photo workflow reliability review — 25 September 2026

## Reported failure

The supplied screenshot shows a saved hand photo with `Photo check unavailable`. That state is a service failure, not a prediction or a rejected image. A live AI health request took 25.3 seconds, while the production gateway allowed only 25 seconds. This is consistent with the free-host wake-up timeout; the screenshot alone cannot identify the exact historical server error.

## Repairs

- Production AI read budget: 90 seconds; connection budget capped at 10 seconds. Browser image upload, retry, and screening calls allow 120 seconds. No automatic upload retry creates duplicate photos.
- Pending checks explain the wait and retry the existing saved image. Neither timeouts nor model outages enable continuation or generate a deficiency.
- CPU-heavy photo work runs outside the ASGI event loop, with one photo at a time to bound decoding/inference memory. Health requests remain responsive while photo work runs.
- The unused synthetic medical model no longer allocates weights and threads at startup.
- Deployment health returns HTTP 503 if the photo-content model cannot load.

## Coverage matrix

| Layer | Cases |
|---|---|
| Input validation | Empty/corrupt data, supported JPEG/PNG/WebP, unsupported format, small resolution, oversized upload, invalid body area |
| Content | Burger in six body areas; JPEG/WebP, resized, mirrored, dimmer and brighter variants; real eye/tongue/lips/nails controls; wrong body selections; phone drawing |
| Quality | Dark, bright, blurred images; severely blurred/dark real eye variations |
| Failure handling | Model unavailable then same-photo recovery, gateway 503 then recovery, slow-response timeout then adequate-budget recovery, health responsiveness, readiness failure |
| Medical boundary | No prediction from rejected/unavailable inputs; accepted eye still has no fabricated medical diagnosis; synthetic model cannot bypass validation |
| Accounts/data | Existing backend journey tests cover authentication, ownership, persistence and image retrieval after disk loss |
| Supporting flows | Existing nutrition filters, vitamin categories, assistant intents, doctor searches and real chart data tests |

This matrix is explicit coverage, not proof that every possible image, device, outage or user action has been tested. Existing public fixtures are a small regression set, not a clinical or demographic validation dataset. Camera hardware/permissions and a complete mobile-device matrix require separate testing.

## Prediction and recommendation gate

The owner confirmed that no real-photo deficiency dataset or model is available and requested reliability repairs plus documentation of this gap. A body-area suitability check is not a deficiency prediction. Symptoms are entered by the user. General food information and clinician search remain available as educational tools, without claiming they were prescribed from an image. Deficiency-specific symptoms, diet and referral suggestions must only be linked to a genuinely validated prediction; that clinical feature remains unavailable.

Free-host sleep remains a latency limitation. Larger timeouts accommodate wake-up but do not provide an always-on service-level guarantee.
