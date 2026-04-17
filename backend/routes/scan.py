from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import shutil, os
import numpy as np
import faiss

from services.embedding import get_embedding, get_video_embedding
from services.video_processor import extract_frames
from services.legal import generate_legal_advice
from services.search import get_internet_sources

router = APIRouter()
UPLOAD_DIR = "uploads"
DIMENSION = 768  # CLIPVisionModel pooler_output


def _classify(score: float) -> str:
    if score >= 0.90:
        return "High Risk Piracy"
    elif score >= 0.55:
        return "Possible Copy"
    return "Safe"


def _build_result(score: float, platform: str, url: str, title: str) -> dict:
    advice = generate_legal_advice(score, platform, title)
    return {
        "similarity_score": round(float(score), 4),
        "similarity_pct": round(float(score) * 100, 1),
        "status": _classify(score),
        "platform": platform,
        "url": url,
        "title": title,
        "legal_advice": advice,
    }


@router.post("/search")
@router.post("/search/")
async def search_video(
    file: UploadFile = File(...),
    query: str = Query(default="", description="Optional keyword hint for YouTube search"),
):
    """
    Core pipeline: upload video → extract frames → average embedding →
    scan internet sources → rank by similarity → return piracy report.
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    path = os.path.join(UPLOAD_DIR, file.filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ext = file.filename.rsplit(".", 1)[-1].lower()
    is_video = ext in {"mp4", "avi", "mov", "mkv", "webm"}

    try:
        # Step 1: Build query embedding
        if is_video:
            frames = extract_frames(path, max_frames=20)
            if not frames:
                raise HTTPException(status_code=400, detail="No frames could be extracted.")
            query_embedding = get_video_embedding(frames)
        else:
            query_embedding = get_embedding(path)

        # Step 2: Fetch internet sources
        hint = query or file.filename.rsplit(".", 1)[0]
        sources = get_internet_sources(query=hint)

        if not sources:
            return {
                "query_video": file.filename,
                "total_scanned": 0,
                "matches_found": 0,
                "piracy_detected": False,
                "results": [],
            }

        # Step 3: Build a fresh FAISS index for this request (no cross-request pollution)
        local_index = faiss.IndexFlatIP(DIMENSION)
        valid_sources = []

        for source in sources:
            local_path = source.get("local_path")
            if not local_path or not os.path.exists(local_path):
                continue
            try:
                emb = get_embedding(local_path)
                local_index.add(np.array([emb], dtype=np.float32))
                valid_sources.append(source)
            except Exception:
                continue

        if local_index.ntotal == 0:
            return {
                "query_video": file.filename,
                "total_scanned": len(sources),
                "matches_found": 0,
                "piracy_detected": False,
                "results": [],
            }

        # Step 4: Search
        k = min(10, local_index.ntotal)
        q_vec = np.array([query_embedding], dtype=np.float32)
        scores, indices = local_index.search(q_vec, k)

        # Step 5: Build ranked results
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1 or idx >= len(valid_sources):
                continue
            meta = valid_sources[idx]
            results.append(_build_result(
                score=float(score),
                platform=meta.get("platform", "Unknown"),
                url=meta.get("url", ""),
                title=meta.get("title", meta.get("url", "Unknown")),
            ))

        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        piracy_count = sum(1 for r in results if r["status"] != "Safe")

        return {
            "query_video": file.filename,
            "total_scanned": len(valid_sources),
            "matches_found": len(results),
            "piracy_detected": piracy_count > 0,
            "results": results,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
