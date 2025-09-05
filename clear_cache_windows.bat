@echo off
echo 🧹 FORCE CLEARING CACHE AND RESTARTING...

echo.
echo 1. Clearing Next.js cache...
if exist .next rmdir /s /q .next
echo ✅ Next.js cache cleared

echo.
echo 2. Clearing node_modules cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✅ Node modules cache cleared

echo.
echo 3. Clearing npm cache...
npm cache clean --force
echo ✅ NPM cache cleared

echo.
echo 4. Adding timestamp to force reload...
powershell -Command "(Get-Content 'src\components\student\StudentDashboardClient.tsx') -replace 'FORCE UPDATE 2025-09-05', 'FORCE UPDATE 2025-09-05-%date%' | Set-Content 'src\components\student\StudentDashboardClient.tsx'"
echo ✅ Timestamp added to force reload

echo.
echo 🚀 Starting development server...
npm run dev

echo.
echo ✅ FORCE CLEAR COMPLETED!
echo 📋 Next steps:
echo 1. Open browser in incognito/private mode
echo 2. Go to localhost:3000/student/dashboard
echo 3. Check if Rumpun Ilmu filters are showing
echo 4. If still showing old filters, clear browser cache completely
pause
