import { Suspense } from "react";
import { Metadata } from "next";
import PageTitle from "../../components/PageTitle";
import TeacherDashboardClient from "../../components/teacher/TeacherDashboardClient";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Dashboard Guru - Sistem TKA",
  description:
    "Dashboard utama guru untuk mengelola data siswa, kelas, dan hasil tes TKA",
};

export default function TeacherPage() {
  return (
    <>
      <PageTitle
        title="Dashboard Guru - Sistem TKA"
        description="Dashboard utama guru untuk mengelola data siswa, kelas, dan hasil tes TKA"
      />
      <Suspense
        fallback={
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
        }
      >
        <TeacherDashboardClient />
      </Suspense>
    </>
  );
}
