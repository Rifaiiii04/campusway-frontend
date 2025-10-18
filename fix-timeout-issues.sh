#!/bin/bash

echo "🔧 Fixing timeout issues for Campusway Frontend"
echo "=============================================="

# Change to frontend directory
cd /opt/lampp/htdocs/tka/campusway-frontend

echo "📁 Current directory: $(pwd)"

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache
echo "✅ Next.js cache cleared"

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force
echo "✅ npm cache cleared"

# Reinstall dependencies (optional, uncomment if needed)
# echo "📦 Reinstalling dependencies..."
# rm -rf node_modules
# npm install
# echo "✅ Dependencies reinstalled"

# Clear browser storage instructions
echo ""
echo "🌐 BROWSER CLEANUP REQUIRED:"
echo "============================"
echo "1. Open browser Developer Tools (F12)"
echo "2. Go to Application/Storage tab"
echo "3. Clear Local Storage and Session Storage"
echo "4. Or use incognito/private mode"
echo ""

# Start development server
echo "🚀 Starting development server..."
echo "   Server will start on http://localhost:3000"
echo "   Backend should be running on http://127.0.0.1:8000"
echo ""

# Check if backend is running
echo "🔍 Checking backend server..."
if curl -s http://127.0.0.1:8000/api/web/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not running"
    echo "   Please start it with: cd ../superadmin-campusway && php artisan serve --host=127.0.0.1 --port=8000"
    echo ""
fi

# Start frontend server
npm run dev
