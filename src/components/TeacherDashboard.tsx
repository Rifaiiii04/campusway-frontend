"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import PageTitle from "./PageTitle";
import DashboardContent from "./dashboard/DashboardContent";
import StudentsContent from "./dashboard/StudentsContent";
import ClassesContent from "./dashboard/ClassesContent";
import TestsContent from "./dashboard/TestsContent";
import ReportsContent from "./dashboard/ReportsContent";
import SettingsContent from "./dashboard/SettingsContent";
import Sidebar from "./layout/Sidebar";
import AddStudentModal from "./modals/AddStudentModal";
import AddClassModal from "./modals/AddClassModal";
import {
  apiService,
  studentApiService,
  DashboardData,
  Student,
  MajorStatistics,
  TkaSchedule,
} from "../services/api";
// import TkaScheduleCard from "./TkaScheduleCard";

// Interface untuk export data
interface ExportStudentData {
  nama_siswa: string;
  nisn: string;
  kelas: string;
  email: string;
  no_handphone: string;
  no_orang_tua: string;
  status_pilihan_jurusan: string;
  tanggal_memilih: string;
  nama_jurusan: string;
  rumpun_ilmu: string;
  prospek_karir: string;
  mata_pelajaran_wajib: string | string[];
  mata_pelajaran_diutamakan: string | string[];
  mata_pelajaran_kurikulum_merdeka: string | string[];
  mata_pelajaran_kurikulum_2013_ipa: string | string[];
  mata_pelajaran_kurikulum_2013_ips: string | string[];
  mata_pelajaran_kurikulum_2013_bahasa: string | string[];
}

interface SchoolInfo {
  id: number;
  npsn: string;
  name: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Types sudah diimport dari api.ts

export default function TeacherDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [majorStatistics, setMajorStatistics] = useState<MajorStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [schoolId, setSchoolId] = useState<number | null>(null);

  // ArahPotensi Schedules state
  const [tkaSchedules, setTkaSchedules] = useState<TkaSchedule[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<TkaSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  // const [schedulesLoaded, setSchedulesLoaded] = useState(false);

  // Dark mode detection and management
  useEffect(() => {
    // Guard untuk SSR - hanya jalankan di client
    if (typeof window === "undefined") return;

    // Check for saved dark mode preference or system preference
    const savedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    } else {
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    // Guard untuk SSR - hanya jalankan di client
    if (typeof window === "undefined") return;

    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Load ArahPotensi schedules separately
  const loadTkaSchedules = useCallback(async (schoolId: number) => {
    try {
      setLoadingSchedules(true);
      console.log("🔄 Loading ArahPotensi schedules for school:", schoolId);

      // Try loading without schoolId first (global schedules)
      let schedulesResponse, upcomingResponse;

      try {
        [schedulesResponse, upcomingResponse] = await Promise.all([
          studentApiService.getTkaSchedules(), // Try without schoolId first
          studentApiService.getUpcomingTkaSchedules(),
        ]);
        console.log(
          "📊 ArahPotensi Schedules Response (global):",
          schedulesResponse
        );
        console.log(
          "📊 Upcoming Schedules Response (global):",
          upcomingResponse
        );
      } catch (globalErr) {
        console.warn(
          "⚠️ Global ArahPotensi loading failed, trying with schoolId:",
          globalErr
        );
        // Fallback to school-specific loading
        [schedulesResponse, upcomingResponse] = await Promise.all([
          studentApiService.getTkaSchedules(schoolId),
          studentApiService.getUpcomingTkaSchedules(schoolId),
        ]);
        console.log(
          "📊 ArahPotensi Schedules Response (school):",
          schedulesResponse
        );
        console.log(
          "📊 Upcoming Schedules Response (school):",
          upcomingResponse
        );
      }

      // Process schedules response
      if (schedulesResponse && schedulesResponse.success) {
        const schedules = schedulesResponse.data || [];
        setTkaSchedules(schedules);
        // setSchedulesLoaded(true);
        console.log(
          "✅ ArahPotensi schedules loaded:",
          schedules.length,
          schedules
        );
      } else {
        console.warn("⚠️ ArahPotensi schedules failed:", schedulesResponse);
        setTkaSchedules([]);
        // setSchedulesLoaded(false);
      }

      // Process upcoming response
      if (upcomingResponse && upcomingResponse.success) {
        const upcoming = upcomingResponse.data || [];
        setUpcomingSchedules(upcoming);
        console.log("✅ Upcoming schedules loaded:", upcoming.length, upcoming);
      } else {
        console.warn("⚠️ Upcoming schedules failed:", upcomingResponse);
        setUpcomingSchedules([]);
      }
    } catch (scheduleErr: unknown) {
      console.error("❌ Error loading ArahPotensi schedules:", scheduleErr);
      setTkaSchedules([]);
      setUpcomingSchedules([]);
      // setSchedulesLoaded(false);
    } finally {
      setLoadingSchedules(false);
    }
  }, []);

  const loadDataFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Check if token exists
      const token = localStorage.getItem("school_token");
      console.log(
        "🔍 TeacherDashboard - Token check:",
        token ? `${token.substring(0, 10)}...` : "NO TOKEN FOUND"
      );
      console.log(
        "🔍 TeacherDashboard - School data:",
        localStorage.getItem("school_data")
      );

      // Load dashboard data
      const dashboardResponse = await apiService.getDashboard();
      setDashboardData(dashboardResponse.data);
      setSchoolId(dashboardResponse.data.school.id);

      // Load students data
      const studentsResponse = await apiService.getStudents();
      setStudents(studentsResponse.data.students);

      // Load major statistics
      const majorStatsResponse = await apiService.getMajorStatistics();
      setMajorStatistics(majorStatsResponse.data.major_statistics);

      // Note: ArahPotensi schedules will be loaded by the useEffect that watches schoolId
    } catch (err: unknown) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data from API
  useEffect(() => {
    loadDataFromAPI();
  }, [loadDataFromAPI]);

  // Force load ArahPotensi schedules on component mount
  useEffect(() => {
    console.log("🔄 Component mounted, checking for schoolId...");
    if (schoolId) {
      console.log(
        "🔄 SchoolId available on mount, loading ArahPotensi schedules:",
        schoolId
      );
      loadTkaSchedules(schoolId);
    }
  }, [schoolId, loadTkaSchedules]); // Include dependencies

  // Load ArahPotensi schedules when schoolId changes
  useEffect(() => {
    console.log(
      "🔄 useEffect triggered - schoolId:",
      schoolId,
      "loadTkaSchedules:",
      typeof loadTkaSchedules
    );
    if (schoolId) {
      console.log(
        "🔄 SchoolId changed, loading ArahPotensi schedules:",
        schoolId
      );
      loadTkaSchedules(schoolId);
    } else {
      console.log("⚠️ No schoolId available for ArahPotensi schedules");
    }
  }, [schoolId, loadTkaSchedules]); // Include loadTkaSchedules dependency

  // Load ArahPotensi schedules on component mount and window focus
  useEffect(() => {
    const handleFocus = () => {
      if (schoolId && activeMenu === "tka-schedules") {
        console.log("🔄 Window focused, refreshing ArahPotensi schedules...");
        loadTkaSchedules(schoolId);
      }
    };

    // Load on mount
    if (schoolId) {
      loadTkaSchedules(schoolId);
    }

    // Listen for window focus - hanya di client
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleFocus);

      return () => {
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [schoolId, activeMenu, loadTkaSchedules]); // Include loadTkaSchedules dependency

  const handleClassClick = (classItem: {
    kelas: string;
    student_count: number;
  }) => {
    // Handle class click if needed
    console.log("Class clicked:", classItem);
  };

  // Refresh ArahPotensi schedules manually
  const refreshTkaSchedules = useCallback(async () => {
    if (schoolId) {
      console.log("🔄 Manually refreshing ArahPotensi schedules...");
      await loadTkaSchedules(schoolId);
    }
  }, [schoolId, loadTkaSchedules]); // Include loadTkaSchedules dependency

  // Handle menu change and refresh ArahPotensi schedules when ArahPotensi menu is selected
  const handleMenuChange = (menuId: string) => {
    setActiveMenu(menuId);

    // Refresh ArahPotensi schedules when ArahPotensi menu is selected
    if (menuId === "tka-schedules" && schoolId) {
      console.log("🔄 ArahPotensi menu selected, refreshing schedules...");
      refreshTkaSchedules();
    }
  };

  const openAddStudentModal = () => {
    setShowAddStudentModal(true);
  };

  const closeAddStudentModal = () => {
    setShowAddStudentModal(false);
  };

  const loadStudents = async (forceRefresh: boolean = false) => {
    try {
      console.log(
        "📡 Loading students data...",
        forceRefresh ? "(force refresh)" : ""
      );
      const studentsResponse = await apiService.getStudents(forceRefresh);
      console.log(
        "✅ Students loaded:",
        studentsResponse.data.students.length,
        "students"
      );
      setStudents(studentsResponse.data.students);
    } catch (err: unknown) {
      console.error("Error loading students:", err);
      setError(err instanceof Error ? err.message : "Gagal memuat data siswa");
    }
  };

  const handleAddStudent = () => {
    console.log("🔄 handleAddStudent called - refreshing students data...");
    // Refresh data siswa setelah menambah siswa baru (force refresh to bypass cache)
    loadStudents(true);
    setShowAddStudentModal(false);
  };

  const openAddClassModal = () => {
    setShowAddClassModal(true);
  };

  const closeAddClassModal = () => {
    setShowAddClassModal(false);
  };

  const handleAddClass = (classData: { name: string }) => {
    // Simulasi penambahan kelas
    console.log("Menambahkan kelas baru:", classData);

    // Tampilkan notifikasi sukses
    alert(`Kelas "${classData.name}" berhasil ditambahkan!`);

    // Refresh data siswa untuk menampilkan kelas baru
    loadStudents(true);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("school_token");
    }
    router.push("/login");
  };

  // Export data siswa ke Excel/CSV
  const handleExportData = async () => {
    console.log("🚀 Starting export process...");
    try {
      setLoading(true);
      console.log("📊 Loading state set to true");

      // Check authentication first
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("school_token")
          : null;
      const schoolData =
        typeof window !== "undefined"
          ? localStorage.getItem("school_data")
          : null;

      console.log("🔑 Token exists:", !!token);
      console.log(
        "🔑 Token value:",
        token ? `${token.substring(0, 10)}...` : "null"
      );
      console.log("🏫 School data exists:", !!schoolData);
      console.log("🏫 School data:", schoolData);

      if (!token || !schoolData) {
        throw new Error(
          "Anda belum login atau session telah expired. Silakan login ulang."
        );
      }

      // Ambil data export dari API - Fixed call
      console.log("🌐 Calling API to get export data...");
      console.log(
        "🔑 Current token:",
        typeof window !== "undefined"
          ? localStorage.getItem("school_token")
          : "SSR"
      );
      console.log(
        "🏫 Current school data:",
        typeof window !== "undefined"
          ? localStorage.getItem("school_data")
          : "SSR"
      );

      // Get school ID from schoolData
      const school = schoolData ? JSON.parse(schoolData) : null;
      const schoolId = school ? school.id : null;

      console.log("🏫 School ID for export:", schoolId);

      if (!schoolId) {
        throw new Error("School ID tidak ditemukan. Silakan login ulang.");
      }

      const response = await apiService.exportStudents(schoolId);
      console.log("✅ API response received:", response);

      if (response.success && response.data) {
        console.log("📊 Response data structure:", response.data);

        const responseData = response.data as {
          export_data: ExportStudentData[];
          school: SchoolInfo;
          export_date: string;
        };

        console.log("📋 Export data:", responseData.export_data);
        console.log("🏫 School data:", responseData.school);
        console.log("📅 Export date:", responseData.export_date);

        const { export_data, school, export_date } = responseData;

        // Konversi data ke format CSV
        const csvContent = convertToCSV(export_data);

        // Download file CSV dengan format Excel
        downloadCSV(
          csvContent,
          `Data_Siswa_${school.name}_${export_date
            .split(" ")[0]
            .replace(/\//g, "-")}.csv`
        );

        // Tampilkan notifikasi sukses
        alert(`Data berhasil diekspor! Total ${export_data.length} siswa.`);
      } else {
        throw new Error("Gagal mengambil data untuk export");
      }
    } catch (error) {
      console.error("❌ Export error:", error);

      // Fallback: try to export with existing data
      if (students && students.length > 0) {
        console.log("🔄 Trying fallback export with existing data...");
        try {
          const fallbackData = students.map((student) => ({
            nama_siswa: student.name || "",
            nisn: student.nisn || "",
            kelas: student.class || "",
            email: student.email || "",
            no_handphone: student.phone || "",
            no_orang_tua: student.parent_phone || "",
            status_pilihan_jurusan: student.has_choice
              ? "Sudah Memilih"
              : "Belum Memilih",
            tanggal_memilih: student.choice_date
              ? new Date(student.choice_date).toLocaleDateString("id-ID")
              : "-",
            nama_jurusan: student.chosen_major?.name || "-",
            rumpun_ilmu: student.chosen_major?.rumpun_ilmu || "-",
            prospek_karir: student.chosen_major?.career_prospects || "-",
            mata_pelajaran_wajib:
              student.chosen_major?.required_subjects || "-",
            mata_pelajaran_diutamakan:
              student.chosen_major?.preferred_subjects || "-",
            mata_pelajaran_kurikulum_merdeka:
              student.chosen_major?.kurikulum_merdeka_subjects || "-",
            mata_pelajaran_kurikulum_2013_ipa:
              student.chosen_major?.kurikulum_2013_ipa_subjects || "-",
            mata_pelajaran_kurikulum_2013_ips:
              student.chosen_major?.kurikulum_2013_ips_subjects || "-",
            mata_pelajaran_kurikulum_2013_bahasa:
              student.chosen_major?.kurikulum_2013_bahasa_subjects || "-",
          }));

          const schoolData =
            typeof window !== "undefined"
              ? localStorage.getItem("school_data")
              : null;
          const school = schoolData
            ? JSON.parse(schoolData)
            : { name: "Unknown School", npsn: "Unknown" };

          const csvContent = convertToCSV(fallbackData);
          downloadCSV(
            csvContent,
            `Data_Siswa_${school.name}_${
              new Date().toISOString().split("T")[0]
            }.csv`
          );

          alert(
            `Data berhasil diekspor (mode fallback)! Total ${fallbackData.length} siswa.`
          );
          return;
        } catch (fallbackError) {
          console.error("❌ Fallback export also failed:", fallbackError);
        }
      }

      alert(
        `Gagal mengekspor data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      console.log("🏁 Export process finished, setting loading to false");
      setLoading(false);
    }
  };

  // Konversi data ke format CSV dengan styling dan pemisahan kolom yang benar
  const convertToCSV = (data: ExportStudentData[]) => {
    if (!data || data.length === 0) return "";

    // Header CSV dengan pemisahan yang benar
    const headers = [
      "Nama Siswa",
      "NISN",
      "Kelas",
      "Email",
      "No Handphone",
      "No Orang Tua",
      "Status Pilihan Jurusan",
      "Tanggal Memilih",
      "Nama Jurusan",
      "Kategori Jurusan",
      "Prospek Karir",
      "Mata Pelajaran Wajib",
      "Mata Pelajaran Diutamakan",
      "Mata Pelajaran Kurikulum Merdeka",
      "Mata Pelajaran Kurikulum 2013 IPA",
      "Mata Pelajaran Kurikulum 2013 IPS",
      "Mata Pelajaran Kurikulum 2013 Bahasa",
    ];

    // Data rows dengan pemisahan yang benar
    const rows = data.map((student) => [
      student.nama_siswa || "",
      student.nisn || "",
      student.kelas || "",
      student.email || "",
      student.no_handphone || "",
      student.no_orang_tua || "",
      student.status_pilihan_jurusan || "",
      student.tanggal_memilih || "",
      student.nama_jurusan || "",
      student.rumpun_ilmu || "",
      student.prospek_karir || "",
      student.mata_pelajaran_wajib || "",
      student.mata_pelajaran_diutamakan || "",
      student.mata_pelajaran_kurikulum_merdeka || "",
      student.mata_pelajaran_kurikulum_2013_ipa || "",
      student.mata_pelajaran_kurikulum_2013_ips || "",
      student.mata_pelajaran_kurikulum_2013_bahasa || "",
    ]);

    // Fungsi untuk escape CSV field - format standar CSV
    const escapeCSVField = (field: unknown) => {
      // Pastikan field adalah string
      const stringField = String(field || "");
      // Selalu wrap dengan quotes untuk memastikan Excel mengenali sebagai field terpisah
      const cleanField = stringField.replace(/"/g, '""'); // Escape quotes
      return `"${cleanField}"`;
    };

    // Gabungkan header dan data dengan pemisahan yang benar
    // Format seperti super admin backend dengan semicolon sebagai separator
    const csvContent = [
      // Header kolom - gunakan semicolon seperti super admin
      headers.map(escapeCSVField).join(";"),
      // Data rows - gunakan semicolon seperti super admin
      ...rows.map((row) => row.map(escapeCSVField).join(";")),
    ].join("\n");

    return csvContent;
  };

  // Download file CSV dengan format Excel yang benar (seperti super admin backend)
  const downloadCSV = (content: string, filename: string) => {
    // Tambahkan BOM (Byte Order Mark) untuk UTF-8 seperti super admin backend
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + content;

    // Gunakan MIME type yang sama seperti super admin backend
    const blob = new Blob([csvWithBOM], {
      type: "text/csv; charset=UTF-8",
    });

    // Guard untuk SSR - hanya jalankan di client
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename); // Tetap gunakan .csv
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL object
      URL.revokeObjectURL(url);
    }
  };

  // Data untuk title dan description setiap halaman
  const pageMetadata = {
    dashboard: {
      title: "Dashboard - Sistem ArahPotensi Guru",
      description:
        "Dashboard utama guru dengan overview statistik siswa, kelas, dan hasil tes",
    },
    students: {
      title: "Data Siswa - Sistem ArahPotensi Guru",
      description:
        "Kelola data siswa, lihat profil, dan monitor status tes setiap siswa",
    },
    classes: {
      title: "Manajemen Kelas - Sistem ArahPotensi Guru",
      description:
        "Kelola kelas, lihat performa kelas, dan statistik per kelas",
    },
    tests: {
      title: "Tes & Hasil - Sistem ArahPotensi Guru",
      description:
        "Monitor hasil tes siswa, analisis performa, dan rekomendasi jurusan",
    },
    reports: {
      title: "Laporan & Analisis - Sistem ArahPotensi Guru",
      description:
        "Generate laporan, analisis statistik, dan ranking performa siswa",
    },
    settings: {
      title: "Pengaturan - Sistem ArahPotensi Guru",
      description: "Pengaturan profil guru, sistem, dan keamanan akun",
    },
  };

  const currentMetadata =
    pageMetadata[activeMenu as keyof typeof pageMetadata] ||
    pageMetadata.dashboard;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/teacher" },
    { id: "students", label: "Data Siswa", icon: "👥", path: "/teacher" },
    { id: "classes", label: "Kelas", icon: "🏫", path: "/teacher" },
    {
      id: "tka-schedules",
      label: "Jadwal ArahPotensi",
      icon: "🗓️",
      path: "/teacher/tka-schedule",
    },
    { id: "tests", label: "Tes & Hasil", icon: "📝", path: "/teacher" },
    { id: "reports", label: "Laporan", icon: "📋", path: "/teacher" },
    { id: "settings", label: "Pengaturan", icon: "⚙️", path: "/teacher" },
  ];

  const handleMenuClick = (menuId: string) => {
    handleMenuChange(menuId);
    const menuItem = menuItems.find((item) => item.id === menuId);
    if (menuItem) {
      console.log("🔍 TeacherDashboard: Navigating to:", menuItem.path);
      router.push(menuItem.path);
    }
  };

  // Render content berdasarkan menu aktif
  const renderContent = () => {
    switch (activeMenu) {
      case "students":
        return schoolId ? (
          <StudentsContent
            students={students}
            darkMode={darkMode}
            onAddStudent={openAddStudentModal}
            schoolId={schoolId}
            onImportSuccess={() => loadStudents(true)}
          />
        ) : (
          <div className="text-center text-gray-500 p-8">
            School ID tidak tersedia
          </div>
        );
      case "classes":
        return (
          <ClassesContent
            students={students}
            darkMode={darkMode}
            onAddClass={openAddClassModal}
          />
        );
      case "tka-schedules":
        // Redirect to dedicated TKA Schedule page
        router.push("/teacher/tka-schedule");
        return null;
      case "tests":
        return <TestsContent darkMode={darkMode} />;
      case "reports":
        return (
          <ReportsContent
            students={students}
            majorStatistics={majorStatistics}
            dashboardData={dashboardData}
            darkMode={darkMode}
          />
        );
      case "settings":
        return (
          <SettingsContent
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );
      default:
        return (
          <DashboardContent
            dashboardData={dashboardData}
            students={students}
            darkMode={darkMode}
            onClassClick={handleClassClick}
            tkaSchedules={tkaSchedules}
            upcomingSchedules={upcomingSchedules}
            loadingSchedules={loadingSchedules}
          />
        );
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      students: "Data Siswa",
      classes: "Manajemen Kelas",
      tests: "Tes & Hasil",
      reports: "Laporan & Analisis",
      settings: "Pengaturan Sistem",
    };
    return titles[activeMenu as keyof typeof titles] || "Dashboard";
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Memuat Dashboard Guru...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Terjadi Kesalahan
          </h2>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title={currentMetadata.title}
        description={currentMetadata.description}
      />
      <div
        className={`min-h-screen flex ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          darkMode={darkMode}
        />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col ${
            sidebarOpen ? "ml-64" : "ml-16"
          } transition-all duration-300 ease-in-out`}
        >
          {/* Header */}
          <div
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } shadow-sm border-b fixed top-0 right-0 z-20 transition-all duration-300 ease-in-out ${
              sidebarOpen ? "left-64" : "left-16"
            }`}
          >
            <div className="flex justify-between items-center py-3 px-6">
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {getPageTitle()}
                </h1>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Selamat datang di sistem ArahPotensi
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  title={
                    darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                  }
                >
                  {darkMode ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Export button clicked!");
                    handleExportData();
                  }}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer relative z-30 ${
                    loading
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                  style={{ pointerEvents: loading ? "none" : "auto" }}
                >
                  {loading ? "Exporting..." : "Export Data"}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-auto mt-16">
            {renderContent()}
          </div>
        </div>

        {/* Modals */}
        {schoolId && (
          <AddStudentModal
            isOpen={showAddStudentModal}
            onClose={closeAddStudentModal}
            onStudentAdded={handleAddStudent}
            schoolId={schoolId}
          />
        )}

        <AddClassModal
          isOpen={showAddClassModal}
          onClose={closeAddClassModal}
          onAddClass={handleAddClass}
          darkMode={darkMode}
        />
      </div>
    </>
  );
}
