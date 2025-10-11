// Performance testing script for TKA Frontend
// Run this in browser console to test performance optimizations

console.log("🚀 TKA Performance Test Starting...");

// Test 1: Cache Performance
function testCachePerformance() {
  console.log("📊 Testing Cache Performance...");

  const startTime = performance.now();

  // Simulate cache operations
  for (let i = 0; i < 1000; i++) {
    const key = `test_key_${i}`;
    const data = { id: i, name: `Item ${i}`, timestamp: Date.now() };

    // Simulate cache set
    localStorage.setItem(key, JSON.stringify(data));

    // Simulate cache get
    const retrieved = JSON.parse(localStorage.getItem(key));
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(
    `✅ Cache Performance: ${duration.toFixed(2)}ms for 1000 operations`
  );
  console.log(`📈 Average: ${(duration / 1000).toFixed(4)}ms per operation`);

  // Cleanup
  for (let i = 0; i < 1000; i++) {
    localStorage.removeItem(`test_key_${i}`);
  }
}

// Test 2: API Performance Simulation
function testAPIPerformance() {
  console.log("🌐 Testing API Performance...");

  const apiCalls = [
    "majors",
    "major-details",
    "student-choice",
    "major-status",
    "dashboard",
  ];

  const results = [];

  apiCalls.forEach(async (endpoint) => {
    const startTime = performance.now();

    try {
      // Simulate API call
      const response = await fetch(
        `http://127.0.0.1:8000/api/optimized/${endpoint}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      results.push({
        endpoint,
        duration: duration.toFixed(2),
        status: response.ok ? "success" : "error",
        statusCode: response.status,
      });
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      results.push({
        endpoint,
        duration: duration.toFixed(2),
        status: "error",
        error: error.message,
      });
    }
  });

  setTimeout(() => {
    console.log("📊 API Performance Results:");
    results.forEach((result) => {
      console.log(
        `  ${result.endpoint}: ${result.duration}ms (${result.status})`
      );
    });
  }, 2000);
}

// Test 3: Component Render Performance
function testComponentPerformance() {
  console.log("⚛️ Testing Component Performance...");

  const startTime = performance.now();

  // Simulate component rendering
  const elements = [];
  for (let i = 0; i < 100; i++) {
    const element = document.createElement("div");
    element.innerHTML = `
      <div class="major-card">
        <h3>Major ${i}</h3>
        <p>Description for major ${i}</p>
        <button>Select</button>
      </div>
    `;
    elements.push(element);
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(
    `✅ Component Performance: ${duration.toFixed(2)}ms for 100 components`
  );
  console.log(`📈 Average: ${(duration / 100).toFixed(4)}ms per component`);

  // Cleanup
  elements.forEach((el) => el.remove());
}

// Test 4: Memory Usage
function testMemoryUsage() {
  console.log("💾 Testing Memory Usage...");

  if (performance.memory) {
    const memory = performance.memory;
    console.log("📊 Memory Usage:");
    console.log(
      `  Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `  Total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `  Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    );
  } else {
    console.log("⚠️ Memory API not available in this browser");
  }
}

// Test 5: Network Performance
function testNetworkPerformance() {
  console.log("🌐 Testing Network Performance...");

  const startTime = performance.now();

  // Test connection speed
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (connection) {
    console.log("📊 Network Information:");
    console.log(`  Type: ${connection.effectiveType || "unknown"}`);
    console.log(`  Downlink: ${connection.downlink || "unknown"} Mbps`);
    console.log(`  RTT: ${connection.rtt || "unknown"} ms`);
  } else {
    console.log("⚠️ Network API not available in this browser");
  }

  const endTime = performance.now();
  console.log(`✅ Network Test: ${(endTime - startTime).toFixed(2)}ms`);
}

// Run all tests
function runAllTests() {
  console.log("🎯 Running All Performance Tests...\n");

  testCachePerformance();
  setTimeout(() => testAPIPerformance(), 100);
  setTimeout(() => testComponentPerformance(), 200);
  setTimeout(() => testMemoryUsage(), 300);
  setTimeout(() => testNetworkPerformance(), 400);

  setTimeout(() => {
    console.log("\n🎉 All Performance Tests Completed!");
    console.log("📊 Check the results above for performance insights.");
  }, 5000);
}

// Export functions for manual testing
window.TKAPerformanceTest = {
  runAllTests,
  testCachePerformance,
  testAPIPerformance,
  testComponentPerformance,
  testMemoryUsage,
  testNetworkPerformance,
};

// Auto-run tests
runAllTests();
