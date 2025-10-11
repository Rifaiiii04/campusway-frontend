# PowerShell script untuk mengatasi masalah network access
Write-Host "🔧 TKA Frontend Network Fix" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Stop any running processes
Write-Host "1. Stopping running processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear cache
Write-Host "2. Clearing cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   ✅ .next directory removed" -ForegroundColor Green
}

# Clear node_modules if needed
if (Test-Path "node_modules") {
    Write-Host "3. Checking node_modules..." -ForegroundColor Yellow
    $nodeModulesAge = (Get-Item "node_modules").LastWriteTime
    $packageJsonAge = (Get-Item "package.json").LastWriteTime
    
    if ($nodeModulesAge -lt $packageJsonAge) {
        Write-Host "   📦 Reinstalling dependencies..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "node_modules"
        npm install
    } else {
        Write-Host "   ✅ Dependencies up to date" -ForegroundColor Green
    }
}

# Set environment variables
Write-Host "4. Setting environment variables..." -ForegroundColor Yellow
$env:HOSTNAME = "0.0.0.0"
$env:PORT = "3000"
$env:NODE_ENV = "development"

Write-Host "   ✅ HOSTNAME = 0.0.0.0" -ForegroundColor Green
Write-Host "   ✅ PORT = 3000" -ForegroundColor Green

# Start development server
Write-Host "5. Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Frontend akan berjalan di:" -ForegroundColor Cyan
Write-Host "   - http://localhost:3000 (local access)" -ForegroundColor White
Write-Host "   - http://192.168.1.6:3000 (network access)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Backend harus berjalan di http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Red
Write-Host ""

# Start Next.js with network access
npm run dev -- --hostname 0.0.0.0 --port 3000
