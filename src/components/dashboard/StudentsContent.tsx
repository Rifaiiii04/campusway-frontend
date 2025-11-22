"use client";

import { useState, useEffect } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import EditStudentModal from "../modals/EditStudentModal";
import StudentDetailModal from "../modals/StudentDetailModal";
import ImportStudentsModal from "../modals/ImportStudentsModal";
import { Student, apiService } from "../../services/api";
import { clientCache, cacheKeys } from "../../utils/cache";

interface StudentsContentProps {
  students: Student[];
  darkMode: boolean;
  onAddStudent: () => void;
  schoolId: number;
  onImportSuccess?: () => void;
}

export default function StudentsContent({
  students,
  darkMode,
  onAddStudent,
  schoolId,
  onImportSuccess,
}: StudentsContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedChoiceStatus, setSelectedChoiceStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [loadingStudentDetail, setLoadingStudentDetail] = useState(false);
  const [classes, setClasses] = useState<{ name: string; value: string }[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Load classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await apiService.getClasses();
        if (response.success) {
          setClasses(response.data.classes);
        }
      } catch (error) {
        console.error("Error loading classes:", error);
      } finally {
        setLoadingClasses(false);
      }
    };

    if (schoolId) {
      loadClasses();
    }
  }, [schoolId]);

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nisn.includes(searchTerm) ||
      (student.email &&
        student.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass = !selectedClass || (student.kelas || student.class) === selectedClass;

    const matchesMajor =
      !selectedMajor ||
      (student.chosen_major &&
        student.chosen_major.name
          .toLowerCase()
          .includes(selectedMajor.toLowerCase()));

    const matchesChoiceStatus = 
      !selectedChoiceStatus ||
      (selectedChoiceStatus === "has_choice" && student.has_choice) ||
      (selectedChoiceStatus === "no_choice" && !student.has_choice);

    return matchesSearch && matchesClass && matchesMajor && matchesChoiceStatus;
  });

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) {
      setShowDeleteModal(false);
      return;
    }

    const studentToDelete = selectedStudent;
    setShowDeleteModal(false);
    setSelectedStudent(null);

    try {
      console.log("🗑️ Deleting student:", studentToDelete.name);
      console.log("🆔 Student ID:", studentToDelete.id);

      // Call API to delete student
      const response = await apiService.deleteStudent(studentToDelete.id);

      console.log("📡 Delete response:", response);
      console.log("✅ Response success:", response.success);
      console.log("📝 Response message:", response.message);

      // Double check response
      if (response && response.success === true) {
        console.log("🎉 Delete successful, clearing cache and refreshing data...");
        
        // Clear students cache to ensure fresh data
        const schoolData = localStorage.getItem("school_data");
        const schoolId =
          schoolData && schoolData !== "undefined" && schoolData !== "null"
            ? JSON.parse(schoolData).id
            : "unknown";
        
        // Clear all related caches
        clientCache.delete(cacheKeys.students(schoolId));
        clientCache.delete(cacheKeys.dashboard(schoolId));
        clientCache.delete(cacheKeys.majorStatistics(schoolId));
        console.log("🗑️ All caches cleared for students");
        
        // Show success message
        alert(`Siswa "${studentToDelete.name}" berhasil dihapus!`);
        
        // Force refresh students list by calling onImportSuccess if available
        // This will trigger a data refresh without full page reload
        if (onImportSuccess) {
          console.log("🔄 Calling onImportSuccess to refresh data...");
          // Add small delay to ensure backend has processed the deletion
          setTimeout(() => {
            onImportSuccess();
          }, 500);
        } else {
          console.log("🔄 onImportSuccess not available, reloading page...");
          // Fallback to page reload if callback not available
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } else {
        console.error("❌ Delete failed - response not successful:", response);
        alert(
          `Gagal menghapus data siswa: ${
            response?.message || "Response tidak valid. Silakan coba lagi."
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
        
        // Check if it's a 404 error (student already deleted)
        if (error.message.includes("404") || error.message.includes("tidak ditemukan")) {
          console.log("⚠️ Student not found - might already be deleted, refreshing data...");
          // Clear cache and refresh data anyway since student might already be deleted
          const schoolData = localStorage.getItem("school_data");
          const schoolId =
            schoolData && schoolData !== "undefined" && schoolData !== "null"
              ? JSON.parse(schoolData).id
              : "unknown";
          
          // Clear all related caches
          clientCache.delete(cacheKeys.students(schoolId));
          clientCache.delete(cacheKeys.dashboard(schoolId));
          clientCache.delete(cacheKeys.majorStatistics(schoolId));
          
          // Don't show error alert if student might already be deleted
          // Just refresh the data silently
          if (onImportSuccess) {
            setTimeout(() => {
              onImportSuccess();
            }, 500);
          } else {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        } else {
          alert(
            `Terjadi kesalahan saat menghapus data siswa: ${
              error.message || "Silakan coba lagi."
            }`
          );
        }
      } else {
        alert(
          "Terjadi kesalahan saat menghapus data siswa. Silakan coba lagi."
        );
      }
    }
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
        kelas: updatedStudent.kelas || updatedStudent.class || "",
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
        console.log("✅ Student updated successfully, clearing cache and refreshing data...");
        
        // Clear students cache to ensure fresh data
        const schoolData = localStorage.getItem("school_data");
        const schoolId =
          schoolData && schoolData !== "undefined" && schoolData !== "null"
            ? JSON.parse(schoolData).id
            : "unknown";
        
        // Clear all related caches
        clientCache.delete(cacheKeys.students(schoolId));
        clientCache.delete(cacheKeys.dashboard(schoolId));
        clientCache.delete(cacheKeys.majorStatistics(schoolId));
        console.log("🗑️ All caches cleared for students");
        
        alert(`Siswa ${updatedStudent.name} berhasil diupdate!`);
        setShowEditModal(false);
        setEditingStudent(null);

        // Refresh data using callback instead of page reload
        if (onImportSuccess) {
          console.log("🔄 Calling onImportSuccess to refresh data...");
          // Add small delay to ensure backend has processed the update
          setTimeout(() => {
            onImportSuccess();
          }, 500);
        } else {
          console.log("🔄 onImportSuccess not available, reloading page...");
          // Fallback to page reload if callback not available
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } else {
        alert("Gagal mengupdate data siswa. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Terjadi kesalahan saat mengupdate data siswa. Silakan coba lagi.");
    }
  };

  const handleDetailClick = async (student: Student) => {
    setLoadingStudentDetail(true);
    try {
      // Fetch detailed student information from API to get complete subject data
      const response = await apiService.getStudentDetail(student.id);
      if (response.success && response.data.student) {
        // Debug: Log the response to see what data we're getting
        console.log("📚 Student detail response:", response.data.student);
        console.log("📚 Chosen major:", response.data.student.chosen_major);
        if (response.data.student.chosen_major) {
          console.log("📚 Required subjects:", response.data.student.chosen_major.required_subjects);
          console.log("📚 Preferred subjects:", response.data.student.chosen_major.preferred_subjects);
          console.log("📚 Kurikulum Merdeka:", response.data.student.chosen_major.kurikulum_merdeka_subjects);
        }

        // Normalize subjects data: convert string to array if needed (same as student dashboard)
        const normalizeSubjects = (subjects: string | string[] | null | undefined): string[] | undefined => {
          if (!subjects) return undefined;
          if (Array.isArray(subjects)) return subjects;
          if (typeof subjects === 'string' && subjects.trim().length > 0) {
            // Try parsing as JSON first, then fallback to comma-separated
            try {
              const parsed = JSON.parse(subjects);
              return Array.isArray(parsed) ? parsed : [subjects];
            } catch {
              // If not JSON, treat as comma-separated string
              const parts = subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
              return parts.length > 0 ? parts : [subjects];
            }
          }
          return undefined;
        };

        // Normalize student data with subjects
        const normalizedStudent = {
          ...response.data.student,
          chosen_major: response.data.student.chosen_major ? {
            ...response.data.student.chosen_major,
            required_subjects: normalizeSubjects(response.data.student.chosen_major.required_subjects),
            preferred_subjects: normalizeSubjects(response.data.student.chosen_major.preferred_subjects),
            optional_subjects: normalizeSubjects(response.data.student.chosen_major.optional_subjects),
            kurikulum_merdeka_subjects: normalizeSubjects(response.data.student.chosen_major.kurikulum_merdeka_subjects),
            kurikulum_2013_ipa_subjects: normalizeSubjects(response.data.student.chosen_major.kurikulum_2013_ipa_subjects),
            kurikulum_2013_ips_subjects: normalizeSubjects(response.data.student.chosen_major.kurikulum_2013_ips_subjects),
            kurikulum_2013_bahasa_subjects: normalizeSubjects(response.data.student.chosen_major.kurikulum_2013_bahasa_subjects),
          } : undefined,
        };

        setViewingStudent(normalizedStudent);
        setShowDetailModal(true);
      } else {
        console.warn("⚠️ API response not successful:", response);
        // Fallback to using existing student data if API fails
        setViewingStudent(student);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error("❌ Error loading student detail:", error);
      
      // Show user-friendly error message
      let errorMessage = "Gagal memuat detail siswa. Silakan coba lagi.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check if it's a server error (500)
        if (errorMessage.includes("Server error") || errorMessage.includes("500")) {
          errorMessage = "Server sedang mengalami masalah. Silakan coba lagi dalam beberapa saat atau hubungi administrator.";
        }
      }
      
      // Show error notification (you can replace alert with a toast/notification component)
      alert(`⚠️ ${errorMessage}`);
      
      // Fallback to using existing student data if API fails (but without subjects)
      // This allows user to still see basic student info
      setViewingStudent(student);
      setShowDetailModal(true);
    } finally {
      setLoadingStudentDetail(false);
    }
  };

  const handleDetailClose = () => {
    setShowDetailModal(false);
    setViewingStudent(null);
  };

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleImportClose = () => {
    setShowImportModal(false);
  };

  const handleImportSuccess = () => {
    if (onImportSuccess) {
      onImportSuccess();
    }
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              disabled={loadingClasses}
            >
              <option
                value=""
                className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                {loadingClasses ? "Memuat kelas..." : "Semua Kelas"}
              </option>
              {classes.map((classItem) => (
                <option
                  key={classItem.value}
                  value={classItem.value}
                  className={`${darkMode ? "text-gray-100" : "text-gray-900"}`}
                >
                  {classItem.name}
                </option>
              ))}
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
              value={selectedChoiceStatus}
              onChange={(e) => setSelectedChoiceStatus(e.target.value)}
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
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Cari Jurusan
            </label>
            <input
              type="text"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              placeholder="Masukkan nama jurusan..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
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
            Daftar Siswa ({filteredStudents.length})
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
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-6 py-12 text-center ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-16 h-16 mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium mb-2">
                        {students.length === 0
                          ? "Belum ada data siswa"
                          : "Tidak ada siswa yang sesuai dengan filter"}
                      </p>
                      <p className="text-sm">
                        {students.length === 0
                          ? "Silakan tambah siswa baru atau import dari file Excel/CSV"
                          : "Coba ubah filter atau kata kunci pencarian"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
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
                    {student.kelas || student.class || "-"}
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
                        disabled={loadingStudentDetail}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                ))
              )}
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

      {/* Import Students Modal */}
      <ImportStudentsModal
        isOpen={showImportModal}
        onClose={handleImportClose}
        onImportSuccess={handleImportSuccess}
        schoolId={schoolId}
        darkMode={darkMode}
      />
    </div>
  );
}
