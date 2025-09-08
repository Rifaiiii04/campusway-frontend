@echo off
echo ========================================
echo 🔧 TKA FRONTEND NETWORK FIX
echo ========================================

echo.
echo 1. Stopping processes...
taskkill /f /im node.exe 2>nul

echo.
echo 2. Setting environment variables...
set HOSTNAME=0.0.0.0
set PORT=3000
set NODE_ENV=development

echo.
echo 3. Starting Next.js with network access...
echo Frontend: http://localhost:3000 dan http://192.168.1.6:3000
echo Backend: http://127.0.0.1:8000 (harus running)
echo.

npx next dev --hostname 0.0.0.0 --port 3000

pause
