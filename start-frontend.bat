@echo off
echo === FRONTEND SETUP ===

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
echo 3. Starting frontend development server...
echo Frontend akan berjalan di http://localhost:3000
echo Backend harus berjalan di http://127.0.0.1:8000
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.

npm run dev

pause
