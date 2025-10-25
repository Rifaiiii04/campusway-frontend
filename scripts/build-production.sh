#!/bin/bash

# Production Build Script for TKA Frontend Siswa
echo "🚀 Starting production build process..."

# Set production environment
export NODE_ENV=production

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next/
rm -rf out/
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run linting
echo "🔍 Running ESLint..."
npm run lint -- --fix

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Optimize static files
    echo "⚡ Optimizing static files..."
    
    # Compress images (if any)
    if command -v imagemin &> /dev/null; then
        echo "🖼️  Compressing images..."
        find out/ -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs imagemin --out-dir=out/
    fi
    
    # Generate sitemap (if needed)
    echo "🗺️  Generating sitemap..."
    # Add sitemap generation logic here if needed
    
    # Create production manifest
    echo "📋 Creating production manifest..."
    cat > out/manifest.json << EOF
{
  "name": "TKA Frontend Siswa",
  "version": "1.0.0",
  "buildDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "production",
  "apiBaseUrl": "http://103.23.198.101/super-admin"
}
EOF
    
    echo "🎉 Production build completed successfully!"
    echo "📁 Output directory: ./out/"
    echo "🌐 Ready for deployment!"
    
else
    echo "❌ Build failed!"
    exit 1
fi
