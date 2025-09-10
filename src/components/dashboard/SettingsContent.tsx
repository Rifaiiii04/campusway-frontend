"use client";

interface SettingsContentProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsContent({
  darkMode,
  onToggleDarkMode,
}: SettingsContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow`}
          >
            <div
              className={`px-6 py-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Profil Guru
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    defaultValue="Guru ArahPotensi"
                    placeholder="Masukkan nama lengkap guru"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="guru@tka.sch.id"
                    placeholder="Masukkan alamat email guru"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    NIP
                  </label>
                  <input
                    type="text"
                    defaultValue="197001012000031001"
                    placeholder="Masukkan NIP guru"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    defaultValue="+62 812-3456-7890"
                    placeholder="Masukkan nomor telepon guru"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow`}
          >
            <div
              className={`px-6 py-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Pengaturan Sistem
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Notifikasi Email
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Terima notifikasi untuk hasil tes baru
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Auto Backup
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Backup otomatis data setiap hari
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Mode Gelap
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Menggunakan tema gelap untuk interface
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={onToggleDarkMode}
                  />
                  <div
                    className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      darkMode
                        ? "bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow`}
          >
            <div
              className={`px-6 py-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Keamanan
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password Lama
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password lama"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password Baru
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password baru"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  placeholder="Konfirmasi password baru"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Ubah Password
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow`}
          >
            <div
              className={`px-6 py-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Aksi Cepat
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <button
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-red-900/50 text-red-300 hover:bg-red-800/50"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Export Data Siswa
                </div>
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-green-900/50 text-green-300 hover:bg-green-800/50"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Import Data Siswa
                </div>
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-yellow-900/50 text-yellow-300 hover:bg-yellow-800/50"
                    : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                }`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Generate Laporan
                </div>
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Backup Data
                </div>
              </button>
            </div>
          </div>

          {/* System Info */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow`}
          >
            <div
              className={`px-6 py-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Info Sistem
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Versi Sistem
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  v1.0.0
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Last Backup
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  2024-01-20
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Storage Used
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  2.5 GB
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Active Users
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  150 siswa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
