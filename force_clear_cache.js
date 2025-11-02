const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🧹 FORCE CLEARING CACHE AND RESTARTING...\n");

// 1. Clear Next.js cache
console.log("1. Clearing Next.js cache...");
try {
  execSync("rm -rf .next", { stdio: "inherit" });
  console.log("✅ Next.js cache cleared");
} catch (error) {
  console.log("⚠️ Could not clear .next directory (might not exist)");
}

// 2. Clear node_modules cache
console.log("\n2. Clearing node_modules cache...");
try {
  execSync("rm -rf node_modules/.cache", { stdio: "inherit" });
  console.log("✅ Node modules cache cleared");
} catch (error) {
  console.log("⚠️ Could not clear node_modules cache");
}

// 3. Clear npm cache
console.log("\n3. Clearing npm cache...");
try {
  execSync("npm cache clean --force", { stdio: "inherit" });
  console.log("✅ NPM cache cleared");
} catch (error) {
  console.log("⚠️ Could not clear npm cache");
}

// 4. Add timestamp to force reload
console.log("\n4. Adding timestamp to force reload...");
const filePath = path.join(
  __dirname,
  "src/components/student/StudentDashboardClient.tsx"
);
const content = fs.readFileSync(filePath, "utf8");
const timestamp = new Date().toISOString();
const updatedContent = content.replace(
  /FORCE UPDATE 2025-09-05/,
  `FORCE UPDATE 2025-09-05-${timestamp}`
);
fs.writeFileSync(filePath, updatedContent);
console.log("✅ Timestamp added to force reload");

console.log("\n🚀 Starting development server...");
try {
  execSync("npm run dev", { stdio: "inherit" });
} catch (error) {
  console.log("❌ Error starting development server:", error.message);
}

console.log("\n✅ FORCE CLEAR COMPLETED!");
console.log("📋 Next steps:");
console.log("1. Open browser in incognito/private mode");
console.log("2. Go to localhost:3000/student/dashboard");
console.log("3. Check if Rumpun Ilmu filters are showing");
console.log("4. If still showing old filters, clear browser cache completely");
