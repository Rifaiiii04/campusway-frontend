#!/usr/bin/env node

/**
 * Debug script untuk mengatasi masalah login timeout
 * Menjalankan berbagai test untuk mendiagnosis masalah koneksi
 */

const https = require('https');
const http = require('http');

const API_BASE_URL = 'http://127.0.0.1:8000';
const ENDPOINTS = {
  health: '/api/web/health',
  schoolLogin: '/api/school/login',
  studentLogin: '/api/web/login'
};

// Helper function untuk test HTTP request
function testEndpoint(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: responseData,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });

    req.on('error', (error) => {
      reject({
        error: error.message,
        code: error.code,
        success: false
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject({
        error: 'Request timeout after 10 seconds',
        success: false
      });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testServerHealth() {
  console.log('🔍 Testing server health...');
  try {
    const result = await testEndpoint(`${API_BASE_URL}${ENDPOINTS.health}`);
    console.log(`✅ Health check: ${result.status} - ${result.success ? 'OK' : 'FAILED'}`);
    if (result.data) {
      try {
        const healthData = JSON.parse(result.data);
        console.log('📊 Health data:', healthData);
      } catch (e) {
        console.log('📄 Raw response:', result.data);
      }
    }
    return result.success;
  } catch (error) {
    console.log(`❌ Health check failed:`, error);
    return false;
  }
}

async function testSchoolLogin() {
  console.log('\n🔍 Testing school login endpoint...');
  try {
    const result = await testEndpoint(
      `${API_BASE_URL}${ENDPOINTS.schoolLogin}`,
      'POST',
      { npsn: '12345678', password: 'password' }
    );
    console.log(`✅ School login test: ${result.status} - ${result.success ? 'OK' : 'FAILED'}`);
    if (result.data) {
      try {
        const loginData = JSON.parse(result.data);
        console.log('📊 Login response:', loginData);
      } catch (e) {
        console.log('📄 Raw response:', result.data);
      }
    }
    return result.success;
  } catch (error) {
    console.log(`❌ School login test failed:`, error);
    return false;
  }
}

async function testStudentLogin() {
  console.log('\n🔍 Testing student login endpoint...');
  try {
    const result = await testEndpoint(
      `${API_BASE_URL}${ENDPOINTS.studentLogin}`,
      'POST',
      { nisn: '1234567890', password: 'password' }
    );
    console.log(`✅ Student login test: ${result.status} - ${result.success ? 'OK' : 'FAILED'}`);
    if (result.data) {
      try {
        const loginData = JSON.parse(result.data);
        console.log('📊 Login response:', loginData);
      } catch (e) {
        console.log('📄 Raw response:', result.data);
      }
    }
    return result.success;
  } catch (error) {
    console.log(`❌ Student login test failed:`, error);
    return false;
  }
}

async function testNetworkConnectivity() {
  console.log('\n🔍 Testing network connectivity...');
  
  // Test DNS resolution
  const dns = require('dns');
  const { promisify } = require('util');
  const dnsLookup = promisify(dns.lookup);
  
  try {
    const result = await dnsLookup('127.0.0.1');
    console.log(`✅ DNS resolution: ${result.address}`);
  } catch (error) {
    console.log(`❌ DNS resolution failed:`, error.message);
  }
  
  // Test port connectivity
  const net = require('net');
  const testPort = (host, port) => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const timeout = 5000;
      
      socket.setTimeout(timeout);
      socket.connect(port, host, () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('error', () => {
        resolve(false);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
    });
  };
  
  const portOpen = await testPort('127.0.0.1', 8000);
  console.log(`✅ Port 8000 connectivity: ${portOpen ? 'OPEN' : 'CLOSED'}`);
  
  return portOpen;
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('🚀 Starting login timeout diagnostics...\n');
  
  const results = {
    serverHealth: false,
    schoolLogin: false,
    studentLogin: false,
    networkConnectivity: false
  };
  
  // Run all tests
  results.networkConnectivity = await testNetworkConnectivity();
  results.serverHealth = await testServerHealth();
  results.schoolLogin = await testSchoolLogin();
  results.studentLogin = await testStudentLogin();
  
  // Summary
  console.log('\n📋 DIAGNOSTIC SUMMARY:');
  console.log('========================');
  console.log(`Network Connectivity: ${results.networkConnectivity ? '✅' : '❌'}`);
  console.log(`Server Health: ${results.serverHealth ? '✅' : '❌'}`);
  console.log(`School Login: ${results.schoolLogin ? '✅' : '❌'}`);
  console.log(`Student Login: ${results.studentLogin ? '✅' : '❌'}`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('===================');
  
  if (!results.networkConnectivity) {
    console.log('❌ Network issue detected:');
    console.log('   - Check if server is running on port 8000');
    console.log('   - Run: cd superadmin-campusway && php artisan serve --host=127.0.0.1 --port=8000');
  }
  
  if (!results.serverHealth) {
    console.log('❌ Server health issue:');
    console.log('   - Check Laravel application logs');
    console.log('   - Verify database connection');
    console.log('   - Check .env configuration');
  }
  
  if (!results.schoolLogin || !results.studentLogin) {
    console.log('❌ Login endpoint issues:');
    console.log('   - Check if routes are properly defined');
    console.log('   - Verify CORS configuration');
    console.log('   - Check authentication middleware');
  }
  
  if (results.networkConnectivity && results.serverHealth) {
    console.log('✅ Server is running properly');
    console.log('   - Timeout issues might be frontend-related');
    console.log('   - Check browser console for errors');
    console.log('   - Verify API configuration in frontend');
    console.log('   - Try clearing browser cache');
  }
  
  console.log('\n🔧 QUICK FIXES:');
  console.log('================');
  console.log('1. Restart server: cd superadmin-campusway && php artisan serve --host=127.0.0.1 --port=8000');
  console.log('2. Clear browser cache and reload page');
  console.log('3. Check browser console for detailed error messages');
  console.log('4. Verify API_BASE_URL in frontend configuration');
  console.log('5. Test with different browser or incognito mode');
}

// Run diagnostics
runDiagnostics().catch(console.error);
