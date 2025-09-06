import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-32 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-full mb-12">
            🚀 Mulai Perjalananmu Sekarang
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-10 leading-tight">
            Siap Memulai
            <br />
            <span className="text-yellow-300">Perjalananmu?</span>
          </h2>

          <p className="text-xl text-blue-100 mb-20 max-w-4xl mx-auto leading-relaxed">
            Temukan jurusan yang tepat untuk masa depanmu dengan FITME. Pilih
            jurusan sekarang dan dapatkan rekomendasi yang akurat berdasarkan
            data resmi Pusmendik.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <Link
              href="/student"
              className="inline-flex items-center justify-center px-12 py-6 border border-transparent text-lg font-semibold rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 mr-3"
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
              Pilih Jurusan Sekarang
              <svg
                className="w-5 h-5 ml-3"
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
              className="inline-flex items-center justify-center px-12 py-6 border-2 border-white text-lg font-semibold rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Login Sebagai Guru
              <svg
                className="w-5 h-5 ml-3"
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
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
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
              </div>
              <h4 className="text-xl font-bold text-white mb-4">100% Gratis</h4>
              <p className="text-blue-100 text-lg">Tanpa biaya tersembunyi</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
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
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                Cepat & Akurat
              </h4>
              <p className="text-blue-100 text-lg">
                Hasil dalam hitungan detik
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
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
              </div>
              <h4 className="text-xl font-bold text-white mb-4">
                Aman & Privat
              </h4>
              <p className="text-blue-100 text-lg">
                Data terlindungi dengan baik
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
