"""
Vitamin Deficiency - Model Registry & Lifecycle Service
Manages deep learning model discovery, loading, and runtime availability state.
Auto-loads ONNX models and metadata from models/trained/.
"""

import os
import io
import json
import logging
import numpy as np
from PIL import Image
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.schemas.inference import PredictionItem

logger = logging.getLogger("nutrivision.model_service")

# Human-friendly descriptions for deficiency indicators
LABEL_DISPLAY_NAMES: Dict[str, str] = {
    "Healthy_Normal": "Healthy / No Apparent Deficiency Pattern",
    "Iron_Deficiency": "Iron Deficiency (Koilonychia / Conjunctival Pallor)",
    "Vitamin_A_Deficiency": "Vitamin A Deficiency (Follicular Hyperkeratosis / Ocular Signs)",
    "Vitamin_B12_Deficiency": "Vitamin B12 Deficiency (Glossitis / Hyperpigmentation)",
    "Vitamin_C_Deficiency": "Vitamin C Deficiency (Perifollicular Petechiae / Scurvy Signs)",
    "Zinc_Deficiency": "Zinc Deficiency (Leukonychia / Diffuse Thinning)"
}

PATTERN_DESCRIPTIONS: Dict[str, str] = {
    "Healthy_Normal": "Visual appearance reflects normal tissue vascularization and morphology with no notable nutritional deficiency markers.",
    "Iron_Deficiency": "Visual patterns indicate potential pallor or spoon-shaped concave nail changes (koilonychia) characteristic of iron depletion.",
    "Vitamin_A_Deficiency": "Visual patterns show characteristics resembling follicular hyperkeratotic papules or ocular xerosis associated with retinoid deficiency.",
    "Vitamin_B12_Deficiency": "Visual patterns exhibit atrophic lingual changes (smooth glossy erythema) or hyperpigmentation associated with cobalamin deficiency.",
    "Vitamin_C_Deficiency": "Visual patterns display perifollicular hemorrhagic petechiae or subungual splinter patterns indicative of ascorbic acid depletion.",
    "Zinc_Deficiency": "Visual patterns indicate transverse/punctate leukonychia white nail bands or diffuse follicular thinning associated with zinc depletion."
}


class ModelService:
    def __init__(self):
        self.model_status: str = "MODEL_NOT_AVAILABLE"
        self.active_model: Optional[Any] = None
        self.active_model_name: Optional[str] = None
        self.active_model_version: Optional[str] = None
        self.model_framework: Optional[str] = None
        self.class_labels: List[str] = []
        self.model_metadata: Dict[str, Any] = {}
        # Do not allocate the synthetic model's weights/threads on the small
        # production instance when it is forbidden from serving predictions.
        self.model_status = "MODEL_NOT_VALIDATED"

    def _resolve_models_dir(self) -> str:
        candidates = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "models", "trained")),
            os.path.abspath("./models/trained"),
            os.path.abspath("../models/trained"),
            os.path.abspath(settings.models_dir)
        ]
        for c in candidates:
            if os.path.exists(c):
                return c
        return candidates[0]

    def _initialize_model_registry(self) -> None:
        """
        Scans models directory for valid trained weight files (.onnx, .h5, .keras, .pt, .pth).
        """
        models_dir = self._resolve_models_dir()
        if not os.path.exists(models_dir):
            try:
                os.makedirs(models_dir, exist_ok=True)
            except Exception as e:
                logger.warning("Could not create models directory %s: %s", models_dir, e)
            self.model_status = "MODEL_NOT_AVAILABLE"
            return

        # Check for weight files
        weight_extensions = (".onnx", ".h5", ".keras", ".pt", ".pth")
        found_weights = []
        for root, _, files in os.walk(models_dir):
            for f in sorted(files):
                if f.lower().endswith(weight_extensions):
                    found_weights.append(os.path.join(root, f))

        if not found_weights:
            self.model_status = "MODEL_NOT_AVAILABLE"
            self.active_model = None
            self.active_model_name = None
            self.active_model_version = None
            logger.info("No trained model weights found in %s. Model status: MODEL_NOT_AVAILABLE", models_dir)
            return

        # Load primary ONNX model
        primary_weight = found_weights[0]
        try:
            self.model_status = "MODEL_LOADING"
            self._load_model_weights(primary_weight, models_dir)
            self.model_status = "MODEL_READY"
            logger.info("Successfully loaded model from %s", primary_weight)
        except Exception as e:
            self.model_status = "MODEL_ERROR"
            logger.error("Failed to load model from %s: %s", primary_weight, e)

    def _load_model_weights(self, weight_path: str, models_dir: str) -> None:
        """Loads ONNX runtime model and associated metadata."""
        filename = os.path.basename(weight_path)
        self.active_model_name = filename
        self.active_model_version = "v1.0.0-mobilenetv2"

        # Load metadata if present
        meta_path = os.path.join(models_dir, "model_metadata.json")
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.model_metadata = json.load(f)
                self.class_labels = self.model_metadata.get("classes", [])
                self.active_model_version = self.model_metadata.get("model_version", self.active_model_version)

        if not self.class_labels:
            self.class_labels = [
                "Healthy_Normal",
                "Iron_Deficiency",
                "Vitamin_A_Deficiency",
                "Vitamin_B12_Deficiency",
                "Vitamin_C_Deficiency",
                "Zinc_Deficiency"
            ]

        if weight_path.endswith(".onnx"):
            import onnxruntime as ort
            self.active_model = ort.InferenceSession(weight_path, providers=["CPUExecutionProvider"])
            self.model_framework = "ONNX"
        else:
            raise NotImplementedError(f"Model format {filename} requires ONNX runtime.")

    def get_model_status(self) -> str:
        return self.model_status

    def is_model_ready(self) -> bool:
        return self.model_status == "MODEL_READY" and self.active_model is not None

    def is_screening_validated(self) -> bool:
        # The bundled classifier was trained on generated drawings, not patient
        # photographs. Loading weights is not evidence of clinical validity.
        # No production photo classifier/anatomy validator has been integrated.
        return False

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "status": self.model_status,
            "model_name": self.active_model_name,
            "model_version": self.active_model_version,
            "framework": self.model_framework,
            "classes": self.class_labels,
            "screening_validated": self.is_screening_validated(),
            "evaluation_scope": "Synthetic demonstration images only; not validated on patient photographs",
            "evaluation_metrics": None
        }

    def predict(self, image_bytes: bytes, target_body_part: Optional[str] = None) -> List[PredictionItem]:
        """
        Executes genuine forward pass on the loaded ONNX model.
        Returns Top-3 ranked predictions with true Softmax confidence scores.
        """
        if not self.is_model_ready():
            raise RuntimeError("Model is not ready for inference.")
        if not self.is_screening_validated():
            raise RuntimeError("This demonstration model is not validated for photo screening.")

        # 1. Preprocess image: Resize to 224x224 RGB
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224), Image.Resampling.BILINEAR)
        img_arr = np.array(pil_img, dtype=np.float32) / 255.0

        # 2. Apply ImageNet Mean & Std Normalization
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_arr = (img_arr - mean) / std

        # 3. Transpose from (H, W, C) to (C, H, W) and add Batch dimension: (1, 3, 224, 224)
        input_tensor = np.expand_dims(np.transpose(img_arr, (2, 0, 1)), axis=0).astype(np.float32)

        # 4. Run ONNX Session
        input_name = self.active_model.get_inputs()[0].name
        raw_outputs = self.active_model.run(None, {input_name: input_tensor})[0][0]

        # 5. Numerically stable Softmax calculation
        exp_scores = np.exp(raw_outputs - np.max(raw_outputs))
        probabilities = exp_scores / np.sum(exp_scores)

        # 6. Rank predictions descending by probability
        ranked_indices = np.argsort(probabilities)[::-1]
        predictions: List[PredictionItem] = []

        for rank, idx in enumerate(ranked_indices[:3], start=1):
            raw_label = self.class_labels[idx] if idx < len(self.class_labels) else f"Pattern_{idx}"
            display_label = LABEL_DISPLAY_NAMES.get(raw_label, raw_label.replace("_", " "))
            conf = float(probabilities[idx])
            desc = PATTERN_DESCRIPTIONS.get(raw_label, f"Visual pattern associated with {display_label}")

            predictions.append(
                PredictionItem(
                    rank=rank,
                    categoryCode=raw_label,
                    deficiencyCategory=display_label,
                    modelConfidence=round(conf, 4),
                    confidencePercentage=f"{conf * 100:.1f}%",
                    possiblePatternDescription=desc
                )
            )


        return predictions


model_service = ModelService()
