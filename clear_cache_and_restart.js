// Script to clear cache and restart development server
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

console.log("🧹 Clearing cache and restarting development server...\n");

// Clear Next.js cache
const nextCachePath = path.join(__dirname, ".next");
if (fs.existsSync(nextCachePath)) {
  console.log("🗑️ Removing .next directory...");
  fs.rmSync(nextCachePath, { recursive: true, force: true });
  console.log("✅ .next directory removed");
} else {
  console.log("ℹ️ .next directory not found");
}

// Clear node_modules/.cache if exists
const nodeModulesCachePath = path.join(__dirname, "node_modules/.cache");
if (fs.existsSync(nodeModulesCachePath)) {
  console.log("🗑️ Removing node_modules/.cache directory...");
  fs.rmSync(nodeModulesCachePath, { recursive: true, force: true });
  console.log("✅ node_modules/.cache directory removed");
} else {
  console.log("ℹ️ node_modules/.cache directory not found");
}

// Clear browser cache instructions
console.log("\n🌐 Browser Cache Instructions:");
console.log("1. Open browser developer tools (F12)");
console.log("2. Right-click on refresh button");
console.log('3. Select "Empty Cache and Hard Reload"');
console.log("4. Or use Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)");

console.log("\n🚀 Starting development server...");
console.log("Please run: npm run dev");

console.log("\n✅ Cache cleared! Please restart your browser and try again.");
