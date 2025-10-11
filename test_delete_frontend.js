// Test script untuk frontend delete functionality
console.log("🧪 Testing frontend delete functionality...");

// Simulate the delete process
async function testDeleteStudent() {
  const studentId = 1; // Test student ID
  const API_BASE_URL = "http://127.0.0.1:8000/api/school";

  // Get token from localStorage (simulate)
  const token = localStorage.getItem("school_token");
  console.log("🔑 Token from localStorage:", token ? "EXISTS" : "NOT FOUND");

  if (!token) {
    console.log("❌ No token found in localStorage");
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log(
    "🌐 Making DELETE request to:",
    `${API_BASE_URL}/students/${studentId}`
  );
  console.log("📋 Headers:", headers);

  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "DELETE",
      headers: headers,
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response ok:", response.ok);

    const data = await response.json();
    console.log("📄 Response data:", data);

    if (response.ok && data.success) {
      console.log("✅ Delete successful!");
    } else {
      console.log("❌ Delete failed:", data.message);
    }
  } catch (error) {
    console.error("❌ Error during delete:", error);
  }
}

// Run the test
testDeleteStudent();
