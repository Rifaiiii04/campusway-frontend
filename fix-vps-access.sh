#!/bin/bash

# Script untuk memperbaiki akses VPS 103.23.198.101
# Jalankan di VPS: bash fix-vps-access.sh

echo "🔧 FIXING VPS ACCESS"
echo "===================="
echo ""

VPS_HOST="103.23.198.101"
VPS_PATH="/var/www/html"
APACHE_CONFIG="/etc/apache2/sites-available/103.23.198.101.conf"

# Step 1: Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Script requires sudo privileges"
    echo "   Running: sudo bash $0"
    exec sudo bash "$0" "$@"
fi

# Step 2: Check Apache status
echo "1. Checking Apache status..."
if systemctl is-active --quiet apache2; then
    echo "   ✅ Apache is running"
else
    echo "   ❌ Apache is not running"
    echo "   Starting Apache..."
    systemctl start apache2
    if [ $? -eq 0 ]; then
        echo "   ✅ Apache started"
    else
        echo "   ❌ Failed to start Apache"
        exit 1
    fi
fi
echo ""

# Step 3: Check if directory exists
echo "2. Checking directory..."
if [ -d "$VPS_PATH" ]; then
    echo "   ✅ Directory exists: $VPS_PATH"
    echo "   Files in directory:"
    ls -la "$VPS_PATH" | head -10
else
    echo "   ❌ Directory does not exist: $VPS_PATH"
    echo "   Creating directory..."
    mkdir -p "$VPS_PATH"
    chown -R www-data:www-data "$VPS_PATH"
    chmod -R 755 "$VPS_PATH"
    echo "   ✅ Directory created"
fi
echo ""

# Step 4: Check if index.html exists
echo "3. Checking index.html..."
if [ -f "$VPS_PATH/index.html" ]; then
    echo "   ✅ index.html exists"
    echo "   File size: $(du -h $VPS_PATH/index.html | cut -f1)"
    echo "   First 5 lines:"
    head -5 "$VPS_PATH/index.html"
else
    echo "   ❌ index.html does NOT exist!"
    echo "   ⚠️  Frontend files are missing!"
    echo ""
    echo "   SOLUTION:"
    echo "   1. Build frontend locally: npm run build"
    echo "   2. Upload files from 'out/' directory to $VPS_PATH"
    echo "   3. Or copy from backup if available"
    echo ""
    read -p "   Do you want to create a placeholder index.html? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat > "$VPS_PATH/index.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>TKA Frontend</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <h1>Frontend files are missing!</h1>
    <p>Please upload the built files from 'out/' directory.</p>
    <p>Run: npm run build (locally) then upload to /var/www/html/</p>
</body>
</html>
EOF
        chown www-data:www-data "$VPS_PATH/index.html"
        chmod 644 "$VPS_PATH/index.html"
        echo "   ✅ Placeholder created"
    fi
fi
echo ""

# Step 5: Fix permissions
echo "4. Fixing permissions..."
chown -R www-data:www-data "$VPS_PATH"
chmod -R 755 "$VPS_PATH"
echo "   ✅ Permissions fixed"
echo ""

# Step 6: Check Apache configuration
echo "5. Checking Apache configuration..."
if [ -f "$APACHE_CONFIG" ]; then
    echo "   ✅ Configuration file exists"
    echo "   Checking DocumentRoot..."
    DOCUMENT_ROOT=$(grep -i "DocumentRoot" "$APACHE_CONFIG" | head -1 | awk '{print $2}')
    if [ "$DOCUMENT_ROOT" = "$VPS_PATH" ]; then
        echo "   ✅ DocumentRoot is correct: $DOCUMENT_ROOT"
    else
        echo "   ⚠️  DocumentRoot mismatch: $DOCUMENT_ROOT (expected: $VPS_PATH)"
    fi
else
    echo "   ❌ Configuration file does NOT exist!"
    echo "   Creating configuration..."
    
    cat > "$APACHE_CONFIG" << 'EOF'
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
    echo "   ✅ Configuration created"
fi
echo ""

# Step 7: Enable site and modules
echo "6. Enabling Apache site and modules..."
a2ensite 103.23.198.101.conf 2>/dev/null || true
a2enmod rewrite headers 2>/dev/null || true
echo "   ✅ Modules enabled"
echo ""

# Step 8: Test Apache configuration
echo "7. Testing Apache configuration..."
if apache2ctl configtest > /dev/null 2>&1; then
    echo "   ✅ Configuration is valid"
else
    echo "   ❌ Configuration has errors!"
    apache2ctl configtest
    echo ""
    echo "   Please fix the errors above"
    exit 1
fi
echo ""

# Step 9: Restart Apache
echo "8. Restarting Apache..."
systemctl restart apache2
if [ $? -eq 0 ]; then
    echo "   ✅ Apache restarted"
else
    echo "   ❌ Failed to restart Apache"
    exit 1
fi
echo ""

# Step 10: Test local access
echo "9. Testing local access..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Server responding (HTTP $HTTP_CODE)"
else
    echo "   ⚠️  Server returned HTTP $HTTP_CODE"
    echo "   Check logs: tail -f /var/log/apache2/error.log"
fi
echo ""

# Step 11: Show summary
echo "=== SUMMARY ==="
echo ""
echo "✅ Apache is running"
echo "✅ Directory exists: $VPS_PATH"
if [ -f "$VPS_PATH/index.html" ]; then
    echo "✅ index.html exists"
else
    echo "❌ index.html MISSING - Upload frontend files!"
fi
echo "✅ Apache configuration exists"
echo "✅ Apache restarted"
echo ""
echo "🌐 Test the website:"
echo "   http://$VPS_HOST/"
echo ""
echo "📋 If still not working:"
echo "   1. Check if frontend files are uploaded: ls -la $VPS_PATH"
echo "   2. Check Apache logs: tail -f /var/log/apache2/error.log"
echo "   3. Check Apache access logs: tail -f /var/log/apache2/103.23.198.101_access.log"
echo "   4. Test from server: curl http://localhost/"
echo ""







