"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import TeacherDashboard from "../TeacherDashboard";
import { usePerformance } from "@/components/providers/PerformanceProvider";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface SchoolData {
  id: number;
  npsn: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export default function TeacherDashboardClient() {
  const router = useRouter();
  const { startTiming } = usePerformance();
  const hasInitialized = useRef(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);

  const checkAuthentication = useCallback(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const endTiming = startTiming("teacher_authentication_check");

    try {
      // Cek apakah ada token di localStorage
      const token = localStorage.getItem("school_token");
      const storedSchoolData = localStorage.getItem("school_data");

      console.log("🔍 Checking authentication:", {
        hasToken: !!token,
        hasSchoolData: !!storedSchoolData,
        schoolDataValue: storedSchoolData,
      });

      if (
        token &&
        storedSchoolData &&
        storedSchoolData !== "undefined" &&
        storedSchoolData !== "null" &&
        storedSchoolData.trim() !== ""
      ) {
        try {
          const parsedSchoolData = JSON.parse(storedSchoolData);
          console.log("✅ Successfully parsed school data:", parsedSchoolData);
          setSchoolData(parsedSchoolData);
          setIsAuthenticated(true);
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError);
          console.log("🔍 Problematic data:", storedSchoolData);
          // Clear invalid data
          localStorage.removeItem("school_token");
          localStorage.removeItem("school_data");
          setIsAuthenticated(false);
          router.push("/login");
        }
      } else {
        console.log(
          "⚠️ Missing or invalid authentication data, redirecting to login"
        );
        // Redirect ke halaman login jika tidak ada token
        router.push("/login");
      }
    } catch (error) {
      console.error("❌ Error in authentication check:", error);
      // Jika data tidak valid, hapus dan redirect ke login
      localStorage.removeItem("school_token");
      localStorage.removeItem("school_data");
      setIsAuthenticated(false);
      router.push("/login");
    } finally {
      setLoading(false);
      endTiming();
    }
  }, [router, startTiming]);

  const handleLogout = useCallback(() => {
    // Hapus token dan data dari localStorage
    localStorage.removeItem("school_token");
    localStorage.removeItem("school_data");

    // Redirect ke halaman login
    router.push("/login");
  }, [router]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Memuat Dashboard Guru...
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Memverifikasi autentikasi dan menyiapkan data... 🔐
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Akan redirect ke login
  }

  return (
    <>
      {/* School Info Header */}
      {schoolData && (
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {schoolData.name}
                </h1>
                <p className="text-sm text-gray-600">NPSN: {schoolData.npsn}</p>
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
