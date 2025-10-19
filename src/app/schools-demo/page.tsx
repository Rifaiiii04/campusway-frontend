"use client";
import SchoolSelector from "@/components/SchoolSelector";

export default function SchoolsDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Demo Pemilihan Sekolah
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Server Component dengan API Call
              </h2>
              <SchoolSelector
                className="mb-4"
                onSchoolSelect={(school) => {
                  // This would be handled by a client component in a real app
                  console.log("Selected school:", school);
                }}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Cara Penggunaan:
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  1. Import:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    import SchoolSelector from
                    &apos;@/components/SchoolSelector&apos;
                  </code>
                </p>
                <p>
                  2. Gunakan sebagai server component:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    &lt;SchoolSelector /&gt;
                  </code>
                </p>
                <p>
                  3. API function tersedia di:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    @/lib/api/schools
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
