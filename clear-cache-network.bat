@echo off
echo === CLEARING CACHE FOR NETWORK ACCESS ===

echo.
echo 1. Stopping any running processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

echo 2. Clearing Next.js cache...
if exist ".next" (
    echo Removing .next directory...
    rmdir /s /q ".next"
)

echo 3. Clearing node_modules cache...
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q "node_modules"
)

echo 4. Clearing npm cache...
npm cache clean --force

echo 5. Reinstalling dependencies...
npm install

echo 6. Starting with network access...
echo.
echo Frontend akan berjalan di:
echo   - http://localhost:3000 (local access)
echo   - http://192.168.1.6:3000 (network access)
echo.

REM Set environment variables
set HOSTNAME=0.0.0.0
set PORT=3000

REM Start with network access
npm run dev -- --hostname 0.0.0.0 --port 3000

pause
