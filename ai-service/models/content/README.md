# Photo-content model

Fixed-taxonomy CLIP ViT-B/32, ONNX int8 conversion by Xenova, upstream OpenAI CLIP (MIT).
Source: https://huggingface.co/Xenova/clip-vit-base-patch32/tree/d15189d7028b43f1d3e65039190477f6af591c2a
Upstream model card: https://huggingface.co/openai/clip-vit-base-patch32
Upstream licence: https://github.com/openai/CLIP/blob/main/LICENSE

`scripts/prepare_content_model.py` downloads revision-pinned weights, checks ONNX SHA-256 hashes and computes text embeddings for the fixed prompts in `content_service.py`. Weights are downloaded during Docker build, not when a user uploads a photo. Images are processed inside the project's AI service; no third-party vision API receives them.

This is a suitability filter, **not a medical classifier**. It compares photos to body-area and unrelated-content descriptions. Accepted means the selected body area ranked first and exceeded similarity/margin thresholds; similarity is not a probability or diagnostic confidence. Unknown, ambiguous, mismatched and unavailable outcomes fail closed.

Operating thresholds (similarity 0.26, margin 0.005) are provisional. A small public-photo regression set checks a burger, eye, tongue, lips and nails, plus generated unrelated/quality cases. This does not measure population accuracy, all body areas, skin-tone parity, adversarial robustness or clinical performance. The upstream model card calls for rigorous in-domain evaluation before deployment; broader independent testing remains necessary. No medical predictions are enabled by this model.
