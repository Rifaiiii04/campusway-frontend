"use client";

import { useState } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import EditStudentModal from "../modals/EditStudentModal";
import StudentDetailModal from "../modals/StudentDetailModal";
import ComingSoonModal from "../modals/ComingSoonModal";
import { Student, apiService } from "../../services/api";

interface StudentsContentProps {
  students: Student[];
  darkMode: boolean;
  onAddStudent: () => void;
  schoolId: number;
}

export default function StudentsContent({
  students,
  darkMode,
  onAddStudent,
  schoolId: _schoolId, // Prefixed with underscore to indicate intentionally unused
}: StudentsContentProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedStudent) {
      try {
        console.log("🗑️ Deleting student:", selectedStudent.name);
        console.log("🆔 Student ID:", selectedStudent.id);

        // Call API to delete student
        const response = await apiService.deleteStudent(selectedStudent.id);

        console.log("📡 Delete response:", response);
        console.log("✅ Response success:", response.success);
        console.log("📝 Response message:", response.message);

        if (response.success) {
          console.log("🎉 Delete successful, reloading page...");
          alert(`Siswa ${selectedStudent.name} berhasil dihapus!`);
          // Refresh the page to show updated data
          window.location.reload();
        } else {
          console.log("❌ Delete failed:", response.message);
          alert(
            `Gagal menghapus data siswa: ${
              response.message || "Silakan coba lagi."
            }`
          );
        }
      } catch (error) {
        console.error("❌ Error deleting student:", error);
        if (error instanceof Error) {
          console.error("❌ Error details:", {
            message: error.message,
            stack: error.stack,
          });
          alert(
            `Terjadi kesalahan saat menghapus data siswa: ${
              error.message || "Silakan coba lagi."
            }`
          );
        } else {
          alert(
            "Terjadi kesalahan saat menghapus data siswa. Silakan coba lagi."
          );
        }
      }
    }
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingStudent(null);
  };

  const handleEditSave = async (updatedStudent: Student) => {
    try {
      console.log("Mengupdate siswa:", updatedStudent);

      // Prepare data for API call
      const updateData = {
        name: updatedStudent.name,
        nisn: updatedStudent.nisn,
        kelas: updatedStudent.class,
        email: updatedStudent.email || "",
        phone: updatedStudent.phone || "",
        parent_phone: updatedStudent.parent_phone || "",
        ...(updatedStudent.password && { password: updatedStudent.password }),
      };

      // Call API to update student
      const response = await apiService.updateStudent(
        updatedStudent.id,
        updateData
      );

      if (response.success) {
        alert(`Siswa ${updatedStudent.name} berhasil diupdate!`);
        setShowEditModal(false);
        setEditingStudent(null);

        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert("Gagal mengupdate data siswa. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Terjadi kesalahan saat mengupdate data siswa. Silakan coba lagi.");
    }
  };

  const handleDetailClick = (student: Student) => {
    setViewingStudent(student);
    setShowDetailModal(true);
  };

  const handleDetailClose = () => {
    setShowDetailModal(false);
    setViewingStudent(null);
  };

  const handleImportClick = () => {
    setShowComingSoonModal(true);
  };

  const handleComingSoonClose = () => {
    setShowComingSoonModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header dengan tombol tambah */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={onAddStudent}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            + Tambah Siswa
          </button>
          <button
            onClick={handleImportClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            📥 Import Excel/CSV
          </button>
        </div>
      </div>

      {/* Filter dan Search */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow p-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Cari Siswa
            </label>
            <input
              type="text"
              placeholder="Masukkan nama atau NIS siswa..."
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
              Kelas
            </label>
            <select
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option
                value=""
                className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                Semua Kelas
              </option>
              <option
                value="X IPA 1"
                className={`${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                X IPA 1
              </option>
              <option
                value="X IPA 2"
                className={`${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                X IPA 2
              </option>
              <option
                value="X IPS 1"
                className={`${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                X IPS 1
              </option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Status Pilihan Jurusan
            </label>
            <select
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option
                value=""
                className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                Semua
              </option>
              <option
                value="has_choice"
                className={`${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                Sudah Memilih
              </option>
              <option
                value="no_choice"
                className={`${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                Belum Memilih
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Siswa */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow`}
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
            Daftar Siswa ({students.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table
            className={`min-w-full divide-y ${
              darkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Siswa
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Kelas
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Kontak
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Pilihan Jurusan
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody
              className={`${
                darkMode
                  ? "bg-gray-800 divide-gray-700"
                  : "bg-white divide-gray-200"
              } divide-y`}
            >
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            darkMode ? "bg-gray-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {student.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {student.name}
                        </div>
                        <div
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {student.nisn}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {student.class}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <div>
                      {student.email && (
                        <div className="text-xs text-gray-500">
                          {student.email}
                        </div>
                      )}
                      {student.phone && (
                        <div className="text-xs text-gray-500">
                          {student.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.has_choice ? (
                      <div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Sudah Memilih
                        </span>
                        {student.chosen_major && (
                          <div className="text-xs text-gray-500 mt-1">
                            {student.chosen_major.name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Belum Memilih
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-32">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(student)}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Edit"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDetailClick(student)}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Detail"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(student)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Hapus"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Siswa"
        message="Apakah Anda yakin ingin menghapus siswa ini?"
        itemName={
          selectedStudent
            ? `${selectedStudent.name} (${selectedStudent.nisn})`
            : undefined
        }
        darkMode={darkMode}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={showEditModal}
        onClose={handleEditCancel}
        onSave={handleEditSave}
        student={editingStudent}
        darkMode={darkMode}
      />

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={showDetailModal}
        onClose={handleDetailClose}
        student={viewingStudent}
        darkMode={darkMode}
      />

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={handleComingSoonClose}
        feature="Import Data Siswa"
        description="Fitur import data siswa dari file Excel/CSV sedang dalam pengembangan. Anda dapat menambahkan siswa secara manual menggunakan tombol 'Tambah Siswa'."
      />
    </div>
  );
}
