"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { studentApiService } from "../services/api";

interface School {
  id: number;
  npsn: string;
  name: string;
}

interface StudentRegistrationProps {
  onRegistrationSuccess: (studentData: unknown) => void;
  onBackToLogin: () => void;
}

export default function StudentRegistration({
  onRegistrationSuccess,
  onBackToLogin,
}: StudentRegistrationProps) {
  const [formData, setFormData] = useState({
    nisn: "",
    name: "",
    npsn_sekolah: "",
    nama_sekolah: "",
    kelas: "",
    email: "",
    phone: "",
    parent_phone: "",
    password: "",
    confirmPassword: "",
  });

  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Load schools on component mount
  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoadingMessage("Memuat daftar sekolah...");
      const response = await studentApiService.getSchools();
      if (response.success) {
        setSchools(response.data || []);
      }
    } catch (error) {
      console.error("Error loading schools:", error);
      setError("Gagal memuat daftar sekolah");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNpsn = e.target.value;
    const selectedSchool = schools.find(
      (school) => school.npsn === selectedNpsn
    );

    setFormData((prev) => ({
      ...prev,
      npsn_sekolah: selectedNpsn,
      nama_sekolah: selectedSchool ? selectedSchool.name : "",
    }));

    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.nisn || formData.nisn.length !== 10) {
      setError("NISN harus 10 digit");
      return false;
    }

    if (!formData.name.trim()) {
      setError("Nama lengkap harus diisi");
      return false;
    }

    if (!formData.npsn_sekolah) {
      setError("Pilih sekolah terlebih dahulu");
      return false;
    }

    if (!formData.kelas.trim()) {
      setError("Kelas harus diisi");
      return false;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      setError("Format nomor telepon tidak valid");
      return false;
    }

    if (
      formData.parent_phone &&
      !/^[0-9+\-\s()]+$/.test(formData.parent_phone)
    ) {
      setError("Format nomor telepon orang tua tidak valid");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setLoadingMessage("Mendaftarkan akun siswa...");

    try {
      const registrationData = {
        nisn: formData.nisn,
        name: formData.name,
        npsn_sekolah: formData.npsn_sekolah,
        nama_sekolah: formData.nama_sekolah,
        kelas: formData.kelas,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        parent_phone: formData.parent_phone || undefined,
        password: formData.password,
      };

      console.log("🔍 Attempting student registration:", registrationData);

      const response = await studentApiService.register(registrationData);

      if (response.success) {
        console.log("✅ Student registration successful!");
        setSuccess(
          "Registrasi berhasil! Silakan login dengan NISN dan password Anda."
        );

        // Simpan data siswa di localStorage untuk auto-login
        localStorage.setItem("student_token", "student_session_token");
        localStorage.setItem(
          "student_data",
          JSON.stringify(response.data.student)
        );

        // Call success callback
        onRegistrationSuccess(response.data.student);
      } else {
        throw new Error(response.message || "Registrasi gagal");
      }
    } catch (err: unknown) {
      console.error("💥 Error during registration:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat registrasi";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-lg flex items-center justify-center shadow-lg mb-6">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Registrasi Siswa
          </h2>
          <p className="text-gray-600">
            Daftarkan akun siswa untuk mengakses tes kemampuan akademik
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NISN */}
              <div>
                <label
                  htmlFor="nisn"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  NISN <span className="text-red-500">*</span>
                </label>
                <input
                  id="nisn"
                  name="nisn"
                  type="text"
                  required
                  maxLength={10}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                  placeholder="Masukkan NISN (10 digit)"
                  value={formData.nisn}
                  onChange={handleInputChange}
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* School Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School Selection */}
              <div>
                <label
                  htmlFor="npsn_sekolah"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sekolah <span className="text-red-500">*</span>
                </label>
                <select
                  id="npsn_sekolah"
                  name="npsn_sekolah"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                  value={formData.npsn_sekolah}
                  onChange={handleSchoolChange}
                >
                  <option value="">Pilih Sekolah</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.npsn}>
                      {school.name} ({school.npsn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div>
                <label
                  htmlFor="kelas"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  id="kelas"
                  name="kelas"
                  type="text"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                  placeholder="Contoh: XII IPA 1"
                  value={formData.kelas}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email (Opsional)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nomor Telepon (Opsional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Parent Phone */}
            <div>
              <label
                htmlFor="parent_phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nomor Telepon Orang Tua (Opsional)
              </label>
              <input
                id="parent_phone"
                name="parent_phone"
                type="tel"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                placeholder="Contoh: 081234567891"
                value={formData.parent_phone}
                onChange={handleInputChange}
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleInputChange}
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black transition-all duration-200"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
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
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                    {loadingMessage || "Mendaftarkan Akun..."}
                  </div>
                ) : (
                  <div className="flex items-center">
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Daftar Akun Siswa
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBackToLogin}
              className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
            >
              ← Kembali ke Login
            </button>
            <Link
              href="/landing"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              ← Kembali ke Halaman Utama
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            © 2024 Sistem TKA. Dibuat dengan ❤️ untuk pendidikan Indonesia.
          </p>
        </div>
      </div>
    </div>
  );
}
