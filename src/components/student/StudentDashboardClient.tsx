"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { studentApiService, Major } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner, SkeletonLoader } from "@/components/ui/LoadingSpinner";
import { usePerformance } from "@/components/providers/PerformanceProvider";

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
  category: string;
  description: string;
  appliedDate?: string;
}

export default function StudentDashboardClient() {
  const router = useRouter();
  const { startTiming } = usePerformance();
  const hasInitialized = useRef(false);

  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedMajors, setAppliedMajors] = useState<AppliedMajor[]>([]);
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMajorDetail, setShowMajorDetail] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [settingsData, setSettingsData] = useState({
    email: "",
    phone: "",
    parent_phone: "",
  });

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // API hooks with caching
  const {
    data: availableMajors,
    loading: loadingMajors,
    error: majorsError,
    execute: loadMajors,
  } = useApi(() => studentApiService.getMajors(), {
    onError: (error) => {
      console.error("Error loading majors:", error);
      setError(error.message);
    },
  });

  const {
    data: majorDetails,
    loading: loadingMajorDetail,
    execute: loadMajorDetails,
  } = useApi((majorId: number) => studentApiService.getMajorDetails(majorId));

  // Memoized filtered majors
  const filteredMajors = useMemo(() => {
    if (!availableMajors?.data) return [];

    let filtered = availableMajors.data;

    // Filter by search query
    if (debouncedSearchQuery.trim() !== "") {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (major) =>
          major.major_name.toLowerCase().includes(query) ||
          major.description?.toLowerCase().includes(query) ||
          major.category?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (major) =>
          major.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return filtered;
  }, [availableMajors?.data, debouncedSearchQuery, selectedCategory]);

  // Authentication check
  const checkAuthentication = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const endTiming = startTiming("authentication_check");

    try {
      const token = localStorage.getItem("student_token");
      const storedStudentData = localStorage.getItem("student_data");

      if (token && storedStudentData) {
        const parsedData = JSON.parse(storedStudentData);
        setStudentData(parsedData);
        setIsAuthenticated(true);

        // Load data in parallel
        await Promise.all([loadMajors(), loadMajorStatus(parsedData)]);
      } else {
        router.push("/student");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      localStorage.removeItem("student_token");
      localStorage.removeItem("student_data");
      router.push("/student");
    } finally {
      setLoading(false);
      endTiming();
    }
  }, [router, loadMajors, startTiming]);

  // Load major status
  const loadMajorStatus = useCallback(async (studentData: StudentData) => {
    if (!studentData?.id) return;

    try {
      const response = await studentApiService.checkMajorStatus(studentData.id);

      if (
        response.success &&
        response.data.has_choice &&
        response.data.selected_major_id
      ) {
        setSelectedMajorId(response.data.selected_major_id);
        await loadStudentChoice(studentData);
      } else {
        setAppliedMajors([]);
        setSelectedMajorId(null);
      }
    } catch (error) {
      console.error("Error loading major status:", error);
      setAppliedMajors([]);
      setSelectedMajorId(null);
    }
  }, []);

  // Load student choice
  const loadStudentChoice = useCallback(async (studentData: StudentData) => {
    if (!studentData?.id) return;

    try {
      const response = await studentApiService.getStudentChoice(studentData.id);

      if (response.success && response.data) {
        const appliedMajor = {
          id: response.data.major.id,
          major_name: response.data.major.major_name,
          category: response.data.major.category || "Saintek",
          description: response.data.major.description || "",
          appliedDate: new Date(response.data.chosen_at).toLocaleDateString(
            "id-ID"
          ),
        };
        setAppliedMajors([appliedMajor]);
        setSelectedMajorId(response.data.major.id);
      }
    } catch (error) {
      console.error("Error loading student choice:", error);
    }
  }, []);

  // Check if major is selected
  const isMajorSelected = useCallback(
    (majorId: number) => {
      return (
        selectedMajorId === majorId ||
        appliedMajors.some((major) => major.id === majorId)
      );
    },
    [selectedMajorId, appliedMajors]
  );

  // Handle major application
  const handleApplyMajor = useCallback(
    async (major: Major) => {
      if (!studentData?.id) {
        showSuccessNotification(
          "Data siswa tidak ditemukan. Silakan login ulang."
        );
        return;
      }

      try {
        const endTiming = startTiming("apply_major");

        if (appliedMajors.length > 0) {
          await handleChangeMajor(major);
        } else {
          const response = await studentApiService.chooseMajor(
            studentData.id,
            major.id
          );

          if (response.success) {
            const appliedMajor = {
              id: major.id,
              major_name: major.major_name,
              category: major.category || "Saintek",
              description: major.description || "",
              appliedDate: new Date().toLocaleDateString("id-ID"),
            };
            setAppliedMajors([appliedMajor]);
            setSelectedMajorId(major.id);
            showSuccessNotification(
              `Berhasil memilih jurusan ${major.major_name}!`
            );
          }
        }

        endTiming();
      } catch (error: any) {
        if (error.message.includes("sudah memilih jurusan sebelumnya")) {
          await handleChangeMajor(major);
        } else {
          showSuccessNotification(error.message || "Gagal memilih jurusan");
        }
      }
    },
    [studentData, appliedMajors, startTiming]
  );

  // Handle major change
  const handleChangeMajor = useCallback(
    async (newMajor: Major) => {
      if (!studentData?.id) return;

      try {
        const endTiming = startTiming("change_major");

        const response = await studentApiService.changeMajor(
          studentData.id,
          newMajor.id
        );

        if (response.success) {
          const appliedMajor = {
            id: newMajor.id,
            major_name: newMajor.major_name,
            category: newMajor.category || "Saintek",
            description: newMajor.description || "",
            appliedDate: new Date().toLocaleDateString("id-ID"),
          };
          setAppliedMajors([appliedMajor]);
          setSelectedMajorId(newMajor.id);
          showSuccessNotification(
            `Berhasil mengubah pilihan jurusan ke ${newMajor.major_name}!`
          );
        }

        endTiming();
      } catch (error: any) {
        showSuccessNotification(
          error.message || "Gagal mengubah pilihan jurusan"
        );
      }
    },
    [studentData, startTiming]
  );

  // Handle major detail
  const handleShowMajorDetail = useCallback(
    async (major: Major) => {
      try {
        const response = await loadMajorDetails(major.id);
        if (response) {
          setSelectedMajor(response.data);
          setShowMajorDetail(true);
        }
      } catch (error) {
        setError("Gagal memuat detail jurusan");
      }
    },
    [loadMajorDetails]
  );

  // Show success notification
  const showSuccessNotification = useCallback((message: string) => {
    setSuccessMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_data");
    router.push("/student");
  }, [router]);

  // Initialize on mount
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Memuat Dashboard...
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Menyiapkan semuanya untuk Anda! ✨
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Portal Jurusan
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Temukan jurusan impianmu
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium text-sm sm:text-base">
                  Settings
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium text-sm sm:text-base">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Halo, {studentData?.name}!
              </h2>
              <div className="space-y-1">
                <p className="text-gray-600 text-base sm:text-lg">
                  <span className="font-medium">NISN:</span> {studentData?.nisn}
                </p>
                <p className="text-gray-600 text-base sm:text-lg">
                  <span className="font-medium">Kelas:</span>{" "}
                  {studentData?.class ||
                    studentData?.kelas ||
                    "Belum ditentukan"}
                </p>
                {studentData?.school_name && (
                  <p className="text-gray-600 text-base sm:text-lg">
                    <span className="font-medium">Sekolah:</span>{" "}
                    {studentData.school_name}
                  </p>
                )}
              </div>
              <p className="text-gray-500 text-sm sm:text-base mt-2">
                Mari temukan jurusan yang sesuai dengan minat dan bakatmu
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-white/20">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Cari Jurusan Impianmu
            </h3>
            <p className="text-gray-600 text-base sm:text-lg">
              Temukan jurusan yang sesuai dengan minat dan bakatmu
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan nama jurusan, deskripsi, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl leading-5 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-gray-900 text-base sm:text-lg transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
            {["all", "Saintek", "Soshum", "Campuran"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-600 hover:bg-white/70 hover:scale-105"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 mb-4 sm:mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-600 font-medium text-sm sm:text-base">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loadingMajors && (
            <div className="text-center py-8 sm:py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">
                Memuat data jurusan...
              </p>
            </div>
          )}

          {/* Search Results */}
          {!loadingMajors && filteredMajors.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Daftar Jurusan ({filteredMajors.length} jurusan ditemukan)
              </h4>
              <div className="grid gap-4">
                {filteredMajors.map((major) => (
                  <div
                    key={major.id}
                    className="bg-white/60 backdrop-blur-sm border-2 border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 hover:border-purple-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h5 className="text-lg sm:text-xl font-bold text-gray-900">
                            {major.major_name}
                          </h5>
                          <span
                            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold w-fit ${
                              major.category === "Saintek"
                                ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200"
                                : major.category === "Soshum"
                                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                                : "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border border-orange-200"
                            }`}
                          >
                            {major.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {major.description}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-3 lg:ml-6">
                        {/* Show selection status indicator */}
                        {isMajorSelected(major.id) ? (
                          <div className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-800">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="font-bold text-sm sm:text-base">
                              Jurusan Dipilih
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApplyMajor(major)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            <span className="font-bold text-sm sm:text-base">
                              Pilih Jurusan
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => handleShowMajorDetail(major)}
                          disabled={loadingMajorDetail}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span className="font-bold text-sm sm:text-base">
                            {loadingMajorDetail ? "Loading..." : "Lihat Detail"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loadingMajors &&
            filteredMajors.length === 0 &&
            availableMajors?.data &&
            availableMajors.data.length > 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
                  Tidak ada jurusan yang ditemukan
                </h4>
                <p className="text-gray-500 text-sm sm:text-base">
                  Coba ubah kata kunci pencarian atau filter kategori
                </p>
              </div>
            )}
        </div>

        {/* Applied Majors */}
        {appliedMajors.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🎯</span>
              Jurusan Pilihanmu
            </h3>
            <div className="space-y-4">
              {appliedMajors.map((major) => (
                <div
                  key={major.id}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h5 className="text-xl font-bold text-gray-900 mr-4">
                          {major.major_name}
                        </h5>
                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-bold ${
                            major.category === "Saintek"
                              ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200"
                              : major.category === "Soshum"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                              : "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border border-orange-200"
                          }`}
                        >
                          {major.category === "Saintek"
                            ? "🔬"
                            : major.category === "Soshum"
                            ? "📚"
                            : "🎨"}{" "}
                          {major.category}
                        </span>
                        <span className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 ml-2">
                          ✅ Terpilih
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{major.description}</p>
                      <p className="text-sm text-gray-500">
                        📅 Tanggal Pilih: {major.appliedDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Animation */}
        {showSuccessAnimation && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-bounce">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Berhasil!
                </h3>
                <p className="text-gray-600">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
