"use client";

import { useState } from "react";
import { Student } from "../../services/api";

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  darkMode: boolean;
}

export default function StudentDetailModal({
  isOpen,
  onClose,
  student,
  darkMode,
}: StudentDetailModalProps) {
  // State for collapsible curriculum sections
  const [expandedCurriculums, setExpandedCurriculums] = useState({
    merdeka: false,
    kurikulum_2013_ipa: false,
    kurikulum_2013_ips: false,
    kurikulum_2013_bahasa: false,
  });

  // Helper function to format subjects with proper spacing
  const formatSubjects = (subjects: string | string[] | null | undefined) => {
    if (!subjects) return "";

    if (Array.isArray(subjects)) {
      // Filter out empty strings and null values
      const filtered = subjects.filter(s => s && s.trim().length > 0);
      return filtered.length > 0 ? filtered.join(", ") : "";
    }

    if (typeof subjects === "string") {
      // If empty string, return empty
      if (subjects.trim().length === 0) return "";
      
      // If it's a JSON string, try to parse it
      try {
        const parsed = JSON.parse(subjects);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((s: string | number | boolean | null) => s !== null && s !== undefined && String(s).trim().length > 0);
          return filtered.length > 0 ? filtered.join(", ") : "";
        }
        // If parsed but not array, convert to string
        return String(parsed).trim();
      } catch {
        // If parsing fails, return as is (might be comma-separated string)
        const parts = subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
        return parts.length > 0 ? parts.join(", ") : subjects;
      }
    }

    return "";
  };

  // Toggle curriculum section
  const toggleCurriculum = (curriculum: keyof typeof expandedCurriculums) => {
    setExpandedCurriculums((prev) => ({
      ...prev,
      [curriculum]: !prev[curriculum],
    }));
  };
  if (!isOpen || !student) return null;

  // Debug: Log student data to see what we're receiving
  if (student?.chosen_major) {
    console.log("📚 StudentDetailModal - chosen_major:", student.chosen_major);
    console.log("📚 Required subjects:", student.chosen_major.required_subjects);
    console.log("📚 Required subjects type:", typeof student.chosen_major.required_subjects);
    console.log("📚 Required subjects isArray:", Array.isArray(student.chosen_major.required_subjects));
    console.log("📚 Preferred subjects:", student.chosen_major.preferred_subjects);
    console.log("📚 Optional subjects:", student.chosen_major.optional_subjects);
    console.log("📚 Kurikulum Merdeka:", student.chosen_major.kurikulum_merdeka_subjects);
    console.log("📚 Kurikulum 2013 IPA:", student.chosen_major.kurikulum_2013_ipa_subjects);
  }

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
              : "border-gray-200/50 bg-gradient-to-r from-red-50/90 via-indigo-50/90 to-purple-50/90"
          } backdrop-blur-sm rounded-t-2xl flex-shrink-0`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-indigo-600 rounded-xl shadow-lg">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Detail Siswa
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Informasi lengkap siswa
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
            {/* Student Avatar and Basic Info */}
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
                    {student.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <h3
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {student.name}
                </h3>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  NISN: {student.nisn}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {student.class}
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
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
                  Informasi Pribadi
                </h4>
                <div className="space-y-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Nama Lengkap
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {student.name}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      NISN
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {student.nisn}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Email
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {student.email || "Tidak tersedia"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Nomor Telepon
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {student.phone || "Tidak tersedia"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Nomor Orang Tua
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {student.parent_phone || "Tidak tersedia"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
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
                  Informasi Akademik
                </h4>
                <div className="space-y-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Kelas
                    </p>
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {student.class}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Status Pilihan Jurusan
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.has_choice
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.has_choice ? "Sudah Memilih" : "Belum Memilih"}
                    </span>
                  </div>
                  {student.has_choice && student.chosen_major && (
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Jurusan Pilihan
                      </p>
                      <div className="flex items-center gap-2">
                        <p
                          className={`${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {student.chosen_major.name}
                        </p>
                        {student.chosen_major.rumpun_ilmu && (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              student.chosen_major.rumpun_ilmu === "ILMU ALAM"
                                ? "bg-red-100 text-red-800"
                                : student.chosen_major.rumpun_ilmu ===
                                  "ILMU SOSIAL"
                                ? "bg-green-100 text-green-800"
                                : student.chosen_major.rumpun_ilmu ===
                                  "HUMANIORA"
                                ? "bg-purple-100 text-purple-800"
                                : student.chosen_major.rumpun_ilmu ===
                                  "ILMU FORMAL"
                                ? "bg-orange-100 text-orange-800"
                                : student.chosen_major.rumpun_ilmu ===
                                  "ILMU TERAPAN"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {student.chosen_major.rumpun_ilmu}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {student.has_choice && student.choice_date && (
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Tanggal Pilihan
                      </p>
                      <p
                        className={`${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {new Date(student.choice_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Major Details */}
            {student.has_choice && student.chosen_major && (
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
                  Detail Jurusan Pilihan
                </h4>
                <div className="space-y-4">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Nama Jurusan
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student.chosen_major.name}
                      </p>
                      {student.chosen_major.rumpun_ilmu && (
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            student.chosen_major.rumpun_ilmu === "ILMU ALAM"
                              ? "bg-red-100 text-red-800"
                              : student.chosen_major.rumpun_ilmu ===
                                "ILMU SOSIAL"
                              ? "bg-green-100 text-green-800"
                              : student.chosen_major.rumpun_ilmu === "HUMANIORA"
                              ? "bg-purple-100 text-purple-800"
                              : student.chosen_major.rumpun_ilmu ===
                                "ILMU FORMAL"
                              ? "bg-orange-100 text-orange-800"
                              : student.chosen_major.rumpun_ilmu ===
                                "ILMU TERAPAN"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.chosen_major.rumpun_ilmu}
                        </span>
                      )}
                    </div>
                  </div>

                  {student.chosen_major.description && (
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Deskripsi Jurusan
                      </p>
                      <p
                        className={`mt-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {student.chosen_major.description}
                      </p>
                    </div>
                  )}

                  {student.chosen_major.career_prospects && (
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Prospek Karir
                      </p>
                      <p
                        className={`mt-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {student.chosen_major.career_prospects}
                      </p>
                    </div>
                  )}

                  {/* Helper function to parse subjects to array */}
                  {(() => {
                    const parseSubjectsToArray = (subjects: string | string[] | null | undefined): string[] => {
                      if (!subjects) return [];
                      if (Array.isArray(subjects)) {
                        return subjects.filter(s => s && String(s).trim().length > 0).map(s => String(s).trim());
                      }
                      if (typeof subjects === 'string') {
                        const trimmed = subjects.trim();
                        if (trimmed.length === 0) return [];
                        try {
                          const parsed = JSON.parse(trimmed);
                          if (Array.isArray(parsed)) {
                            return parsed.filter((s: unknown) => s !== null && s !== undefined && String(s).trim().length > 0).map((s: unknown) => String(s).trim());
                          }
                        } catch {
                          // If not JSON, treat as comma-separated
                          return trimmed.split(',').map(s => s.trim()).filter(s => s.length > 0);
                        }
                      }
                      return [];
                    };

                    const requiredSubjects = parseSubjectsToArray(student.chosen_major.required_subjects);
                    const preferredSubjects = parseSubjectsToArray(student.chosen_major.preferred_subjects);
                    const optionalSubjects = parseSubjectsToArray(student.chosen_major.optional_subjects);

                    return (
                      <>
                        {/* Mata Pelajaran Wajib */}
                        {requiredSubjects.length > 0 && (
                          <div className={`border rounded-lg p-5 ${
                            darkMode 
                              ? "border-gray-600 bg-gradient-to-br from-red-900/20 to-pink-900/20" 
                              : "border-red-200 bg-gradient-to-br from-red-50 to-pink-50"
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`p-2 rounded-lg ${
                                darkMode ? "bg-red-800/30" : "bg-red-100"
                              }`}>
                                <svg className={`w-5 h-5 ${
                                  darkMode ? "text-red-300" : "text-red-600"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <h5 className={`text-lg font-bold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}>
                                Mata Pelajaran Wajib
                              </h5>
                            </div>
                            <ul className={`space-y-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}>
                              {requiredSubjects.map((subject, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className={`mt-1.5 flex-shrink-0 ${
                                    darkMode ? "text-red-400" : "text-red-600"
                                  }`}>•</span>
                                  <span className="text-sm">{subject}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Mata Pelajaran Diutamakan */}
                        {preferredSubjects.length > 0 && (
                          <div className={`border rounded-lg p-5 ${
                            darkMode 
                              ? "border-gray-600 bg-gradient-to-br from-blue-900/20 to-cyan-900/20" 
                              : "border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50"
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`p-2 rounded-lg ${
                                darkMode ? "bg-blue-800/30" : "bg-blue-100"
                              }`}>
                                <svg className={`w-5 h-5 ${
                                  darkMode ? "text-blue-300" : "text-blue-600"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </div>
                              <h5 className={`text-lg font-bold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}>
                                Mata Pelajaran Diutamakan
                              </h5>
                            </div>
                            <ul className={`space-y-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}>
                              {preferredSubjects.map((subject, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className={`mt-1.5 flex-shrink-0 ${
                                    darkMode ? "text-blue-400" : "text-blue-600"
                                  }`}>•</span>
                                  <span className="text-sm">{subject}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Mata Pelajaran Pilihan/Opsional */}
                        {optionalSubjects.length > 0 && (
                          <div className={`border rounded-lg p-5 ${
                            darkMode 
                              ? "border-gray-600 bg-gradient-to-br from-green-900/20 to-emerald-900/20" 
                              : "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`p-2 rounded-lg ${
                                darkMode ? "bg-green-800/30" : "bg-green-100"
                              }`}>
                                <svg className={`w-5 h-5 ${
                                  darkMode ? "text-green-300" : "text-green-600"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              <h5 className={`text-lg font-bold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}>
                                Mata Pelajaran Pilihan
                              </h5>
                            </div>
                            <ul className={`space-y-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}>
                              {optionalSubjects.map((subject, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className={`mt-1.5 flex-shrink-0 ${
                                    darkMode ? "text-green-400" : "text-green-600"
                                  }`}>•</span>
                                  <span className="text-sm">{subject}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Curriculum-based Subjects - Displayed in Grid Format like Student Dashboard */}
                  {(() => {
                    const hasCurriculumSubjects = 
                      (student.chosen_major.kurikulum_merdeka_subjects && 
                        (Array.isArray(student.chosen_major.kurikulum_merdeka_subjects) 
                          ? student.chosen_major.kurikulum_merdeka_subjects.length > 0
                          : String(student.chosen_major.kurikulum_merdeka_subjects).trim().length > 0)) ||
                      (student.chosen_major.kurikulum_2013_ipa_subjects && 
                        (Array.isArray(student.chosen_major.kurikulum_2013_ipa_subjects) 
                          ? student.chosen_major.kurikulum_2013_ipa_subjects.length > 0
                          : String(student.chosen_major.kurikulum_2013_ipa_subjects).trim().length > 0)) ||
                      (student.chosen_major.kurikulum_2013_ips_subjects && 
                        (Array.isArray(student.chosen_major.kurikulum_2013_ips_subjects) 
                          ? student.chosen_major.kurikulum_2013_ips_subjects.length > 0
                          : String(student.chosen_major.kurikulum_2013_ips_subjects).trim().length > 0)) ||
                      (student.chosen_major.kurikulum_2013_bahasa_subjects && 
                        (Array.isArray(student.chosen_major.kurikulum_2013_bahasa_subjects) 
                          ? student.chosen_major.kurikulum_2013_bahasa_subjects.length > 0
                          : String(student.chosen_major.kurikulum_2013_bahasa_subjects).trim().length > 0));

                    if (!hasCurriculumSubjects) return null;

                    const parseSubjectsToArray = (subjects: string | string[] | null | undefined): string[] => {
                      if (!subjects) return [];
                      if (Array.isArray(subjects)) {
                        return subjects.filter(s => s && String(s).trim().length > 0).map(s => String(s).trim());
                      }
                      if (typeof subjects === 'string') {
                        const trimmed = subjects.trim();
                        if (trimmed.length === 0) return [];
                        try {
                          const parsed = JSON.parse(trimmed);
                          if (Array.isArray(parsed)) {
                            return parsed.filter((s: unknown) => s !== null && s !== undefined && String(s).trim().length > 0).map((s: unknown) => String(s).trim());
                          }
                        } catch {
                          return trimmed.split(',').map(s => s.trim()).filter(s => s.length > 0);
                        }
                      }
                      return [];
                    };

                    const merdekaSubjects = parseSubjectsToArray(student.chosen_major.kurikulum_merdeka_subjects);
                    const ipaSubjects = parseSubjectsToArray(student.chosen_major.kurikulum_2013_ipa_subjects);
                    const ipsSubjects = parseSubjectsToArray(student.chosen_major.kurikulum_2013_ips_subjects);
                    const bahasaSubjects = parseSubjectsToArray(student.chosen_major.kurikulum_2013_bahasa_subjects);

                    return (
                      <div className="mt-6">
                        <h5 className={`text-md font-semibold mb-4 flex items-center ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          <svg
                            className={`w-5 h-5 mr-2 ${
                              darkMode ? "text-purple-400" : "text-purple-500"
                            }`}
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
                          Mata Pelajaran Wajib Berdasarkan Kurikulum
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Kurikulum Merdeka */}
                          {merdekaSubjects.length > 0 && (
                            <div className={`rounded-lg p-4 border ${
                              darkMode 
                                ? "border-purple-600/50 bg-gradient-to-br from-purple-900/20 to-indigo-900/20" 
                                : "border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50"
                            }`}>
                              <h6 className={`font-semibold mb-2 text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}>
                                Kurikulum Merdeka
                              </h6>
                              <ul className="space-y-1">
                                {merdekaSubjects.map((subject, index) => (
                                  <li
                                    key={index}
                                    className={`text-xs flex items-center ${
                                      darkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${
                                      darkMode ? "bg-purple-400" : "bg-purple-500"
                                    }`}></span>
                                    {subject}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Kurikulum 2013 IPA */}
                          {ipaSubjects.length > 0 && (
                            <div className={`rounded-lg p-4 border ${
                              darkMode 
                                ? "border-orange-600/50 bg-gradient-to-br from-orange-900/20 to-red-900/20" 
                                : "border-orange-200 bg-gradient-to-br from-orange-50 to-red-50"
                            }`}>
                              <h6 className={`font-semibold mb-2 text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}>
                                Kurikulum 2013 - IPA
                              </h6>
                              <ul className="space-y-1">
                                {ipaSubjects.map((subject, index) => (
                                  <li
                                    key={index}
                                    className={`text-xs flex items-center ${
                                      darkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${
                                      darkMode ? "bg-orange-400" : "bg-orange-500"
                                    }`}></span>
                                    {subject}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Kurikulum 2013 IPS */}
                          {ipsSubjects.length > 0 && (
                            <div className={`rounded-lg p-4 border ${
                              darkMode 
                                ? "border-teal-600/50 bg-gradient-to-br from-teal-900/20 to-cyan-900/20" 
                                : "border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50"
                            }`}>
                              <h6 className={`font-semibold mb-2 text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}>
                                Kurikulum 2013 - IPS
                              </h6>
                              <ul className="space-y-1">
                                {ipsSubjects.map((subject, index) => (
                                  <li
                                    key={index}
                                    className={`text-xs flex items-center ${
                                      darkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${
                                      darkMode ? "bg-teal-400" : "bg-teal-500"
                                    }`}></span>
                                    {subject}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Kurikulum 2013 Bahasa */}
                          {bahasaSubjects.length > 0 && (
                            <div className={`rounded-lg p-4 border ${
                              darkMode 
                                ? "border-indigo-600/50 bg-gradient-to-br from-indigo-900/20 to-blue-900/20" 
                                : "border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50"
                            }`}>
                              <h6 className={`font-semibold mb-2 text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}>
                                Kurikulum 2013 - Bahasa
                              </h6>
                              <ul className="space-y-1">
                                {bahasaSubjects.map((subject, index) => (
                                  <li
                                    key={index}
                                    className={`text-xs flex items-center ${
                                      darkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${
                                      darkMode ? "bg-indigo-400" : "bg-indigo-500"
                                    }`}></span>
                                    {subject}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {student.chosen_major.choice_date && (
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Tanggal Pilihan
                      </p>
                      <p
                        className={`mt-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {new Date(
                          student.chosen_major.choice_date
                        ).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-5 border-t ${
            darkMode
              ? "border-gray-600/50 bg-gradient-to-r from-gray-700/90 to-gray-800/90"
              : "border-gray-200/50 bg-gradient-to-r from-gray-50/90 to-red-50/90"
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
