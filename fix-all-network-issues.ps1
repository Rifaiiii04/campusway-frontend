# PowerShell script untuk mengatasi semua masalah network access
Write-Host "========================================" -ForegroundColor Green
Write-Host "🔧 TKA FRONTEND NETWORK FIX ALL ISSUES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Stop all running processes
Write-Host "1. Stopping all running processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Clear all caches
Write-Host "2. Clearing all caches..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Write-Host "   Removing .next directory..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force ".next"
}

if (Test-Path "node_modules") {
    Write-Host "   Removing node_modules..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force "node_modules"
}

Write-Host "   Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force

# Reinstall dependencies
Write-Host "3. Reinstalling dependencies..." -ForegroundColor Yellow
npm install

# Set environment variables
Write-Host "4. Setting environment variables..." -ForegroundColor Yellow
$env:HOSTNAME = "0.0.0.0"
$env:PORT = "3000"
$env:NODE_ENV = "development"

Write-Host "   ✅ HOSTNAME = 0.0.0.0" -ForegroundColor Green
Write-Host "   ✅ PORT = 3000" -ForegroundColor Green
Write-Host "   ✅ NODE_ENV = development" -ForegroundColor Green

# Display information
Write-Host "5. Configuration summary..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Frontend akan berjalan di:" -ForegroundColor Cyan
Write-Host "   - http://localhost:3000 (local access)" -ForegroundColor White
Write-Host "   - http://192.168.1.6:3000 (network access)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Backend harus berjalan di http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 File yang sudah diperbaiki:" -ForegroundColor Cyan
Write-Host "   - next.config.ts (CORS headers, cache control)" -ForegroundColor White
Write-Host "   - network-fix.css (CSS fixes)" -ForegroundColor White
Write-Host "   - network-styles.css (Network-specific styles)" -ForegroundColor White
Write-Host "   - layout.tsx (Import CSS fixes)" -ForegroundColor White
Write-Host "   - package.json (Network script)" -ForegroundColor White
Write-Host "   - networkConfig.ts (Network utility)" -ForegroundColor White
Write-Host ""

# Test network connectivity
Write-Host "6. Testing network connectivity..." -ForegroundColor Yellow
try {
    $networkTest = Test-NetConnection -ComputerName "192.168.1.6" -Port 3000 -InformationLevel Quiet
    if ($networkTest) {
        Write-Host "   ✅ Network connectivity OK" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Network connectivity may be limited" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️ Network test failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Start development server
Write-Host "7. Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Starting server with network access..." -ForegroundColor Green
Write-Host "   Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Red
Write-Host ""

# Start Next.js with network access
npm run dev -- --hostname 0.0.0.0 --port 3000
