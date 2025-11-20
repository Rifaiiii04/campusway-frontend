"use client";

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
  if (!isOpen || !student) return null;

  // Helper function to parse subjects to array
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

  const requiredSubjects = student.chosen_major ? parseSubjectsToArray(student.chosen_major.required_subjects) : [];
  const preferredSubjects = student.chosen_major ? parseSubjectsToArray(student.chosen_major.preferred_subjects) : [];
  const optionalSubjects = student.chosen_major ? parseSubjectsToArray(student.chosen_major.optional_subjects) : [];

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`${
          darkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        } rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col border overflow-hidden transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
        } flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
              darkMode 
                ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white" 
                : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
            }`}>
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {student.name}
              </h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {student.class} • NISN: {student.nisn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              student.has_choice
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}>
              {student.has_choice ? "✓ Sudah Memilih Jurusan" : "⏳ Belum Memilih Jurusan"}
            </span>
            {student.has_choice && student.chosen_major?.rumpun_ilmu && (
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                student.chosen_major.rumpun_ilmu === "ILMU ALAM"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : student.chosen_major.rumpun_ilmu === "ILMU SOSIAL"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : student.chosen_major.rumpun_ilmu === "HUMANIORA"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}>
                {student.chosen_major.rumpun_ilmu}
              </span>
            )}
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Info */}
            <div className={`rounded-xl p-5 border ${
              darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
            }`}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informasi Pribadi
              </h3>
              <div className="space-y-3">
                <InfoRow label="Email" value={student.email || "-"} darkMode={darkMode} />
                <InfoRow label="Telepon" value={student.phone || "-"} darkMode={darkMode} />
                <InfoRow label="Telepon Orang Tua" value={student.parent_phone || "-"} darkMode={darkMode} />
              </div>
            </div>

            {/* Academic Info */}
            <div className={`rounded-xl p-5 border ${
              darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
            }`}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Informasi Akademik
              </h3>
              <div className="space-y-3">
                <InfoRow label="Kelas" value={student.class} darkMode={darkMode} />
                {student.has_choice && student.chosen_major && (
                  <InfoRow 
                    label="Jurusan" 
                    value={student.chosen_major.name} 
                    darkMode={darkMode} 
                  />
                )}
                {student.has_choice && student.choice_date && (
                  <InfoRow 
                    label="Tanggal Pilihan" 
                    value={new Date(student.choice_date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })} 
                    darkMode={darkMode} 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Major Details */}
          {student.has_choice && student.chosen_major && (
            <div className={`rounded-xl p-6 border ${
              darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  darkMode ? "bg-blue-900/30" : "bg-blue-100"
                }`}>
                  <svg className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {student.chosen_major.name}
                  </h3>
                  {student.chosen_major.description && (
                    <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {student.chosen_major.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-4">
                {/* Required Subjects */}
                {requiredSubjects.length > 0 && (
                  <SubjectCard
                    title="Mata Pelajaran Wajib"
                    subjects={requiredSubjects}
                    iconColor="red"
                    darkMode={darkMode}
                  />
                )}

                {/* Preferred Subjects */}
                {preferredSubjects.length > 0 && (
                  <SubjectCard
                    title="Mata Pelajaran Diutamakan"
                    subjects={preferredSubjects}
                    iconColor="blue"
                    darkMode={darkMode}
                  />
                )}

                {/* Optional Subjects */}
                {optionalSubjects.length > 0 && (
                  <SubjectCard
                    title="Mata Pelajaran Pilihan"
                    subjects={optionalSubjects}
                    iconColor="green"
                    darkMode={darkMode}
                  />
                )}

                {/* Curriculum Subjects */}
                {(() => {
                  const merdeka = parseSubjectsToArray(student.chosen_major.kurikulum_merdeka_subjects);
                  const ipa = parseSubjectsToArray(student.chosen_major.kurikulum_2013_ipa_subjects);
                  const ips = parseSubjectsToArray(student.chosen_major.kurikulum_2013_ips_subjects);
                  const bahasa = parseSubjectsToArray(student.chosen_major.kurikulum_2013_bahasa_subjects);

                  if (merdeka.length === 0 && ipa.length === 0 && ips.length === 0 && bahasa.length === 0) {
                    return null;
                  }

                  return (
                    <div className="mt-6">
                      <h4 className={`text-sm font-semibold mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Mata Pelajaran Berdasarkan Kurikulum
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {merdeka.length > 0 && (
                          <CurriculumCard title="Kurikulum Merdeka" subjects={merdeka} color="purple" darkMode={darkMode} />
                        )}
                        {ipa.length > 0 && (
                          <CurriculumCard title="K13 - IPA" subjects={ipa} color="orange" darkMode={darkMode} />
                        )}
                        {ips.length > 0 && (
                          <CurriculumCard title="K13 - IPS" subjects={ips} color="teal" darkMode={darkMode} />
                        )}
                        {bahasa.length > 0 && (
                          <CurriculumCard title="K13 - Bahasa" subjects={bahasa} color="indigo" darkMode={darkMode} />
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Career Prospects */}
              {student.chosen_major.career_prospects && (
                <div className={`mt-6 p-4 rounded-lg ${
                  darkMode ? "bg-gray-700/30" : "bg-white/60"
                }`}>
                  <h4 className={`text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Prospek Karir
                  </h4>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {student.chosen_major.career_prospects}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
        } flex justify-end`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoRow({ label, value, darkMode }: { label: string; value: string; darkMode: boolean }) {
  return (
    <div>
      <p className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}

function SubjectCard({ 
  title, 
  subjects, 
  iconColor, 
  darkMode 
}: { 
  title: string; 
  subjects: string[]; 
  iconColor: "red" | "blue" | "green";
  darkMode: boolean;
}) {
  const colorClasses = {
    red: {
      bg: darkMode ? "bg-red-900/20" : "bg-red-50",
      border: darkMode ? "border-red-800/50" : "border-red-200",
      icon: darkMode ? "text-red-400" : "text-red-600",
      dot: darkMode ? "text-red-400" : "text-red-600",
    },
    blue: {
      bg: darkMode ? "bg-blue-900/20" : "bg-blue-50",
      border: darkMode ? "border-blue-800/50" : "border-blue-200",
      icon: darkMode ? "text-blue-400" : "text-blue-600",
      dot: darkMode ? "text-blue-400" : "text-blue-600",
    },
    green: {
      bg: darkMode ? "bg-green-900/20" : "bg-green-50",
      border: darkMode ? "border-green-800/50" : "border-green-200",
      icon: darkMode ? "text-green-400" : "text-green-600",
      dot: darkMode ? "text-green-400" : "text-green-600",
    },
  };

  const colors = colorClasses[iconColor];

  return (
    <div className={`rounded-lg p-4 border ${colors.bg} ${colors.border}`}>
      <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
        <span className={`${colors.icon}`}>●</span>
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject, index) => (
          <span
            key={index}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ${
              darkMode
                ? "bg-gray-700/50 text-gray-300"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            {subject}
          </span>
        ))}
      </div>
    </div>
  );
}

function CurriculumCard({ 
  title, 
  subjects, 
  color, 
  darkMode 
}: { 
  title: string; 
  subjects: string[]; 
  color: "purple" | "orange" | "teal" | "indigo";
  darkMode: boolean;
}) {
  const colorClasses = {
    purple: {
      bg: darkMode ? "bg-purple-900/20" : "bg-purple-50",
      border: darkMode ? "border-purple-800/50" : "border-purple-200",
      text: darkMode ? "text-purple-300" : "text-purple-700",
      dot: darkMode ? "bg-purple-400" : "bg-purple-500",
    },
    orange: {
      bg: darkMode ? "bg-orange-900/20" : "bg-orange-50",
      border: darkMode ? "border-orange-800/50" : "border-orange-200",
      text: darkMode ? "text-orange-300" : "text-orange-700",
      dot: darkMode ? "bg-orange-400" : "bg-orange-500",
    },
    teal: {
      bg: darkMode ? "bg-teal-900/20" : "bg-teal-50",
      border: darkMode ? "border-teal-800/50" : "border-teal-200",
      text: darkMode ? "text-teal-300" : "text-teal-700",
      dot: darkMode ? "bg-teal-400" : "bg-teal-500",
    },
    indigo: {
      bg: darkMode ? "bg-indigo-900/20" : "bg-indigo-50",
      border: darkMode ? "border-indigo-800/50" : "border-indigo-200",
      text: darkMode ? "text-indigo-300" : "text-indigo-700",
      dot: darkMode ? "bg-indigo-400" : "bg-indigo-500",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`rounded-lg p-3 border ${colors.bg} ${colors.border}`}>
      <h5 className={`text-xs font-semibold mb-2 ${colors.text}`}>
        {title}
      </h5>
      <ul className="space-y-1.5">
        {subjects.map((subject, index) => (
          <li key={index} className={`text-xs flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
            {subject}
          </li>
        ))}
      </ul>
    </div>
  );
}
