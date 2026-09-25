# Chat and photo recovery repair — 25 September 2026

## Confirmed production failure

Render backend application logs at 21:27:02 IST show ImageQualityClient received HTTP 429 (Too Many Requests) from the photo service URL. The configured timeout was already 90 seconds. The screenshot's PENDING result was an upstream refusal, not evidence that nails were misclassified. The AI service later started at 21:33 and its detailed readiness endpoint returned 200. The precise hosting rule responsible for 429 is not exposed in these logs.

## Changes

- Photo quality and inference requests retry explicit 429/502/503/504 refusals up to twice within their request budget. Retry-After seconds and HTTP dates are respected; long delays return control instead of retrying early. Upload creation is not repeated. Timeouts and invalid images are not silently passed.
- Pending-photo UI displays the actual saved-photo service message.
- Chat answers hydration and protein questions, distinguishes thanks from a new question, and supports short nutrient follow-ups using a bounded topic hint. Explicit new questions override that hint.
- Doctor urgency and supplement safety routes precede broad nutrient/location matches. Greetings no longer match substrings such as “hi” inside “this”. Unsupported questions receive an honest short fallback instead of an echo and unrelated boilerplate.
- Chat input has an accessible label and length limit; the message panel has bounded scrolling. Medical confidence and directory verification claims were corrected.

## Validation

51 backend tests passed after adding 15 regression cases; frontend lint and production build passed. Targeted tests rerun after final wording changes. Live release verification is recorded separately when complete.

## Remaining boundaries

This is still a rule-based nutrition assistant, not an unrestricted language-model agent. No LLM credential or validated medical image model is configured. Photo checks do not diagnose vitamin deficiencies. Transient-refusal recovery cannot promise permanent availability when a host remains unavailable or throttles traffic. Both dynamic services currently use Render Free.

Sources used for new educational responses:
- https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/water-drinks-nutrition/
- https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/
- Hosting limits: https://render.com/docs/free
