# 🔧 FIX TEACHER LOGIN INSTRUCTIONS

## Masalah

Error: `"undefined" is not valid JSON` saat login guru

## Solusi Langkah demi Langkah

### 1. Buka Browser dan Clear LocalStorage

1. Buka browser (Chrome/Firefox/Edge)
2. Tekan `F12` untuk membuka Developer Tools
3. Pergi ke tab **Application** (Chrome) atau **Storage** (Firefox)
4. Di sidebar kiri, klik **Local Storage**
5. Klik domain `localhost:3000`
6. Klik **Clear All** atau hapus item berikut:
   - `school_token`
   - `school_data`
7. Tutup Developer Tools

### 2. Restart Development Server

```bash
# Di terminal, jalankan:
cd tka-frontend-siswa
npm run dev
```

### 3. Test Login

1. Buka `http://localhost:3000/login`
2. Login sebagai guru dengan kredensial yang benar
3. Jika masih error, buka Developer Tools (F12) dan lihat Console untuk error details

### 4. Alternative: Gunakan Clear Script

1. Buka `http://localhost:3000/clear-localStorage.html`
2. Klik tombol clear (jika ada)
3. Tutup tab tersebut
4. Coba login lagi

## Troubleshooting

### Jika masih error:

1. **Hard Refresh**: Tekan `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
2. **Incognito Mode**: Buka browser dalam mode incognito/private
3. **Different Browser**: Coba browser lain
4. **Clear All Cache**:
   - Chrome: Settings > Privacy > Clear browsing data
   - Firefox: Settings > Privacy > Clear Data

### Check Backend

Pastikan backend Laravel berjalan:

```bash
cd superadmin-backend
php artisan serve
```

## Kode yang Sudah Diperbaiki

- ✅ TeacherDashboardClient.tsx - Added robust JSON parsing
- ✅ API Service - Added null checks for schoolData
- ✅ Error handling - Better error messages and cleanup

## Status

- ✅ Frontend: Fixed JSON parsing errors
- ✅ Backend: Running on http://localhost:8000
- ✅ Database: MSSQL connected
- ✅ Mapping: Subject mappings populated

Jika masih ada masalah, periksa Console browser untuk error details yang lebih spesifik.
