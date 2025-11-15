#!/bin/bash

# Script untuk deploy frontend ke production server
# Jalankan di VPS: bash deploy-production.sh

echo "🚀 Deploying Frontend to Production Server"
echo "==========================================="
echo ""

VPS_PATH="/var/www/html"
BACKUP_PATH="/var/www/html.backup.$(date +%Y%m%d_%H%M%S)"

# Step 1: Backup existing files
if [ -d "$VPS_PATH" ] && [ "$(ls -A $VPS_PATH)" ]; then
    echo "📦 Creating backup..."
    sudo mkdir -p "$BACKUP_PATH"
    sudo cp -r "$VPS_PATH"/* "$BACKUP_PATH/" 2>/dev/null || true
    echo "✅ Backup created at: $BACKUP_PATH"
    echo ""
fi

# Step 2: Create directory if not exists
echo "📁 Creating directory..."
sudo mkdir -p "$VPS_PATH"
sudo chown -R www-data:www-data "$VPS_PATH"
sudo chmod -R 755 "$VPS_PATH"
echo "✅ Directory ready"
echo ""

# Step 3: Check if files exist in current directory
if [ ! -d "out" ]; then
    echo "❌ Error: 'out' directory not found!"
    echo "   Please build the application first:"
    echo "   npm run build"
    exit 1
fi

# Step 4: Copy files
echo "📤 Copying files..."
sudo cp -r out/* "$VPS_PATH/"
echo "✅ Files copied"
echo ""

# Step 5: Set permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data "$VPS_PATH"
sudo chmod -R 755 "$VPS_PATH"
echo "✅ Permissions set"
echo ""

# Step 6: Configure Apache
echo "⚙️  Configuring Apache..."

# Create Apache config if not exists
APACHE_CONFIG="/etc/apache2/sites-available/103.23.198.101.conf"

if [ ! -f "$APACHE_CONFIG" ]; then
    echo "   Creating Apache configuration..."
    sudo tee "$APACHE_CONFIG" > /dev/null << 'EOF'
<VirtualHost *:80>
    ServerName 103.23.198.101
    DocumentRoot /var/www/html
    
    # Enable mod_rewrite
    RewriteEngine On
    
    # Handle client-side routing for Next.js
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [QSA,L]
    
    # Security headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "origin-when-cross-origin"
    
    # CORS headers
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    
    # Cache control for static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>
    
    # Cache control for HTML files
    <LocationMatch "\.html$">
        Header set Cache-Control "public, max-age=3600"
    </LocationMatch>
    
    # Handle Next.js static files
    <LocationMatch "^/_next/static/">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>
    
    # Error and access logs
    ErrorLog ${APACHE_LOG_DIR}/103.23.198.101_error.log
    CustomLog ${APACHE_LOG_DIR}/103.23.198.101_access.log combined
    
    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
EOF
    echo "✅ Apache configuration created"
else
    echo "✅ Apache configuration already exists"
fi

# Enable site
echo "   Enabling site..."
sudo a2ensite 103.23.198.101.conf 2>/dev/null || true

# Enable required modules
echo "   Enabling modules..."
sudo a2enmod rewrite headers 2>/dev/null || true

# Test Apache configuration
echo "   Testing Apache configuration..."
sudo apache2ctl configtest

# Restart Apache
echo "   Restarting Apache..."
sudo systemctl restart apache2

if [ $? -eq 0 ]; then
    echo "✅ Apache restarted successfully"
else
    echo "⚠️  Apache restart failed, check logs:"
    echo "   sudo tail -f /var/log/apache2/error.log"
fi

echo ""

# Step 7: Verification
echo "🔍 Verification:"
echo ""
echo "   Testing server response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Server responding (HTTP $HTTP_CODE)"
else
    echo "   ⚠️  Server returned HTTP $HTTP_CODE"
    echo "   Check Apache logs for details"
fi

echo ""
echo "=== DEPLOYMENT COMPLETED ==="
echo ""
echo "🌐 Frontend should be available at:"
echo "   http://103.23.198.101/"
echo "   http://103.23.198.101/landing"
echo ""
echo "📋 Next steps:"
echo "   1. Test the website in browser"
echo "   2. Check browser console for errors"
echo "   3. Verify API calls are working"
echo "   4. Check Apache logs if issues persist:"
echo "      sudo tail -f /var/log/apache2/103.23.198.101_error.log"
echo ""





