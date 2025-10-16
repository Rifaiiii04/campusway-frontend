#!/bin/bash

# Setup script untuk menghubungkan frontend dengan backend
echo "🔧 Setting up Frontend-Backend Connection..."

# 1. Install dependencies jika belum ada
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# 2. Create environment configuration
echo "📝 Creating environment configuration..."
cat > .env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://103.23.198.101/super-admin/api/school
NEXT_PUBLIC_STUDENT_API_BASE_URL=http://103.23.198.101/super-admin/api/web
NEXT_PUBLIC_SUPERADMIN_API_URL=http://103.23.198.101/super-admin/api
NEXT_PUBLIC_BACKEND_URL=http://103.23.198.101/super-admin

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# CORS Configuration
NEXT_PUBLIC_CORS_ORIGIN=http://localhost:3000
EOF

# 3. Test backend connection
echo "🧪 Testing backend connection..."
node test-connection.js

# 4. Build application
echo "🏗️ Building application..."
npm run build

# 5. Start development server
echo "🚀 Starting development server..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API: http://103.23.198.101/super-admin"

# Start Next.js development server
npm run dev

