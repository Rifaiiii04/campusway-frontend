# Backend Setup Guide

## Masalah: Error 500 Internal Server Error

Jika Anda melihat error 500 atau "Server backend tidak berjalan", ikuti langkah-langkah berikut:

## 1. Pastikan Backend Laravel Berjalan

### Opsi A: Menggunakan Script Otomatis

**Untuk Linux/Mac:**
```bash
bash start-backend-server.sh
```

**Untuk Windows:**
```cmd
start-backend-server.bat
```

### Opsi B: Manual Setup

1. **Buka terminal di folder backend Laravel**
2. **Install dependencies:**
   ```bash
   composer install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Jalankan migrasi database:**
   ```bash
   php artisan migrate
   ```

5. **Jalankan server:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

## 2. Verifikasi Server Berjalan

Server harus dapat diakses di:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/super-admin/api

## 3. Test API Endpoints

Jalankan script test untuk memverifikasi API:
```bash
node test-localhost-api.js
```

## 4. Troubleshooting

### Error: "Connection Refused"
- Pastikan server Laravel berjalan di port 8000
- Cek apakah port 8000 tidak digunakan aplikasi lain
- Jalankan: `netstat -tulpn | grep :8000` (Linux) atau `netstat -an | findstr :8000` (Windows)

### Error: "Database Connection Failed"
- Periksa konfigurasi database di file `.env`
- Pastikan database server berjalan
- Jalankan migrasi: `php artisan migrate`

### Error: "Class not found" atau "Method not found"
- Jalankan: `composer dump-autoload`
- Clear cache: `php artisan config:clear`

## 5. Struktur API Endpoints

API endpoints yang tersedia:
- `GET /super-admin/api/school/dashboard` - Data dashboard sekolah
- `GET /super-admin/api/school/students` - Data siswa
- `GET /super-admin/api/school/major-statistics` - Statistik jurusan
- `POST /super-admin/api/school/login` - Login sekolah

## 6. Logs dan Debugging

Untuk melihat error detail:
1. Cek log Laravel: `storage/logs/laravel.log`
2. Cek console browser (F12)
3. Jalankan dengan debug mode: `APP_DEBUG=true php artisan serve`

## 7. Port Configuration

Jika port 8000 sudah digunakan, ganti port:
```bash
php artisan serve --host=0.0.0.0 --port=8001
```

Dan update konfigurasi di `src/services/api.ts`:
```javascript
const url = "http://localhost:8001/super-admin";
```

## 8. Production Setup

Untuk production, gunakan web server seperti Nginx atau Apache dengan PHP-FPM, bukan `php artisan serve`.

---

**Catatan:** Pastikan backend Laravel berjalan sebelum mengakses frontend React/Next.js.
