const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/services/api.ts");

console.log("🔍 Verifying API functions...\n");

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("❌ Error reading file:", err);
    return;
  }

  // Check for duplicate getTkaSchedules functions
  const getTkaSchedulesMatches = data.match(/async getTkaSchedules\(/g);
  const getTkaSchedulesCount = getTkaSchedulesMatches
    ? getTkaSchedulesMatches.length
    : 0;

  console.log(`📊 getTkaSchedules function count: ${getTkaSchedulesCount}`);

  if (getTkaSchedulesCount === 1) {
    console.log("✅ Only one getTkaSchedules function found - Good!");
  } else if (getTkaSchedulesCount > 1) {
    console.log(
      `❌ Found ${getTkaSchedulesCount} getTkaSchedules functions - Duplicates detected!`
    );
  } else {
    console.log("❌ No getTkaSchedules function found!");
  }

  // Check for export statements
  const exportMatches = data.match(/export const \w+Service = \{/g);
  const exportCount = exportMatches ? exportMatches.length : 0;

  console.log(`\n📊 Service exports count: ${exportCount}`);
  exportMatches?.forEach((match, index) => {
    console.log(`  ${index + 1}. ${match}`);
  });

  // Check for closing braces
  const closingBraceMatches = data.match(/\};\s*$/gm);
  const closingBraceCount = closingBraceMatches
    ? closingBraceMatches.length
    : 0;

  console.log(`\n📊 Closing braces count: ${closingBraceCount}`);

  // Check for specific services
  const services = ["apiService", "studentApiService", "schoolLevelApiService"];
  services.forEach((service) => {
    const serviceMatches = data.match(
      new RegExp(`export const ${service} = \\{`, "g")
    );
    const serviceCount = serviceMatches ? serviceMatches.length : 0;
    console.log(`📊 ${service}: ${serviceCount} export(s)`);
  });

  console.log("\n✅ API verification completed!");
});
