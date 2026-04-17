# TraceX AI — Piracy Detection Engine

> Upload a video → scan the internet → find pirated copies → get legal actions.

---

## Architecture

```
User uploads video
      ↓
Extract 10–20 frames (OpenCV)
      ↓
Average CLIP embeddings → video fingerprint
      ↓
Scan internet sources (local dataset + YouTube API)
      ↓
Embed each source → compare via FAISS (cosine similarity)
      ↓
Rank results by similarity score
      ↓
Classify: High Risk Piracy / Possible Copy / Safe
      ↓
Generate legal actions per result
```

---

## Setup

```bash
cd backend
pip install -r requirements.txt

# Seed local sample dataset (run once)
python seed_samples.py
```

### Optional: YouTube API
Set your key to enable live YouTube scanning:
```bash
set YOUTUBE_API_KEY=your_key_here   # Windows
export YOUTUBE_API_KEY=your_key_here  # Mac/Linux
```

Get a free key at: https://console.cloud.google.com → YouTube Data API v3

---

## Run

```bash
uvicorn app:app --reload --port 8000
```

Open interactive docs: http://localhost:8000/docs

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Index your original owned content |
| `POST` | `/search` | Scan internet for pirated copies of uploaded video |
| `GET`  | `/media`  | List all indexed media |

### /search response shape
```json
{
  "query_video": "my_video.mp4",
  "total_scanned": 15,
  "matches_found": 5,
  "piracy_detected": true,
  "results": [
    {
      "similarity_pct": 92.3,
      "status": "High Risk Piracy",
      "platform": "YouTube",
      "url": "https://youtube.com/watch?v=xxx",
      "title": "IPL Match Highlights",
      "legal_advice": {
        "risk_level": "High Risk Piracy",
        "confidence_pct": 92.3,
        "actions": [
          "File a DMCA takedown request...",
          "Report copyright violation to YouTube",
          ...
        ]
      }
    }
  ]
}
```

---

## Demo Flow

1. Put sample videos/images in `data/samples/` (or run `seed_samples.py`)
2. `POST /search` — upload any video
3. See ranked piracy results with legal actions

---

## Piracy Thresholds

| Score | Status |
|-------|--------|
| ≥ 85% | 🚨 High Risk Piracy |
| ≥ 65% | ⚠️ Possible Copy |
| < 65% | ✅ Safe |
