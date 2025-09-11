"use client";

import { useState } from "react";
import ErrorModal from "./modals/ErrorModal";
import Link from "next/link";
import { studentApiService } from "../services/api";

interface SchoolLoginProps {
  onLoginSuccess: (token: string) => void;
  userType?: "guru" | "siswa";
}

export default function SchoolLogin({
  onLoginSuccess,
  userType = "guru",
}: SchoolLoginProps) {
  const [npsn, setNpsn] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLoadingMessage("Memverifikasi kredensial...");

    try {
      console.log("🔍 Attempting login with:", { npsn, password });

      // Login siswa menggunakan API
      if (userType === "siswa") {
        console.log("🎓 Student login with API validation");
        setLoadingMessage("Memverifikasi data siswa...");

        // Tambahkan timeout untuk mencegah loading terlalu lama
        const loginPromise = studentApiService.login(npsn, password);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout: Server tidak merespons")),
            10000
          )
        );

        const response = (await Promise.race([
          loginPromise,
          timeoutPromise,
        ])) as {
          success: boolean;
          data: {
            student: {
              id: number;
              name: string;
              nisn: string;
              class?: string;
              kelas?: string;
              email: string;
              phone: string;
              parent_phone?: string;
              school_name?: string;
              has_choice?: boolean;
            };
          };
          message?: string;
        };

        if (response.success) {
          console.log("✅ Student login successful!");
          console.log("📊 Student data from API:", response.data.student);

          // Simpan data siswa di localStorage
          localStorage.setItem("student_token", "student_session_token");
          localStorage.setItem(
            "student_data",
            JSON.stringify(response.data.student)
          );

          onLoginSuccess("student_session_token");
          return;
        } else {
          throw new Error(response.message || "Login siswa gagal");
        }
      }

      // Validasi normal untuk guru
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://127.0.0.1:8000/api/school";
      console.log("🌐 API Base URL:", apiBaseUrl);
      setLoadingMessage("Memverifikasi data sekolah...");

      // Tambahkan timeout untuk mencegah loading terlalu lama
      const fetchPromise = fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          npsn: npsn,
          password: password,
        }),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout: Server tidak merespons")),
          10000
        )
      );

      const response = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as Response;

      if (!response.ok) {
        // Handle non-JSON responses (like 404 HTML pages)
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await response.json();
          throw new Error(
            data.message || `HTTP ${response.status}: ${response.statusText}`
          );
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();

      if (data.success) {
        console.log("✅ Login successful!");
        localStorage.setItem("school_token", data.data.token);
        localStorage.setItem("school_data", JSON.stringify(data.data.school));
        onLoginSuccess(data.data.token);
      } else {
        throw new Error(data.message || "Login gagal");
      }
    } catch (err: unknown) {
      console.error("💥 Error during login:", err);

      let errorMessage = "Terjadi kesalahan saat login";

      if (err instanceof Error) {
        const message = err.message.toLowerCase();

        // Handle specific error cases
        if (
          message.includes("password salah") ||
          message.includes("invalid password")
        ) {
          errorMessage =
            userType === "guru"
              ? "Password salah. Silakan periksa kembali password Anda."
              : "Password salah. Silakan periksa kembali password Anda.";
        } else if (
          message.includes("npsn tidak ditemukan") ||
          message.includes("nisn tidak ditemukan")
        ) {
          errorMessage =
            userType === "guru"
              ? "NPSN tidak ditemukan. Silakan periksa kembali NPSN sekolah Anda."
              : "NISN tidak ditemukan. Silakan periksa kembali NISN Anda.";
        } else if (
          message.includes("timeout") ||
          message.includes("server tidak merespons")
        ) {
          errorMessage =
            "Server tidak merespons. Silakan coba lagi dalam beberapa saat.";
        } else if (message.includes("network") || message.includes("fetch")) {
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        } else if (
          message.includes("unauthorized") ||
          message.includes("401")
        ) {
          errorMessage =
            userType === "guru"
              ? "NPSN atau password salah. Silakan periksa kembali kredensial Anda."
              : "NISN atau password salah. Silakan periksa kembali kredensial Anda.";
        } else if (message.includes("not found") || message.includes("404")) {
          errorMessage =
            userType === "guru"
              ? "NPSN tidak ditemukan dalam sistem."
              : "NISN tidak ditemukan dalam sistem.";
        } else {
          // Use the original error message if it's user-friendly
          errorMessage = err.message;
        }
      }

      // Show modal for critical errors, inline for minor ones
      if (
        errorMessage.includes("Password") ||
        errorMessage.includes("NPSN") ||
        errorMessage.includes("NISN")
      ) {
        setErrorTitle(
          errorMessage.includes("Password")
            ? "Password Salah"
            : errorMessage.includes("NPSN") || errorMessage.includes("NISN")
            ? "Kredensial Tidak Ditemukan"
            : "Login Gagal"
        );
        setError(errorMessage);
        setShowErrorModal(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-lg flex items-center justify-center shadow-lg mb-6">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === "guru" ? "Dashboard Guru" : "Login Siswa"}
          </h2>
          <p className="text-gray-600">
            {userType === "guru"
              ? "Masuk menggunakan NPSN dan password Anda"
              : "Masuk menggunakan NISN dan password Anda"}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* NPSN/NIS Input */}
            <div>
              <label
                htmlFor="npsn"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {userType === "guru" ? "NPSN Sekolah" : "NISN Siswa"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <input
                  id="npsn"
                  name="npsn"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black transition-all duration-200 placeholder-black/50"
                  placeholder={
                    userType === "guru"
                      ? "Masukkan NPSN sekolah"
                      : "Masukkan NISN siswa"
                  }
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black transition-all duration-200 placeholder-black/50"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 mb-1">
                      {error.includes("Password")
                        ? "Password Salah"
                        : error.includes("NPSN") || error.includes("NISN")
                        ? "Kredensial Tidak Ditemukan"
                        : error.includes("Server")
                        ? "Masalah Koneksi"
                        : "Login Gagal"}
                    </h3>
                    <p className="text-sm text-red-600">{error}</p>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setError("")}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        Tutup pesan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                  userType === "guru"
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {loadingMessage ||
                      (userType === "guru"
                        ? "Memproses Login Guru..."
                        : "Memproses Login Siswa...")}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {userType === "guru" ? (
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    )}
                    {userType === "guru" ? "Masuk ke Dashboard Guru" : "Masuk"}
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div>
            <Link
              href="/landing"
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              ← Kembali ke Halaman Utama
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            &copy; 2025 Arah Potensi. All rights reserved. Dibuat Oleh Mahasiswa
            FICT Horizon University
          </p>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setError("");
        }}
        title={errorTitle}
        message={error}
        type="error"
      />
    </div>
  );
}
