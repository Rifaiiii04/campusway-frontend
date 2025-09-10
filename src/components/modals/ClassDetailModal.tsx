"use client";

interface ClassSummary {
  class_id: number;
  class_name: string;
  grade: string;
  total_students: number;
  total_tests: number;
  completed_tests: number;
  completion_rate: number;
  average_score: number;
}

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassSummary | null;
  darkMode: boolean;
}

export default function ClassDetailModal({
  isOpen,
  onClose,
  classData,
  darkMode,
}: ClassDetailModalProps) {
  if (!isOpen || !classData) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/30 to-gray-900/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-800/95"
            : "bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95"
        } backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border ${
          darkMode ? "border-gray-600/50" : "border-gray-200/50"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-5 border-b ${
            darkMode
              ? "border-gray-600/50 bg-gradient-to-r from-gray-700/90 via-gray-800/90 to-gray-700/90"
              : "border-gray-200/50 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90"
          } backdrop-blur-sm rounded-t-2xl flex-shrink-0`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Detail Kelas
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Informasi lengkap kelas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  darkMode
                    ? "text-gray-400 group-hover:text-gray-200"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Class Header */}
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <div
                  className={`h-20 w-20 rounded-full flex items-center justify-center ${
                    darkMode ? "bg-gray-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`text-2xl font-bold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {classData.class_name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <h3
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {classData.class_name}
                </h3>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Kelas {classData.grade}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ID: {classData.class_id}
                </p>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div
                className={`${
                  darkMode ? "bg-gray-700/50" : "bg-red-50"
                } rounded-xl p-4`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-red-900" : "bg-red-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        darkMode ? "text-red-300" : "text-red-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Siswa
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {classData.total_students}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  darkMode ? "bg-gray-700/50" : "bg-green-50"
                } rounded-xl p-4`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-green-900" : "bg-green-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        darkMode ? "text-green-300" : "text-green-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Tes Selesai
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {classData.completed_tests}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  darkMode ? "bg-gray-700/50" : "bg-yellow-50"
                } rounded-xl p-4`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-yellow-900" : "bg-yellow-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        darkMode ? "text-yellow-300" : "text-yellow-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Progress
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {classData.completion_rate}%
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  darkMode ? "bg-gray-700/50" : "bg-purple-50"
                } rounded-xl p-4`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-purple-900" : "bg-purple-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        darkMode ? "text-purple-300" : "text-purple-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Rata-rata
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {classData.average_score.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Information */}
              <div
                className={`${
                  darkMode ? "bg-gray-700/50" : "bg-gray-50"
                } rounded-xl p-6`}
              >
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Informasi Kelas
                </h4>
                <div className="space-y-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Nama Kelas
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {classData.class_name}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Tingkat
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Kelas {classData.grade}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      ID Kelas
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {classData.class_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Test Information */}
              <div
                className={`${
                  darkMode ? "bg-gray-700/50" : "bg-gray-50"
                } rounded-xl p-6`}
              >
                <h4
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Informasi Tes
                </h4>
                <div className="space-y-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Tes
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {classData.total_tests}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Tes Selesai
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {classData.completed_tests}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Tingkat Penyelesaian
                    </p>
                    <div className="flex items-center">
                      <div
                        className={`w-20 rounded-full h-2 mr-3 ${
                          darkMode ? "bg-gray-600" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${classData.completion_rate}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {classData.completion_rate}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Rata-rata Nilai
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {classData.average_score.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div
              className={`${
                darkMode ? "bg-gray-700/50" : "bg-gray-50"
              } rounded-xl p-6 mt-6`}
            >
              <h4
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Ringkasan Performa
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {classData.total_students}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total Siswa
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {classData.completed_tests}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Tes Selesai
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {classData.average_score.toFixed(1)}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Rata-rata Nilai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-5 border-t ${
            darkMode
              ? "border-gray-600/50 bg-gradient-to-r from-gray-700/90 to-gray-800/90"
              : "border-gray-200/50 bg-gradient-to-r from-gray-50/90 to-blue-50/90"
          } backdrop-blur-sm rounded-b-2xl flex-shrink-0`}
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 ${
                darkMode
                  ? "border-gray-500 text-gray-300 hover:bg-gray-600 hover:border-gray-400"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Tutup</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
