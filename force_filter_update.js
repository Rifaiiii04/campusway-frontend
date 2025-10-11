const fs = require("fs");
const path = require("path");

// Path ke file StudentDashboardClient.tsx
const filePath = path.join(
  __dirname,
  "src/components/student/StudentDashboardClient.tsx"
);

console.log("🔧 Force updating filter in StudentDashboardClient.tsx...\n");

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("❌ Error reading file:", err);
    return;
  }

  // Replace any remaining old filter patterns
  let updatedData = data;

  // Force replace any hardcoded old filters
  const replacements = [
    // Look for any button text patterns
    { old: 'label: "Saintek"', new: 'label: "ILMU ALAM"' },
    { old: 'label: "Soshum"', new: 'label: "ILMU SOSIAL"' },
    { old: 'label: "Campuran"', new: 'label: "HUMANIORA"' },
    { old: '"Saintek"', new: '"ILMU ALAM"' },
    { old: '"Soshum"', new: '"ILMU SOSIAL"' },
    { old: '"Campuran"', new: '"HUMANIORA"' },
    { old: "'Saintek'", new: "'ILMU ALAM'" },
    { old: "'Soshum'", new: "'ILMU SOSIAL'" },
    { old: "'Campuran'", new: "'HUMANIORA'" },
    // Look for key patterns
    { old: 'key: "Saintek"', new: 'key: "ILMU ALAM"' },
    { old: 'key: "Soshum"', new: 'key: "ILMU SOSIAL"' },
    { old: 'key: "Campuran"', new: 'key: "HUMANIORA"' },
  ];

  let changesMade = 0;
  replacements.forEach(({ old, new: newText }) => {
    const beforeLength = updatedData.length;
    updatedData = updatedData.replace(new RegExp(old, "g"), newText);
    const afterLength = updatedData.length;
    if (beforeLength !== afterLength) {
      console.log(`✅ Replaced: ${old} → ${newText}`);
      changesMade++;
    }
  });

  if (changesMade === 0) {
    console.log("ℹ️ No old filter patterns found to replace.");

    // Check if the correct filters are already there
    const correctFilters = [
      "HUMANIORA",
      "ILMU SOSIAL",
      "ILMU ALAM",
      "ILMU FORMAL",
      "ILMU TERAPAN",
    ];
    const hasAllCorrectFilters = correctFilters.every((filter) =>
      updatedData.includes(filter)
    );

    if (hasAllCorrectFilters) {
      console.log(
        "✅ All correct Rumpun Ilmu filters are present in the file."
      );
      console.log("\n🧹 This might be a browser cache issue. Try:");
      console.log(
        "1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
      );
      console.log("2. Clear browser cache completely");
      console.log("3. Open browser in incognito/private mode");
      console.log("4. Restart the development server");
    } else {
      console.log("❌ Some Rumpun Ilmu filters are missing from the file.");
    }
  } else {
    // Write the updated file
    fs.writeFile(filePath, updatedData, "utf8", (writeErr) => {
      if (writeErr) {
        console.error("❌ Error writing file:", writeErr);
        return;
      }
      console.log(`\n✅ Successfully updated ${changesMade} filter patterns!`);
      console.log(
        "🔄 Please restart your development server and refresh the browser."
      );
    });
  }
});
