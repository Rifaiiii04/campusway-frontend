"use client";

import { useState, useEffect } from "react";
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

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Network connection restored");
      if (error.includes("Tidak ada koneksi internet")) {
        setError("");
      }
    };

    const handleOffline = () => {
      console.log("🌐 Network connection lost");
      if (loading) {
        setError("Koneksi internet terputus. Silakan periksa koneksi Anda.");
        setLoading(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, loading]);

  const handleLogin = async (e: React.FormEvent, retryCount: number = 0) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLoadingMessage("Memverifikasi kredensial...");

    // Check network connectivity
    if (!navigator.onLine) {
      setError("Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.");
      setLoading(false);
      return;
    }

    // Generate request ID for tracking
    const requestId = Math.random().toString(36).substr(2, 9);
    
    try {
      console.log(`🔍 [${requestId}] Attempting ${userType} login with:`, { 
        npsn: npsn.substring(0, 3) + "***", 
        hasPassword: !!password,
        retryCount,
        timestamp: new Date().toISOString()
      });
      
      // Check if this is a retry due to ERR_BLOCKED_BY_CLIENT
      const isBlockedRetry = retryCount > 0 && retryCount < 3;

      // Login siswa menggunakan API
      if (userType === "siswa") {
        console.log("🎓 Student login with API validation");
        setLoadingMessage("Memverifikasi data siswa...");

        // Tambahkan timeout untuk mencegah loading terlalu lama
        let loginPromise;
        try {
          // Try fallback URL if this is a retry due to blocking
          if (isBlockedRetry) {
            console.log("🔄 Using fallback URL for student login due to blocking");
            // Override the API service temporarily
            const fallbackUrl = "http://127.0.0.1:8001/api/web";
            const response = await fetch(`${fallbackUrl}/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ nisn: npsn, password: password }),
            });
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data.success) {
              console.log("✅ Student login successful with fallback URL!");
              localStorage.setItem("student_token", "student_session_token");
              localStorage.setItem("student_data", JSON.stringify(data.data.student));
              onLoginSuccess("student_session_token");
              return;
            } else {
              throw new Error(data.message || "Login siswa gagal");
            }
          } else {
            loginPromise = studentApiService.login(npsn, password);
          }
        } catch (error) {
          // Enhanced error logging for student login
          console.error(`💥 [${requestId}] Student login error:`, {
            error,
            retryCount,
            npsn: npsn.substring(0, 3) + "***",
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            online: navigator.onLine
          });

        // Retry for 500 errors, timeout, and network errors up to 2 times
        if (retryCount < 2 && error instanceof Error && 
            (error.message.includes("500") || 
             error.message.includes("Timeout") ||
             error.message.includes("Failed to fetch") ||
             error.message.includes("ERR_BLOCKED_BY_CLIENT") ||
             error.message.includes("err_blocked_by_client"))) {
          console.warn(`🔄 [${requestId}] Server/network error, retrying student login... (attempt ${retryCount + 1}/2)`);
          setLoadingMessage(`Mencoba lagi... (${retryCount + 1}/2)`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return handleLogin(e, retryCount + 1);
        }

        // Special handling for ERR_BLOCKED_BY_CLIENT in student login
        if (error instanceof Error && error.message.includes("ERR_BLOCKED_BY_CLIENT")) {
          console.error("🚫 Student request blocked by client (ad blocker/extension)");
          
          // Try fallback URL if this is the first attempt
          if (retryCount === 0) {
            console.log("🔄 Trying fallback URL for student login due to blocking...");
            setLoadingMessage("Mencoba URL alternatif...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            return handleLogin(e, 1);
          }
          
          setErrorTitle("Request Diblokir");
          setError("Request diblokir oleh browser atau extension. Silakan:\n1. Nonaktifkan ad blocker (uBlock Origin, AdBlock Plus, dll)\n2. Nonaktifkan privacy extensions (Privacy Badger, Ghostery, dll)\n3. Coba gunakan mode Incognito/Private\n4. Atau coba browser lain");
          setShowErrorModal(true);
          return;
        }
          throw error;
        }
        
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout: Server tidak merespons")),
          15000 // Increased timeout to 15 seconds
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

      // Validasi normal untuk guru - use local development API URL
      const apiBaseUrl = "http://127.0.0.1:8001/api/school";
      
      console.log("🌐 Using consistent API Base URL:", apiBaseUrl);
      console.log("🌐 Current hostname:", typeof window !== "undefined" ? window.location.hostname : "server-side");
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
          15000 // Increased timeout to 15 seconds
        )
      );

      const response = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as Response;

      if (!response.ok) {
        // Retry for 500 errors up to 2 times
        if (response.status === 500 && retryCount < 2) {
          console.warn(`Server error 500, retrying login... (attempt ${retryCount + 1}/2)`);
          setLoadingMessage(`Mencoba lagi... (${retryCount + 1}/2)`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return handleLogin(e, retryCount + 1);
        }
        
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
      // Enhanced error logging with request tracking
      console.error(`💥 [${requestId || 'unknown'}] Error during ${userType} login:`, {
        error: err,
        errorType: typeof err,
        errorConstructor: err?.constructor?.name,
        errorMessage: err instanceof Error ? err.message : String(err),
        errorStack: err instanceof Error ? err.stack : undefined,
        retryCount,
        npsn: npsn.substring(0, 3) + "***",
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        online: navigator.onLine
      });

      // Retry for timeout and network errors up to 2 times
      if (retryCount < 2 && err instanceof Error && 
          (err.message.includes("Timeout") || 
           err.message.includes("Failed to fetch") || 
           err.message.includes("ERR_BLOCKED_BY_CLIENT") ||
           err.message.includes("err_blocked_by_client"))) {
        console.warn(`🔄 [${requestId}] Network/timeout error, retrying login... (attempt ${retryCount + 1}/2)`);
        setLoadingMessage(`Mencoba lagi... (${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return handleLogin(e, retryCount + 1);
      }

      // Special handling for ERR_BLOCKED_BY_CLIENT
      if (err instanceof Error && err.message.includes("ERR_BLOCKED_BY_CLIENT")) {
        console.error("🚫 Request blocked by client (ad blocker/extension)");
        
        // Try fallback URL if this is the first attempt
        if (retryCount === 0) {
          console.log("🔄 Trying fallback URL due to blocking...");
          setLoadingMessage("Mencoba URL alternatif...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          return handleLogin(e, 1);
        }
        
        setErrorTitle("Request Diblokir");
        setError("Request diblokir oleh browser atau extension. Silakan:\n1. Nonaktifkan ad blocker (uBlock Origin, AdBlock Plus, dll)\n2. Nonaktifkan privacy extensions (Privacy Badger, Ghostery, dll)\n3. Coba gunakan mode Incognito/Private\n4. Atau coba browser lain");
        setShowErrorModal(true);
        return;
      }

      let errorMessage = "Terjadi kesalahan saat login";

      // Handle different error types
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
        } else if (message.includes("network") || message.includes("fetch") || message.includes("err_blocked_by_client")) {
          if (message.includes("diblokir oleh browser") || message.includes("err_blocked_by_client")) {
            errorMessage = "Request diblokir oleh browser atau extension. Silakan nonaktifkan ad blocker atau extension yang memblokir request.";
          } else if (message.includes("cors") || message.includes("cross-origin")) {
            errorMessage = "Masalah CORS: Server tidak mengizinkan request dari domain ini. Hubungi administrator untuk mengatur CORS policy.";
          } else if (message.includes("koneksi internet terputus")) {
            errorMessage = "Koneksi internet terputus. Periksa koneksi internet Anda dan coba lagi.";
          } else if (message.includes("masalah keamanan koneksi")) {
            errorMessage = "Masalah keamanan koneksi. Silakan coba akses dengan HTTP atau periksa sertifikat SSL.";
          } else {
            errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
          }
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
        } else if (message.includes("500") || message.includes("internal server error")) {
          errorMessage = "Server sedang mengalami masalah. Silakan coba lagi nanti atau hubungi administrator.";
        } else if (message.includes("timeout")) {
          errorMessage = "Server tidak merespons dalam waktu yang ditentukan. Silakan coba lagi.";
        } else {
          // Use the original error message if it's user-friendly
          errorMessage = err.message;
        }
      } else if (typeof err === 'string') {
        // Handle string errors
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        // Handle object errors with message property
        errorMessage = String(err.message);
      } else {
        // Handle other error types
        console.warn('Unknown error type:', err);
        errorMessage = `Terjadi kesalahan tidak terduga: ${String(err)}`;
      }

      // Show modal for critical errors, inline for minor ones
      if (
        errorMessage.includes("Password") ||
        errorMessage.includes("NPSN") ||
        errorMessage.includes("NISN") ||
        errorMessage.includes("diblokir oleh browser") ||
        errorMessage.includes("ERR_BLOCKED_BY_CLIENT")
      ) {
        setErrorTitle(
          errorMessage.includes("Password")
            ? "Password Salah"
            : errorMessage.includes("NPSN") || errorMessage.includes("NISN")
            ? "Kredensial Tidak Ditemukan"
            : errorMessage.includes("diblokir oleh browser") || errorMessage.includes("ERR_BLOCKED_BY_CLIENT")
            ? "Request Diblokir"
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
        showRetry={error.includes("500") || error.includes("Server sedang mengalami masalah") || error.includes("timeout") || error.includes("tidak merespons")}
        onRetry={() => {
          setShowErrorModal(false);
          setError("");
          // Trigger retry by calling handleLogin with current form data
          const form = document.querySelector('form');
          if (form) {
            handleLogin(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>, 0);
          }
        }}
      />
    </div>
  );
}
