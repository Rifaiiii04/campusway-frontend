"use client";

import React, { useState, useRef } from "react";
import { apiService } from "../../services/api";

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  schoolId: number;
  darkMode: boolean;
}

interface ImportResult {
  imported_count: number;
  skipped_count: number;
  total_rows: number;
  errors: string[];
}

export default function ImportStudentsModal({
  isOpen,
  onClose,
  onImportSuccess,
  schoolId,
  darkMode,
}: ImportStudentsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validasi tipe file
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError(
          "Format file tidak didukung. Gunakan file CSV atau Excel (.xlsx, .xls)"
        );
        return;
      }

      // Validasi ukuran file (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("Ukuran file terlalu besar. Maksimal 10MB");
        return;
      }

      setFile(selectedFile);
      setError("");
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Pilih file terlebih dahulu");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("school_id", schoolId.toString());

      // Simulasi progress upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiService.importStudents(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setImportResult(response.data);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refresh data siswa setelah import berhasil
        setTimeout(() => {
          onImportSuccess();
          onClose();
        }, 2000);
      } else {
        setError(response.message || "Gagal mengimport data siswa");
      }
    } catch (err) {
      console.error("Import error:", err);
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengimport"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setError("");
      setImportResult(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  const downloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      setError("");

      console.log("🚀 Starting template download...");
      const response = await apiService.downloadImportTemplate();

      console.log("📥 Response received, creating blob...");
      // Download file
      const blob = await response.blob();
      console.log("📦 Blob created, size:", blob.size, "type:", blob.type);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `template_import_siswa_${
        new Date().toISOString().split("T")[0]
      }.csv`;

      console.log("🔗 Download link created, triggering download...");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("✅ Template download completed successfully");
    } catch (error) {
      console.error("❌ Error downloading template:", error);
      setError(
        `Gagal mengunduh template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Import Data Siswa
            </h3>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <svg
                className="w-5 h-5"
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Template Download */}
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-blue-50"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">📋</div>
              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Template Import
                </h4>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Download template CSV untuk memastikan format data yang benar
                </p>
                <div
                  className={`text-xs mt-2 p-2 rounded ${
                    darkMode
                      ? "bg-gray-600 text-gray-200"
                      : "bg-yellow-50 text-yellow-800"
                  }`}
                >
                  <strong>💡 Tips untuk nomor handphone di Excel:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>
                      Gunakan format: <code>="081234567890"</code> agar angka 0
                      di depan tidak hilang
                    </li>
                    <li>
                      Atau format kolom sebagai "Text" sebelum memasukkan nomor
                    </li>
                  </ul>
                </div>
                <button
                  onClick={downloadTemplate}
                  disabled={isDownloadingTemplate}
                  className={`mt-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                    isDownloadingTemplate
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isDownloadingTemplate
                    ? "⏳ Mengunduh..."
                    : "📥 Download Template"}
                </button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Pilih File
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                file
                  ? darkMode
                    ? "border-green-500 bg-green-900/20"
                    : "border-green-500 bg-green-50"
                  : darkMode
                  ? "border-gray-600 hover:border-gray-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
              <div className="space-y-2">
                <div className="text-4xl">📁</div>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isUploading
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {file ? "Ganti File" : "Pilih File"}
                  </button>
                </div>
                {file && (
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <p className="font-medium">{file.name}</p>
                    <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Format yang didukung: CSV, Excel (.xlsx, .xls)
                  <br />
                  Maksimal ukuran: 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Mengupload file...
                </span>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {uploadProgress}%
                </span>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className={`p-4 rounded-lg ${
                darkMode
                  ? "bg-red-900/20 border border-red-500"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start space-x-2">
                <div className="text-red-500 text-xl">⚠️</div>
                <div>
                  <h4
                    className={`font-medium ${
                      darkMode ? "text-red-300" : "text-red-800"
                    }`}
                  >
                    Error
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      darkMode ? "text-red-200" : "text-red-600"
                    }`}
                  >
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div
              className={`p-4 rounded-lg ${
                darkMode
                  ? "bg-green-900/20 border border-green-500"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div className="flex items-start space-x-2">
                <div className="text-green-500 text-xl">✅</div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      darkMode ? "text-green-300" : "text-green-800"
                    }`}
                  >
                    Import Berhasil!
                  </h4>
                  <div
                    className={`text-sm mt-2 space-y-1 ${
                      darkMode ? "text-green-200" : "text-green-600"
                    }`}
                  >
                    <p>
                      ✅ {importResult.imported_count} siswa berhasil diimport
                    </p>
                    <p>⚠️ {importResult.skipped_count} siswa dilewati</p>
                    <p>📊 Total baris: {importResult.total_rows}</p>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="mt-3">
                      <p
                        className={`font-medium ${
                          darkMode ? "text-yellow-300" : "text-yellow-800"
                        }`}
                      >
                        Error yang ditemukan:
                      </p>
                      <div
                        className={`mt-2 max-h-32 overflow-y-auto text-xs ${
                          darkMode ? "text-yellow-200" : "text-yellow-600"
                        }`}
                      >
                        {importResult.errors.map((error, index) => (
                          <p key={index}>• {error}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Format Requirements */}
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <h4
              className={`font-medium mb-2 ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Format Data yang Diperlukan
            </h4>
            <div
              className={`text-sm space-y-1 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <p>
                • <strong>NISN</strong> - NISN siswa (wajib, 10 digit)
              </p>
              <p>
                • <strong>Nama Lengkap</strong> - Nama lengkap siswa (wajib)
              </p>
              <p>
                • <strong>Kelas</strong> - Kelas siswa (wajib)
              </p>
              <p>
                • <strong>Email</strong> - Email siswa (opsional)
              </p>
              <p>
                • <strong>No Handphone</strong> - Nomor handphone siswa
                (opsional)
              </p>
              <p>
                • <strong>No Handphone Orang Tua</strong> - Nomor handphone
                orang tua (opsional)
              </p>
              <p>
                • <strong>Password</strong> - Password default (opsional,
                default: password123)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } flex justify-end space-x-3`}
        >
          <button
            onClick={handleClose}
            disabled={isUploading}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isUploading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : darkMode
                ? "bg-gray-600 text-gray-100 hover:bg-gray-500"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {importResult ? "Tutup" : "Batal"}
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isUploading}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !file || isUploading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isUploading ? "Mengimport..." : "Import Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
