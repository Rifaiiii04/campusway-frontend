"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageTitle from "../../../components/PageTitle";
import { studentApiService, Major } from "../../../services/api";

interface StudentData {
  id: number;
  name: string;
  nisn: string;
  class?: string;
  kelas?: string; // Alternative field name
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

export default function StudentDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedMajors, setAppliedMajors] = useState<AppliedMajor[]>([]);
  const [availableMajors, setAvailableMajors] = useState<Major[]>([]);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMajorDetail, setShowMajorDetail] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [loadingMajors, setLoadingMajors] = useState(false);
  const [loadingMajorDetail, setLoadingMajorDetail] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [settingsData, setSettingsData] = useState({
    email: "",
    phone: "",
    parent_phone: "",
  });

  // Load majors from API
  const loadMajors = async () => {
    try {
      setLoadingMajors(true);
      setError("");
      const response = await studentApiService.getMajors();
      if (response.success) {
        setAvailableMajors(response.data);
        setFilteredMajors(response.data);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat data jurusan";
      console.error("❌ Error loading majors:", err);

      // Show user-friendly error message
      if (errorMessage.includes("Server tidak dapat diakses")) {
        setError(
          "⚠️ Server backend tidak berjalan. Silakan jalankan server Laravel di http://127.0.0.1:8000"
        );
        showSuccessNotification(
          "⚠️ Server backend tidak berjalan. Silakan jalankan server Laravel di http://127.0.0.1:8000"
        );

        // Set fallback data for demo purposes
        const fallbackMajors = [
          {
            id: 1,
            major_name: "Teknik Informatika",
            description:
              "Jurusan yang mempelajari teknologi informasi dan pemrograman komputer.",
            category: "Saintek",
            required_subjects: "Matematika, Fisika, Bahasa Inggris",
            preferred_subjects: "Pemrograman, Logika, Algoritma",
            career_prospects:
              "Software Developer, System Analyst, Database Administrator",
            kurikulum_merdeka_subjects:
              "Matematika, Fisika, Bahasa Inggris, Pemrograman Dasar",
            kurikulum_2013_ipa_subjects:
              "Matematika, Fisika, Kimia, Bahasa Inggris",
            kurikulum_2013_ips_subjects:
              "Matematika, Ekonomi, Sosiologi, Bahasa Inggris",
            kurikulum_2013_bahasa_subjects:
              "Matematika, Bahasa Indonesia, Bahasa Inggris, Sastra",
            is_active: true,
          },
          {
            id: 2,
            major_name: "Manajemen",
            description:
              "Jurusan yang mempelajari pengelolaan organisasi dan bisnis.",
            category: "Soshum",
            required_subjects: "Matematika, Bahasa Indonesia, Bahasa Inggris",
            preferred_subjects: "Ekonomi, Akuntansi, Manajemen",
            career_prospects: "Manager, Business Analyst, Entrepreneur",
            kurikulum_merdeka_subjects:
              "Matematika, Bahasa Indonesia, Bahasa Inggris, Ekonomi",
            kurikulum_2013_ipa_subjects:
              "Matematika, Ekonomi, Geografi, Bahasa Inggris",
            kurikulum_2013_ips_subjects:
              "Matematika, Ekonomi, Sosiologi, Bahasa Inggris",
            kurikulum_2013_bahasa_subjects:
              "Matematika, Bahasa Indonesia, Bahasa Inggris, Sastra",
            is_active: true,
          },
        ];
        setAvailableMajors(fallbackMajors);
        setFilteredMajors(fallbackMajors);
      } else {
        setError(errorMessage);
        showSuccessNotification(`❌ ${errorMessage}`);
      }
    } finally {
      setLoadingMajors(false);
    }
  };

  // Load student's major status with data parameter
  const loadMajorStatusWithData = async (studentData: StudentData) => {
    if (!studentData?.id) {
      console.log("❌ No student data available for loading major status");
      return;
    }

    try {
      console.log("🔄 Loading major status for student ID:", studentData.id);
      console.log(
        "🌐 API URL:",
        `http://127.0.0.1:8000/api/web/major-status/${studentData.id}`
      );

      const response = await studentApiService.checkMajorStatus(studentData.id);
      console.log("📊 Major status response:", response);

      if (
        response.success &&
        response.data.has_choice &&
        response.data.selected_major_id
      ) {
        console.log(
          "✅ Student has chosen major ID:",
          response.data.selected_major_id
        );
        setSelectedMajorId(response.data.selected_major_id);

        // Load full major details for display
        await loadStudentChoiceWithData(studentData);
      } else {
        console.log("ℹ️ Student has not chosen any major");
        console.log("📊 Response data:", response.data);
        setAppliedMajors([]);
        setSelectedMajorId(null);
      }
    } catch (err: unknown) {
      console.error("❌ Error loading major status:", err);
      console.log("⚠️ Server backend tidak berjalan, clearing applied majors");
      setAppliedMajors([]);
      setSelectedMajorId(null);
    }
  };

  // Load student's major status (using state)
  const loadMajorStatus = async () => {
    if (!studentData?.id) {
      console.log("❌ No student data available for loading major status");
      return;
    }
    await loadMajorStatusWithData(studentData);
  };

  // Load student's chosen major details with data parameter
  const loadStudentChoiceWithData = async (studentData: StudentData) => {
    if (!studentData?.id) {
      console.log("❌ No student data available for loading choice");
      return;
    }

    try {
      console.log(
        "🔄 Loading student choice details for student ID:",
        studentData.id
      );
      const response = await studentApiService.getStudentChoice(studentData.id);
      console.log("📊 Student choice response:", response);

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
        console.log("✅ Setting applied major:", appliedMajor);
        setAppliedMajors([appliedMajor]);
        setSelectedMajorId(response.data.major.id);
      } else {
        console.log("ℹ️ No student choice found, clearing applied majors");
        setAppliedMajors([]);
        setSelectedMajorId(null);
      }
    } catch (err: unknown) {
      console.error("❌ Error loading student choice:", err);
      console.log("⚠️ Server backend tidak berjalan, clearing applied majors");
      setAppliedMajors([]);
      setSelectedMajorId(null);
    }
  };

  // Filter majors based on search query and category
  useEffect(() => {
    let filtered = availableMajors;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (major) =>
          major.major_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          major.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          major.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (major) =>
          major.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredMajors(filtered);
  }, [searchQuery, selectedCategory, availableMajors]);

  useEffect(() => {
    checkAuthentication();
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthentication = async () => {
    const token = localStorage.getItem("student_token");
    const storedStudentData = localStorage.getItem("student_data");

    if (token && storedStudentData) {
      try {
        const parsedData = JSON.parse(storedStudentData);
        console.log("📊 Student data from localStorage:", parsedData);
        setStudentData(parsedData);
        setIsAuthenticated(true);
        await loadMajors();
        // Load major status with the parsed data directly
        await loadMajorStatusWithData(parsedData);
      } catch (error) {
        console.error("Error parsing student data:", error);
        localStorage.removeItem("student_token");
        localStorage.removeItem("student_data");
        router.push("/student");
      }
    } else {
      router.push("/student");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_data");
    router.push("/student");
  };

  // Helper function to check if a major is already selected
  const isMajorSelected = (majorId: number) => {
    console.log("🔍 isMajorSelected called for major ID:", majorId);
    console.log("📊 Current selectedMajorId:", selectedMajorId);
    console.log("📊 Current appliedMajors:", appliedMajors);

    // Check from database state first
    if (selectedMajorId !== null) {
      const isSelected = selectedMajorId === majorId;
      console.log("✅ Using selectedMajorId check:", isSelected);
      return isSelected;
    }
    // Fallback to appliedMajors array
    const isSelected = appliedMajors.some(
      (appliedMajor) => appliedMajor.id === majorId
    );
    console.log("✅ Using appliedMajors fallback:", isSelected);
    return isSelected;
  };

  const handleApplyMajor = async (major: Major) => {
    try {
      console.log("🎯 handleApplyMajor called for major:", major.major_name);
      console.log("📊 Current appliedMajors:", appliedMajors);

      if (!studentData?.id) {
        showSuccessNotification(
          "Data siswa tidak ditemukan. Silakan login ulang."
        );
        return;
      }

      // Jika siswa sudah memilih jurusan, gunakan changeMajor
      if (appliedMajors.length > 0) {
        console.log(
          "🔄 Student already has choice, redirecting to changeMajor"
        );
        await handleChangeMajor(major);
        return;
      }

      console.log("🆕 First time selection, calling chooseMajor API");
      // Call API to choose major
      const response = await studentApiService.chooseMajor(
        studentData.id,
        major.id
      );

      console.log("📊 chooseMajor response:", response);
      if (response.success) {
        const appliedMajor = {
          id: major.id,
          major_name: major.major_name,
          category: major.category || "Saintek",
          description: major.description || "",
          appliedDate: new Date().toLocaleDateString("id-ID"),
        };
        console.log("✅ Setting applied major:", appliedMajor);
        setAppliedMajors([appliedMajor]);
        setSelectedMajorId(major.id);
        showSuccessNotification(
          `Berhasil memilih jurusan ${major.major_name}!`
        );
        // Reload major status to ensure consistency
        await loadMajorStatus();
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memilih jurusan";
      console.log("❌ Error in handleApplyMajor:", errorMessage);

      // Jika error karena sudah memilih jurusan, gunakan changeMajor
      if (errorMessage.includes("sudah memilih jurusan sebelumnya")) {
        console.log(
          "🔄 Error indicates student already has choice, redirecting to changeMajor"
        );
        await handleChangeMajor(major);
        return;
      }

      showSuccessNotification(errorMessage);
      console.error("Error applying major:", err);
    }
  };

  const handleChangeMajor = async (newMajor: Major) => {
    try {
      console.log(
        "🔄 handleChangeMajor called for major:",
        newMajor.major_name
      );
      console.log("📊 Current appliedMajors:", appliedMajors);

      if (!studentData?.id) {
        showSuccessNotification(
          "Data siswa tidak ditemukan. Silakan login ulang."
        );
        return;
      }

      console.log("🔄 Calling changeMajor API");
      // Call API to change major
      const response = await studentApiService.changeMajor(
        studentData.id,
        newMajor.id
      );

      console.log("📊 changeMajor response:", response);
      if (response.success) {
        const appliedMajor = {
          id: newMajor.id,
          major_name: newMajor.major_name,
          category: newMajor.category || "Saintek",
          description: newMajor.description || "",
          appliedDate: new Date().toLocaleDateString("id-ID"),
        };
        console.log("✅ Setting new applied major:", appliedMajor);
        setAppliedMajors([appliedMajor]);
        setSelectedMajorId(newMajor.id);
        showSuccessNotification(
          `Berhasil mengubah pilihan jurusan ke ${newMajor.major_name}!`
        );
        // Reload major status to ensure consistency
        await loadMajorStatus();
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengubah pilihan jurusan";
      console.log("❌ Error in handleChangeMajor:", errorMessage);
      showSuccessNotification(errorMessage);
      console.error("Error changing major:", err);
    }
  };

  const handleSettingsChange = (field: string, value: string) => {
    setSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenSettings = () => {
    setSettingsData({
      email: studentData?.email || "",
      phone: studentData?.phone || "",
      parent_phone: studentData?.parent_phone || "",
    });
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    // Update student data with new settings
    if (studentData) {
      setStudentData({
        ...studentData,
        email: settingsData.email,
        phone: settingsData.phone,
        parent_phone: settingsData.parent_phone,
      });
    }
    setShowSettings(false);
  };

  const handleShowMajorDetail = async (major: Major) => {
    try {
      setLoadingMajorDetail(true);
      setError("");

      // Get detailed information about the major
      const response = await studentApiService.getMajorDetails(major.id);
      if (response.success) {
        setSelectedMajor(response.data);
        setShowMajorDetail(true);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat detail jurusan"
      );
      console.error("Error loading major details:", err);
    } finally {
      setLoadingMajorDetail(false);
    }
  };

  const handleCloseMajorDetail = () => {
    setShowMajorDetail(false);
    setSelectedMajor(null);
  };

  const showSuccessNotification = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="text-center">
          {/* Modern Loading Animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            {/* Animated Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin"></div>
            {/* Inner Dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              Memuat Dashboard...
            </h2>
            <p className="text-gray-600 text-lg">
              Menyiapkan semuanya untuk Anda! ✨
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <>
      <PageTitle
        title="Dashboard Siswa - Portal Jurusan"
        description="Portal siswa untuk mencari dan mendaftar jurusan yang diminati"
      />
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
                  onClick={handleOpenSettings}
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
                  <span className="font-medium text-sm sm:text-base">
                    Logout
                  </span>
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
                    <span className="font-medium">NISN:</span>{" "}
                    {studentData?.nisn}
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
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-600 hover:bg-white/70 hover:scale-105"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedCategory("Saintek")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  selectedCategory === "Saintek"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-600 hover:bg-white/70 hover:scale-105"
                }`}
              >
                Saintek
              </button>
              <button
                onClick={() => setSelectedCategory("Soshum")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  selectedCategory === "Soshum"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-600 hover:bg-white/70 hover:scale-105"
                }`}
              >
                Soshum
              </button>
              <button
                onClick={() => setSelectedCategory("Campuran")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  selectedCategory === "Campuran"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                    : "bg-white/50 text-gray-600 hover:bg-white/70 hover:scale-105"
                }`}
              >
                Campuran
              </button>
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
                <div className="relative inline-block">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600"
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
                </div>
                <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">
                  Memuat data jurusan...
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Mohon tunggu sebentar
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
                              {loadingMajorDetail
                                ? "Loading..."
                                : "Lihat Detail"}
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
              availableMajors.length > 0 && (
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
                        <p className="text-gray-600 mb-2">
                          {major.description}
                        </p>
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

          {/* Major Detail Modal */}
          {showMajorDetail && selectedMajor && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="text-3xl mr-3">📚</span>
                    Detail Jurusan
                  </h3>
                  <button
                    onClick={handleCloseMajorDetail}
                    className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>

                {/* Major Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <h4 className="text-2xl font-bold text-gray-900 mr-4">
                      {selectedMajor.major_name}
                    </h4>
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        selectedMajor.category === "Saintek"
                          ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200"
                          : selectedMajor.category === "Soshum"
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                          : "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border border-orange-200"
                      }`}
                    >
                      {selectedMajor.category === "Saintek"
                        ? "🔬"
                        : selectedMajor.category === "Soshum"
                        ? "📚"
                        : "🎨"}{" "}
                      {selectedMajor.category}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {selectedMajor.description}
                  </p>
                </div>

                {/* Career Prospects */}
                {selectedMajor.career_prospects && (
                  <div className="mb-6">
                    <h5 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-2xl mr-2">🚀</span>
                      Prospek Karir
                    </h5>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedMajor.career_prospects}
                      </p>
                    </div>
                  </div>
                )}

                {/* Subjects Information */}
                {selectedMajor.subjects && (
                  <div className="mb-6">
                    <h5 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-2xl mr-2">📖</span>
                      Mata Pelajaran yang Dipelajari
                    </h5>

                    <div className="grid gap-4">
                      {/* Required Subjects */}
                      {selectedMajor.subjects.required && (
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 border border-red-200">
                          <h6 className="font-bold text-gray-900 mb-2 flex items-center">
                            <span className="text-lg mr-2">⭐</span>
                            Mata Pelajaran Wajib
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {selectedMajor.subjects.required.map(
                              (subject: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium"
                                >
                                  {subject}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Preferred Subjects */}
                      {selectedMajor.subjects.preferred && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                          <h6 className="font-bold text-gray-900 mb-2 flex items-center">
                            <span className="text-lg mr-2">💡</span>
                            Mata Pelajaran Pilihan
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {selectedMajor.subjects.preferred.map(
                              (subject: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                                >
                                  {subject}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Kurikulum Merdeka */}
                      {selectedMajor.subjects.kurikulum_merdeka && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200">
                          <h6 className="font-bold text-gray-900 mb-2 flex items-center">
                            <span className="text-lg mr-2">🎯</span>
                            Kurikulum Merdeka
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {selectedMajor.subjects.kurikulum_merdeka.map(
                              (subject: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
                                >
                                  {subject}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Kurikulum 2013 IPA */}
                      {selectedMajor.subjects.kurikulum_2013_ipa && (
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-200">
                          <h6 className="font-bold text-gray-900 mb-2 flex items-center">
                            <span className="text-lg mr-2">🔬</span>
                            Kurikulum 2013 - IPA
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {selectedMajor.subjects.kurikulum_2013_ipa.map(
                              (subject: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium"
                                >
                                  {subject}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Kurikulum 2013 IPS */}
                      {selectedMajor.subjects.kurikulum_2013_ips && (
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-4 border border-green-200">
                          <h6 className="font-bold text-gray-900 mb-2 flex items-center">
                            <span className="text-lg mr-2">📊</span>
                            Kurikulum 2013 - IPS
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {selectedMajor.subjects.kurikulum_2013_ips.map(
                              (subject: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                                >
                                  {subject}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Kurikulum 2013 Bahasa */}
                      {selectedMajor.subjects.kurikulum_2013_bahasa && (
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200">
                          <h6 className="font-bold text-gray-900 mb-2 flex items-center">
                            <span className="text-lg mr-2">📝</span>
                            Kurikulum 2013 - Bahasa
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {selectedMajor.subjects.kurikulum_2013_bahasa.map(
                              (subject: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-pink-100 text-pink-800 rounded-lg text-sm font-medium"
                                >
                                  {subject}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCloseMajorDetail}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Tutup
                  </button>
                  {selectedMajor && isMajorSelected(selectedMajor.id) ? (
                    <div className="flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-800">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-bold">Jurusan Dipilih</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleCloseMajorDetail();
                        if (selectedMajor) {
                          handleApplyMajor(selectedMajor);
                        }
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <svg
                        className="w-5 h-5 mr-2 inline"
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
                      Pilih Jurusan
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="text-2xl mr-3">⚙️</span>
                    Pengaturan Akun
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={studentData?.name || ""}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-gray-900 bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      NISN
                    </label>
                    <input
                      type="text"
                      value={studentData?.nisn || ""}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-gray-900 bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Kelas
                    </label>
                    <input
                      type="text"
                      value={studentData?.class || studentData?.kelas || ""}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-gray-900 bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settingsData.email}
                      onChange={(e) =>
                        handleSettingsChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={settingsData.phone}
                      onChange={(e) =>
                        handleSettingsChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nomor Orang Tua
                    </label>
                    <input
                      type="tel"
                      value={settingsData.parent_phone}
                      onChange={(e) =>
                        handleSettingsChange("parent_phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Simpan
                  </button>
                </div>
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
    </>
  );
}
