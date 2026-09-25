"""Local, fixed-taxonomy photo suitability check. Never predicts medical conditions.

CLIP similarities are retrieval scores, not calibrated probabilities. Uncertain
or mismatched images are rejected; outages never silently pass an image.
"""
import io
import json
import logging
import os
import threading
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

MODEL_DIR = Path(os.getenv("CONTENT_MODEL_DIR", Path(__file__).resolve().parents[2] / "models" / "content"))
# app/services -> ai-service is parents[2]
PROMPTS = {
    "EYES": ["a close-up photograph of a human eye and eyelids", "a photograph of human eyes"],
    "TONGUE": ["a close-up photograph of a human tongue sticking out", "a photograph of the surface of a person's tongue"],
    "NAILS": ["a close-up photograph of human fingernails", "a photograph of a person's hand showing the nails"],
    "LIPS": ["a close-up photograph of human lips", "a photograph of a person's mouth and lips"],
    "SKIN": ["a close-up photograph of human skin on an arm or leg", "a photograph of a patch of skin with a rash"],
    "HAIR": ["a close-up photograph of human hair and scalp", "a photograph of the top of a person's head and hair"],
    "FACE": ["a portrait photograph of a human face"],
    "FOOD": ["a photograph of a hamburger sandwich", "a photograph of food on a plate", "a photograph of fruit and vegetables"],
    "OBJECT": ["a photograph of a mobile phone", "a photograph of a laptop computer", "a photograph of a household object", "a photograph of a car", "a photograph of clothing"],
    "ANIMAL": ["a photograph of an animal", "a close-up photograph of an animal's eye", "a photograph of a dog or cat"],
    "SCENE": ["a photograph of a landscape", "a photograph of a building", "a photograph of flowers and plants"],
    "DOCUMENT": ["a screenshot of text on a screen", "a photograph of a document", "a diagram or cartoon drawing", "a photograph of a medical scan or x-ray"],
}
BODY_PARTS = set(PROMPTS) - {"FOOD", "OBJECT", "ANIMAL", "SCENE", "DOCUMENT"}


class ContentService:
    def __init__(self):
        self.session = None
        self.labels = []
        self.embeddings = None
        self.lock = threading.Lock()
        self.load_attempted = False

    def ready(self):
        if not self.load_attempted:
            with self.lock:
                if not self.load_attempted:
                    try:
                        import onnxruntime as ort
                        opts = ort.SessionOptions()
                        opts.intra_op_num_threads = 2
                        opts.inter_op_num_threads = 1
                        self.session = ort.InferenceSession(str(MODEL_DIR / "vision_model_quantized.onnx"), opts, providers=["CPUExecutionProvider"])
                        data = json.loads((MODEL_DIR / "text_embeddings.json").read_text())
                        self.labels = data["labels"]
                        self.embeddings = np.asarray(data["embeddings"], dtype=np.float32)
                    except Exception:
                        self.session = None
                        logging.getLogger(__name__).exception("Photo content model could not be loaded")
                    self.load_attempted = True
        return self.session is not None

    def check(self, image_bytes, body_part):
        target = (body_part or "").upper().strip()
        if target not in BODY_PARTS:
            return {"status": "INVALID_BODY_PART", "message": "Choose a body area before uploading your photo."}
        if not self.ready():
            return {"status": "UNAVAILABLE", "message": "Photo checking is temporarily unavailable. Please try again shortly."}
        try:
            with Image.open(io.BytesIO(image_bytes)) as source:
                img = ImageOps.exif_transpose(source).convert("RGB")
                # CLIP reference preprocessing: resize shortest edge, then center crop.
                width, height = img.size
                scale = 224 / min(width, height)
                img = img.resize((int(width * scale), int(height * scale)), Image.Resampling.BICUBIC)
                left, top = (img.width - 224) // 2, (img.height - 224) // 2
                img = img.crop((left, top, left + 224, top + 224))
                pixels = np.asarray(img, dtype=np.float32) / 255
            pixels = (pixels - [0.48145466, 0.4578275, 0.40821073]) / [0.26862954, 0.26130258, 0.27577711]
            output = self.session.run(["image_embeds"], {"pixel_values": pixels.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
            output /= max(np.linalg.norm(output), 1e-8)
            scores = self.embeddings @ output
            groups = {label: float(max(scores[i] for i, item in enumerate(self.labels) if item == label)) for label in set(self.labels)}
            detected = max(groups, key=groups.get)
            score = groups[target]
            rival = max(value for key, value in groups.items() if key != target)
            # Conservative abstention; these are operating thresholds, not accuracy claims.
            accepted = detected == target and score >= 0.26 and score - rival >= 0.005
            if accepted:
                return {"status": "ACCEPTED", "detectedBodyPart": target, "message": "Your photo appears to show the selected body area."}
            area = target.lower()
            message = f"Please upload a clear, close-up photo of your {area}. "
            if detected not in BODY_PARTS:
                message += "This image appears to show unrelated content. Food, objects, screenshots and drawings cannot be used."
            elif detected != target:
                message += "This photo does not clearly show the body area you selected."
            else:
                message += "We could not confidently confirm the selected body area. Keep it centred and well lit."
            return {"status": "REJECTED", "message": message}
        except Exception:
            logging.getLogger(__name__).exception("Photo content check failed")
            return {"status": "UNAVAILABLE", "message": "We could not check this photo. Please try again with a clear close-up."}


content_service = ContentService()
