"use client";

import { useState } from "react";

interface NewClass {
  name: string;
}

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClass: (classData: NewClass) => void;
  darkMode: boolean;
}

export default function AddClassModal({
  isOpen,
  onClose,
  onAddClass,
  darkMode,
}: AddClassModalProps) {
  const [newClass, setNewClass] = useState<NewClass>({
    name: "",
  });

  const handleInputChange = (field: keyof NewClass, value: string) => {
    setNewClass((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClass.name.trim()) {
      onAddClass(newClass);
      setNewClass({
        name: "",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/30 to-gray-900/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-800/95"
            : "bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95"
        } backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border ${
          darkMode ? "border-gray-600/50" : "border-gray-200/50"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-5 border-b ${
            darkMode
              ? "border-gray-600/50 bg-gradient-to-r from-gray-700/90 via-gray-800/90 to-gray-700/90"
              : "border-gray-200/50 bg-gradient-to-r from-green-50/90 via-emerald-50/90 to-teal-50/90"
          } backdrop-blur-sm rounded-t-2xl flex-shrink-0`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Tambah Kelas Baru
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Buat kelas baru untuk mengelompokkan siswa
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  darkMode
                    ? "text-gray-400 group-hover:text-gray-200"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Form Field */}
            <div className="mb-6">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Nama Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newClass.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Contoh: XII TKJ 1, XI TKRO 2, X MM 1, dll"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 hover:border-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                  }`}
                />
                <p
                  className={`text-xs mt-2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Masukkan nama kelas sesuai dengan sistem sekolah (SMK: XII
                  TKJ/AK/MM, SMA: XII IPA/IPS, dll)
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div
              className={`${
                darkMode
                  ? "bg-gradient-to-r from-gray-700/80 to-gray-800/80"
                  : "bg-gradient-to-r from-green-50/80 to-emerald-50/80"
              } backdrop-blur-sm rounded-2xl p-5 border ${
                darkMode ? "border-gray-600/50" : "border-green-200/50"
              } mb-6`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3
                    className={`text-lg font-semibold mb-3 ${
                      darkMode ? "text-green-300" : "text-green-900"
                    }`}
                  >
                    Informasi Penting
                  </h3>
                  <div
                    className={`space-y-2.5 ${
                      darkMode ? "text-green-200" : "text-green-800"
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm">
                        Kelas akan otomatis tersedia untuk pendaftaran siswa
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm">
                        Masukkan nama kelas sesuai dengan sistem sekolah Anda
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm">
                        Contoh: XII TKJ 1, XI TKRO 2, X MM 1, dll
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-5 border-t ${
            darkMode
              ? "border-gray-600/50 bg-gradient-to-r from-gray-700/90 to-gray-800/90"
              : "border-gray-200/50 bg-gradient-to-r from-gray-50/90 to-green-50/90"
          } backdrop-blur-sm rounded-b-2xl flex-shrink-0`}
        >
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 ${
                darkMode
                  ? "border-gray-500 text-gray-300 hover:bg-gray-600 hover:border-gray-400"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Batal</span>
              </div>
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Tambah Kelas</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
