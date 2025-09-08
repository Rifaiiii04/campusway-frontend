@echo off
echo === FRONTEND NETWORK SETUP ===

echo.
echo 1. Checking if backend is running...
timeout /t 2 /nobreak >nul

echo 2. Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
) else (
    echo Dependencies already installed
)

echo.
echo 3. Starting frontend development server with network access...
echo Frontend akan berjalan di:
echo   - http://localhost:3000 (local access)
echo   - http://192.168.1.6:3000 (network access)
echo Backend harus berjalan di http://127.0.0.1:8000
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.

REM Set environment variables for network access
set HOSTNAME=0.0.0.0
set PORT=3000

REM Start Next.js with network access
npm run dev -- --hostname 0.0.0.0 --port 3000

pause
