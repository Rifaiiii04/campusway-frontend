export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-10">
            ✨ Fitur Unggulan
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-10">
            Mengapa Memilih
            <span className="text-blue-600"> FITME</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Platform yang dirancang khusus untuk membantu siswa/i menemukan
            jurusan yang tepat berdasarkan analisis mendalam dan data resmi
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="bg-white p-12 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200">
            <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mb-10">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Pemilihan Jurusan
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Pilih jurusan yang sesuai dengan minat dan bakat Anda dari
              berbagai pilihan yang tersedia dengan sistem rekomendasi
            </p>
          </div>

          <div className="bg-white p-12 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-200">
            <div className="w-20 h-20 bg-green-600 rounded-xl flex items-center justify-center mb-10">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Mata Pelajaran
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Dapatkan rekomendasi mata pelajaran yang harus dipelajari
              berdasarkan data resmi Pusmendik untuk persiapan yang optimal
            </p>
          </div>

          <div className="bg-white p-12 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-200">
            <div className="w-20 h-20 bg-purple-600 rounded-xl flex items-center justify-center mb-10">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Rekomendasi Personal
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Dapatkan rekomendasi yang disesuaikan dengan kemampuan dan minat
              pribadi Anda berdasarkan data resmi
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
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
            <h4 className="font-bold text-gray-900 mb-4 text-lg">
              Cepat & Akurat
            </h4>
            <p className="text-gray-600">Hasil dalam hitungan detik</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h4 className="font-bold text-gray-900 mb-4 text-lg">
              Data Terpercaya
            </h4>
            <p className="text-gray-600">Berdasarkan Pusmendik</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-purple-600"
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
            <h4 className="font-bold text-gray-900 mb-4 text-lg">
              Aman & Privat
            </h4>
            <p className="text-gray-600">Data terlindungi</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-orange-600"
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
            </div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Gratis</h4>
            <p className="text-gray-600">Tanpa biaya tersembunyi</p>
          </div>
        </div>
      </div>
    </section>
  );
}
