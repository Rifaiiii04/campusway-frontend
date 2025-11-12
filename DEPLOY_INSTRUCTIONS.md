# 🚀 Instruksi Lengkap: Membuat http://103.23.198.101/ Dapat Diakses

## Status Saat Ini
Halaman http://103.23.198.101/ hanya menampilkan "Memuat halaman..." yang berarti frontend belum ter-deploy dengan benar.

## Solusi Lengkap (3 Langkah)

### ✅ LANGKAH 1: Build Frontend (Lokal)

```bash
cd campusway-frontend
npm install
npm run build
```

**Pastikan:**
- Folder `out/` terbuat setelah build
- Ada file `index.html` di dalam folder `out/`
- Ada file CSS, JS, dan asset lainnya

### ✅ LANGKAH 2: Upload ke VPS

**Pilih salah satu metode:**

#### Metode A: WinSCP/FileZilla (PALING MUDAH) ⭐

1. **Download WinSCP** (gratis): https://winscp.net/
2. **Connect ke VPS:**
   - Host: `103.23.198.101`
   - Username: `marketing`
   - Password: (password VPS Anda)
   - Protocol: SFTP
3. **Upload files:**
   - Di panel kiri (lokal): Buka folder `campusway-frontend/out/`
   - Di panel kanan (server): Buka folder `/var/www/html/`
   - **Pilih SEMUA file** dari folder `out/` (Ctrl+A)
   - **Drag & drop** atau klik tombol Upload
   - Tunggu sampai semua file ter-upload

#### Metode B: SCP Command

```bash
# Dari Git Bash atau PowerShell
scp -r campusway-frontend/out/* marketing@103.23.198.101:/var/www/html/
```

**Masukkan password saat diminta.**

### ✅ LANGKAH 3: Fix di VPS (SSH)

#### Opsi A: Script Otomatis (Recommended)

1. **Upload script `complete-fix.sh` ke VPS** (via WinSCP atau scp)
2. **SSH ke VPS:**
   ```bash
   ssh marketing@103.23.198.101
   ```
3. **Jalankan script:**
   ```bash
   sudo bash complete-fix.sh
   ```

Script akan otomatis:
- ✅ Check dan start Apache
- ✅ Fix permissions
- ✅ Create/check Apache configuration
- ✅ Enable modules
- ✅ Restart Apache
- ✅ Test access

#### Opsi B: Manual Commands

```bash
# SSH ke VPS
ssh marketing@103.23.198.101

# Set permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Check Apache status
sudo systemctl status apache2

# Restart Apache
sudo systemctl restart apache2

# Test
curl http://localhost/
```

## Verifikasi

Setelah semua langkah:

1. **Buka browser:** http://103.23.198.101/
2. **Harus menampilkan:** Halaman frontend (bukan "Memuat halaman...")
3. **Test halaman lain:**
   - http://103.23.198.101/landing
   - http://103.23.198.101/login

## Troubleshooting

### Masalah: Masih "Memuat halaman..."

**Kemungkinan penyebab:**
1. File belum ter-upload dengan benar
2. File di lokasi yang salah
3. Permissions tidak benar

**Solusi:**
```bash
# SSH ke VPS
ssh marketing@103.23.198.101

# Check apakah file ada
ls -la /var/www/html/
ls -la /var/www/html/index.html

# Jika tidak ada, upload lagi
# Jika ada, fix permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo systemctl restart apache2
```

### Masalah: 404 Not Found

**Solusi:**
```bash
# Check Apache configuration
sudo apache2ctl -S
sudo cat /etc/apache2/sites-available/103.23.198.101.conf

# Enable site
sudo a2ensite 103.23.198.101.conf
sudo systemctl restart apache2
```

### Masalah: 403 Forbidden

**Solusi:**
```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

### Masalah: Connection Reset

**Solusi:**
```bash
# Check Apache status
sudo systemctl status apache2

# Start Apache jika tidak running
sudo systemctl start apache2

# Check firewall
sudo ufw status
sudo ufw allow 80/tcp
```

## Checklist Final

- [ ] Frontend sudah di-build (`npm run build`)
- [ ] Folder `out/` berisi file HTML, CSS, JS
- [ ] File sudah di-upload ke `/var/www/html/` di VPS
- [ ] File `index.html` ada di server
- [ ] Permissions sudah benar (www-data:www-data, 755)
- [ ] Apache berjalan (`sudo systemctl status apache2`)
- [ ] Apache sudah di-restart
- [ ] Website dapat diakses di browser

## Script yang Tersedia

1. **`build-and-deploy.ps1`** - Build frontend (Windows)
2. **`complete-fix.sh`** - Fix semua masalah di VPS (Linux)
3. **`fix-vps-access.sh`** - Script perbaikan alternatif

## Support

Jika masih bermasalah, kirimkan output dari:
```bash
sudo systemctl status apache2
ls -la /var/www/html/
sudo tail -20 /var/log/apache2/error.log
curl -I http://localhost/
```

