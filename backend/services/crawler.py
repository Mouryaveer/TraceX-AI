import requests
import os

TEMP_DIR = "uploads"
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

def download_image(url: str, filename: str = "temp.jpg") -> str:
    os.makedirs(TEMP_DIR, exist_ok=True)
    path = os.path.join(TEMP_DIR, filename)
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    with open(path, "wb") as f:
        f.write(response.content)
    return path

def search_youtube(query: str, max_results: int = 10) -> list[dict]:
    """Search YouTube for potentially pirated content using Data API v3."""
    if not YOUTUBE_API_KEY:
        return []
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY,
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    items = resp.json().get("items", [])
    results = []
    for item in items:
        video_id = item["id"]["videoId"]
        snippet = item["snippet"]
        thumbnail_url = snippet["thumbnails"]["high"]["url"]
        results.append({
            "platform": "YouTube",
            "title": snippet["title"],
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "thumbnail_url": thumbnail_url,
        })
    return results

def fetch_thumbnail(item: dict, idx: int) -> dict | None:
    """Download thumbnail for a search result and attach local path."""
    try:
        path = download_image(item["thumbnail_url"], filename=f"thumb_{idx}.jpg")
        return {**item, "local_path": path}
    except Exception:
        return None
