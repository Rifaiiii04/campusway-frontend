"use client";

import { Bar, Doughnut } from "react-chartjs-2";
import { DashboardData, Student, TkaSchedule } from "../../services/api";
import TkaScheduleCard from "../TkaScheduleCard";

interface DashboardContentProps {
  dashboardData: DashboardData | null;
  students: Student[];
  darkMode: boolean;
  onClassClick: (classItem: { kelas: string; student_count: number }) => void;
  tkaSchedules?: TkaSchedule[];
  upcomingSchedules?: TkaSchedule[];
  loadingSchedules?: boolean;
}

export default function DashboardContent({
  dashboardData,
  students,
  darkMode,
  onClassClick,
  tkaSchedules = [],
  upcomingSchedules = [],
  loadingSchedules = false,
}: DashboardContentProps) {
  const classChartData = {
    labels: dashboardData?.students_by_class.map((cls) => cls.kelas) || [],
    datasets: [
      {
        label: "Jumlah Siswa",
        data:
          dashboardData?.students_by_class.map((cls) => cls.student_count) ||
          [],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart untuk jurusan yang diminati
  const majorChartData = {
    labels: dashboardData?.top_majors.map((major) => major.major_name) || [],
    datasets: [
      {
        label: "Jumlah Siswa",
        data:
          dashboardData?.top_majors.map((major) => major.student_count) || [],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Siswa
              </p>
              <p
                className={`text-2xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {dashboardData?.statistics.total_students}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Kelas
              </p>
              <p
                className={`text-2xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {dashboardData?.students_by_class.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Siswa Memilih Jurusan
              </p>
              <p
                className={`text-2xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {dashboardData?.statistics.students_with_choice}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Tingkat Penyelesaian
              </p>
              <p
                className={`text-2xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {dashboardData?.statistics.completion_percentage?.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TKA Schedules Section */}
      {tkaSchedules.length > 0 && (
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow mb-8`}
        >
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg ${
                    darkMode ? "bg-blue-900" : "bg-blue-100"
                  } mr-3`}
                >
                  <svg
                    className={`w-6 h-6 ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`}
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
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Jadwal TKA Mendatang
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Jadwal pelaksanaan Tes Kemampuan Akademik
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total: {tkaSchedules.length} jadwal
                </div>
                <div
                  className={`text-sm font-medium ${
                    darkMode ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  Mendatang: {upcomingSchedules.length} jadwal
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loadingSchedules ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span
                  className={`ml-2 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Memuat jadwal TKA...
                </span>
              </div>
            ) : upcomingSchedules.length > 0 ? (
              <div className="grid gap-4">
                {upcomingSchedules.slice(0, 3).map((schedule) => (
                  <TkaScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    showActions={false}
                  />
                ))}
                {upcomingSchedules.length > 3 && (
                  <div
                    className={`text-center py-4 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="text-sm">
                      Dan {upcomingSchedules.length - 3} jadwal lainnya...
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📅</div>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Belum ada jadwal TKA mendatang
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? "bg-blue-900" : "bg-blue-100"
              } mr-3`}
            >
              <svg
                className={`w-6 h-6 ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Distribusi Kelas
            </h3>
          </div>
          <div className="h-64">
            <Doughnut
              data={classChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? "bg-green-900" : "bg-green-100"
              } mr-3`}
            >
              <svg
                className={`w-6 h-6 ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Jurusan yang Diminati
            </h3>
          </div>
          <div className="h-64">
            <Bar
              data={majorChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Class Summary */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow mb-8`}
      >
        <div
          className={`px-6 py-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Ringkasan Kelas
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table
            className={`min-w-full divide-y ${
              darkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Kelas
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Jumlah Siswa
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Siswa Memilih Jurusan
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Tingkat Penyelesaian
                </th>
              </tr>
            </thead>
            <tbody
              className={`${
                darkMode
                  ? "bg-gray-800 divide-gray-700"
                  : "bg-white divide-gray-200"
              } divide-y`}
            >
              {dashboardData?.students_by_class.map((classItem, index) => {
                const studentsInClass = students.filter(
                  (student) => student.class === classItem.kelas
                );
                const studentsWithChoice = studentsInClass.filter(
                  (student) => student.has_choice
                ).length;
                const completionRate =
                  classItem.student_count > 0
                    ? (studentsWithChoice / classItem.student_count) * 100
                    : 0;

                return (
                  <tr
                    key={index}
                    className={`${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    } cursor-pointer transition-colors`}
                    onClick={() => onClassClick(classItem)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {classItem.kelas}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {classItem.student_count}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {studentsWithChoice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-16 rounded-full h-2 mr-2 ${
                            darkMode ? "bg-gray-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {completionRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
