"use client";

import { useState, useRef } from "react";
import { apiService } from "../../services/api";

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  schoolId: number;
}

interface ImportResult {
  total_rows: number;
  processed: number;
  success_count: number;
  error_count: number;
  success_data: Array<{
    row: number;
    student: {
      id: number;
      nisn: string;
      name: string;
      kelas: string;
    };
  }>;
  errors: Array<{
    row: number;
    data: any;
    errors: string[];
  }>;
}

export default function ImportStudentsModal({
  isOpen,
  onClose,
  onImportSuccess,
  schoolId,
}: ImportStudentsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "text/csv", // .csv
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File harus berupa CSV (.csv)");
        return;
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("Ukuran file maksimal 10MB");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Pilih file terlebih dahulu");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("school_id", schoolId.toString());

      const response = await apiService.importStudents(formData);

      if (response.success) {
        setImportResult(response.data);
        setShowResult(true);
      } else {
        setError(response.message || "Gagal mengimport data");
      }
    } catch (err) {
      console.error("Error importing students:", err);
      setError("Terjadi kesalahan saat mengimport data");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/school/students/import/template", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `template_import_siswa_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Gagal mengunduh template");
      }
    } catch (err) {
      console.error("Error downloading template:", err);
      setError("Gagal mengunduh template");
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    setShowResult(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleImportSuccess = () => {
    handleClose();
    onImportSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Import Data Siswa
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {!showResult ? (
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  📋 Template Import
                </h3>
                <p className="text-blue-700 mb-3">
                  Download template Excel untuk memastikan format data yang
                  benar.
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📥 Download Template
                </button>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-4xl text-gray-400 mb-4">📁</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pilih File Excel/CSV
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Format yang didukung: .csv (Maksimal 10MB)
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors cursor-pointer inline-block"
                  >
                    Pilih File
                  </label>

                  {file && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700">
                        ✅ File dipilih: <strong>{file.name}</strong>
                      </p>
                      <p className="text-sm text-green-600">
                        Ukuran: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">❌ {error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleImport}
                  disabled={!file || isUploading}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <span className="flex items-center">
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
                      Mengimport...
                    </span>
                  ) : (
                    "Import Data"
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Import Results */
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  ✅ Import Selesai
                </h3>
                <p className="text-green-700">
                  {importResult?.processed} dari {importResult?.total_rows} data
                  berhasil diimport
                </p>
              </div>

              {/* Success Data */}
              {importResult && importResult.success_data.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Data Berhasil Diimport ({importResult.success_count})
                  </h4>
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1">Baris</th>
                          <th className="text-left py-1">NISN</th>
                          <th className="text-left py-1">Nama</th>
                          <th className="text-left py-1">Kelas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.success_data.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-1">{item.row}</td>
                            <td className="py-1">{item.student.nisn}</td>
                            <td className="py-1">{item.student.name}</td>
                            <td className="py-1">{item.student.kelas}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Error Data */}
              {importResult && importResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">
                    Data Gagal Diimport ({importResult.error_count})
                  </h4>
                  <div className="max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="mb-2 p-2 bg-red-100 rounded">
                        <p className="text-sm font-medium text-red-800">
                          Baris {error.row}:
                        </p>
                        <ul className="text-sm text-red-700 ml-4">
                          {error.errors.map((err, errIndex) => (
                            <li key={errIndex}>• {err}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={handleImportSuccess}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
