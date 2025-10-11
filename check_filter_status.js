// Script to check if filter is correctly updated
const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "src/components/student/StudentDashboardClient.tsx"
);

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Check for old filter terms
  const oldTerms = ["Saintek", "Soshum", "Campuran"];
  const newTerms = [
    "HUMANIORA",
    "ILMU SOSIAL",
    "ILMU ALAM",
    "ILMU FORMAL",
    "ILMU TERAPAN",
  ];

  console.log("🔍 Checking filter status...\n");

  // Check for old terms
  oldTerms.forEach((term) => {
    if (data.includes(term)) {
      console.log(`❌ Found old term: "${term}"`);
    } else {
      console.log(`✅ No old term: "${term}"`);
    }
  });

  console.log("\n");

  // Check for new terms
  newTerms.forEach((term) => {
    if (data.includes(term)) {
      console.log(`✅ Found new term: "${term}"`);
    } else {
      console.log(`❌ Missing new term: "${term}"`);
    }
  });

  // Check for rumpun ilmu filter section
  if (data.includes("Rumpun Ilmu Filter")) {
    console.log('\n✅ Found "Rumpun Ilmu Filter" section');
  } else {
    console.log('\n❌ Missing "Rumpun Ilmu Filter" section');
  }

  // Check for selectedRumpunIlmu state
  if (data.includes("selectedRumpunIlmu")) {
    console.log("✅ Found selectedRumpunIlmu state");
  } else {
    console.log("❌ Missing selectedRumpunIlmu state");
  }
});
