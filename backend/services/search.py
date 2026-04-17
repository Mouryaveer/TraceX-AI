import os
from services.crawler import search_youtube, fetch_thumbnail

SAMPLES_DIR = "data/samples"

def get_local_dataset() -> list[dict]:
    """Load simulated 'internet' from local sample files."""
    if not os.path.exists(SAMPLES_DIR):
        return []
    results = []
    for fname in os.listdir(SAMPLES_DIR):
        ext = fname.rsplit(".", 1)[-1].lower()
        if ext in {"jpg", "jpeg", "png", "bmp"}:
            results.append({
                "platform": "Simulated Web",
                "title": fname,
                "url": f"https://example.com/media/{fname}",
                "local_path": os.path.join(SAMPLES_DIR, fname),
            })
    return results

def get_internet_sources(query: str = "") -> list[dict]:
    """
    Combine local dataset + YouTube API results.
    YouTube results are only fetched when YOUTUBE_API_KEY is set.
    """
    sources = get_local_dataset()

    if query:
        yt_results = search_youtube(query, max_results=10)
        for idx, item in enumerate(yt_results):
            fetched = fetch_thumbnail(item, idx)
            if fetched:
                sources.append(fetched)

    return sources
