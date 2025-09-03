@echo off
echo === FRONTEND ONLY SETUP ===

echo.
echo 1. Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
) else (
    echo Dependencies already installed
)

echo.
echo 2. Starting frontend development server...
echo Frontend akan berjalan di http://localhost:3000
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.

npm run dev

pause
