'use client';

import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

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

interface TestResult {
  id: number;
  student: {
    name: string;
    nis: string;
    school_class: {
      name: string;
    };
  };
  total_score: number;
  recommended_major: string;
  major_confidence: number;
  test_date: string;
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
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [majorStats, setMajorStats] = useState<MajorStatistic[]>([]);
  const [classSummary, setClassSummary] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('school_token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Fetch overview data
      const overviewResponse = await fetch('http://127.0.0.1:8000/api/school/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json();
        setOverview(overviewData.data);
      }

      // Fetch students data
      const studentsResponse = await fetch('http://127.0.0.1:8000/api/school/dashboard/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.data);
      }

      // Fetch test results data
      const testResultsResponse = await fetch('http://127.0.0.1:8000/api/school/dashboard/test-results', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (testResultsResponse.ok) {
        const testResultsData = await testResultsResponse.json();
        setTestResults(testResultsData.data);
      }

      // Fetch major statistics
      const majorStatsResponse = await fetch('http://127.0.0.1:8000/api/school/dashboard/major-statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (majorStatsResponse.ok) {
        const majorStatsData = await majorStatsResponse.json();
        setMajorStats(majorStatsData.data);
      }

      // Fetch class summary
      const classSummaryResponse = await fetch('http://127.0.0.1:8000/api/school/dashboard/class-summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (classSummaryResponse.ok) {
        const classSummaryData = await classSummaryResponse.json();
        setClassSummary(classSummaryData.data);
      }

    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('school_token');
    window.location.reload();
  };

  const retryConnection = () => {
    fetchDashboardData();
  };

  const chartData = {
    majorDistribution: {
      labels: majorStats.length > 0 ? majorStats.map(stat => stat.major) : ['Tidak ada data'],
      datasets: [
        {
          label: 'Jumlah Siswa',
          data: majorStats.length > 0 ? majorStats.map(stat => stat.count) : [1],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
          ],
        },
      ],
    },
    classPerformance: {
      labels: classSummary.length > 0 ? classSummary.map(cls => cls.class_name) : ['Tidak ada data'],
      datasets: [
        {
          label: 'Rata-rata Skor',
          data: classSummary.length > 0 ? classSummary.map(cls => cls.average_score) : [0],
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Tingkat Penyelesaian (%)',
          data: classSummary.length > 0 ? classSummary.map(cls => cls.completion_rate) : [0],
          backgroundColor: '#FFCE56',
        },
      ],
    },
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className={`text-xl mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Loading Dashboard...</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mengambil data dari backend...</div>
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
              <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-red-800 font-medium">Error Koneksi</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            
            <div className="space-y-3">
              <button
                onClick={retryConnection}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Coba Lagi
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Troubleshooting:</strong><br />
                1. Pastikan backend Laravel berjalan di port 8000<br />
                2. Jalankan file <code>setup.bat</code> di folder backend<br />
                3. Periksa koneksi database SQL Server
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Dashboard Sekolah</h1>
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
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Siswa</p>
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{overview.total_students}</p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Kelas</p>
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{overview.total_classes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tes Selesai</p>
                  <p className="text-2xl font-semibold text-gray-900">{overview.completed_tests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tingkat Penyelesaian</p>
                  <p className="text-2xl font-semibold text-gray-900">{overview.completion_rate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Major Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Jurusan Rekomendasi</h3>
            <div className="h-80">
              <Doughnut 
                data={chartData.majorDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Class Performance Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performa Kelas</h3>
            <div className="h-80">
              <Bar 
                data={chartData.classPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
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
            <h3 className="text-lg font-semibold text-gray-900">Daftar Siswa</h3>
          </div>
          <div className="overflow-x-auto">
            {students.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor Tes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan Rekomendasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.school_class.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.latest_test_result ? student.latest_test_result.total_score : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.latest_test_result ? student.latest_test_result.recommended_major : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.latest_test_result ? `${(student.latest_test_result.major_confidence * 100).toFixed(1)}%` : '-'}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Siswa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tes Selesai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat Penyelesaian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rata-rata Skor</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classSummary.map((cls) => (
                    <tr key={cls.class_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.class_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.total_students}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.completed_tests}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.completion_rate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.average_score}</td>
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
