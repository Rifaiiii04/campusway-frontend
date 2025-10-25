# 🚀 ArahPotensi Production Deployment Guide

## 📋 Overview
This guide will help you deploy ArahPotensi to production server `103.23.198.101` and configure it to show the landing page.

## 🌐 Production URLs
- **Main Site**: http://103.23.198.101
- **Landing Page**: http://103.23.198.101/landing
- **API Backend**: http://103.23.198.101/super-admin/api

## 🔧 Prerequisites
- Apache2 web server
- Node.js 18+ and npm
- Git access to repository

## 📦 Deployment Steps

### 1. Build the Application
```bash
# Set production environment
export NODE_ENV=production

# Install dependencies
npm install

# Build the application
npm run build
```

### 2. Deploy to Server
```bash
# Run deployment script
sudo ./deploy-production.sh
```

### 3. Manual Deployment (Alternative)
```bash
# Create production directory
sudo mkdir -p /var/www/arahpotensi
sudo mkdir -p /var/www/arahpotensi/out

# Copy built files
sudo cp -r out/* /var/www/arahpotensi/out/

# Set permissions
sudo chown -R www-data:www-data /var/www/arahpotensi
sudo chmod -R 755 /var/www/arahpotensi
```

### 4. Configure Apache
```bash
# Copy virtual host configuration
sudo cp arahpotensi.conf /etc/apache2/sites-available/

# Enable the site
sudo a2ensite arahpotensi.conf

# Enable required modules
sudo a2enmod rewrite headers

# Reload Apache
sudo systemctl reload apache2
```

## ⚙️ Configuration Files

### Environment Configuration
- **Development**: `env.config.js` (localhost:3000)
- **Production**: `env.config.js` (103.23.198.101)

### Next.js Configuration
- **next.config.ts**: Updated with production URLs
- **Output**: Static export for Apache hosting

## 🔍 Verification

### Check if deployment is working:
1. Visit http://103.23.198.101
2. Should redirect to landing page automatically
3. Check browser console for any errors
4. Verify API calls are going to correct backend

### Check Apache logs:
```bash
# Error logs
sudo tail -f /var/log/apache2/arahpotensi_error.log

# Access logs
sudo tail -f /var/log/apache2/arahpotensi_access.log
```

## 🛠️ Troubleshooting

### Common Issues:
1. **404 on refresh**: Check Apache rewrite rules
2. **API calls failing**: Verify backend is running on port 80
3. **Static assets not loading**: Check file permissions
4. **CORS errors**: Verify CORS headers in Apache config

### Debug Commands:
```bash
# Check Apache status
sudo systemctl status apache2

# Check site configuration
sudo apache2ctl -S

# Test configuration
sudo apache2ctl configtest
```

## 📱 Features Available
- ✅ Landing page with hero section
- ✅ Features showcase
- ✅ About section
- ✅ Call-to-action section
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Fast loading with static export

## 🔄 Updates
To update the production site:
1. Pull latest changes: `git pull origin main`
2. Rebuild: `npm run build`
3. Redeploy: `sudo ./deploy-production.sh`

## 📞 Support
For issues or questions, check the logs and verify all configuration files are correct.
