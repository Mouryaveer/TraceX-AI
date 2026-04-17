import sys
import requests
import json

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = "http://127.0.0.1:8000"

print("=" * 50)
print("TraceX AI - API Test")
print("=" * 50)

# 1. Health check
r = requests.get(f"{BASE}/")
print(f"\n[1] Health check: {r.status_code}")
print(json.dumps(r.json(), indent=2))

# 2. Search with sample image
print("\n[2] POST /search with sample_1.jpg ...")
with open("data/samples/sample_1.jpg", "rb") as f:
    r = requests.post(
        f"{BASE}/search",
        files={"file": ("sample_1.jpg", f, "image/jpeg")},
        timeout=120,
    )

print(f"Status: {r.status_code}")
if r.ok:
    d = r.json()
    print(f"  query_video   : {d.get('query_video')}")
    print(f"  total_scanned : {d.get('total_scanned')}")
    print(f"  matches_found : {d.get('matches_found')}")
    print(f"  piracy_detected: {d.get('piracy_detected')}")
    print("\n  Top 3 results:")
    for i, res in enumerate(d.get("results", [])[:3]):
        print(f"    [{i+1}] {res['status']:20s} {res['similarity_pct']:5.1f}%  {res['platform']}")
        print(f"         URL: {res['url']}")
        print(f"         Legal: {res['legal_advice']['actions'][0]}")
else:
    print("ERROR:", r.text)

print("\n[DONE] Backend is fully working.")
