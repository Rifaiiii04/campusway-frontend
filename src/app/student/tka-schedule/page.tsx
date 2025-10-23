"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { studentApiService, TkaSchedule } from "@/services/api";
import TkaScheduleList from "@/components/TkaScheduleList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function TkaSchedulePage() {
  const router = useRouter();
  const [tkaSchedules, setTkaSchedules] = useState<TkaSchedule[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<TkaSchedule[]>([]);
  const [completedSchedules, setCompletedSchedules] = useState<TkaSchedule[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed">(
    "all"
  );

  // Debug logging
  console.log("🔍 TkaSchedulePage component loaded");
  console.log("🔍 Router:", router);

  const loadTkaSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Loading ArahPotensi schedules...");

      const [schedulesResponse, upcomingResponse] = await Promise.all([
        studentApiService.getTkaSchedules(),
        studentApiService.getUpcomingTkaSchedules(),
      ]);

      const allSchedules = schedulesResponse.data;
      const upcoming = upcomingResponse.data;

      // Filter completed schedules
      const completed = allSchedules.filter(
        (schedule) => new Date(schedule.end_date) < new Date()
      );

      setTkaSchedules(allSchedules);
      setUpcomingSchedules(upcoming);
      setCompletedSchedules(completed);

      console.log("✅ ArahPotensi schedules loaded:", allSchedules.length);
      console.log("✅ Upcoming schedules:", upcoming.length);
      console.log("✅ Completed schedules:", completed.length);
      console.log("🔄 Setting loading to false...");
    } catch (err) {
      console.error("❌ Error loading ArahPotensi schedules:", err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat jadwal ArahPotensi"
      );
      console.log("🔄 Setting loading to false after error...");
    } finally {
      setLoading(false);
      console.log("✅ Loading set to false");
    }
  }, []);

  useEffect(() => {
    loadTkaSchedules();
  }, [loadTkaSchedules]);

  const getCurrentSchedules = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingSchedules;
      case "completed":
        return completedSchedules;
      default:
        return tkaSchedules;
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "upcoming":
        return upcomingSchedules.length;
      case "completed":
        return completedSchedules.length;
      default:
        return tkaSchedules.length;
    }
  };

  // Debug logging
  console.log("🔍 TkaSchedulePage render state:", {
    loading,
    error,
    tkaSchedules: tkaSchedules.length,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Tombol Kembali ke Dashboard */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Dashboard
          </button>
        </div>
        {/* Loading/Error/Main Content */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Memuat jadwal ArahPotensi...</p>
              <p className="text-xs text-gray-400 mt-2">Loading state active</p>
            </div>
          </div>
        ) : error ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Error
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-xs text-gray-400 mb-4">Error state active</p>
              <button
                onClick={loadTkaSchedules}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-white">📅</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Jadwal ArahPotensi
              </h1>
              <p className="text-lg text-gray-600">
                Lihat jadwal Tes Kemampuan Akademik (ArahPotensi) yang tersedia
              </p>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {tkaSchedules.length}
                </div>
                <div className="text-gray-600">Total Jadwal</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {upcomingSchedules.length}
                </div>
                <div className="text-gray-600">Jadwal Mendatang</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {completedSchedules.length}
                </div>
                <div className="text-gray-600">Jadwal Selesai</div>
              </div>
            </div>
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {/* ...existing code... */}
                  {[
                    { id: "all", label: "Semua Jadwal" },
                    { id: "upcoming", label: "Mendatang" },
                    { id: "completed", label: "Selesai" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(tab.id as "all" | "upcoming" | "completed")
                      }
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {getTabCount(tab.id)}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            {/* Schedules List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <TkaScheduleList
                schedules={getCurrentSchedules()}
                loading={loading}
                showActions={false}
              />
            </div>
            {/* Refresh Button */}
            <div className="text-center mt-8">
              <button
                onClick={loadTkaSchedules}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                🔄 Refresh Jadwal
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
