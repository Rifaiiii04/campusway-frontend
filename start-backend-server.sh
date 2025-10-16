#!/bin/bash

# Script untuk menjalankan Laravel backend server
# Jalankan dengan: bash start-backend-server.sh

echo "🚀 Starting Laravel Backend Server..."
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found!"
    echo "   Please run this script from the Laravel backend directory"
    echo "   (where artisan file is located)"
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ Error: PHP is not installed or not in PATH"
    echo "   Please install PHP first"
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Error: Composer is not installed or not in PATH"
    echo "   Please install Composer first"
    exit 1
fi

echo "✅ PHP and Composer are available"
echo ""

# Install dependencies if needed
if [ ! -d "vendor" ]; then
    echo "📦 Installing dependencies..."
    composer install
    echo ""
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   Creating .env from .env.example..."
    cp .env.example .env
    echo "   Please configure your database settings in .env file"
    echo ""
fi

# Generate application key if needed
echo "🔑 Generating application key..."
php artisan key:generate
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force
echo ""

# Clear caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
echo ""

# Start the server
echo "🌐 Starting Laravel server on localhost:8000..."
echo "   Server will be available at: http://localhost:8000"
echo "   API endpoints will be available at: http://localhost:8000/super-admin/api"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

php artisan serve --host=0.0.0.0 --port=8000
