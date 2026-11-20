@echo off
TITLE Email Reply Assistant
echo =======================================================
echo          Starting Email Reply Assistant...
echo =======================================================
cd /d "%~dp0"

IF EXIST "backend\venv\Scripts\python.exe" (
    start "" "http://127.0.0.1:5000"
    backend\venv\Scripts\python.exe backend\app.py
) ELSE (
    echo Virtual environment not found. Using system python...
    start "" "http://127.0.0.1:5000"
    python backend\app.py
)
pause
