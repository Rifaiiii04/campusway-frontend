"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageTitle from "../components/PageTitle";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect langsung ke halaman landing setelah component mount
    router.push("/landing");
  }, [router]);

  return (
    <>
      <PageTitle
        title="Arah Potensi"
        description="Portal sekolah untuk mengelola data siswa dan pencarian jurusan"
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat halaman...</p>
        </div>
      </div>
    </>
  );
}
