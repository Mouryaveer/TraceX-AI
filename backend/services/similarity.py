import faiss
import numpy as np

DIMENSION = 768  # CLIPVisionModel pooler_output dimension

index = faiss.IndexFlatIP(DIMENSION)  # cosine similarity on normalized vectors
_id_map: list[str] = []
_metadata_store: dict[str, dict] = {}

def add_embedding(embedding: np.ndarray, media_id: str, metadata: dict = None):
    vec = np.array([embedding], dtype=np.float32)
    index.add(vec)
    _id_map.append(media_id)
    if metadata:
        _metadata_store[media_id] = metadata

def search_embedding(query_embedding: np.ndarray, k: int = 10) -> list[dict]:
    if index.ntotal == 0:
        return []
    vec = np.array([query_embedding], dtype=np.float32)
    k = min(k, index.ntotal)
    scores, indices = index.search(vec, k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx == -1:
            continue
        media_id = _id_map[idx]
        results.append({
            "score": float(score),
            "media_id": media_id,
            "metadata": _metadata_store.get(media_id, {})
        })
    return results

def classify_piracy(score: float) -> str:
    if score >= 0.90:
        return "High Risk Piracy"
    elif score >= 0.55:
        return "Possible Copy"
    return "Safe"
