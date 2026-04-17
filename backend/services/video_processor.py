import cv2
import os

FRAMES_DIR = "frames"

def extract_frames(video_path: str, max_frames: int = 20) -> list[str]:
    """Extract up to max_frames evenly-spaced frames from a video."""
    os.makedirs(FRAMES_DIR, exist_ok=True)
    cap = cv2.VideoCapture(video_path)

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total <= 0:
        # Fallback: read every 30th frame
        return _extract_by_interval(cap, video_path, interval=30)

    interval = max(1, total // max_frames)
    frames = []
    count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if count % interval == 0 and len(frames) < max_frames:
            base = os.path.splitext(os.path.basename(video_path))[0]
            path = os.path.join(FRAMES_DIR, f"{base}_frame_{count}.jpg")
            cv2.imwrite(path, frame)
            frames.append(path)
        count += 1

    cap.release()
    return frames

def _extract_by_interval(cap, video_path: str, interval: int) -> list[str]:
    frames = []
    count = 0
    base = os.path.splitext(os.path.basename(video_path))[0]
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if count % interval == 0:
            path = os.path.join(FRAMES_DIR, f"{base}_frame_{count}.jpg")
            cv2.imwrite(path, frame)
            frames.append(path)
        count += 1
    cap.release()
    return frames
