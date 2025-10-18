# Solusi Masalah Timeout Login

## 🚨 Masalah
Error: `Timeout: Server tidak merespons` saat melakukan login

## 🔍 Diagnosis
Berdasarkan diagnostic yang telah dilakukan:
- ✅ Server backend berjalan dengan baik di port 8000
- ✅ Network connectivity normal
- ✅ API endpoints merespons dengan cepat
- ❌ Masalah kemungkinan di frontend atau browser

## 🛠️ Solusi yang Telah Diterapkan

### 1. Peningkatan Timeout
- Timeout dinaikkan dari 8 detik menjadi 15 detik
- Berlaku untuk semua API calls (login, fetchWithCache, dll)

### 2. Logging yang Lebih Baik
- Ditambahkan console.log untuk debugging
- Error handling yang lebih spesifik

### 3. Script Diagnostic
- `debug-login-issues.js` - untuk mendiagnosis masalah koneksi
- `fix-timeout-issues.sh` - untuk membersihkan cache dan restart

## 🔧 Langkah-langkah Mengatasi

### Langkah 1: Pastikan Backend Berjalan
```bash
cd /opt/lampp/htdocs/tka/superadmin-campusway
php artisan serve --host=127.0.0.1 --port=8000
```

### Langkah 2: Jalankan Script Fix
```bash
cd /opt/lampp/htdocs/tka/campusway-frontend
./fix-timeout-issues.sh
```

### Langkah 3: Bersihkan Browser
1. Buka Developer Tools (F12)
2. Klik kanan pada refresh button
3. Pilih "Empty Cache and Hard Reload"
4. Atau gunakan mode incognito/private

### Langkah 4: Verifikasi Konfigurasi
Pastikan API_BASE_URL benar:
```javascript
// Di src/services/api.ts
const getApiBaseUrl = () => {
  return "http://127.0.0.1:8000";
};
```

## 🧪 Testing

### Test Backend
```bash
curl -X POST http://127.0.0.1:8000/api/school/login \
  -H "Content-Type: application/json" \
  -d '{"npsn":"12345678","password":"password"}'
```

### Test Frontend
1. Buka browser console (F12)
2. Coba login
3. Periksa log untuk pesan error yang lebih detail

## 📊 Monitoring

### Console Logs
Sekarang akan muncul log seperti:
```
🔍 School login attempt to: http://127.0.0.1:8000/api/school/login
🔍 School login data: { npsn: "12345678", password: "***" }
🔍 School login response status: 200
🔍 School login response ok: true
```

### Error Messages
Error yang lebih spesifik:
- `Timeout: Server tidak merespons dalam 15 detik`
- `Koneksi gagal: Pastikan server backend berjalan di http://127.0.0.1:8000`
- `Request diblokir oleh browser atau extension`

## 🚀 Quick Fixes

### Jika Masih Timeout:
1. **Restart kedua server** (backend dan frontend)
2. **Gunakan browser berbeda** atau mode incognito
3. **Periksa firewall/antivirus** yang mungkin memblokir request
4. **Cek network proxy** settings

### Jika Error 500:
1. **Periksa Laravel logs**: `tail -f storage/logs/laravel.log`
2. **Clear Laravel cache**: `php artisan cache:clear`
3. **Restart database** jika menggunakan MySQL

### Jika CORS Error:
1. **Periksa CORS middleware** di Laravel
2. **Pastikan headers** sudah benar
3. **Test dengan Postman** untuk memastikan API bekerja

## 📝 Troubleshooting Checklist

- [ ] Backend server berjalan di port 8000
- [ ] Frontend server berjalan di port 3000
- [ ] Browser cache sudah dibersihkan
- [ ] Console tidak menampilkan error JavaScript
- [ ] Network tab menunjukkan request berhasil
- [ ] API response time < 5 detik
- [ ] Tidak ada ad blocker yang aktif
- [ ] Firewall tidak memblokir localhost

## 🔄 Rollback Plan

Jika masalah masih terjadi, bisa rollback ke versi sebelumnya:
```bash
git log --oneline -5
git checkout <commit-hash-before-timeout-fix>
```

## 📞 Support

Jika masalah masih berlanjut:
1. Jalankan `node debug-login-issues.js` dan share output-nya
2. Screenshot browser console saat error
3. Periksa Network tab di Developer Tools
4. Cek Laravel logs untuk error backend

---
*Dokumentasi ini dibuat untuk mengatasi masalah timeout login yang sering terjadi pada aplikasi Campusway Frontend.*
