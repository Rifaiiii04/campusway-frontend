@echo off
echo ========================================
echo FIXING TEACHER LOGIN ISSUES
echo ========================================

echo.
echo 1. Stopping any running processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM php.exe 2>nul

echo.
echo 2. Clearing Next.js cache...
if exist .next rmdir /s /q .next
if exist .next rmdir /s /q .next

echo.
echo 3. Clearing node_modules cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo 4. Reinstalling dependencies...
call npm install

echo.
echo 5. Building the application...
call npm run build

echo.
echo 6. Starting development server...
echo.
echo ========================================
echo READY! Now open:
echo 1. http://localhost:3000/clear-localStorage.html
echo 2. Clear localStorage and close the tab
echo 3. Go to http://localhost:3000/login
echo 4. Try logging in as teacher
echo ========================================
echo.

start http://localhost:3000/clear-localStorage.html
call npm run dev
