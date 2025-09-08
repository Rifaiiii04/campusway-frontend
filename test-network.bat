@echo off
echo === TESTING NETWORK ACCESS ===

echo.
echo 1. Testing localhost access...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/landing
if %errorlevel% equ 0 (
    echo ✅ Localhost access OK
) else (
    echo ❌ Localhost access failed
)

echo.
echo 2. Testing network access...
curl -s -o nul -w "%%{http_code}" http://192.168.1.6:3000/landing
if %errorlevel% equ 0 (
    echo ✅ Network access OK
) else (
    echo ❌ Network access failed
)

echo.
echo 3. Testing CSS loading...
curl -s -o nul -w "%%{http_code}" http://192.168.1.6:3000/_next/static/css/
if %errorlevel% equ 0 (
    echo ✅ CSS loading OK
) else (
    echo ❌ CSS loading failed
)

echo.
echo 4. Testing font loading...
curl -s -o nul -w "%%{http_code}" https://fonts.googleapis.com/css2?family=Inter
if %errorlevel% equ 0 (
    echo ✅ Font loading OK
) else (
    echo ❌ Font loading failed
)

echo.
echo 5. Testing backend connection...
curl -s -o nul -w "%%{http_code}" http://127.0.0.1:8000/api/school
if %errorlevel% equ 0 (
    echo ✅ Backend connection OK
) else (
    echo ❌ Backend connection failed
)

echo.
echo === TEST COMPLETE ===
pause
