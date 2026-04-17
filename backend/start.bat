@echo off
title TraceX AI Backend
echo ============================================
echo  TraceX AI Backend
echo  API docs: http://127.0.0.1:8000/docs
echo ============================================
echo.
set TRANSFORMERS_VERBOSITY=error
set HF_HUB_DISABLE_SYMLINKS_WARNING=1
python -m uvicorn app:app --reload --port 8000 --host 127.0.0.1
pause
