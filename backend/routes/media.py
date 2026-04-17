from fastapi import APIRouter
from db.database import get_all_media

router = APIRouter()

@router.get("/media")
def list_media():
    return {"media": get_all_media()}
