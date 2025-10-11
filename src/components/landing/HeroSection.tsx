"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className=" bg-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-16">
            <div className="space-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-red-50 text-red-700 text-sm font-medium rounded-full">
                🎓 Platform Pemilihan Jurusan Terpercaya
              </div>

              <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Temukan Jurusan yang
                <span className="text-red-800"> Tepat </span>
                untuk Masa Depanmu
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Platform pemilihan jurusan yang membantu siswa/i menentukan
                jurusan perkuliahan yang paling sesuai dengan minat, bakat, dan
                kemampuan mereka berdasarkan data resmi Pusmendik.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/student"
                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-[#800000] hover:bg-[#800000] transition-colors duration-200"
              >
                Pilih Jurusan Sekarang
                <svg
                  className="ml-3 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-10 py-4 border border-gray-300 text-lg font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Login Sebagai Guru
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-16">
              <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Data Resmi Pusmendik
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Hasil Cepat & Akurat
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    100% Gratis & Aman
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    50+ Jurusan Tersedia
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#800000] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Pilih Jurusan Impianmu
                  </h3>
                  <p className="text-gray-600">
                    Temukan jurusan yang sesuai dengan minat dan bakat
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg rounded-lg border border-red-100 bg-red-50">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-gray-800 text-sm">
                      Ilmu Komputer
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-800 text-sm">
                      Kedokteran
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-gray-800 text-sm">
                      Psikologi
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-gray-800 text-sm">
                      Akuntansi
                    </span>
                  </div>
                </div>

                <div className="bg-[#800000] text-white p-4 rounded-lg text-center">
                  <p className="font-semibold">Dapatkan Rekomendasi</p>
                  <p className="text-xs opacity-90 mt-1">
                    Berdasarkan data resmi Pusmendik
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
