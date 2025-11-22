#!/bin/bash

# Script untuk melihat status Apache dan konfigurasi yang aktif
# Jalankan: bash check-apache.sh

echo "🔍 APACHE STATUS & CONFIGURATION CHECK"
echo "======================================"
echo ""

# 1. Apache Status
echo "1. Apache Service Status:"
echo "------------------------"
if systemctl is-active --quiet apache2; then
    echo "✅ Apache is RUNNING"
    systemctl status apache2 --no-pager -l | head -5
else
    echo "❌ Apache is NOT RUNNING"
    echo "   Start with: sudo systemctl start apache2"
fi
echo ""

# 2. Virtual Hosts
echo "2. Active Virtual Hosts:"
echo "----------------------"
if command -v apache2ctl &> /dev/null; then
    apache2ctl -S 2>/dev/null || sudo apache2ctl -S
else
    echo "⚠️  apache2ctl not found"
fi
echo ""

# 3. Enabled Sites
echo "3. Enabled Sites:"
echo "----------------"
if [ -d "/etc/apache2/sites-enabled" ]; then
    echo "Enabled sites:"
    ls -la /etc/apache2/sites-enabled/ | grep -v "^total" | grep -v "^d" | awk '{print $9, $10, $11}'
    echo ""
    echo "Details:"
    for site in /etc/apache2/sites-enabled/*.conf; do
        if [ -f "$site" ]; then
            echo "  📄 $(basename $site)"
            echo "     ServerName: $(grep -i "ServerName" "$site" | head -1 | awk '{print $2}')"
            echo "     DocumentRoot: $(grep -i "DocumentRoot" "$site" | head -1 | awk '{print $2}')"
        fi
    done
else
    echo "⚠️  /etc/apache2/sites-enabled not found"
fi
echo ""

# 4. Available Sites
echo "4. Available Sites (not necessarily enabled):"
echo "---------------------------------------------"
if [ -d "/etc/apache2/sites-available" ]; then
    ls -la /etc/apache2/sites-available/ | grep "\.conf$" | awk '{print $9}'
else
    echo "⚠️  /etc/apache2/sites-available not found"
fi
echo ""

# 5. Configuration for 103.23.198.101
echo "5. Configuration for 103.23.198.101:"
echo "------------------------------------"
CONFIG_FILE="/etc/apache2/sites-available/103.23.198.101.conf"
if [ -f "$CONFIG_FILE" ]; then
    echo "✅ Config file exists: $CONFIG_FILE"
    echo ""
    echo "Key settings:"
    grep -E "ServerName|DocumentRoot|ServerAlias" "$CONFIG_FILE" | sed 's/^/   /'
    
    # Check if enabled
    if [ -f "/etc/apache2/sites-enabled/103.23.198.101.conf" ]; then
        echo ""
        echo "✅ Site is ENABLED"
    else
        echo ""
        echo "⚠️  Site is NOT ENABLED"
        echo "   Enable with: sudo a2ensite 103.23.198.101.conf"
    fi
else
    echo "❌ Config file NOT FOUND: $CONFIG_FILE"
    echo "   Create it or check other config files"
fi
echo ""

# 6. Enabled Modules
echo "6. Important Modules:"
echo "--------------------"
if command -v apache2ctl &> /dev/null; then
    MODULES=("rewrite" "headers" "ssl")
    for module in "${MODULES[@]}"; do
        if apache2ctl -M 2>/dev/null | grep -q "$module"; then
            echo "   ✅ $module module is enabled"
        else
            echo "   ❌ $module module is NOT enabled"
            echo "      Enable with: sudo a2enmod $module"
        fi
    done
else
    echo "⚠️  apache2ctl not available"
fi
echo ""

# 7. Port Listening
echo "7. Apache Ports:"
echo "---------------"
if command -v netstat &> /dev/null; then
    sudo netstat -tulpn 2>/dev/null | grep apache2 || netstat -tulpn 2>/dev/null | grep apache2
elif command -v ss &> /dev/null; then
    sudo ss -tulpn 2>/dev/null | grep apache2 || ss -tulpn 2>/dev/null | grep apache2
else
    echo "⚠️  netstat/ss not available"
fi
echo ""

# 8. Configuration Test
echo "8. Configuration Test:"
echo "---------------------"
if command -v apache2ctl &> /dev/null; then
    if apache2ctl configtest 2>/dev/null || sudo apache2ctl configtest 2>/dev/null; then
        echo "✅ Configuration is valid"
    else
        echo "❌ Configuration has errors"
        apache2ctl configtest 2>/dev/null || sudo apache2ctl configtest
    fi
else
    echo "⚠️  apache2ctl not available"
fi
echo ""

# 9. DocumentRoot Check
echo "9. DocumentRoot Check:"
echo "--------------------"
DOCUMENT_ROOT="/var/www/html"
if [ -d "$DOCUMENT_ROOT" ]; then
    echo "✅ Directory exists: $DOCUMENT_ROOT"
    echo "   Files: $(ls -1 $DOCUMENT_ROOT | wc -l) items"
    if [ -f "$DOCUMENT_ROOT/index.html" ]; then
        echo "   ✅ index.html exists"
        echo "   Size: $(du -h $DOCUMENT_ROOT/index.html | cut -f1)"
    else
        echo "   ❌ index.html NOT FOUND"
    fi
else
    echo "❌ Directory does NOT exist: $DOCUMENT_ROOT"
fi
echo ""

# 10. Summary
echo "=== SUMMARY ==="
echo ""
echo "Apache Status: $(systemctl is-active apache2 2>/dev/null || echo 'unknown')"
echo "Config File: $([ -f "$CONFIG_FILE" ] && echo 'EXISTS' || echo 'NOT FOUND')"
echo "Site Enabled: $([ -f "/etc/apache2/sites-enabled/103.23.198.101.conf" ] && echo 'YES' || echo 'NO')"
echo "DocumentRoot: $([ -d "$DOCUMENT_ROOT" ] && echo 'EXISTS' || echo 'NOT FOUND')"
echo "index.html: $([ -f "$DOCUMENT_ROOT/index.html" ] && echo 'EXISTS' || echo 'NOT FOUND')"
echo ""
echo "🌐 Test URL: http://103.23.198.101/"
echo ""









