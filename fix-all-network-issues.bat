@echo off
echo ========================================
echo 🔧 TKA FRONTEND NETWORK FIX ALL ISSUES
echo ========================================

echo.
echo 1. Stopping all running processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo 2. Clearing all caches...
if exist ".next" (
    echo    Removing .next directory...
    rmdir /s /q ".next"
)

if exist "node_modules" (
    echo    Removing node_modules...
    rmdir /s /q "node_modules"
)

echo    Clearing npm cache...
npm cache clean --force

echo.
echo 3. Reinstalling dependencies...
npm install

echo.
echo 4. Setting environment variables...
set HOSTNAME=0.0.0.0
set PORT=3000
set NODE_ENV=development

echo    ✅ HOSTNAME = 0.0.0.0
echo    ✅ PORT = 3000
echo    ✅ NODE_ENV = development

echo.
echo 5. Starting development server with network access...
echo.
echo 🌐 Frontend akan berjalan di:
echo    - http://localhost:3000 (local access)
echo    - http://192.168.1.6:3000 (network access)
echo.
echo 🔧 Backend harus berjalan di http://127.0.0.1:8000
echo.
echo 📝 File yang sudah diperbaiki:
echo    - next.config.ts (CORS headers, cache control)
echo    - network-fix.css (CSS fixes)
echo    - network-styles.css (Network-specific styles)
echo    - layout.tsx (Import CSS fixes)
echo    - package.json (Network script)
echo.
echo 🚀 Starting server...
echo.

REM Start Next.js with network access
npm run dev -- --hostname 0.0.0.0 --port 3000

pause
