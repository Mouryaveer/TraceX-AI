from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil, os

from services.embedding import get_embedding, get_video_embedding
from services.video_processor import extract_frames
from services.similarity import add_embedding
from db.database import save_metadata
from utils.hashing import get_phash

router = APIRouter()
UPLOAD_DIR = "uploads"

@router.post("/upload")
async def upload_media(file: UploadFile = File(...)):
    """Index original owned content into FAISS + MongoDB for future matching."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    path = os.path.join(UPLOAD_DIR, file.filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ext = file.filename.rsplit(".", 1)[-1].lower()
    is_video = ext in {"mp4", "avi", "mov", "mkv", "webm"}

    try:
        if is_video:
            frames = extract_frames(path, max_frames=20)
            if not frames:
                raise HTTPException(status_code=400, detail="No frames extracted from video.")
            embedding = get_video_embedding(frames)
            phash = get_phash(frames[0])
            media_id = save_metadata({
                "filename": file.filename,
                "type": "video",
                "frame_count": len(frames),
                "phash": phash,
            })
        else:
            embedding = get_embedding(path)
            phash = get_phash(path)
            media_id = save_metadata({
                "filename": file.filename,
                "type": "image",
                "path": path,
                "phash": phash,
            })

        add_embedding(embedding, media_id, metadata={
            "filename": file.filename,
            "platform": "Original (Owned)",
            "url": "",
            "title": file.filename,
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Indexed successfully", "filename": file.filename, "media_id": media_id}
