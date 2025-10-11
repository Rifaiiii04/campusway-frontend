import { Suspense } from "react";
import { Metadata } from "next";
import PageTitle from "../../../components/PageTitle";
import StudentDashboardClient from "../../../components/student/StudentDashboardClient";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Dashboard Siswa - Portal Jurusan",
  description: "Portal siswa untuk mencari dan mendaftar jurusan yang diminati",
};

export default function StudentDashboardPage() {
  return (
    <>
      <PageTitle
        title="Dashboard Siswa - Portal Jurusan"
        description="Portal siswa untuk mencari dan mendaftar jurusan yang diminati"
      />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                Memuat Dashboard...
              </h2>
              <p className="text-gray-600 text-lg mt-2">
                Menyiapkan semuanya untuk Anda! ✨
              </p>
            </div>
          </div>
        }
      >
        <StudentDashboardClient />
      </Suspense>
    </>
  );
}
