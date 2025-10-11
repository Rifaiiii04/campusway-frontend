"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SchoolLogin from "../../components/SchoolLogin";
import StudentRegistration from "../../components/StudentRegistration";
import PageTitle from "../../components/PageTitle";

export default function StudentLoginPage() {
  const router = useRouter();
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLoginSuccess = () => {
    // Redirect ke halaman tes siswa setelah login berhasil
    router.push("/student/dashboard");
  };

  const handleRegistrationSuccess = () => {
    // Setelah registrasi berhasil, redirect ke dashboard
    router.push("/student/dashboard");
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
  };

  return (
    <>
      <PageTitle
        title={
          showRegistration
            ? "Registrasi Siswa - Sistem ArahPotensi"
            : "Login Siswa - Sistem ArahPotensi"
        }
        description={
          showRegistration
            ? "Halaman registrasi untuk siswa baru"
            : "Halaman login untuk siswa mengakses tes ArahPotensi"
        }
      />
      {showRegistration ? (
        <StudentRegistration
          onRegistrationSuccess={handleRegistrationSuccess}
          onBackToLogin={handleBackToLogin}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            {/* Login Component */}
            <SchoolLogin onLoginSuccess={handleLoginSuccess} userType="siswa" />

            {/* Registration Link */}
            <div className="text-center">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum punya akun?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Daftarkan akun siswa baru untuk mengakses tes kemampuan
                  akademik
                </p>
                <button  
                  onClick={handleShowRegistration}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Daftar Akun Siswa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
