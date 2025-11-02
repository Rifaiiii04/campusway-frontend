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

                  {(() => {
                    const requiredSubjects: string[] | string | null | undefined = student.chosen_major.required_subjects;
                    if (!requiredSubjects) return false;
                    if (Array.isArray(requiredSubjects)) {
                      return requiredSubjects.length > 0 && requiredSubjects.some(s => s && String(s).trim().length > 0);
                    }
                    if (typeof requiredSubjects === 'string') {
                      return requiredSubjects.trim().length > 0;
                    }
                    return false;
                  })() && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-red-50 to-pink-50">
                      <p
                        className={`text-lg font-bold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Mata Pelajaran Wajib
                      </p>
                      <p
                        className={`mt-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formatSubjects(student.chosen_major.required_subjects)}
                      </p>
                    </div>
                  )}

                  {(() => {
                    const preferredSubjects: string[] | string | null | undefined = student.chosen_major.preferred_subjects;
                    if (!preferredSubjects) return false;
                    if (Array.isArray(preferredSubjects)) {
                      return preferredSubjects.length > 0 && preferredSubjects.some(s => s && String(s).trim().length > 0);
                    }
                    if (typeof preferredSubjects === 'string') {
                      return preferredSubjects.trim().length > 0;
                    }
                    return false;
                  })() && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-red-50 to-cyan-50">
                      <p
                        className={`text-lg font-bold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Mata Pelajaran Pilihan
                      </p>
                      <p
                        className={`mt-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formatSubjects(
                          student.chosen_major.preferred_subjects
                        )}
                      </p>
                    </div>
                  )}

                  {(() => {
                    const subjects: string[] | string | null | undefined = student.chosen_major.kurikulum_merdeka_subjects;
                    if (!subjects) return false;
                    if (Array.isArray(subjects)) {
                      return subjects.length > 0 && subjects.some(s => s && String(s).trim().length > 0);
                    }
                    if (typeof subjects === 'string') {
                      return subjects.trim().length > 0;
                    }
                    return false;
                  })() && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                      <button
                        onClick={() => toggleCurriculum("merdeka")}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          📚 Mata Pelajaran Kurikulum Merdeka
                        </p>
                        <span
                          className={`transform transition-transform duration-200 ${
                            expandedCurriculums.merdeka
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        >
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>
                      {expandedCurriculums.merdeka && (
                        <p
                          className={`mt-3 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {formatSubjects(
                            student.chosen_major.kurikulum_merdeka_subjects
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {(() => {
                    const subjects: string[] | string | null | undefined = student.chosen_major.kurikulum_2013_ipa_subjects;
                    if (!subjects) return false;
                    if (Array.isArray(subjects)) {
                      return subjects.length > 0 && subjects.some(s => s && String(s).trim().length > 0);
                    }
                    if (typeof subjects === 'string') {
                      return subjects.trim().length > 0;
                    }
                    return false;
                  })() && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50">
                      <button
                        onClick={() => toggleCurriculum("kurikulum_2013_ipa")}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          🧪 Mata Pelajaran Kurikulum 2013 - IPA
                        </p>
                        <span
                          className={`transform transition-transform duration-200 ${
                            expandedCurriculums.kurikulum_2013_ipa
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        >
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>
                      {expandedCurriculums.kurikulum_2013_ipa && (
                        <p
                          className={`mt-3 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {formatSubjects(
                            student.chosen_major.kurikulum_2013_ipa_subjects
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {(() => {
                    const subjects: string[] | string | null | undefined = student.chosen_major.kurikulum_2013_ips_subjects;
                    if (!subjects) return false;
                    if (Array.isArray(subjects)) {
                      return subjects.length > 0 && subjects.some(s => s && String(s).trim().length > 0);
                    }
                    if (typeof subjects === 'string') {
                      return subjects.trim().length > 0;
                    }
                    return false;
                  })() && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-teal-50 to-cyan-50">
                      <button
                        onClick={() => toggleCurriculum("kurikulum_2013_ips")}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          📊 Mata Pelajaran Kurikulum 2013 - IPS
                        </p>
                        <span
                          className={`transform transition-transform duration-200 ${
                            expandedCurriculums.kurikulum_2013_ips
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        >
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>
                      {expandedCurriculums.kurikulum_2013_ips && (
                        <p
                          className={`mt-3 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {formatSubjects(
                            student.chosen_major.kurikulum_2013_ips_subjects
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {(() => {
                    const subjects: string[] | string | null | undefined = student.chosen_major.kurikulum_2013_bahasa_subjects;
                    if (!subjects) return false;
                    if (Array.isArray(subjects)) {
                      return subjects.length > 0 && subjects.some(s => s && String(s).trim().length > 0);
                    }
                    if (typeof subjects === 'string') {
                      return subjects.trim().length > 0;
                    }
                    return false;
                  })() && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-red-50">
                      <button
                        onClick={() =>
                          toggleCurriculum("kurikulum_2013_bahasa")
                        }
                        className="flex items-center justify-between w-full text-left"
                      >
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          📝 Mata Pelajaran Kurikulum 2013 - Bahasa
                        </p>
                        <span
                          className={`transform transition-transform duration-200 ${
                            expandedCurriculums.kurikulum_2013_bahasa
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        >
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>
                      {expandedCurriculums.kurikulum_2013_bahasa && (
                        <p
                          className={`mt-3 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {formatSubjects(
                            student.chosen_major.kurikulum_2013_bahasa_subjects
                          )}
                        </p>
                      )}
                    </div>
                  )}

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
