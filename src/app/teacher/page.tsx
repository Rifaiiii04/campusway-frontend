'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TeacherDashboard from '../../components/TeacherDashboard';
import PageTitle from '../../components/PageTitle';

interface SchoolData {
  id: number;
  npsn: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export default function TeacherPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);

  useEffect(() => {
    checkAuthentication();
  }, [router]);

  const checkAuthentication = () => {
    // Cek apakah ada token di localStorage
    const token = localStorage.getItem('school_token');
    const storedSchoolData = localStorage.getItem('school_data');
    
    if (token && storedSchoolData) {
      try {
        const parsedSchoolData = JSON.parse(storedSchoolData);
        setSchoolData(parsedSchoolData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing school data:', error);
        // Jika data tidak valid, hapus dan redirect ke login
        localStorage.removeItem('school_token');
        localStorage.removeItem('school_data');
        router.push('/login');
      }
    } else {
      // Redirect ke halaman login jika tidak ada token
      router.push('/login');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    // Hapus token dan data dari localStorage
    localStorage.removeItem('school_token');
    localStorage.removeItem('school_data');
    
    // Redirect ke halaman login
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          {/* Modern Loading Animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            {/* Animated Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-indigo-500 rounded-full animate-spin"></div>
            {/* Inner Dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              Memuat Dashboard Guru...
            </h2>
            <p className="text-gray-600 text-lg">
              Memverifikasi autentikasi dan menyiapkan data... 🔐
            </p>
          </div>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Akan redirect ke login
  }

  return (
    <>
      <PageTitle 
        title="Dashboard Guru - Sistem TKA" 
        description="Dashboard utama guru untuk mengelola data siswa, kelas, dan hasil tes TKA"
      />
      
      {/* School Info Header */}
      {schoolData && (
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {schoolData.name}
                </h1>
                <p className="text-sm text-gray-600">
                  NPSN: {schoolData.npsn}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
      <TeacherDashboard />
    </>
  );
}
