const fs = require("fs");
const path = require("path");

console.log("🔄 FORCING BROWSER RELOAD...\n");

const filePath = path.join(
  __dirname,
  "src/components/student/StudentDashboardClient.tsx"
);

// Read the file
let content = fs.readFileSync(filePath, "utf8");

// Add a unique timestamp to force reload
const timestamp = Date.now();
const randomId = Math.random().toString(36).substring(7);

// Replace the comment to force reload
content = content.replace(
  /FORCE UPDATE 2025-09-05 - NO MORE SAINTEK SOSHUM CAMPURAN/,
  `FORCE UPDATE 2025-09-05-${timestamp}-${randomId} - NO MORE SAINTEK SOSHUM CAMPURAN`
);

// Add a unique comment to force reload
content = content.replace(
  /console\.log\("🔍 FORCE UPDATE - Rendering Rumpun Ilmu Filters:", rumpunFilters\);/,
  `console.log("🔍 FORCE UPDATE - Rendering Rumpun Ilmu Filters:", rumpunFilters);
              console.log("🔄 RELOAD FORCE ID: ${timestamp}-${randomId}");`
);

// Write the updated file
fs.writeFileSync(filePath, content);

console.log("✅ File updated with force reload timestamp");
console.log(`🆔 Force reload ID: ${timestamp}-${randomId}`);
console.log("\n📋 Next steps:");
console.log("1. Start the development server: npm run dev");
console.log("2. Open browser in incognito/private mode");
console.log("3. Go to localhost:3000/student/dashboard");
console.log("4. Check browser console for the force reload ID");
console.log("5. If still showing old filters, clear browser cache completely");
console.log("\n🚀 Ready to test!");
