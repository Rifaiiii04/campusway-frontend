"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../services/api";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
  schoolId: number;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onStudentAdded,
  schoolId,
}: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    nisn: "",
    name: "",
    kelas: "",
    email: "",
    phone: "",
    parent_phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load preselected class from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const preselectedClass = localStorage.getItem('preselected_class');
      if (preselectedClass) {
        setFormData((prev) => ({
          ...prev,
          kelas: preselectedClass,
        }));
        // Clear the preselected class after using it
        localStorage.removeItem('preselected_class');
      }
    } else {
      // Reset form when modal closes
      setFormData({
        nisn: "",
        name: "",
        kelas: "",
        email: "",
        phone: "",
        parent_phone: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.nisn ||
      !formData.name ||
      !formData.kelas ||
      !formData.password
    ) {
      setError("NISN, Nama, Kelas, dan Password wajib diisi");
      return false;
    }

    if (formData.nisn.length !== 10) {
      setError("NISN harus terdiri dari 10 digit");
      return false;
    }

    // Check if NISN contains only numbers
    if (!/^[0-9]{10}$/.test(formData.nisn)) {
      setError("NISN harus terdiri dari 10 digit angka");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return false;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }

    if (formData.phone && !/^[0-9]{10,13}$/.test(formData.phone)) {
      setError("Format nomor telepon tidak valid (10-13 digit)");
      return false;
    }

    if (
      formData.parent_phone &&
      !/^[0-9]{10,13}$/.test(formData.parent_phone)
    ) {
      setError("Format nomor telepon orang tua tidak valid (10-13 digit)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        nisn: formData.nisn,
        name: formData.name,
        kelas: formData.kelas,
        email: formData.email || null,
        phone: formData.phone || null,
        parent_phone: formData.parent_phone || null,
        password: formData.password,
        school_id: schoolId,
      };

      console.log("📤 Add student request data:", requestData);
      console.log("🏫 School ID:", schoolId);
      console.log("🏫 School ID type:", typeof schoolId);
      console.log(
        "🔑 Token:",
        localStorage.getItem("school_token") ? "EXISTS" : "NOT FOUND"
      );
      console.log(
        "🔑 Token value:",
        localStorage.getItem("school_token")
          ? localStorage.getItem("school_token")?.substring(0, 20) + "..."
          : "NOT FOUND"
      );

      // Panggil API untuk menambah siswa menggunakan apiService
      const data = await apiService.addStudent({
        name: requestData.name,
        nisn: requestData.nisn,
        kelas: requestData.kelas,
        email: requestData.email || undefined,
        phone: requestData.phone || undefined,
        parent_phone: requestData.parent_phone || undefined,
        password: requestData.password,
      });

      console.log("📄 Response data:", data);

      // apiService.addStudent akan throw error jika gagal, jadi jika sampai sini berarti berhasil
      // Handle validation errors jika ada di response
      if (data.errors) {
        console.log("❌ Validation errors:", data.errors);
        let errorMessage = "Validasi gagal:\n";
        Object.keys(data.errors).forEach((field) => {
          errorMessage += `- ${field}: ${data.errors[field].join(", ")}\n`;
        });
        throw new Error(errorMessage);
      }

      setSuccess("Siswa berhasil ditambahkan!");
      setFormData({
        nisn: "",
        name: "",
        kelas: "",
        email: "",
        phone: "",
        parent_phone: "",
        password: "",
        confirmPassword: "",
      });

      // Panggil callback untuk refresh data
      onStudentAdded();

      // Tutup modal setelah 1.5 detik (lebih cepat)
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menambahkan siswa"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nisn: "",
        name: "",
        kelas: "",
        email: "",
        phone: "",
        parent_phone: "",
        password: "",
        confirmPassword: "",
      });
      setError("");
      setSuccess("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Tambah Siswa Baru
              </h2>
              <p className="text-sm text-gray-600">
                Masukkan data siswa yang akan ditambahkan
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          {/* Form Fields */}
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
                type="text"
                id="nisn"
                name="nisn"
                value={formData.nisn}
                onChange={handleInputChange}
                placeholder="Masukkan NISN (10 digit)"
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                required
                disabled={loading}
              />
            </div>

            {/* Nama Lengkap */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                required
                disabled={loading}
              />
            </div>

            {/* Kelas */}
            <div>
              <label
                htmlFor="kelas"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kelas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleInputChange}
                placeholder="Contoh: X IPA 1, XI IPS 2, XII TKJ 1, X AK 2, dll"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan kelas sesuai dengan sistem sekolah (SMA: X IPA/IPS,
                SMK: X TKJ/AK/MM, dll)
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan email (opsional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                disabled={loading}
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Masukkan nomor telepon (opsional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                disabled={loading}
              />
            </div>

            {/* Nomor Telepon Orang Tua */}
            <div>
              <label
                htmlFor="parent_phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nomor Telepon Orang Tua
              </label>
              <input
                type="tel"
                id="parent_phone"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleInputChange}
                placeholder="Masukkan nomor telepon orang tua (opsional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password (min 6 karakter)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                required
                disabled={loading}
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Konfirmasi password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Menambahkan...
                </>
              ) : (
                <>
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
                  Tambah Siswa
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
