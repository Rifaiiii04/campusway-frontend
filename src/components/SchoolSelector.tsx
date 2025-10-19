import { fetchSchools, School } from "@/lib/api/schools";

interface SchoolSelectorProps {
  onSchoolSelect?: (school: School) => void;
  selectedSchoolId?: number;
  className?: string;
}

export default async function SchoolSelector({
  onSchoolSelect,
  selectedSchoolId,
  className = "",
}: SchoolSelectorProps) {
  let schools: School[] = [];
  let error: string | null = null;

  try {
    schools = await fetchSchools();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load schools";
  }

  if (error) {
    return (
      <div
        className={`p-4 border border-red-200 rounded-md bg-red-50 ${className}`}
      >
        <p className="text-red-600">Error loading schools: {error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor="school-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Pilih Sekolah
      </label>
      <select
        id="school-select"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        defaultValue={selectedSchoolId || ""}
        onChange={(e) => {
          if (onSchoolSelect) {
            const selectedSchool = schools.find(
              (school) => school.id === parseInt(e.target.value)
            );
            if (selectedSchool) {
              onSchoolSelect(selectedSchool);
            }
          }
        }}
      >
        <option value="">-- Pilih Sekolah --</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name} ({school.school_level})
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        Total {schools.length} sekolah tersedia
      </p>
    </div>
  );
}
