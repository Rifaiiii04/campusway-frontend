"use client";

import { useState, useEffect } from "react";
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
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardOverview {
  total_students: number;
  total_classes: number;
  total_test_results: number;
  completed_tests: number;
  completion_rate: number;
}

interface Student {
  id: number;
  nis: string;
  name: string;
  gender: string;
  school_class: {
    name: string;
    grade: string;
  };
  latest_test_result?: {
    total_score: number;
    recommended_major: string;
    major_confidence: number;
    test_date: string;
  };
}

interface MajorStatistic {
  major: string;
  count: number;
}

interface ClassSummary {
  class_id: number;
  class_name: string;
  grade: string;
  total_students: number;
  total_tests: number;
  completed_tests: number;
  completion_rate: number;
  average_score: number;
}

export default function SchoolDashboard() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [majorStats, setMajorStats] = useState<MajorStatistic[]>([]);
  const [classSummary, setClassSummary] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate class summary when students data changes
  useEffect(() => {
    if (students.length > 0) {
      const classSummaryData = students.reduce((acc: any[], student) => {
        const existingClass = acc.find(cls => cls.class_name === student.school_class?.name);
        if (existingClass) {
          existingClass.total_students++;
          if (student.latest_test_result) {
            existingClass.completed_tests++;
            existingClass.total_score += student.latest_test_result.total_score;
          }
        } else {
          acc.push({
            class_id: student.school_class?.id || 0,
            class_name: student.school_class?.name || "Unknown",
            grade: student.school_class?.name || "Unknown",
            total_students: 1,
            total_tests: 1,
            completed_tests: student.latest_test_result ? 1 : 0,
            completion_rate: student.latest_test_result ? 100 : 0,
            average_score: student.latest_test_result?.total_score || 0,
            total_score: student.latest_test_result?.total_score || 0,
          });
        }
        return acc;
      }, []);

      // Calculate completion rates and average scores
      classSummaryData.forEach(cls => {
        cls.completion_rate = cls.total_students > 0 ? Math.round((cls.completed_tests / cls.total_students) * 100) : 0;
        cls.average_score = cls.completed_tests > 0 ? Math.round(cls.total_score / cls.completed_tests) : 0;
      });

      setClassSummary(classSummaryData);
    }
  }, [students]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("school_token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      // Import apiService
      const { apiService } = await import("@/services/api");

      let dashboardData = null;
      let studentsData = [];
      let majorStatsData = [];

      try {
        // Fetch dashboard data using apiService
        const dashboardResponse = await apiService.getDashboard();
        if (dashboardResponse.success && dashboardResponse.data) {
          dashboardData = dashboardResponse.data;
          setOverview({
            total_students: dashboardData.statistics.total_students,
            total_classes: dashboardData.students_by_class.length,
            total_test_results: dashboardData.statistics.students_with_choice,
            completed_tests: dashboardData.statistics.students_with_choice,
            completion_rate: dashboardData.statistics.completion_percentage,
          });
        }
      } catch (dashboardError) {
        console.warn("Dashboard data fetch failed:", dashboardError);
        // Set fallback overview data
        setOverview({
          total_students: 0,
          total_classes: 0,
          total_test_results: 0,
          completed_tests: 0,
          completion_rate: 0,
        });
        
        // Show specific error message for 500 errors
        if (dashboardError instanceof Error && dashboardError.message.includes("500")) {
          setError("Server sedang mengalami masalah. Silakan coba lagi nanti atau hubungi administrator.");
        } else {
          setError("Gagal memuat data dashboard. Pastikan koneksi internet stabil.");
        }
      }

      try {
        // Fetch students data using apiService
        const studentsResponse = await apiService.getStudents();
        if (studentsResponse.success && studentsResponse.data) {
          studentsData = studentsResponse.data.students;
          setStudents(studentsData);
        }
      } catch (studentsError) {
        console.warn("Students data fetch failed:", studentsError);
        setStudents([]);
        
        // Show specific error message for 500 errors
        if (studentsError instanceof Error && studentsError.message.includes("500")) {
          setError("Server sedang mengalami masalah. Data siswa tidak dapat dimuat.");
        }
      }

      try {
        // Fetch major statistics using apiService
        const majorStatsResponse = await apiService.getMajorStatistics();
        if (majorStatsResponse.success && majorStatsResponse.data) {
          majorStatsData = majorStatsResponse.data.major_statistics.map(stat => ({
            major: stat.major_name,
            count: stat.student_count
          }));
          setMajorStats(majorStatsData);
        }
      } catch (majorStatsError) {
        console.warn("Major statistics fetch failed:", majorStatsError);
        setMajorStats([]);
        
        // Show specific error message for 500 errors
        if (majorStatsError instanceof Error && majorStatsError.message.includes("500")) {
          setError("Server sedang mengalami masalah. Statistik jurusan tidak dapat dimuat.");
        }
      }

      // If we have students data but no dashboard data, calculate overview from students
      if (studentsData.length > 0 && !dashboardData) {
        const totalStudents = studentsData.length;
        const studentsWithChoice = studentsData.filter(s => s.has_choice).length;
        const completionRate = totalStudents > 0 ? Math.round((studentsWithChoice / totalStudents) * 100) : 0;
        
        // Get unique classes
        const uniqueClasses = [...new Set(studentsData.map(s => s.school_class?.name).filter(Boolean))];
        
        setOverview({
          total_students: totalStudents,
          total_classes: uniqueClasses.length,
          total_test_results: studentsWithChoice,
          completed_tests: studentsWithChoice,
          completion_rate: completionRate,
        });
      }

      // If we have students data but no major stats, calculate from students
      if (studentsData.length > 0 && majorStatsData.length === 0) {
        const majorCounts: { [key: string]: number } = {};
        studentsData.forEach(student => {
          if (student.chosen_major?.name) {
            majorCounts[student.chosen_major.name] = (majorCounts[student.chosen_major.name] || 0) + 1;
          }
        });
        
        const calculatedMajorStats = Object.entries(majorCounts).map(([major, count]) => ({
          major,
          count
        }));
        setMajorStats(calculatedMajorStats);
      }

    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      
      // Provide specific error messages based on error type
      if (err instanceof Error) {
        if (err.message.includes('ECONNREFUSED') || err.message.includes('Failed to fetch')) {
          setError("Server backend tidak berjalan. Silakan jalankan server Laravel terlebih dahulu.");
        } else if (err.message.includes('timeout')) {
          setError("Server tidak merespons. Periksa koneksi dan coba lagi.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError("Failed to fetch dashboard data. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("school_token");
    window.location.reload();
  };

  const retryConnection = () => {
    fetchDashboardData();
  };

  const chartData = {
    majorDistribution: {
      labels:
        majorStats.length > 0
          ? majorStats.map((stat) => stat.major)
          : ["Tidak ada data"],
      datasets: [
        {
          label: "Jumlah Siswa",
          data:
            majorStats.length > 0 ? majorStats.map((stat) => stat.count) : [1],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6384",
            "#C9CBCF",
          ],
        },
      ],
    },
    classPerformance: {
      labels:
        classSummary.length > 0
          ? classSummary.map((cls) => cls.class_name)
          : ["Tidak ada data"],
      datasets: [
        {
          label: "Rata-rata Skor",
          data:
            classSummary.length > 0
              ? classSummary.map((cls) => cls.average_score)
              : [0],
          backgroundColor: "#36A2EB",
        },
        {
          label: "Tingkat Penyelesaian (%)",
          data:
            classSummary.length > 0
              ? classSummary.map((cls) => cls.completion_rate)
              : [0],
          backgroundColor: "#FFCE56",
        },
      ],
    },
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="text-center">
          <div
            className={`text-xl mb-4 ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Loading Dashboard...
          </div>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Mengambil data dari backend...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="text-red-800 font-medium">Error Koneksi</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>

            <div className="space-y-3">
              <button
                onClick={retryConnection}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Coba Lagi
              </button>

              {error.includes("500") && (
                <button
                  onClick={() => {
                    setError("");
                    setLoading(false);
                    // Set fallback data
                    setOverview({
                      total_students: 0,
                      total_classes: 0,
                      total_test_results: 0,
                      completed_tests: 0,
                      completion_rate: 0,
                    });
                    setStudents([]);
                    setMajorStats([]);
                  }}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Lanjutkan dengan Data Kosong
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </div>

            <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Troubleshooting:</strong>
                <br />
                1. <strong>Jalankan server Laravel backend:</strong>
                <br />
                &nbsp;&nbsp;&nbsp;• Buka terminal di folder backend
                <br />
                &nbsp;&nbsp;&nbsp;• Jalankan: <code>php artisan serve --host=0.0.0.0 --port=8000</code>
                <br />
                2. Pastikan database terhubung dan migrasi sudah dijalankan
                <br />
                3. Periksa file <code>.env</code> di folder backend
                <br />
                4. Cek console browser untuk detail error
                <br />
                5. Pastikan port 8000 tidak digunakan aplikasi lain
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Dashboard Sekolah
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow p-6`}
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
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
                    {overview.total_students}
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
                    {overview.total_classes}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Tes Selesai
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {overview.completed_tests}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-orange-600"
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
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Tingkat Penyelesaian
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {overview.completion_rate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Major Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribusi Jurusan Rekomendasi
            </h3>
            <div className="h-80">
              <Doughnut
                data={chartData.majorDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Class Performance Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performa Kelas
            </h3>
            <div className="h-80">
              <Bar
                data={chartData.classPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Siswa
            </h3>
          </div>
          <div className="overflow-x-auto">
            {students.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skor Tes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jurusan Rekomendasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.nis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.school_class.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.latest_test_result
                          ? student.latest_test_result.total_score
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.latest_test_result
                          ? student.latest_test_result.recommended_major
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.latest_test_result
                          ? `${(
                              student.latest_test_result.major_confidence * 100
                            ).toFixed(1)}%`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Tidak ada data siswa yang tersedia
              </div>
            )}
          </div>
        </div>

        {/* Class Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Rekap Kelas</h3>
          </div>
          <div className="overflow-x-auto">
            {classSummary.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tes Selesai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tingkat Penyelesaian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rata-rata Skor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classSummary.map((cls) => (
                    <tr key={cls.class_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cls.class_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cls.total_students}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cls.completed_tests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cls.completion_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cls.average_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Tidak ada data kelas yang tersedia
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
