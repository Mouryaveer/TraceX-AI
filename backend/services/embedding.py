import os
import warnings
import logging

os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_TOKEN"] = "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"
os.environ["HUGGING_FACE_HUB_TOKEN"] = "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"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "1"

warnings.filterwarnings("ignore")
for _log in ["transformers", "transformers.modeling_utils",
             "huggingface_hub", "huggingface_hub.file_download"]:
    logging.getLogger(_log).setLevel(logging.ERROR)

from transformers import CLIPVisionModel, CLIPProcessor
from PIL import Image
import torch
import numpy as np

_model = None
_processor = None


def _load_model():
    global _model, _processor
    if _model is None:
        _model = CLIPVisionModel.from_pretrained(
            "openai/clip-vit-base-patch32",
            local_files_only=True,
        )
        _processor = CLIPProcessor.from_pretrained(
            "openai/clip-vit-base-patch32",
            local_files_only=True,
        )
        _model.eval()
    return _model, _processor


def get_embedding(image_path: str) -> np.ndarray:
    model, processor = _load_model()
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    embedding = outputs.pooler_output[0].numpy().astype(np.float32)
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm
    return embedding


def get_video_embedding(frame_paths: list[str]) -> np.ndarray:
    """Average normalized embeddings across frames for a robust video fingerprint."""
    embeddings = [get_embedding(f) for f in frame_paths]
    avg = np.mean(embeddings, axis=0).astype(np.float32)
    norm = np.linalg.norm(avg)
    if norm > 0:
        avg = avg / norm
    return avg


def warmup():
    """Pre-load model at startup so first request is instant."""
    _load_model()
    print("[TraceX] CLIP model loaded and ready.")
