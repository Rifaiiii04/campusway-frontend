# PowerShell script untuk menjalankan Next.js dengan network access
Write-Host "========================================" -ForegroundColor Green
Write-Host "🔧 TKA FRONTEND NETWORK FIX" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Stop any running processes
Write-Host "1. Stopping processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Set environment variables
Write-Host "2. Setting environment variables..." -ForegroundColor Yellow
$env:HOSTNAME = "0.0.0.0"
$env:PORT = "3000"
$env:NODE_ENV = "development"

Write-Host "   ✅ HOSTNAME = 0.0.0.0" -ForegroundColor Green
Write-Host "   ✅ PORT = 3000" -ForegroundColor Green
Write-Host "   ✅ NODE_ENV = development" -ForegroundColor Green

# Display information
Write-Host "3. Configuration summary..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Frontend akan berjalan di:" -ForegroundColor Cyan
Write-Host "   - http://localhost:3000 (local access)" -ForegroundColor White
Write-Host "   - http://192.168.1.6:3000 (network access)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Backend harus berjalan di http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Perbaikan yang sudah diterapkan:" -ForegroundColor Cyan
Write-Host "   - SSR/CSR mismatch fixes" -ForegroundColor White
Write-Host "   - localStorage guards" -ForegroundColor White
Write-Host "   - window/document guards" -ForegroundColor White
Write-Host "   - Hydration mismatch fixes" -ForegroundColor White
Write-Host ""

# Start Next.js with network access
Write-Host "4. Starting Next.js with network access..." -ForegroundColor Yellow
Write-Host "   Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Red
Write-Host ""

npx next dev --hostname 0.0.0.0 --port 3000
