"use client";

import { useState, useEffect } from "react";

interface SettingsContentProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface SchoolData {
  id: number;
  npsn: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export default function SettingsContent({
  darkMode,
  onToggleDarkMode,
}: SettingsContentProps) {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    // Get school data from localStorage
    if (typeof window !== "undefined") {
      const storedSchoolData = localStorage.getItem("school_data");
      if (storedSchoolData) {
        try {
          const parsedData = JSON.parse(storedSchoolData);
          setSchoolData(parsedData);
        } catch (error) {
          console.error("Error parsing school data:", error);
        }
      }
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError("");
    if (passwordSuccess) setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!passwordData.newPassword) {
      setPasswordError("Password baru harus diisi");
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password minimal 6 karakter");
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Konfirmasi password tidak sesuai");
      setPasswordLoading(false);
      return;
    }

    try {
      // Get school token
      const token = localStorage.getItem("school_token");
      if (!token) {
        throw new Error("Anda belum login");
      }

      // Call API to change password using the same pattern as other API calls
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://103.23.198.101/super-admin/api/school";
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_password: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess("Password berhasil diubah");
        setPasswordData({ newPassword: "", confirmPassword: "" });
      } else {
        setPasswordError(data.message || "Gagal mengubah password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Terjadi kesalahan saat mengubah password");
    } finally {
      setPasswordLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* School Profile Settings */}
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
                Profil Sekolah
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  value={schoolData?.name ?? "Memuat..."}
                  readOnly
                  className={`w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed ${
                    darkMode
                      ? "bg-gray-600 border-gray-500 text-gray-300"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  NPSN
                </label>
                <input
                  type="text"
                  value={schoolData?.npsn ?? "Memuat..."}
                  readOnly
                  className={`w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed ${
                    darkMode
                      ? "bg-gray-600 border-gray-500 text-gray-300"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
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

          {/* Password Change */}
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
                Ubah Password
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Masukkan password baru"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    disabled={passwordLoading}
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
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Konfirmasi password baru"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    disabled={passwordLoading}
                  />
                </div>

                {/* Error Message */}
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{passwordError}</p>
                  </div>
                )}

                {/* Success Message */}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">{passwordSuccess}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    passwordLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                >
                  {passwordLoading ? "Mengubah Password..." : "Ubah Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
