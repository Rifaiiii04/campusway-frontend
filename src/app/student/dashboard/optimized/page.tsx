"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageTitle from "../../../../components/PageTitle";
import { useMajors, useStudentChoice } from "../../../../hooks/useMajors";
import { studentApiService } from "../../../../services/api";
import StudentSubjectsDisplay from "../../../../components/student/StudentSubjectsDisplay";

interface StudentData {
  id: number;
  name: string;
  nisn: string;
  class?: string;
  kelas?: string;
  email: string;
  phone: string;
  parent_phone?: string;
  school_name?: string;
  has_choice?: boolean;
}

interface AppliedMajor {
  id: number;
  major_name: string;
  rumpun_ilmu: string;
  description: string;
  appliedDate?: string;
}

export default function OptimizedStudentDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedMajors, setAppliedMajors] = useState<AppliedMajor[]>([]);
  const [showMajorDetail, setShowMajorDetail] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<{
    id: number;
    major_name: string;
    rumpun_ilmu?: string;
    description?: string;
    career_prospects?: string;
    required_subjects?: string[];
    preferred_subjects?: string[];
    optional_subjects?: string[];
    kurikulum_merdeka_subjects?: string[];
    kurikulum_2013_ipa_subjects?: string[];
    kurikulum_2013_ips_subjects?: string[];
    kurikulum_2013_bahasa_subjects?: string[];
    subjects?: {
      required?: string[];
      preferred?: string[];
      kurikulum_merdeka?: string[];
      kurikulum_2013_ipa?: string[];
      kurikulum_2013_ips?: string[];
      kurikulum_2013_bahasa?: string[];
    };
  } | null>(null);
  const [loadingMajorDetail, setLoadingMajorDetail] = useState(false);
  const [error, setError] = useState("");
  const [selectedRumpunIlmu, setSelectedRumpunIlmu] = useState("all");
  const [showSubjects, setShowSubjects] = useState(false);

  // Use SWR hooks for data fetching with caching
  const { majors: availableMajors, isLoading: loadingMajors } = useMajors();
  const { mutate: refetchChoice } = useStudentChoice(studentData?.id || null);

  // Memoized filtered majors for better performance
  const filteredMajors = useMemo(() => {
    if (!availableMajors) return [];

    let filtered = availableMajors;

    // Filter by rumpun ilmu
    if (selectedRumpunIlmu !== "all") {
      filtered = filtered.filter(
        (major) => major.rumpun_ilmu === selectedRumpunIlmu
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (major) =>
          major.major_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          major.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [availableMajors, selectedRumpunIlmu, searchQuery]);

  // Get unique rumpun ilmu for filter
  const rumpunIlmuList = useMemo(() => {
    if (!availableMajors) return [];
    const uniqueRumpunIlmu = [
      ...new Set(availableMajors.map((major) => major.rumpun_ilmu)),
    ];
    return uniqueRumpunIlmu.sort();
  }, [availableMajors]);

  const loadAppliedMajors = useCallback(async (studentId: number) => {
    try {
      const response = await studentApiService.getStudentChoice(studentId);
      if (response.success && response.data) {
        const appliedMajor: AppliedMajor = {
          id: response.data.major.id,
          major_name: response.data.major.major_name,
          rumpun_ilmu: response.data.major.rumpun_ilmu || "",
          description: response.data.major.description || "",
          appliedDate: response.data.chosen_at,
        };
        setAppliedMajors([appliedMajor]);
      }
    } catch (error) {
      console.error("Error loading applied majors:", error);
    }
  }, []);

  const checkAuthentication = useCallback(async () => {
    // Guard untuk SSR - hanya jalankan di client
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("student_token");
    const studentDataStr = localStorage.getItem("student_data");

    if (token && studentDataStr) {
      try {
        const parsedStudentData = JSON.parse(studentDataStr);
        setStudentData(parsedStudentData);
        setIsAuthenticated(true);

        // Always try to load applied majors from database, regardless of has_choice
        // This ensures we get the latest data from the database
        await loadAppliedMajors(parsedStudentData.id);
      } catch (error) {
        console.error("Error parsing student data:", error);
        if (typeof window !== "undefined") {
          localStorage.removeItem("student_token");
          localStorage.removeItem("student_data");
        }
        router.push("/student");
      }
    } else {
      router.push("/student");
    }
    setLoading(false);
  }, [router, loadAppliedMajors]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleMajorSelection = async (majorId: number) => {
    if (!studentData) return;

    try {
      setLoading(true);
      const response = await studentApiService.chooseMajor(
        studentData.id,
        majorId
      );

      if (response.success) {
        // Update local state
        const selectedMajor = availableMajors.find((m) => m.id === majorId);
        if (selectedMajor) {
          const appliedMajor: AppliedMajor = {
            id: selectedMajor.id,
            major_name: selectedMajor.major_name,
            rumpun_ilmu: selectedMajor.rumpun_ilmu || "",
            description: selectedMajor.description || "",
            appliedDate: new Date().toISOString(),
          };
          setAppliedMajors([appliedMajor]);
        }

        // Always define updatedStudentData before use
        const updatedStudentData = { ...studentData, has_choice: true };

        // Update has_choice in localStorage to reflect the change
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "student_data",
            JSON.stringify(updatedStudentData)
          );
        }
        setStudentData(updatedStudentData);

        // Refetch student choice data
        refetchChoice();
      } else {
        setError(response.message || "Gagal menyimpan pilihan jurusan");
      }
    } catch (error) {
      console.error("Error selecting major:", error);
      setError("Terjadi kesalahan saat menyimpan pilihan jurusan");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMajorDetail = async (major: {
    id: number;
    major_name: string;
    category?: string;
    description?: string;
  }) => {
    setLoadingMajorDetail(true);
    try {
      // Load detailed major information including subjects
      const response = await studentApiService.getMajorDetails(major.id);
      if (response.success) {
        // Normalize all subject fields: convert string to array if needed
        const normalizeSubjects = (subjects: string | string[] | null | undefined): string[] | undefined => {
          if (!subjects) return undefined;
          if (Array.isArray(subjects)) return subjects;
          if (typeof subjects === 'string' && subjects.trim().length > 0) {
            // Try parsing as JSON first, then fallback to comma-separated
            try {
              const parsed = JSON.parse(subjects);
              return Array.isArray(parsed) ? parsed : [subjects];
            } catch {
              // If not JSON, treat as comma-separated string
              const parts = subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
              return parts.length > 0 ? parts : [subjects];
            }
          }
          return undefined;
        };

        const normalizedData = {
          ...response.data,
          required_subjects: normalizeSubjects(response.data.required_subjects),
          preferred_subjects: normalizeSubjects(response.data.preferred_subjects),
          optional_subjects: normalizeSubjects(response.data.optional_subjects),
          kurikulum_merdeka_subjects: normalizeSubjects(response.data.kurikulum_merdeka_subjects),
          kurikulum_2013_ipa_subjects: normalizeSubjects(response.data.kurikulum_2013_ipa_subjects),
          kurikulum_2013_ips_subjects: normalizeSubjects(response.data.kurikulum_2013_ips_subjects),
          kurikulum_2013_bahasa_subjects: normalizeSubjects(response.data.kurikulum_2013_bahasa_subjects),
        };
        setSelectedMajor(normalizedData);
        setShowMajorDetail(true);
      } else {
        setError("Gagal memuat detail jurusan");
      }
    } catch (error) {
      console.error("Error loading major details:", error);
      setError("Gagal memuat detail jurusan");
    } finally {
      setLoadingMajorDetail(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // Clear all localStorage
      localStorage.clear();
      
      // Clear all sessionStorage
      sessionStorage.clear();
      
      // Clear any cookies that might contain sensitive data
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Clear client cache if available
      try {
        const { clientCache } = require("@/utils/cache");
        if (clientCache && typeof clientCache.clear === 'function') {
          clientCache.clear();
        }
      } catch (e) {
        // Cache utility might not be available, ignore
      }
    }
    router.push("/student");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h2>
          <p className="text-gray-600">Silakan login terlebih dahulu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title="Dashboard Siswa" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Selamat datang, {studentData.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Kelas: {studentData.kelas || studentData.class} | NISN:{" "}
                {studentData.nisn}
              </p>
              {studentData.school_name && (
                <p className="text-gray-500 text-sm mt-1">
                  Sekolah: {studentData.school_name}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Applied Majors Section */}
        {appliedMajors.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Jurusan yang Dipilih
            </h2>
            <div className="grid gap-4">
              {appliedMajors.map((major) => (
                <div
                  key={major.id}
                  className="border border-green-200 rounded-lg p-4 bg-green-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">
                        {major.major_name}
                      </h3>
                      <p className="text-green-600 text-sm">
                        {major.rumpun_ilmu}
                      </p>
                      {major.appliedDate && (
                        <p className="text-green-500 text-xs mt-1">
                          Dipilih pada:{" "}
                          {new Date(major.appliedDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowSubjects(true)}
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Lihat Mata Uji
                      </button>
                      <div className="text-green-600">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Majors Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              Pilih Jurusan
            </h2>

            {/* Rumpun Ilmu Filter */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedRumpunIlmu}
                onChange={(e) => setSelectedRumpunIlmu(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Semua Rumpun Ilmu</option>
                {rumpunIlmuList.map((rumpunIlmu) => (
                  <option key={rumpunIlmu} value={rumpunIlmu}>
                    {rumpunIlmu}
                  </option>
                ))}
              </select>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Cari jurusan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Majors Grid */}
          {loadingMajors ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading majors...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMajors.map((major) => (
                <div
                  key={major.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {major.major_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {major.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {major.rumpun_ilmu}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewMajorDetail(major)}
                        disabled={loadingMajorDetail}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        {loadingMajorDetail ? "Loading..." : "Detail"}
                      </button>
                      {appliedMajors.length === 0 && (
                        <button
                          onClick={() => handleMajorSelection(major.id)}
                          disabled={loading}
                          className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                        >
                          Pilih
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredMajors.length === 0 && !loadingMajors && (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada jurusan yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Major Detail Modal */}
      {showMajorDetail && selectedMajor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedMajor.major_name}
                </h3>
                <button
                  onClick={() => setShowMajorDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Rumpun Ilmu</h4>
                  <p className="text-gray-600">
                    {selectedMajor.rumpun_ilmu || "Tidak tersedia"}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Deskripsi</h4>
                  <p className="text-gray-600">
                    {selectedMajor.description || "Tidak tersedia"}
                  </p>
                </div>

                {selectedMajor.career_prospects && (
                  <div>
                    <h4 className="font-medium text-gray-900">Prospek Karir</h4>
                    <p className="text-gray-600">
                      {selectedMajor.career_prospects}
                    </p>
                  </div>
                )}

                {/* Subjects Section */}
                {(selectedMajor.subjects || selectedMajor.required_subjects || selectedMajor.preferred_subjects || 
                  selectedMajor.kurikulum_merdeka_subjects || selectedMajor.kurikulum_2013_ipa_subjects ||
                  selectedMajor.kurikulum_2013_ips_subjects || selectedMajor.kurikulum_2013_bahasa_subjects) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Mata Pelajaran yang Perlu Dipelajari</h4>
                    
                    {/* Required and Preferred Subjects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {((selectedMajor.subjects?.required && selectedMajor.subjects.required.length > 0) ||
                        (selectedMajor.required_subjects && Array.isArray(selectedMajor.required_subjects) && selectedMajor.required_subjects.length > 0)) && (
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <h5 className="font-semibold text-red-900 mb-2 text-sm">Mata Pelajaran Wajib</h5>
                          <ul className="space-y-1">
                            {(() => {
                              const subjects = selectedMajor.subjects?.required || selectedMajor.required_subjects;
                              const subjectsArray = Array.isArray(subjects) ? subjects : [];
                              return subjectsArray.map((subject, index) => (
                                <li key={index} className="text-red-800 text-xs flex items-center">
                                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                  {subject}
                                </li>
                              ));
                            })()}
                          </ul>
                        </div>
                      )}

                      {((selectedMajor.subjects?.preferred && selectedMajor.subjects.preferred.length > 0) ||
                        (selectedMajor.preferred_subjects && Array.isArray(selectedMajor.preferred_subjects) && selectedMajor.preferred_subjects.length > 0) ||
                        (selectedMajor.optional_subjects && Array.isArray(selectedMajor.optional_subjects) && selectedMajor.optional_subjects.length > 0)) && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h5 className="font-semibold text-green-900 mb-2 text-sm">Mata Pelajaran Pilihan</h5>
                          <ul className="space-y-1">
                            {(() => {
                              const subjects = selectedMajor.subjects?.preferred || selectedMajor.preferred_subjects || selectedMajor.optional_subjects;
                              let subjectsArray: string[] = [];
                              if (Array.isArray(subjects)) {
                                subjectsArray = subjects;
                              } else if (typeof subjects === 'string') {
                                subjectsArray = [subjects];
                              }
                              return subjectsArray.map((subject, index) => (
                                <li key={index} className="text-green-800 text-xs flex items-center">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                  {subject}
                                </li>
                              ));
                            })()}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Curriculum-based Subjects */}
                    {(selectedMajor.subjects?.kurikulum_merdeka || selectedMajor.kurikulum_merdeka_subjects ||
                      selectedMajor.subjects?.kurikulum_2013_ipa || selectedMajor.kurikulum_2013_ipa_subjects ||
                      selectedMajor.subjects?.kurikulum_2013_ips || selectedMajor.kurikulum_2013_ips_subjects ||
                      selectedMajor.subjects?.kurikulum_2013_bahasa || selectedMajor.kurikulum_2013_bahasa_subjects) && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-800 mb-3 text-sm">Berdasarkan Kurikulum</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(() => {
                            const subjects = selectedMajor.subjects?.kurikulum_merdeka || selectedMajor.kurikulum_merdeka_subjects;
                            const subjectsArray = Array.isArray(subjects) ? subjects : (typeof subjects === 'string' ? [subjects] : []);
                            return subjectsArray.length > 0;
                          })() && (
                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                              <h6 className="font-semibold text-black mb-1 text-xs">Kurikulum Merdeka</h6>
                              <ul className="space-y-1">
                                {(() => {
                                  const subjects = selectedMajor.subjects?.kurikulum_merdeka || selectedMajor.kurikulum_merdeka_subjects;
                                  const subjectsArray = Array.isArray(subjects) ? subjects : [];
                                  return subjectsArray.map((subject, index) => (
                                    <li key={index} className="text-black text-xs">{subject}</li>
                                  ));
                                })()}
                              </ul>
                            </div>
                          )}
                          {(() => {
                            const subjects = selectedMajor.subjects?.kurikulum_2013_ipa || selectedMajor.kurikulum_2013_ipa_subjects;
                            const subjectsArray = Array.isArray(subjects) ? subjects : (typeof subjects === 'string' ? [subjects] : []);
                            return subjectsArray.length > 0;
                          })() && (
                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                              <h6 className="font-semibold text-black mb-1 text-xs">Kurikulum 2013 - IPA</h6>
                              <ul className="space-y-1">
                                {(() => {
                                  const subjects = selectedMajor.subjects?.kurikulum_2013_ipa || selectedMajor.kurikulum_2013_ipa_subjects;
                                  const subjectsArray = Array.isArray(subjects) ? subjects : [];
                                  return subjectsArray.map((subject, index) => (
                                    <li key={index} className="text-black text-xs">{subject}</li>
                                  ));
                                })()}
                              </ul>
                            </div>
                          )}
                          {(() => {
                            const subjects = selectedMajor.subjects?.kurikulum_2013_ips || selectedMajor.kurikulum_2013_ips_subjects;
                            const subjectsArray = Array.isArray(subjects) ? subjects : (typeof subjects === 'string' ? [subjects] : []);
                            return subjectsArray.length > 0;
                          })() && (
                            <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                              <h6 className="font-semibold text-black mb-1 text-xs">Kurikulum 2013 - IPS</h6>
                              <ul className="space-y-1">
                                {(() => {
                                  const subjects = selectedMajor.subjects?.kurikulum_2013_ips || selectedMajor.kurikulum_2013_ips_subjects;
                                  const subjectsArray = Array.isArray(subjects) ? subjects : [];
                                  return subjectsArray.map((subject, index) => (
                                    <li key={index} className="text-black text-xs">{subject}</li>
                                  ));
                                })()}
                              </ul>
                            </div>
                          )}
                          {(() => {
                            const subjects = selectedMajor.subjects?.kurikulum_2013_bahasa || selectedMajor.kurikulum_2013_bahasa_subjects;
                            const subjectsArray = Array.isArray(subjects) ? subjects : (typeof subjects === 'string' ? [subjects] : []);
                            return subjectsArray.length > 0;
                          })() && (
                            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                              <h6 className="font-semibold text-black mb-1 text-xs">Kurikulum 2013 - Bahasa</h6>
                              <ul className="space-y-1">
                                {(() => {
                                  const subjects = selectedMajor.subjects?.kurikulum_2013_bahasa || selectedMajor.kurikulum_2013_bahasa_subjects;
                                  const subjectsArray = Array.isArray(subjects) ? subjects : [];
                                  return subjectsArray.map((subject, index) => (
                                    <li key={index} className="text-black text-xs">{subject}</li>
                                  ));
                                })()}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowMajorDetail(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Tutup
                </button>
                {appliedMajors.length === 0 && (
                  <button
                    onClick={() => {
                      handleMajorSelection(selectedMajor.id);
                      setShowMajorDetail(false);
                    }}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Pilih Jurusan Ini
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Subjects Modal */}
      {showSubjects && studentData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <StudentSubjectsDisplay
              studentId={studentData.id}
              onClose={() => setShowSubjects(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
