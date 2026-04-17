"""
Populates data/samples/ with free test images from picsum.photos.
Run once before starting the backend.

Usage:
    python seed_samples.py
"""
import os
import sys
import requests

# Force UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SAMPLES_DIR = "data/samples"
os.makedirs(SAMPLES_DIR, exist_ok=True)

HEADERS = {"User-Agent": "TraceX-AI-Seeder/1.0"}

SAMPLE_IMAGES = [
    ("https://picsum.photos/seed/tracex1/640/360",  "sample_1.jpg"),
    ("https://picsum.photos/seed/tracex2/640/360",  "sample_2.jpg"),
    ("https://picsum.photos/seed/tracex3/640/360",  "sample_3.jpg"),
    ("https://picsum.photos/seed/tracex4/640/360",  "sample_4.jpg"),
    ("https://picsum.photos/seed/tracex5/640/360",  "sample_5.jpg"),
    ("https://picsum.photos/seed/tracex6/640/360",  "sample_6.jpg"),
    ("https://picsum.photos/seed/tracex7/640/360",  "sample_7.jpg"),
    ("https://picsum.photos/seed/tracex8/640/360",  "sample_8.jpg"),
    ("https://picsum.photos/seed/tracex9/640/360",  "sample_9.jpg"),
    ("https://picsum.photos/seed/tracex10/640/360", "sample_10.jpg"),
]

success = 0
for url, fname in SAMPLE_IMAGES:
    path = os.path.join(SAMPLES_DIR, fname)
    try:
        r = requests.get(url, timeout=15, headers=HEADERS, allow_redirects=True)
        r.raise_for_status()
        with open(path, "wb") as f:
            f.write(r.content)
        size_kb = len(r.content) // 1024
        print(f"[OK] {fname}  ({size_kb} KB)")
        success += 1
    except Exception as e:
        print(f"[FAIL] {fname}: {e}")

print(f"\nDone. {success}/{len(SAMPLE_IMAGES)} samples saved to {SAMPLES_DIR}/")
