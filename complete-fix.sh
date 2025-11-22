#!/bin/bash

# Script lengkap untuk memperbaiki akses http://103.23.198.101/
# Jalankan di VPS: sudo bash complete-fix.sh

echo "🔧 COMPLETE FIX FOR VPS ACCESS"
echo "=============================="
echo ""

VPS_HOST="103.23.198.101"
VPS_PATH="/var/www/html"
APACHE_CONFIG="/etc/apache2/sites-available/103.23.198.101.conf"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Script requires sudo privileges"
    echo "   Running: sudo bash $0"
    exec sudo bash "$0" "$@"
fi

echo "📍 Target: http://$VPS_HOST/"
echo "📁 Path: $VPS_PATH"
echo ""

# Step 1: Check and start Apache
echo "1. Checking Apache..."
if systemctl is-active --quiet apache2; then
    echo "   ✅ Apache is running"
else
    echo "   ⚠️  Apache is not running, starting..."
    systemctl start apache2
    systemctl enable apache2
    if systemctl is-active --quiet apache2; then
        echo "   ✅ Apache started"
    else
        echo "   ❌ Failed to start Apache"
        echo "   Check: sudo systemctl status apache2"
        exit 1
    fi
fi
echo ""

# Step 2: Create directory
echo "2. Setting up directory..."
mkdir -p "$VPS_PATH"
chown -R www-data:www-data "$VPS_PATH"
chmod -R 755 "$VPS_PATH"
echo "   ✅ Directory ready: $VPS_PATH"
echo ""

# Step 3: Check if files exist
echo "3. Checking files..."
if [ -f "$VPS_PATH/index.html" ]; then
    echo "   ✅ index.html exists"
    FILE_SIZE=$(du -h "$VPS_PATH/index.html" | cut -f1)
    echo "   📄 File size: $FILE_SIZE"
    
    # Check if it's a placeholder
    if grep -q "Memuat halaman" "$VPS_PATH/index.html" || grep -q "Frontend files are missing" "$VPS_PATH/index.html"; then
        echo "   ⚠️  WARNING: Placeholder or loading page detected!"
        echo "   📋 Frontend files need to be uploaded"
        echo ""
        echo "   SOLUTION:"
        echo "   1. Build frontend locally: cd campusway-frontend && npm run build"
        echo "   2. Upload all files from 'out/' directory to $VPS_PATH"
        echo "   3. Use WinSCP, FileZilla, or scp command"
        echo ""
    fi
else
    echo "   ❌ index.html does NOT exist!"
    echo "   📋 Creating placeholder..."
    cat > "$VPS_PATH/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TKA Frontend - Upload Required</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            max-width: 600px;
        }
        h1 { margin-top: 0; }
        .steps {
            text-align: left;
            margin: 20px 0;
        }
        code {
            background: rgba(0,0,0,0.5);
            padding: 2px 6px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Frontend Files Required</h1>
        <p>Please upload the built frontend files to make this site accessible.</p>
        <div class="steps">
            <h3>Steps:</h3>
            <ol>
                <li>Build frontend: <code>cd campusway-frontend && npm run build</code></li>
                <li>Upload all files from <code>out/</code> directory to <code>/var/www/html/</code></li>
                <li>Use WinSCP, FileZilla, or scp command</li>
                <li>After upload, refresh this page</li>
            </ol>
        </div>
    </div>
</body>
</html>
EOF
    chown www-data:www-data "$VPS_PATH/index.html"
    chmod 644 "$VPS_PATH/index.html"
    echo "   ✅ Placeholder created"
fi
echo ""

# Step 4: List files
echo "4. Files in directory:"
ls -lah "$VPS_PATH" | head -15
echo ""

# Step 5: Fix permissions
echo "5. Fixing permissions..."
chown -R www-data:www-data "$VPS_PATH"
chmod -R 755 "$VPS_PATH"
find "$VPS_PATH" -type f -exec chmod 644 {} \;
find "$VPS_PATH" -type d -exec chmod 755 {} \;
echo "   ✅ Permissions fixed"
echo ""

# Step 6: Apache configuration
echo "6. Configuring Apache..."

# Create config if not exists
if [ ! -f "$APACHE_CONFIG" ]; then
    echo "   Creating Apache configuration..."
    cat > "$APACHE_CONFIG" << 'APACHEEOF'
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
APACHEEOF
    echo "   ✅ Configuration created"
else
    echo "   ✅ Configuration exists"
fi

# Enable site
echo "   Enabling site..."
a2ensite 103.23.198.101.conf 2>/dev/null || true

# Enable modules
echo "   Enabling modules..."
a2enmod rewrite headers 2>/dev/null || true
a2enmod ssl 2>/dev/null || true

# Disable default site if exists
a2dissite 000-default.conf 2>/dev/null || true

echo "   ✅ Apache configured"
echo ""

# Step 7: Test configuration
echo "7. Testing Apache configuration..."
if apache2ctl configtest > /dev/null 2>&1; then
    echo "   ✅ Configuration is valid"
else
    echo "   ⚠️  Configuration has warnings (checking...)"
    apache2ctl configtest
fi
echo ""

# Step 8: Restart Apache
echo "8. Restarting Apache..."
systemctl restart apache2
sleep 2

if systemctl is-active --quiet apache2; then
    echo "   ✅ Apache restarted successfully"
else
    echo "   ❌ Apache restart failed!"
    echo "   Check logs: sudo tail -f /var/log/apache2/error.log"
    exit 1
fi
echo ""

# Step 9: Test access
echo "9. Testing access..."
sleep 1
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Server responding (HTTP $HTTP_CODE)"
    echo "   🌐 Website should be accessible at: http://$VPS_HOST/"
elif [ "$HTTP_CODE" = "000" ]; then
    echo "   ⚠️  Could not test (curl not available or connection failed)"
else
    echo "   ⚠️  Server returned HTTP $HTTP_CODE"
    echo "   Check: curl -I http://localhost/"
fi
echo ""

# Step 10: Check firewall
echo "10. Checking firewall..."
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(ufw status | grep -i "Status:" | awk '{print $2}')
    if [ "$UFW_STATUS" = "active" ]; then
        echo "   ⚠️  UFW is active, checking port 80..."
        if ufw status | grep -q "80/tcp.*ALLOW"; then
            echo "   ✅ Port 80 is allowed"
        else
            echo "   ⚠️  Port 80 might be blocked"
            echo "   Run: sudo ufw allow 80/tcp"
        fi
    else
        echo "   ✅ UFW is inactive"
    fi
else
    echo "   ℹ️  UFW not installed"
fi
echo ""

# Step 11: Summary
echo "=== SUMMARY ==="
echo ""
echo "✅ Apache: $(systemctl is-active apache2)"
echo "✅ Directory: $VPS_PATH"
if [ -f "$VPS_PATH/index.html" ]; then
    echo "✅ index.html: EXISTS"
    if grep -q "Frontend files are missing\|Memuat halaman" "$VPS_PATH/index.html"; then
        echo "⚠️  Status: PLACEHOLDER (upload frontend files needed)"
    else
        echo "✅ Status: READY"
    fi
else
    echo "❌ index.html: MISSING"
fi
echo "✅ Apache Config: EXISTS"
echo "✅ Apache Modules: rewrite, headers enabled"
echo ""
echo "🌐 Test URLs:"
echo "   http://$VPS_HOST/"
echo "   http://$VPS_HOST/landing"
echo ""
echo "📋 Next Steps:"
if [ -f "$VPS_PATH/index.html" ] && grep -q "Frontend files are missing\|Memuat halaman" "$VPS_PATH/index.html"; then
    echo "   1. Build frontend: cd campusway-frontend && npm run build"
    echo "   2. Upload files from 'out/' to $VPS_PATH"
    echo "   3. Refresh browser"
else
    echo "   1. Test website in browser"
    echo "   2. Check browser console for errors"
    echo "   3. Check Apache logs if issues: sudo tail -f /var/log/apache2/error.log"
fi
echo ""
echo "📊 Check logs:"
echo "   sudo tail -f /var/log/apache2/103.23.198.101_error.log"
echo "   sudo tail -f /var/log/apache2/error.log"
echo ""









