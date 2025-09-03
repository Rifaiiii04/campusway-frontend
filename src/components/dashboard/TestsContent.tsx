"use client";

import { Student } from "../../services/api";

interface TestsContentProps {
  students: Student[];
  darkMode: boolean;
}

export default function TestsContent({
  students,
  darkMode,
}: TestsContentProps) {
  return (
    <div className="space-y-6">
      {/* Coming Soon Content */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow p-12`}
      >
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2
            className={`text-3xl font-bold mb-4 ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Tes & Hasil
          </h2>
          <p
            className={`text-lg mb-6 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Fitur ini sedang dalam pengembangan
          </p>
          <div
            className={`inline-flex items-center px-6 py-3 rounded-full ${
              darkMode
                ? "bg-yellow-900/30 text-yellow-300 border border-yellow-600/30"
                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Coming Soon
          </div>
          <p
            className={`text-sm mt-6 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Fitur tes dan hasil akan segera hadir dengan kemampuan untuk melihat
            hasil tes siswa, analisis performa, dan rekomendasi jurusan yang
            lebih detail.
          </p>
        </div>
      </div>
    </div>
  );
}
