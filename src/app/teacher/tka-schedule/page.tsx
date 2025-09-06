"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { studentApiService, TkaSchedule } from "@/services/api";
import TkaScheduleList from "@/components/TkaScheduleList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function TeacherTkaSchedulePage() {
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
  const [schoolId, setSchoolId] = useState<number | null>(null);

  // Get school ID from localStorage
  useEffect(() => {
    const schoolData = localStorage.getItem("school_data");
    if (schoolData) {
      try {
        const parsed = JSON.parse(schoolData);
        setSchoolId(parsed.id);
      } catch (err) {
        console.error("Error parsing school data:", err);
      }
    }
  }, []);

  const loadTkaSchedules = useCallback(async () => {
    if (!schoolId) return;

    try {
      setLoading(true);
      setError("");
      console.log("🔄 Loading TKA schedules for school:", schoolId);

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

      console.log("✅ TKA schedules loaded:", allSchedules.length);
      console.log("✅ Upcoming schedules:", upcoming.length);
      console.log("✅ Completed schedules:", completed.length);
    } catch (err) {
      console.error("❌ Error loading TKA schedules:", err);
      setError(err instanceof Error ? err.message : "Gagal memuat jadwal TKA");
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) {
      loadTkaSchedules();
    }
  }, [loadTkaSchedules, schoolId]);

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

  const handleEditSchedule = async (schedule: TkaSchedule) => {
    try {
      // TODO: Implement edit functionality
      console.log("Edit schedule:", schedule);
      // For now, just show a message
      alert("Fitur edit jadwal akan segera tersedia!");
    } catch (error) {
      console.error("Error editing schedule:", error);
      setError("Gagal mengedit jadwal");
    }
  };

  const handleCancelSchedule = async (schedule: TkaSchedule) => {
    try {
      if (
        confirm(
          `Apakah Anda yakin ingin membatalkan jadwal "${schedule.title}"?`
        )
      ) {
        // TODO: Implement cancel functionality
        console.log("Cancel schedule:", schedule);
        // For now, just show a message
        alert("Fitur batalkan jadwal akan segera tersedia!");
      }
    } catch (error) {
      console.error("Error cancelling schedule:", error);
      setError("Gagal membatalkan jadwal");
    }
  };

  const handleDeleteSchedule = async (schedule: TkaSchedule) => {
    try {
      if (
        confirm(
          `Apakah Anda yakin ingin menghapus jadwal "${schedule.title}"? Tindakan ini tidak dapat dibatalkan.`
        )
      ) {
        setLoading(true);

        // Call delete API
        await studentApiService.deleteTkaSchedule(schedule.id);

        // Reload schedules
        await loadTkaSchedules();

        console.log("✅ Schedule deleted successfully:", schedule.title);
      }
    } catch (error) {
      console.error("❌ Error deleting schedule:", error);
      setError(
        error instanceof Error ? error.message : "Gagal menghapus jadwal"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat jadwal TKA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTkaSchedules}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white">📅</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manajemen Jadwal TKA
          </h1>
          <p className="text-lg text-gray-600">
            Kelola jadwal Tes Kemampuan Akademik (TKA) untuk sekolah Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
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

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kelola Jadwal TKA
              </h3>
              <p className="text-gray-600">
                Tambah, edit, atau hapus jadwal TKA untuk sekolah Anda
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // TODO: Implement add schedule functionality
                  console.log("Add new schedule");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ➕ Tambah Jadwal
              </button>
              <button
                onClick={() => router.push("/teacher")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                ← Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
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
                      ? "border-blue-500 text-blue-600"
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
            showActions={true}
            onEdit={handleEditSchedule}
            onCancel={handleCancelSchedule}
            onDelete={handleDeleteSchedule}
          />
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={loadTkaSchedules}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔄 Refresh Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}
