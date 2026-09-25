"""Download pinned ONNX weights and build fixed text embeddings (build time only)."""
import json
import hashlib
import sys
import urllib.request
from pathlib import Path

import numpy as np
import onnxruntime as ort
from tokenizers import Tokenizer

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.content_service import MODEL_DIR, PROMPTS

REVISION = "d15189d7028b43f1d3e65039190477f6af591c2a"
BASE = f"https://huggingface.co/Xenova/clip-vit-base-patch32/resolve/{REVISION}"
HASHES = {
    "vision_model_quantized.onnx": "583fd1110a514667812fee7d684952aaf82a99b959760c8d7dca7e0ab9839299",
    "text_model_quantized.onnx": "73baab855d406190da9faa498cfedf65f15cf309f4cc7385b7b032e6d08e5c3a",
}
MODEL_DIR.mkdir(parents=True, exist_ok=True)
for remote in ["onnx/vision_model_quantized.onnx", "onnx/text_model_quantized.onnx", "tokenizer.json"]:
    path = MODEL_DIR / Path(remote).name
    if not path.exists():
        print(f"Downloading {remote}", flush=True)
        urllib.request.urlretrieve(f"{BASE}/{remote}", path)
    if path.name in HASHES and hashlib.sha256(path.read_bytes()).hexdigest() != HASHES[path.name]:
        raise RuntimeError(f"Model checksum mismatch: {path.name}")
tokenizer = Tokenizer.from_file(str(MODEL_DIR / "tokenizer.json"))
tokenizer.enable_padding(pad_id=49407, pad_token="<|endoftext|>")
labels, texts = zip(*[(label, text) for label, prompts in PROMPTS.items() for text in prompts])
tokens = tokenizer.encode_batch(list(texts))
session = ort.InferenceSession(str(MODEL_DIR / "text_model_quantized.onnx"), providers=["CPUExecutionProvider"])
inputs = {"input_ids": np.asarray([t.ids for t in tokens], dtype=np.int64)}
if any(i.name == "attention_mask" for i in session.get_inputs()):
    inputs["attention_mask"] = np.asarray([t.attention_mask for t in tokens], dtype=np.int64)
embeddings = session.run(["text_embeds"], inputs)[0]
embeddings /= np.linalg.norm(embeddings, axis=1, keepdims=True)
(MODEL_DIR / "text_embeddings.json").write_text(json.dumps({"revision": REVISION, "labels": labels, "prompts": texts, "embeddings": embeddings.tolist()}))
print("Fixed-taxonomy content model prepared.")
