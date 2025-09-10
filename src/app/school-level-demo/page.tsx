"use client";

import React from "react";
import SchoolLevelMajorSelector from "@/components/SchoolLevelMajorSelector";

export default function SchoolLevelDemoPage() {
  const handleMajorSelect = (major: unknown) => {
    console.log("Selected major:", major);
    const majorData = major as { major_name?: string };
    alert(`Anda memilih jurusan: ${majorData.major_name || "Unknown"}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎓 Demo Sistem Rekomendasi Jurusan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem pengkondisian major recommendations berdasarkan jenjang
            sekolah (SMK/MAK vs SMA/MA) yang sesuai dengan ketentuan Pusmendik
            Kemdikbud.
          </p>
        </div>

        <SchoolLevelMajorSelector
          onMajorSelect={handleMajorSelect}
          selectedSchoolLevel="SMA/MA"
        />

        <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📋 Informasi Sistem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏫</span>
                SMA/MA
              </h3>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• Mata pelajaran umum sesuai kurikulum</li>
                <li>• Fokus pada persiapan ke perguruan tinggi</li>
                <li>
                  • Mata pelajaran wajib: Matematika Lanjutan, Bahasa Indonesia
                  Lanjutan, Bahasa Inggris Lanjutan
                </li>
                <li>
                  • Mata pelajaran pilihan: Fisika, Kimia, Biologi, Ekonomi,
                  Sosiologi, Geografi, Sejarah, Antropologi, PPKn/Pendidikan
                  Pancasila, Bahasa Arab, Bahasa Jerman, Bahasa Prancis, Bahasa
                  Jepang, Bahasa Korea, Bahasa Mandarin, Produk/Projek Kreatif
                  dan Kewirausahaan
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🔧</span>
                SMK/MAK
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Mata pelajaran sesuai ketentuan Pusmendik</li>
                <li>• Fokus pada keterampilan praktis dan siap kerja</li>
                <li>• Mata pelajaran pilihan (1-18): Teknik, Bisnis, dll.</li>
                <li>• Produk/Projek Kreatif dan Kewirausahaan (19)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
