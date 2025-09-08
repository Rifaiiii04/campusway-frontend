@echo off
echo ========================================
echo 🔧 TKA FRONTEND EXPORT TEST
echo ========================================

echo.
echo 1. Starting Next.js with network access...
echo Frontend: http://localhost:3000 dan http://192.168.1.6:3000
echo Backend: http://127.0.0.1:8000 (harus running)
echo.
echo 2. Test export function:
echo    - Buka http://localhost:3000/teacher
echo    - Login sebagai guru
echo    - Klik tombol "Export Data" di dashboard
echo    - Cek console untuk error messages
echo    - Cek apakah file CSV ter-download
echo.

REM Set environment variables
set HOSTNAME=0.0.0.0
set PORT=3000

REM Start Next.js
npx next dev --hostname 0.0.0.0 --port 3000

pause
