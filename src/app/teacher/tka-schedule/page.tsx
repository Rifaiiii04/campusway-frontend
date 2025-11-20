import { Suspense } from "react";
import { Metadata } from "next";
import PageTitle from "../../../components/PageTitle";
import TeacherTkaScheduleClient from "../../../components/teacher/TeacherTkaScheduleClient";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Jadwal ArahPotensi - Dashboard Guru",
  description: "Jadwal pelaksanaan Tes Kemampuan Akademik",
};

export default function TeacherTkaSchedulePage() {
  return (
    <>
      <PageTitle
        title="Jadwal ArahPotensi - Dashboard Guru"
        description="Jadwal pelaksanaan Tes Kemampuan Akademik"
      />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                Memuat Jadwal ArahPotensi...
              </h2>
            </div>
          </div>
        }
      >
        <TeacherTkaScheduleClient />
      </Suspense>
    </>
  );
}
