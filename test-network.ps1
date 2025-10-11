# PowerShell script untuk test network access
Write-Host "🧪 Testing Network Access" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Test localhost access
Write-Host "1. Testing localhost access..." -ForegroundColor Yellow
try {
    $localhostResponse = Invoke-WebRequest -Uri "http://localhost:3000/landing" -Method GET -TimeoutSec 5
    if ($localhostResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Localhost access OK (Status: $($localhostResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Localhost access failed (Status: $($localhostResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Localhost access failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test network access
Write-Host "2. Testing network access..." -ForegroundColor Yellow
try {
    $networkResponse = Invoke-WebRequest -Uri "http://192.168.1.6:3000/landing" -Method GET -TimeoutSec 5
    if ($networkResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Network access OK (Status: $($networkResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Network access failed (Status: $($networkResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Network access failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test CSS loading
Write-Host "3. Testing CSS loading..." -ForegroundColor Yellow
try {
    $cssResponse = Invoke-WebRequest -Uri "http://192.168.1.6:3000/_next/static/css/" -Method GET -TimeoutSec 5
    if ($cssResponse.StatusCode -eq 200) {
        Write-Host "   ✅ CSS loading OK (Status: $($cssResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ CSS loading failed (Status: $($cssResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ CSS loading failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test font loading
Write-Host "4. Testing font loading..." -ForegroundColor Yellow
try {
    $fontResponse = Invoke-WebRequest -Uri "https://fonts.googleapis.com/css2?family=Inter" -Method GET -TimeoutSec 5
    if ($fontResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Font loading OK (Status: $($fontResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Font loading failed (Status: $($fontResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Font loading failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test backend connection
Write-Host "5. Testing backend connection..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/school" -Method GET -TimeoutSec 5
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Backend connection OK (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend connection failed (Status: $($backendResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Backend connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test layout consistency
Write-Host "6. Testing layout consistency..." -ForegroundColor Yellow
try {
    $localhostContent = (Invoke-WebRequest -Uri "http://localhost:3000/landing" -Method GET -TimeoutSec 5).Content
    $networkContent = (Invoke-WebRequest -Uri "http://192.168.1.6:3000/landing" -Method GET -TimeoutSec 5).Content
    
    if ($localhostContent -eq $networkContent) {
        Write-Host "   ✅ Layout consistency OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Layout consistency failed - content differs" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Layout consistency test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Test Complete!" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green
