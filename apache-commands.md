# Command Apache untuk Melihat Status dan Konfigurasi

## 1. Melihat Status Apache

```bash
# Status Apache (running/stopped)
sudo systemctl status apache2

# Atau versi singkat
systemctl is-active apache2
```

## 2. Melihat Virtual Host yang Aktif

```bash
# Melihat semua virtual host yang aktif dan konfigurasinya
sudo apache2ctl -S

# Atau
apache2ctl -S

# Output akan menampilkan:
# - IP address dan port
# - ServerName
# - DocumentRoot
# - File konfigurasi yang digunakan
```

## 3. Melihat Site yang Enabled

```bash
# Melihat semua site yang enabled
ls -la /etc/apache2/sites-enabled/

# Melihat detail site yang enabled
cat /etc/apache2/sites-enabled/*.conf

# Melihat site yang available (semua konfigurasi)
ls -la /etc/apache2/sites-available/
```

## 4. Melihat Konfigurasi yang Sedang Digunakan

```bash
# Melihat konfigurasi untuk IP tertentu
sudo apache2ctl -S | grep 103.23.198.101

# Melihat konfigurasi lengkap
sudo apache2ctl -S

# Melihat file konfigurasi spesifik
cat /etc/apache2/sites-available/103.23.198.101.conf

# Atau jika sudah enabled
cat /etc/apache2/sites-enabled/103.23.198.101.conf
```

## 5. Test Konfigurasi Apache

```bash
# Test syntax konfigurasi (tanpa restart)
sudo apache2ctl configtest

# Atau
apache2ctl configtest
```

## 6. Melihat Module yang Enabled

```bash
# Melihat semua module yang enabled
ls -la /etc/apache2/mods-enabled/

# Atau
apache2ctl -M

# Melihat module spesifik
apache2ctl -M | grep rewrite
apache2ctl -M | grep headers
```

## 7. Melihat Port yang Digunakan

```bash
# Melihat port yang digunakan Apache
sudo netstat -tulpn | grep apache2

# Atau
sudo ss -tulpn | grep apache2

# Atau
sudo lsof -i -P -n | grep apache2
```

## 8. Melihat Log Error

```bash
# Melihat log error terakhir
sudo tail -f /var/log/apache2/error.log

# Melihat log error untuk site tertentu
sudo tail -f /var/log/apache2/103.23.198.101_error.log

# Melihat 20 baris terakhir
sudo tail -20 /var/log/apache2/error.log
```

## 9. Command Lengkap untuk Debugging

```bash
# Script lengkap untuk melihat semua info
echo "=== APACHE STATUS ==="
systemctl status apache2 --no-pager

echo ""
echo "=== VIRTUAL HOSTS ==="
apache2ctl -S

echo ""
echo "=== ENABLED SITES ==="
ls -la /etc/apache2/sites-enabled/

echo ""
echo "=== ENABLED MODULES ==="
apache2ctl -M | head -20

echo ""
echo "=== PORT LISTENING ==="
sudo netstat -tulpn | grep apache2
```

## 10. Command untuk Site Spesifik (103.23.198.101)

```bash
# Check apakah site enabled
ls -la /etc/apache2/sites-enabled/ | grep 103.23.198.101

# Lihat konfigurasi site
cat /etc/apache2/sites-available/103.23.198.101.conf

# Check DocumentRoot
grep DocumentRoot /etc/apache2/sites-available/103.23.198.101.conf

# Check ServerName
grep ServerName /etc/apache2/sites-available/103.23.198.101.conf
```

## Quick Reference

| Tujuan | Command |
|--------|---------|
| Status Apache | `sudo systemctl status apache2` |
| Virtual Host Aktif | `sudo apache2ctl -S` |
| Site Enabled | `ls -la /etc/apache2/sites-enabled/` |
| Test Config | `sudo apache2ctl configtest` |
| Module Enabled | `apache2ctl -M` |
| Port Listening | `sudo netstat -tulpn \| grep apache2` |
| Log Error | `sudo tail -f /var/log/apache2/error.log` |

## Contoh Output

### `apache2ctl -S` Output:
```
VirtualHost configuration:
*:80                   103.23.198.101 (/etc/apache2/sites-enabled/103.23.198.101.conf:1)
ServerRoot: /etc/apache2
Main DocumentRoot: /var/www/html
```

### `systemctl status apache2` Output:
```
● apache2.service - The Apache HTTP Server
   Loaded: loaded (/lib/systemd/system/apache2.service; enabled)
   Active: active (running) since ...
```







