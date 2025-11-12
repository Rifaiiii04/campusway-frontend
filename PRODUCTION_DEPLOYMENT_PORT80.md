# Deployment Frontend ke Port 80 (http://103.23.198.101/)

## 📋 Overview

Frontend akan di-deploy ke Apache web server di port 80 (default HTTP), sehingga dapat diakses langsung di `http://103.23.198.101/` tanpa perlu menambahkan port.

## 🏗️ Struktur Deployment

```
http://103.23.198.101/              → Frontend Next.js (Root)
http://103.23.198.101/super-admin  → Backend Laravel (Subfolder)
```

## 📦 Langkah Deployment

### 1. Build Frontend untuk Production

```bash
cd campusway-frontend

# Install dependencies (jika belum)
npm install

# Build aplikasi (akan menghasilkan folder 'out')
npm run build
```

Setelah build, file akan ada di folder `out/` (karena `next.config.ts` menggunakan `output: "export"`).

### 2. Upload ke Server VPS

```bash
# Upload folder 'out' ke server
# Gunakan SCP, SFTP, atau rsync

# Contoh dengan SCP:
scp -r out/* marketing@103.23.198.101:/var/www/html/

# Atau jika menggunakan directory khusus:
scp -r out/* marketing@103.23.198.101:/var/www/arahpotensi/out/
```

### 3. Konfigurasi Apache di Server

SSH ke server:
```bash
ssh marketing@103.23.198.101
```

Buat/update konfigurasi Apache:
```bash
sudo nano /etc/apache2/sites-available/000-default.conf
```

Atau gunakan file konfigurasi yang sudah ada:
```bash
# Copy konfigurasi dari project
sudo cp /path/to/arahpotensi.conf /etc/apache2/sites-available/000-default.conf
```

**Konfigurasi Apache yang diperlukan:**

```apache
<VirtualHost *:80>
    ServerName 103.23.198.101
    
    # Frontend Next.js (Root) - PRIORITAS KEDUA
    DocumentRoot /var/www/html
    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle Next.js static files
        <FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$">
            Header always set Cache-Control "public, max-age=31536000"
        </FilesMatch>
        
        # Rewrite untuk client-side routing (SPA)
        RewriteEngine On
        RewriteCond %{REQUEST_URI} !^/super-admin
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ index.html [L]
    </Directory>
    
    # Backend Laravel (Subfolder) - PRIORITAS PERTAMA
    Alias /super-admin /var/www/superadmin/superadmin-campusway/public
    <Directory /var/www/superadmin/superadmin-campusway/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Laravel rewrite rules
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </Directory>
    
    # CORS headers untuk API
    <LocationMatch "^/super-admin/api">
        Header always set Access-Control-Allow-Origin "*"
        Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    </LocationMatch>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/tka_error.log
    CustomLog ${APACHE_LOG_DIR}/tka_access.log combined
</VirtualHost>
```

### 4. Set Permissions

```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/html

# Set permissions
sudo chmod -R 755 /var/www/html
```

### 5. Enable Modules dan Restart Apache

```bash
# Enable required modules
sudo a2enmod rewrite headers

# Test konfigurasi
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2

# Check status
sudo systemctl status apache2
```

## ✅ Verifikasi

Setelah deployment, test akses:

1. **Frontend**: http://103.23.198.101/
2. **Backend API**: http://103.23.198.101/super-admin/api/public/health
3. **Laravel Admin**: http://103.23.198.101/super-admin/login

## 🔍 Troubleshooting

### Jika halaman tidak muncul:

1. **Cek Apache status:**
   ```bash
   sudo systemctl status apache2
   ```

2. **Cek error log:**
   ```bash
   sudo tail -f /var/log/apache2/tka_error.log
   ```

3. **Cek file permissions:**
   ```bash
   ls -la /var/www/html/
   ```

4. **Cek konfigurasi Apache:**
   ```bash
   sudo apache2ctl -S
   ```

### Jika API calls gagal:

1. Pastikan backend Laravel berjalan
2. Cek CORS headers di Apache config
3. Verifikasi URL API di environment variables frontend

## 📝 Catatan Penting

- **Development**: Frontend tetap menggunakan port 3001 untuk development lokal
- **Production**: Frontend di-deploy ke Apache port 80 (tidak perlu port di URL)
- **Build Output**: Next.js akan menghasilkan static files di folder `out/`
- **Environment Variables**: Pastikan `NEXT_PUBLIC_*` variables sudah benar sebelum build

## 🔄 Update Deployment

Untuk update frontend:

```bash
# 1. Build ulang
cd campusway-frontend
npm run build

# 2. Upload ke server
scp -r out/* marketing@103.23.198.101:/var/www/html/

# 3. Set permissions (jika perlu)
ssh marketing@103.23.198.101
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

## 🎯 Summary

- ✅ Frontend di-build sebagai static export
- ✅ File di-upload ke `/var/www/html/`
- ✅ Apache dikonfigurasi untuk serve dari root (`/`)
- ✅ Backend tetap di `/super-admin`
- ✅ Akses: `http://103.23.198.101/` (tanpa port)

