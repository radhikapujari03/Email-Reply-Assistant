@echo off
TITLE Email Reply Assistant - Development Mode
echo =======================================================
echo     Starting Backend (Port 5000) and Vite (Port 5173)...
echo =======================================================
cd /d "%~dp0"

start "Flask API Backend" cmd /k "backend\venv\Scripts\python.exe backend\app.py"
start "Vite React Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 >nul
start "" "http://localhost:5173"
