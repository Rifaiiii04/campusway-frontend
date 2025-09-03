"use client";

import { useState, useEffect } from "react";
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
  DashboardData,
  Student,
  MajorStatistics,
} from "../services/api";

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

  // Dark mode detection and management
  useEffect(() => {
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

  // Load data from API
  useEffect(() => {
    loadDataFromAPI();
  }, []);

  const handleClassClick = (classItem: {
    kelas: string;
    student_count: number;
  }) => {
    // Handle class click if needed
    console.log("Class clicked:", classItem);
  };

  const openAddStudentModal = () => {
    setShowAddStudentModal(true);
  };

  const closeAddStudentModal = () => {
    setShowAddStudentModal(false);
  };

  const loadStudents = async () => {
    try {
      const studentsResponse = await apiService.getStudents();
      setStudents(studentsResponse.data.students);
    } catch (err: unknown) {
      console.error("Error loading students:", err);
      setError(err instanceof Error ? err.message : "Gagal memuat data siswa");
    }
  };

  const handleAddStudent = () => {
    // Refresh data siswa setelah menambah siswa baru
    loadStudents();
    setShowAddStudentModal(false);
  };

  const openAddClassModal = () => {
    setShowAddClassModal(true);
  };

  const closeAddClassModal = () => {
    setShowAddClassModal(false);
  };

  const handleAddClass = (classData: { name: string; grade: string }) => {
    // Simulasi penambahan kelas
    console.log("Menambahkan kelas baru:", classData);

    // Tampilkan notifikasi sukses
    alert("Kelas berhasil ditambahkan!");
  };

  const handleLogout = () => {
    localStorage.removeItem("school_token");
    router.push("/login");
  };

  // Data untuk title dan description setiap halaman
  const pageMetadata = {
    dashboard: {
      title: "Dashboard - Sistem TKA Guru",
      description:
        "Dashboard utama guru dengan overview statistik siswa, kelas, dan hasil tes",
    },
    students: {
      title: "Data Siswa - Sistem TKA Guru",
      description:
        "Kelola data siswa, lihat profil, dan monitor status tes setiap siswa",
    },
    classes: {
      title: "Manajemen Kelas - Sistem TKA Guru",
      description:
        "Kelola kelas, lihat performa kelas, dan statistik per kelas",
    },
    tests: {
      title: "Tes & Hasil - Sistem TKA Guru",
      description:
        "Monitor hasil tes siswa, analisis performa, dan rekomendasi jurusan",
    },
    reports: {
      title: "Laporan & Analisis - Sistem TKA Guru",
      description:
        "Generate laporan, analisis statistik, dan ranking performa siswa",
    },
    settings: {
      title: "Pengaturan - Sistem TKA Guru",
      description: "Pengaturan profil guru, sistem, dan keamanan akun",
    },
  };

  const currentMetadata =
    pageMetadata[activeMenu as keyof typeof pageMetadata] ||
    pageMetadata.dashboard;

  const loadDataFromAPI = async () => {
    try {
      setLoading(true);
      setError("");

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
    } catch (err: unknown) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/teacher" },
    { id: "students", label: "Data Siswa", icon: "👥", path: "/teacher" },
    { id: "classes", label: "Kelas", icon: "🏫", path: "/teacher" },
    { id: "tests", label: "Tes & Hasil", icon: "📝", path: "/teacher" },
    { id: "reports", label: "Laporan", icon: "📋", path: "/teacher" },
    { id: "settings", label: "Pengaturan", icon: "⚙️", path: "/teacher" },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    const menuItem = menuItems.find((item) => item.id === menuId);
    if (menuItem) {
      router.push(menuItem.path);
    }
  };

  // Render content berdasarkan menu aktif
  const renderContent = () => {
    switch (activeMenu) {
      case "students":
        return (
          <StudentsContent
            students={students}
            darkMode={darkMode}
            onAddStudent={openAddStudentModal}
          />
        );
      case "classes":
        return (
          <ClassesContent
            students={students}
            darkMode={darkMode}
            onAddClass={openAddClassModal}
          />
        );
      case "tests":
        return <TestsContent students={students} darkMode={darkMode} />;
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
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
          onLogout={handleLogout}
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
            <div className="flex justify-between items-center py-4 px-6">
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {getPageTitle()}
                </h1>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Selamat datang di sistem TKA
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
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Export Data
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
          <div className="flex-1 p-6 overflow-auto mt-24">
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
