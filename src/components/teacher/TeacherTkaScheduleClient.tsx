"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../layout/Sidebar";
import TkaScheduleContent from "./TkaScheduleContent";

export default function TeacherTkaScheduleClient() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("tka-schedules");
  const [darkMode, setDarkMode] = useState(false);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load school data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolData = localStorage.getItem("school_data");
      if (schoolData && schoolData !== "undefined" && schoolData !== "null") {
        try {
          const parsed = JSON.parse(schoolData);
          setSchoolId(parsed.id || null);
        } catch (e) {
          console.error("Error parsing school data:", e);
        }
      }
    }
  }, []);

  // Dark mode detection and management
  useEffect(() => {
    if (typeof window === "undefined") return;

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

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    const menuPaths: Record<string, string> = {
      dashboard: "/teacher",
      students: "/teacher",
      classes: "/teacher",
      "tka-schedules": "/teacher/tka-schedule",
      tests: "/teacher",
      reports: "/teacher",
      settings: "/teacher",
    };

    const path = menuPaths[menuId] || "/teacher";
    if (path !== "/teacher/tka-schedule") {
      router.push(path);
    }
  };

  const handleLogout = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("school_token");
        localStorage.removeItem("school_data");
        localStorage.removeItem("darkMode");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, [router]);

  useEffect(() => {
    setLoading(false);
  }, []);

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
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  return (
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
                Jadwal ArahPotensi
              </h1>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Jadwal pelaksanaan Tes Kemampuan Akademik
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
                  handleLogout();
                }}
                type="button"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-auto mt-16">
          <TkaScheduleContent darkMode={darkMode} schoolId={schoolId} />
        </div>
      </div>
    </div>
  );
}

