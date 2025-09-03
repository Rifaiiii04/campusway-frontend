"use client";

import { useState, useEffect } from "react";
import { Student } from "../../services/api";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  student: Student | null;
  darkMode: boolean;
}

export default function EditStudentModal({
  isOpen,
  onClose,
  onSave,
  student,
  darkMode,
}: EditStudentModalProps) {
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (student) {
      setEditedStudent({ ...student });
    }
  }, [student]);

  const handleInputChange = (field: keyof Student, value: string) => {
    if (editedStudent) {
      setEditedStudent((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedStudent) {
      // If password section is shown and passwords are provided, include password
      if (showPasswordSection && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          alert("Password dan konfirmasi password tidak sama!");
          return;
        }
        if (newPassword.length < 6) {
          alert("Password minimal 6 karakter!");
          return;
        }
        onSave({ ...editedStudent, password: newPassword });
      } else {
        onSave(editedStudent);
      }
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordSection(!showPasswordSection);
    if (showPasswordSection) {
      // Reset password fields when hiding section
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!isOpen || !editedStudent) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/30 to-gray-900/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-800/95"
            : "bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95"
        } backdrop-blur-xl rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col border ${
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Edit Data Siswa
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Perbarui informasi siswa
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
            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editedStudent.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Masukkan nama lengkap siswa"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 hover:border-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  NISN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editedStudent.nisn}
                  onChange={(e) => handleInputChange("nisn", e.target.value)}
                  placeholder="Masukkan Nomor Induk Siswa"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 hover:border-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Kelas <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={editedStudent.class}
                  onChange={(e) => handleInputChange("class", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                      : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
                  }`}
                >
                  <option value="X IPA 1">X IPA 1</option>
                  <option value="X IPA 2">X IPA 2</option>
                  <option value="X IPS 1">X IPS 1</option>
                  <option value="X IPS 2">X IPS 2</option>
                  <option value="XI IPA 1">XI IPA 1</option>
                  <option value="XI IPA 2">XI IPA 2</option>
                  <option value="XI IPS 1">XI IPS 1</option>
                  <option value="XI IPS 2">XI IPS 2</option>
                  <option value="XII IPA 1">XII IPA 1</option>
                  <option value="XII IPA 2">XII IPA 2</option>
                  <option value="XII IPS 1">XII IPS 1</option>
                  <option value="XII IPS 2">XII IPS 2</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={editedStudent.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Masukkan alamat email"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 hover:border-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={editedStudent.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Masukkan nomor telepon"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 hover:border-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Password Change Section */}
            <div className="mt-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Ganti Password
                </h3>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    showPasswordSection
                      ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
                  }`}
                >
                  {showPasswordSection ? "Batal" : "Ganti Password"}
                </button>
              </div>

              {showPasswordSection && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Password Baru <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru (min. 6 karakter)"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 hover:border-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Konfirmasi Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi password baru"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 hover:border-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                      }`}
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Password minimal 6 karakter. Kosongkan jika tidak ingin mengubah password.
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Simpan Perubahan</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
