@echo off
echo ========================================
echo    TKA Frontend + Add PUSMENDIK Data
echo ========================================
echo.

echo 1. Starting Next.js frontend...
start "TKA Frontend" cmd /k "npm run dev:network"

echo.
echo 2. Waiting for frontend to start...
timeout /t 5 /nobreak > nul

echo.
echo 3. Opening data addition page...
start "Add TKA Data" "add-pusmendik-data.html"

echo.
echo ========================================
echo    Setup completed!
echo ========================================
echo.
echo ✅ Frontend started on network
echo ✅ Data addition page opened
echo.
echo You can now:
echo - Add PUSMENDIK TKA data via the web page
echo - View the updated TKA schedules in student dashboard
echo.
echo Press any key to exit...
pause > nul
