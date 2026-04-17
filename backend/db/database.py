import os
import json
from pathlib import Path

MONGO_URI = os.getenv("MONGO_URI", "")
_db = None
_fallback_store: list[dict] = []
_fallback_file = Path("data/metadata.json")


def _get_db():
    """Lazy MongoDB connection — falls back to JSON file if Mongo is unavailable."""
    global _db
    if _db is not None:
        return _db
    if not MONGO_URI:
        return None
    try:
        from pymongo import MongoClient
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        client.admin.command("ping")          # fast connection test
        _db = client["tracex_db"]
        print("[TraceX] MongoDB connected.")
        return _db
    except Exception:
        print("[TraceX] MongoDB unavailable — using local JSON fallback.")
        return None


def _load_fallback():
    global _fallback_store
    if _fallback_file.exists():
        try:
            _fallback_store = json.loads(_fallback_file.read_text())
        except Exception:
            _fallback_store = []


def _save_fallback():
    _fallback_file.parent.mkdir(parents=True, exist_ok=True)
    _fallback_file.write_text(json.dumps(_fallback_store, indent=2))


_load_fallback()


def save_metadata(data: dict) -> str:
    db = _get_db()
    if db is not None:
        result = db.media.insert_one(data)
        return str(result.inserted_id)
    # JSON fallback
    import uuid
    media_id = str(uuid.uuid4())
    _fallback_store.append({"_id": media_id, **data})
    _save_fallback()
    return media_id


def get_metadata_by_id(media_id: str):
    db = _get_db()
    if db is not None:
        from bson import ObjectId
        try:
            return db.media.find_one({"_id": ObjectId(media_id)}, {"_id": 0})
        except Exception:
            pass
    return next((r for r in _fallback_store if r.get("_id") == media_id), None)


def get_all_media() -> list[dict]:
    db = _get_db()
    if db is not None:
        return list(db.media.find({}, {"_id": 0}))
    return [{k: v for k, v in r.items() if k != "_id"} for r in _fallback_store]
