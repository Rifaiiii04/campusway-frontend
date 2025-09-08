@echo off
echo ========================================
echo 🔧 QUICK FIX NETWORK ACCESS
echo ========================================

echo.
echo 1. Stopping processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

echo.
echo 2. Clearing cache...
if exist ".next" rmdir /s /q ".next"

echo.
echo 3. Setting environment...
set HOSTNAME=0.0.0.0
set PORT=3000

echo.
echo 4. Starting server...
echo Frontend: http://localhost:3000 dan http://192.168.1.6:3000
echo Backend: http://127.0.0.1:8000 (harus running)
echo.

npm run dev -- --hostname 0.0.0.0 --port 3000

pause
