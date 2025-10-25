export default function TeacherTkaSchedulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-red-600">📅</span>
                Jadwal ArahPotensi
              </h1>
              <p className="text-gray-600 mt-2">
                Jadwal pelaksanaan Tes Kemampuan Akademik
              </p>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Halaman Jadwal TKA
            </h2>
            <p className="text-gray-600 mb-6">
              Halaman ini berfungsi dengan baik! Menu &quot;Jadwal TKA&quot; sekarang mengarah ke halaman yang benar.
            </p>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Navigasi berhasil diperbaiki!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}