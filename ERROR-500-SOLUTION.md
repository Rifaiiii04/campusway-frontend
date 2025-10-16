# Solusi Error 500 Internal Server Error

## Masalah
Aplikasi frontend mengalami error 500 Internal Server Error dan timeout saat mengakses endpoint API `/super-admin/api/school/dashboard` dan `/super-admin/api/school/login`.

## Analisis Masalah
1. **Server Backend Error**: Endpoint API mengembalikan error 500, menunjukkan masalah internal di server Laravel
2. **Timeout Issues**: Server tidak merespons dalam waktu yang ditentukan (10-15 detik)
3. **Semua Endpoint Terpengaruh**: Tidak hanya dashboard, tetapi semua endpoint API mengembalikan error 500
4. **Server Web Berjalan**: Server web Apache berjalan normal, tetapi aplikasi Laravel mengalami error internal

## Solusi yang Diimplementasikan

### 1. Error Handling yang Lebih Baik
- **Pesan Error Spesifik**: Menampilkan pesan error yang lebih informatif untuk error 500
- **Fallback Data**: Menyediakan data kosong sebagai fallback ketika server error
- **Opsi Lanjutkan**: Tombol untuk melanjutkan dengan data kosong ketika server error

### 2. Retry Mechanism
- **Auto Retry**: Otomatis mencoba ulang request hingga 2 kali untuk error 500 dan timeout
- **Exponential Backoff**: Delay bertahap antara retry (1s, 2s)
- **Fallback URL**: Mencoba URL alternatif jika server utama error
- **Timeout Handling**: Meningkatkan timeout dari 10s ke 15s dan retry untuk timeout

### 3. User Experience Improvements
- **Loading State**: Menampilkan loading indicator saat mengambil data
- **Error Display**: UI yang user-friendly untuk menampilkan error
- **Troubleshooting Guide**: Panduan troubleshooting yang terintegrasi

## Kode yang Dimodifikasi

### 1. SchoolLogin.tsx
```typescript
// Retry mechanism untuk error 500
if (response.status === 500 && retryCount < 2) {
  console.warn(`Server error 500, retrying login... (attempt ${retryCount + 1}/2)`);
  setLoadingMessage(`Mencoba lagi... (${retryCount + 1}/2)`);
  await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
  return handleLogin(e, retryCount + 1);
}

// Error handling khusus untuk 500 dan timeout
} else if (message.includes("500") || message.includes("internal server error")) {
  errorMessage = "Server sedang mengalami masalah. Silakan coba lagi nanti atau hubungi administrator.";
} else if (message.includes("timeout")) {
  errorMessage = "Server tidak merespons dalam waktu yang ditentukan. Silakan coba lagi.";
}

// Tombol retry manual di error modal
showRetry={error.includes("500") || error.includes("Server sedang mengalami masalah") || error.includes("timeout") || error.includes("tidak merespons")}
onRetry={() => {
  setShowErrorModal(false);
  setError("");
  const form = document.querySelector('form');
  if (form) {
    handleLogin(new Event('submit') as any, 0);
  }
}}
```

### 2. SchoolDashboard.tsx
```typescript
// Error handling yang lebih spesifik
if (dashboardError instanceof Error && dashboardError.message.includes("500")) {
  setError("Server sedang mengalami masalah. Silakan coba lagi nanti atau hubungi administrator.");
} else {
  setError("Gagal memuat data dashboard. Pastikan koneksi internet stabil.");
}

// Opsi untuk melanjutkan dengan data kosong
{error.includes("500") && (
  <button onClick={() => {
    setError("");
    setLoading(false);
    // Set fallback data
    setOverview({
      total_students: 0,
      total_classes: 0,
      total_test_results: 0,
      completed_tests: 0,
      completion_rate: 0,
    });
    setStudents([]);
    setMajorStats([]);
  }}>
    Lanjutkan dengan Data Kosong
  </button>
)}
```

### 2. api.ts
```typescript
// Retry mechanism untuk error 500
if (response.status === 500 && retryCount < 2) {
  console.warn(`Server error 500, retrying... (attempt ${retryCount + 1}/2)`);
  await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
  return fetchWithCache(url, options, cacheKey, cacheTTL, retryCount + 1);
}

// Fallback URL mechanism
if (response.status === 500 && retryCount === 0) {
  console.warn(`Server error 500, trying fallback URL...`);
  const fallbackUrl = url.replace(getApiBaseUrl(), getFallbackApiBaseUrl());
  try {
    return await fetchWithCache(fallbackUrl, options, cacheKey, cacheTTL, retryCount + 1);
  } catch (fallbackError) {
    console.warn(`Fallback URL also failed:`, fallbackError);
  }
}
```

## Cara Menggunakan

### 1. Ketika Error 500 Terjadi
1. Aplikasi akan otomatis mencoba retry hingga 2 kali
2. Jika masih error, akan mencoba URL fallback
3. Jika semua gagal, akan menampilkan pesan error yang informatif

### 2. Opsi yang Tersedia
- **Coba Lagi**: Mencoba ulang request ke server
- **Lanjutkan dengan Data Kosong**: Melanjutkan dengan data kosong (hanya untuk error 500)
- **Logout**: Keluar dari aplikasi

### 3. Troubleshooting
- Periksa apakah server Laravel backend berjalan
- Pastikan database terhubung dengan benar
- Cek log Laravel di `storage/logs/laravel.log`

## Monitoring dan Debugging

### 1. Console Logs
Aplikasi akan menampilkan log detail di console browser:
- URL yang dicoba
- Status response
- Retry attempts
- Fallback URL attempts

### 2. Error Tracking
Error akan dicatat dengan detail:
- Jenis error (500, timeout, connection refused)
- URL yang error
- Timestamp error
- Retry count

## Rekomendasi untuk Backend

### 1. Perbaikan Server Laravel
- Periksa log Laravel untuk detail error
- Pastikan database connection berfungsi
- Cek konfigurasi environment
- Jalankan `php artisan config:clear` dan `php artisan cache:clear`

### 2. Monitoring
- Setup monitoring untuk endpoint API
- Implementasi health check endpoint
- Logging yang lebih detail untuk debugging

## Status Implementasi
✅ Error handling yang lebih baik
✅ Retry mechanism untuk login dan dashboard
✅ Retry mechanism untuk timeout errors
✅ Fallback data untuk dashboard
✅ User-friendly error display
✅ Tombol retry manual di error modal
✅ Troubleshooting guide
✅ Console logging untuk debugging
✅ Error handling khusus untuk 500 dan timeout di login
✅ Timeout increased dari 10s ke 15s

## Catatan
Solusi ini bersifat sementara untuk meningkatkan user experience ketika server backend mengalami masalah. Masalah root cause di server Laravel masih perlu diperbaiki untuk solusi permanen.
