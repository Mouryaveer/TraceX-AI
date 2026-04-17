def generate_legal_advice(similarity: float, platform: str, title: str = "") -> dict:
    pct = round(similarity * 100, 1)
    content_ref = f'"{title}" on {platform}' if title else f"content on {platform}"

    if similarity >= 0.90:
        return {
            "risk_level": "High Risk Piracy",
            "confidence_pct": pct,
            "actions": [
                f"File a DMCA takedown request against {content_ref}",
                f"Report copyright violation directly to {platform}",
                "Issue a formal legal cease-and-desist notice to the uploader",
                "Contact a copyright attorney to pursue damages",
                "Document evidence (screenshots, URLs, timestamps) immediately",
            ],
        }
    elif similarity >= 0.55:
        return {
            "risk_level": "Possible Copy",
            "confidence_pct": pct,
            "actions": [
                f"Monitor {content_ref} for further distribution",
                "Contact the uploader directly to request removal",
                f"Submit a copyright report to {platform}",
                "Keep records in case escalation is needed",
            ],
        }
    return {
        "risk_level": "Safe",
        "confidence_pct": pct,
        "actions": ["No action required. Content appears original."],
    }
