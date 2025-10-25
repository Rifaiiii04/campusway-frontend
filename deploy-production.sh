#!/bin/bash

# Production Deployment Script for ArahPotensi
# Server: 103.23.198.101

echo "🚀 Starting Production Deployment for ArahPotensi..."

# Set production environment
export NODE_ENV=production

# Build the application
echo "📦 Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Create deployment directory structure
echo "📁 Creating deployment structure..."
mkdir -p /var/www/arahpotensi
mkdir -p /var/www/arahpotensi/out

# Copy built files to production directory
echo "📋 Copying files to production directory..."
cp -r out/* /var/www/arahpotensi/out/

# Create Apache virtual host configuration
echo "⚙️ Creating Apache virtual host configuration..."
cat > /etc/apache2/sites-available/arahpotensi.conf << 'EOF'
<VirtualHost *:80>
    ServerName 103.23.198.101
    DocumentRoot /var/www/arahpotensi/out
    
    # Enable mod_rewrite
    RewriteEngine On
    
    # Handle client-side routing
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
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>
    
    # Cache control for HTML files
    <LocationMatch "\.html$">
        Header set Cache-Control "public, max-age=3600"
    </LocationMatch>
    
    # Error and access logs
    ErrorLog ${APACHE_LOG_DIR}/arahpotensi_error.log
    CustomLog ${APACHE_LOG_DIR}/arahpotensi_access.log combined
</VirtualHost>
EOF

# Enable the site
echo "🔧 Enabling Apache site..."
a2ensite arahpotensi.conf

# Reload Apache
echo "🔄 Reloading Apache..."
systemctl reload apache2

echo "✅ Production deployment completed!"
echo "🌐 ArahPotensi is now available at: http://103.23.198.101"
echo "📱 Landing page will be accessible at: http://103.23.198.101/landing"
