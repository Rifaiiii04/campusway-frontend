"use client";

import React, { useState, useEffect } from "react";
import { schoolLevelApiService } from "@/services/api";

interface SchoolLevelMajorSelectorProps {
  onMajorSelect?: (major: any) => void;
  selectedSchoolLevel?: "SMA/MA" | "SMK/MAK";
}

const SchoolLevelMajorSelector: React.FC<SchoolLevelMajorSelectorProps> = ({
  onMajorSelect,
  selectedSchoolLevel = "SMA/MA",
}) => {
  const [schoolLevel, setSchoolLevel] = useState<"SMA/MA" | "SMK/MAK">(
    selectedSchoolLevel
  );
  const [majors, setMajors] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [schoolLevel]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [majorsResponse, subjectsResponse, statsResponse] =
        await Promise.all([
          schoolLevelApiService.getMajorsBySchoolLevel(schoolLevel),
          schoolLevelApiService.getSubjectsBySchoolLevel(schoolLevel),
          schoolLevelApiService.getSchoolLevelStats(),
        ]);

      setMajors(majorsResponse.data);
      setSubjects(subjectsResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolLevelChange = (level: "SMA/MA" | "SMK/MAK") => {
    setSchoolLevel(level);
  };

  const handleMajorClick = (major: any) => {
    if (onMajorSelect) {
      onMajorSelect(major);
    }
  };

  const getSubjectTypeColor = (subjectType: string) => {
    switch (subjectType) {
      case "Wajib":
        return "bg-red-100 text-red-800";
      case "Pilihan":
        return "bg-blue-100 text-blue-800";
      case "Produk_Kreatif_Kewirausahaan":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Memuat Data...
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Sedang mengambil informasi mata pelajaran dan rekomendasi jurusan
          berdasarkan jenjang sekolah yang dipilih.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-red-800 mb-4">
          Terjadi Kesalahan
        </h3>
        <p className="text-red-700 mb-6 max-w-md mx-auto">{error}</p>
        <button
          onClick={loadData}
          className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 transform hover:scale-105"
        >
          🔄 Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* School Level Selector */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Pilih Jenjang Sekolah
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleSchoolLevelChange("SMA/MA")}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
              schoolLevel === "SMA/MA"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🏫</span>
              <span>SMA/MA</span>
            </div>
          </button>
          <button
            onClick={() => handleSchoolLevelChange("SMK/MAK")}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
              schoolLevel === "SMK/MAK"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🔧</span>
              <span>SMK/MAK</span>
            </div>
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            📊 Statistik {schoolLevel}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
              <div className="text-4xl font-bold text-blue-700 mb-2">
                {stats[schoolLevel === "SMA/MA" ? "sma_ma" : "smk_mak"]
                  ?.majors_count || 0}
              </div>
              <div className="text-sm font-semibold text-blue-800 uppercase tracking-wide">
                Total Jurusan
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200">
              <div className="text-4xl font-bold text-green-700 mb-2">
                {stats[schoolLevel === "SMA/MA" ? "sma_ma" : "smk_mak"]
                  ?.subjects_count || 0}
              </div>
              <div className="text-sm font-semibold text-green-800 uppercase tracking-wide">
                Total Mata Pelajaran
              </div>
            </div>
            {schoolLevel === "SMA/MA" ? (
              <>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center border border-red-200">
                  <div className="text-4xl font-bold text-red-700 mb-2">
                    {stats.sma_ma?.required_subjects || 0}
                  </div>
                  <div className="text-sm font-semibold text-red-800 uppercase tracking-wide">
                    Mata Pelajaran Wajib
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200">
                  <div className="text-4xl font-bold text-purple-700 mb-2">
                    {stats.sma_ma?.optional_subjects || 0}
                  </div>
                  <div className="text-sm font-semibold text-purple-800 uppercase tracking-wide">
                    Mata Pelajaran Pilihan
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-center border border-indigo-200">
                  <div className="text-4xl font-bold text-indigo-700 mb-2">
                    {stats.smk_mak?.pilihan_subjects || 0}
                  </div>
                  <div className="text-sm font-semibold text-indigo-800 uppercase tracking-wide">
                    Mata Pelajaran Pilihan (1-18)
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 text-center border border-emerald-200">
                  <div className="text-4xl font-bold text-emerald-700 mb-2">
                    {stats.smk_mak?.produk_kreatif_subjects || 0}
                  </div>
                  <div className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">
                    Produk Kreatif & Kewirausahaan
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Subjects List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          📚 Mata Pelajaran {schoolLevel}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-bold text-lg text-gray-800 leading-tight pr-2">
                  {subject.name}
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getSubjectTypeColor(
                    subject.subject_type
                  )}`}
                >
                  {subject.subject_type}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {subject.description}
              </p>
              {subject.subject_number && (
                <div className="flex items-center justify-between">
                  <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">
                    No. {subject.subject_number}
                  </div>
                  <div className="text-xs text-gray-500">
                    {subject.education_level}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Majors List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          🎓 Rekomendasi Jurusan untuk {schoolLevel}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {majors.map((major) => (
            <div
              key={major.id}
              onClick={() => handleMajorClick(major)}
              className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            >
              <div className="mb-6">
                <h4 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                  {major.major_name}
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {major.description}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs mr-2">
                      WAJIB
                    </span>
                    Mata Pelajaran Wajib:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {major.required_subjects
                      ?.slice(0, 4)
                      .map((subject: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200"
                        >
                          {subject}
                        </span>
                      ))}
                    {major.required_subjects?.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                        +{major.required_subjects.length - 4} lainnya
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-2">
                      DIUTAMAKAN
                    </span>
                    Mata Pelajaran Diutamakan:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {major.preferred_subjects
                      ?.slice(0, 4)
                      .map((subject: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200"
                        >
                          {subject}
                        </span>
                      ))}
                    {major.preferred_subjects?.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                        +{major.preferred_subjects.length - 4} lainnya
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  Klik untuk melihat detail lengkap
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolLevelMajorSelector;
