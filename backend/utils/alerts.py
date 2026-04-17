from services.similarity import classify_piracy

def build_result(score: float, platform: str, url: str, title: str, advice: dict) -> dict:
    return {
        "similarity_score": round(score, 4),
        "similarity_pct": round(score * 100, 1),
        "status": classify_piracy(score),
        "platform": platform,
        "url": url,
        "title": title,
        "legal_advice": advice,
    }

def no_match_response() -> dict:
    return {"status": "Safe", "message": "No matching content found in scan.", "results": []}
