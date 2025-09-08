@echo off
echo ========================================
echo 🔧 TKA FRONTEND REFRESH TEST
echo ========================================

echo.
echo 1. Starting Next.js with network access...
echo Frontend: http://localhost:3000 dan http://192.168.1.6:3000
echo Backend: http://127.0.0.1:8000 (harus running)
echo.
echo 2. Test refresh issue:
echo    - Buka http://localhost:3000/teacher
echo    - Login sebagai guru
echo    - Buka menu "TKA Schedules"
echo    - Refresh halaman (F5 atau Ctrl+R)
echo    - Cek apakah jadwal TKA masih muncul
echo.

REM Set environment variables
set HOSTNAME=0.0.0.0
set PORT=3000

REM Start Next.js
npx next dev --hostname 0.0.0.0 --port 3000

pause
