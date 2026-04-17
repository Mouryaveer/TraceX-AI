import os
import warnings
import logging
from contextlib import asynccontextmanager

# Suppress all HuggingFace / transformers noise before any import
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_TOKEN"] = "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"
os.environ["HUGGING_FACE_HUB_TOKEN"] = "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"
warnings.filterwarnings("ignore")
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, scan, media


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: warm up CLIP model so first request is instant
    print("[TraceX] Warming up CLIP model...")
    from services.embedding import warmup
    warmup()
    print("[TraceX] Backend ready. http://127.0.0.1:8000/docs")
    yield
    # Shutdown (nothing to clean up)


app = FastAPI(
    title="TraceX AI",
    description="Google-like piracy detection: upload a video, scan the internet, get legal actions.",
    version="2.0.0",
    redirect_slashes=False,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(upload.router, tags=["Index"])
app.include_router(scan.router, tags=["Search"])
app.include_router(media.router, tags=["Media"])


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "TraceX AI is running",
        "version": "2.0.0",
        "endpoints": {
            "POST /upload": "Index your original content",
            "POST /search": "Scan internet for pirated copies",
            "GET  /media":  "List all indexed media",
        },
    }
