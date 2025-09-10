export default function AboutSection() {
  return (
    <section id="about" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-6 py-3 bg-red-50 text-red-800 text-sm font-medium rounded-full mb-10">
            🎯 Tentang Kami
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-10">
            Mengapa
            <span className="text-red-800"> Arah Potensi</span>
            <br />
            Menjadi Pilihan Terbaik?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Platform inovatif yang dirancang khusus untuk membantu siswa/i
            SMA/SMK dalam menentukan jurusan perkuliahan yang tepat
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-16">
            <div className="space-y-10">
              <h3 className="text-3xl font-bold text-gray-900">
                Solusi Terpercaya untuk Masa Depan Pendidikan
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Arah Potensi adalah platform inovatif yang dirancang khusus
                untuk membantu siswa/i SMA/SMK dalam menentukan jurusan
                perkuliahan yang paling sesuai dengan kemampuan, minat, dan
                bakat mereka.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Dengan menggunakan data resmi dari Pusmendik, kami membantu
                ribuan siswa menemukan jalur pendidikan yang tepat untuk masa
                depan mereka.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="text-center p-10 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="text-4xl font-bold text-red-800 mb-4">
                  1000+
                </div>
                <div className="text-gray-600 font-medium text-lg">
                  Siswa Terbantu
                </div>
              </div>
              <div className="text-center p-10 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="text-4xl font-bold text-green-600 mb-4">
                  95%
                </div>
                <div className="text-gray-600 font-medium text-lg">
                  Tingkat Kepuasan
                </div>
              </div>
              <div className="text-center p-10 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  50+
                </div>
                <div className="text-gray-600 font-medium text-lg">
                  Jurusan Tersedia
                </div>
              </div>
              <div className="text-center p-10 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="text-4xl font-bold text-orange-600 mb-4">
                  24/7
                </div>
                <div className="text-gray-600 font-medium text-lg">
                  Akses Gratis
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="space-y-6">
                <div className="text-center mb-6">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Cara Kerja Arah Potensi
                  </h4>
                  <p className="text-gray-600">
                    Proses sederhana untuk hasil yang akurat
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2 text-sm">
                      Dashboard Guru
                    </h5>
                    <p className="text-gray-600 text-xs">
                      Kelola dan pantau hasil pemilihan jurusan siswa dengan
                      mudah
                    </p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2 text-sm">
                      Pilih Jurusan
                    </h5>
                    <p className="text-gray-600 text-xs">
                      Pilih jurusan yang sesuai dengan minat dan bakat pribadi
                    </p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2 text-sm">
                      Mata Pelajaran
                    </h5>
                    <p className="text-gray-600 text-xs">
                      Dapatkan rekomendasi mata pelajaran dari data resmi
                      Pusmendik
                    </p>
                  </div>
                </div>

                <div className="bg-[#800000] text-white p-4 rounded-xl text-center">
                  <p className="font-bold">Mulai Sekarang!</p>
                  <p className="opacity-90 mt-1 text-sm">
                    Bergabung dengan ribuan siswa yang telah menemukan jurusan
                    impian mereka
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
