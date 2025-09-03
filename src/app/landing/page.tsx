'use client';

import Link from 'next/link';
import PageTitle from '../../components/PageTitle';

export default function LandingPage() {
  return (
    <>
      <PageTitle 
        title="Sistem TKA - Landing Page" 
        description="Tes Kemampuan Akademik - Platform untuk membantu siswa menentukan jurusan yang tepat"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Sistem TKA
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tes Kemampuan Akademik - Platform untuk membantu siswa menentukan jurusan yang tepat
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Guru Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Guru</h3>
              <p className="text-gray-600 mb-6">
                Akses dashboard untuk melihat hasil tes siswa, statistik kelas, dan laporan akademik
              </p>
              <Link 
                href="/login" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full"
              >
                Login Sebagai Guru
              </Link>
            </div>
            {/* Siswa Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tes Siswa</h3>
              <p className="text-gray-600 mb-6">
                Ikuti tes kemampuan akademik untuk mengetahui jurusan yang paling sesuai
              </p>
              <Link 
                href="/student" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full"
              >
                Login Sebagai Siswa
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
