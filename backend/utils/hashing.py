import imagehash
from PIL import Image

def get_phash(image_path: str) -> str:
    img = Image.open(image_path)
    return str(imagehash.phash(img))

def hash_similarity(hash1: str, hash2: str) -> float:
    h1 = imagehash.hex_to_hash(hash1)
    h2 = imagehash.hex_to_hash(hash2)
    # Normalize: 0 = identical, 64 = completely different
    diff = h1 - h2
    return 1.0 - (diff / 64.0)
