"use client";

import { useEffect, useState } from "react";
import { TkaSchedule, studentApiService } from "../../services/api";

interface TkaScheduleContentProps {
  darkMode: boolean;
  schoolId: number | null;
}

export default function TkaScheduleContent({
  darkMode,
  schoolId,
}: TkaScheduleContentProps) {
  const [schedules, setSchedules] = useState<TkaSchedule[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<TkaSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadSchedules = async () => {
      if (!schoolId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("🔄 Loading TKA schedules for school:", schoolId);

        // Try loading without schoolId first (global schedules), then with schoolId
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
        if (schedulesResponse && schedulesResponse.success && schedulesResponse.data) {
          setSchedules(schedulesResponse.data);
          console.log("✅ Schedules loaded:", schedulesResponse.data.length);
        } else {
          console.warn("⚠️ Schedules response not successful:", schedulesResponse);
          setSchedules([]);
        }

        // Process upcoming response
        if (upcomingResponse && upcomingResponse.success && upcomingResponse.data) {
          setUpcomingSchedules(upcomingResponse.data);
          console.log("✅ Upcoming schedules loaded:", upcomingResponse.data.length);
        } else {
          console.warn("⚠️ Upcoming response not successful:", upcomingResponse);
          setUpcomingSchedules([]);
        }
      } catch (err) {
        console.error("❌ Error loading schedules:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat jadwal TKA"
        );
        // Set empty arrays on error to prevent UI crashes
        setSchedules([]);
        setUpcomingSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [schoolId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      scheduled: { label: "Terjadwal", color: "text-blue-700", bgColor: "bg-blue-100" },
      ongoing: { label: "Berlangsung", color: "text-green-700", bgColor: "bg-green-100" },
      completed: { label: "Selesai", color: "text-gray-700", bgColor: "bg-gray-100" },
      cancelled: { label: "Dibatalkan", color: "text-red-700", bgColor: "bg-red-100" },
    };

    const statusInfo = statusMap[status] || { label: status, color: "text-gray-700", bgColor: "bg-gray-100" };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; color: string; bgColor: string }> = {
      regular: { label: "Reguler", color: "text-green-700", bgColor: "bg-green-100" },
      makeup: { label: "Susulan", color: "text-orange-700", bgColor: "bg-orange-100" },
      special: { label: "Khusus", color: "text-purple-700", bgColor: "bg-purple-100" },
    };

    const typeInfo = typeMap[type] || { label: type, color: "text-gray-700", bgColor: "bg-gray-100" };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color} ${typeInfo.bgColor}`}
      >
        {typeInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm p-12 text-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Memuat jadwal TKA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"} border rounded-xl p-6`}>
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-600"
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
          <div>
            <h3 className={`${darkMode ? "text-red-400" : "text-red-800"} font-semibold`}>Error</h3>
            <p className={darkMode ? "text-red-300" : "text-red-600"}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Schedules */}
      {upcomingSchedules.length > 0 && (
        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border p-6`}>
          <h2 className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"} mb-4 flex items-center gap-2`}>
            <span className="text-2xl">⏰</span>
            <span>Jadwal Mendatang</span>
            <span className={`text-sm font-normal ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              ({upcomingSchedules.length} jadwal)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`border ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gradient-to-br from-white to-gray-50"} rounded-lg p-5 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"} flex-1`}>
                    {schedule.title}
                  </h3>
                  {getStatusBadge(schedule.status)}
                </div>

                {schedule.description && (
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4 line-clamp-2`}>
                    {schedule.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Mulai:</span>
                    <span>{formatDate(schedule.start_date)}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Selesai:</span>
                    <span>{formatDate(schedule.end_date)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  {getTypeBadge(schedule.type)}
                  {schedule.gelombang && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-blue-700 bg-blue-100">
                      Gelombang {schedule.gelombang}
                    </span>
                  )}
                </div>

                {schedule.exam_venue && (
                  <div className={`mt-4 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{schedule.exam_venue}</span>
                      {schedule.exam_room && (
                        <span className={darkMode ? "text-gray-500" : "text-gray-500"}>- {schedule.exam_room}</span>
                      )}
                    </div>
                  </div>
                )}

                {schedule.instructions && (
                  <div className={`mt-4 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <span className="font-medium">Instruksi:</span> {schedule.instructions}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Schedules */}
      <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border p-6`}>
        <h2 className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"} mb-4 flex items-center gap-2`}>
          <span className="text-2xl">📋</span>
          <span>Semua Jadwal</span>
          <span className={`text-sm font-normal ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            ({schedules.length} jadwal)
          </span>
        </h2>

        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"} style={{ fontSize: "1.125rem" }}>
              Belum ada jadwal TKA yang tersedia
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`border ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200"} rounded-lg p-5 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"} mb-1`}>
                      {schedule.title}
                    </h3>
                    {schedule.description && (
                      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm line-clamp-2`}>
                        {schedule.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(schedule.status)}
                    {getTypeBadge(schedule.type)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium">Mulai:</span>
                      <span>{formatDate(schedule.start_date)}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium">Selesai:</span>
                      <span>{formatDate(schedule.end_date)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {schedule.gelombang && (
                      <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        <span className="font-medium">Gelombang:</span>{" "}
                        <span>Gelombang {schedule.gelombang}</span>
                      </div>
                    )}
                    {schedule.hari_pelaksanaan && (
                      <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        <span className="font-medium">Hari Pelaksanaan:</span>{" "}
                        <span>{schedule.hari_pelaksanaan}</span>
                      </div>
                    )}
                    {schedule.exam_venue && (
                      <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        <span className="font-medium">Tempat:</span>{" "}
                        <span>
                          {schedule.exam_venue}
                          {schedule.exam_room && ` - ${schedule.exam_room}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {(schedule.contact_person || schedule.instructions) && (
                  <div className={`mt-4 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} space-y-2 text-sm`}>
                    {schedule.contact_person && (
                      <div className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        <span className="font-medium">Kontak Person:</span>{" "}
                        <span>
                          {schedule.contact_person}
                          {schedule.contact_phone && ` (${schedule.contact_phone})`}
                        </span>
                      </div>
                    )}
                    {schedule.instructions && (
                      <div className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        <span className="font-medium">Instruksi:</span>{" "}
                        <span>{schedule.instructions}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

