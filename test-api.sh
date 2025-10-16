#!/bin/bash

# Test API Connection Script
echo "🔍 Testing Campusway API Connection..."
echo "=================================="

# Test Health Check
echo "1. Testing Health Check..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://127.0.0.1:8000/api/web/health

# Test Schools Endpoint
echo "2. Testing Schools Endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://127.0.0.1:8000/api/web/schools

# Test Majors Endpoint
echo "3. Testing Majors Endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://127.0.0.1:8000/api/web/majors

# Test School Login Endpoint
echo "4. Testing School Login Endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" -X POST \
  -H "Content-Type: application/json" \
  -d '{"npsn":"test","password":"test"}' \
  http://127.0.0.1:8000/api/school/login

# Test Student Login Endpoint
echo "5. Testing Student Login Endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" -X POST \
  -H "Content-Type: application/json" \
  -d '{"nisn":"test","password":"test"}' \
  http://127.0.0.1:8000/api/web/login

echo "=================================="
echo "✅ API Connection Test Complete!"
