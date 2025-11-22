# Quick Fix: Memperbaiki Akses http://103.23.198.101/

## Masalah
Server masih belum terjangkau atau hanya menampilkan "Memuat halaman..."

## Solusi Cepat (3 Langkah)

### LANGKAH 1: Build Frontend (Lokal)
```bash
cd campusway-frontend
npm install
npm run build
```
**Pastikan folder `out/` terbuat setelah build!**

### LANGKAH 2: Upload ke VPS
**Pilih salah satu metode:**

#### Opsi A: WinSCP/FileZilla (Paling Mudah)
1. Buka WinSCP atau FileZilla
2. Connect ke: `103.23.198.101` dengan user `marketing`
3. Upload semua file dari `campusway-frontend/out/` ke `/var/www/html/` di server

#### Opsi B: SCP Command
```bash
scp -r campusway-frontend/out/* marketing@103.23.198.101:/var/www/html/
```

### LANGKAH 3: Fix di VPS (SSH)
```bash
# SSH ke VPS
ssh marketing@103.23.198.101

# Upload script fix
# (Copy isi file fix-vps-access.sh ke server, atau upload file tersebut)

# Jalankan script perbaikan
sudo bash fix-vps-access.sh
```

**ATAU jalankan manual:**

```bash
# 1. Set permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# 2. Periksa apakah index.html ada
ls -la /var/www/html/index.html

# 3. Periksa status Apache
sudo systemctl status apache2

# 4. Restart Apache
sudo systemctl restart apache2

# 5. Test
curl http://localhost/
```

## Checklist

- [ ] Frontend sudah di-build (`npm run build`)
- [ ] Folder `out/` berisi file HTML, CSS, JS
- [ ] File sudah di-upload ke `/var/www/html/` di VPS
- [ ] File `index.html` ada di `/var/www/html/`
- [ ] Permissions sudah benar (www-data:www-data, 755)
- [ ] Apache berjalan (`sudo systemctl status apache2`)
- [ ] Apache configuration sudah benar
- [ ] Apache sudah di-restart

## Troubleshooting

### Jika masih "Memuat halaman..."
1. **Check browser console** (F12) - ada error JavaScript?
2. **Check Network tab** - file CSS/JS gagal load?
3. **Check Apache logs:**
   ```bash
   sudo tail -f /var/log/apache2/error.log
   ```

### Jika 404 Not Found
- Pastikan file ada di `/var/www/html/`
- Pastikan `index.html` ada
- Check Apache DocumentRoot configuration

### Jika 403 Forbidden
```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

### Jika Connection Reset
- Check apakah Apache berjalan: `sudo systemctl status apache2`
- Check firewall: `sudo ufw status`
- Check port 80: `sudo netstat -tulpn | grep :80`

## Script Otomatis

Upload file `fix-vps-access.sh` ke VPS dan jalankan:
```bash
chmod +x fix-vps-access.sh
sudo bash fix-vps-access.sh
```

Script akan:
- ✅ Check dan start Apache
- ✅ Check directory dan permissions
- ✅ Check apakah index.html ada
- ✅ Fix permissions
- ✅ Create/check Apache configuration
- ✅ Enable modules
- ✅ Restart Apache
- ✅ Test access

## Verifikasi

Setelah semua langkah, test:
1. **Dari browser:** http://103.23.198.101/
2. **Dari server:** `curl http://localhost/`
3. **Check logs:** `sudo tail -f /var/log/apache2/error.log`

Jika masih bermasalah, kirimkan output dari:
```bash
sudo systemctl status apache2
ls -la /var/www/html/
sudo tail -20 /var/log/apache2/error.log
```









