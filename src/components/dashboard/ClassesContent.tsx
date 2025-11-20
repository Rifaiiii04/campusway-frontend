"use client";

import { useState, useEffect } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import ClassDetailModal from "../modals/ClassDetailModal";
import EditClassModal from "../modals/EditClassModal";
import { Student, apiService } from "../../services/api";

interface ClassItem {
  kelas: string;
  student_count: number;
  students_with_choice: number;
}

interface ClassesContentProps {
  students: Student[];
  darkMode: boolean;
  onAddClass: () => void;
  refreshTrigger?: number; // Trigger to force refresh classes
  newlyAddedClass?: string | null; // Newly added class name to add immediately
}

export default function ClassesContent({
  students,
  darkMode,
  onAddClass,
  refreshTrigger,
  newlyAddedClass,
}: ClassesContentProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [viewingClass, setViewingClass] = useState<ClassItem | null>(null);
  const [allClasses, setAllClasses] = useState<string[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Load classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        console.log("🔄 Loading classes from API...", { 
          refreshTrigger, 
          studentsCount: students.length,
          currentAllClassesCount: allClasses.length,
          currentAllClasses: allClasses
        });
        // Force refresh to get latest classes including newly added ones
        const response = await apiService.getClasses(true);
        console.log("📡 Classes API response:", response);
        if (response.success && response.data && response.data.classes) {
          const classNames = response.data.classes.map((cls) => cls.name);
          console.log("📋 Class names from API:", classNames);
          console.log("📋 Total classes from API:", classNames.length);
          
          // Set all classes - this includes classes with 0 students
          setAllClasses(classNames);
          console.log("✅ Classes loaded and set:", classNames.length, "classes", classNames);
          
          // Verify all classes are included
          const classesWithStudents = students.reduce((acc: string[], student) => {
            const studentClass = student.class || student.kelas || '';
            if (studentClass && !acc.includes(studentClass)) {
              acc.push(studentClass);
            }
            return acc;
          }, []);
          
          const classesWithoutStudents = classNames.filter(c => !classesWithStudents.includes(c));
          console.log("📊 Classes breakdown:", {
            totalFromAPI: classNames.length,
            withStudents: classesWithStudents.length,
            withoutStudents: classesWithoutStudents.length,
            classesWithoutStudents: classesWithoutStudents
          });
        } else {
          console.warn("⚠️ Classes response not successful:", response);
          // Don't clear allClasses if response fails, keep existing data
          if (response.data && response.data.classes) {
            const classNames = response.data.classes.map((cls: { name: string; value: string }) => cls.name);
            setAllClasses(classNames);
          }
        }
      } catch (error) {
        console.error("❌ Error loading classes:", error);
        // Don't clear allClasses on error, keep existing data
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]); // Only reload when refreshTrigger changes, not when students change

  // Add newly added class immediately if not already in list
  useEffect(() => {
    if (newlyAddedClass && !allClasses.includes(newlyAddedClass)) {
      console.log("➕ Adding newly added class to list immediately:", newlyAddedClass);
      setAllClasses((prev) => {
        const updated = [...prev, newlyAddedClass];
        return updated.sort();
      });
    }
  }, [newlyAddedClass, allClasses]);

  // Generate class summary from students data, but include all classes from API
  // Sort classes alphabetically for consistent display
  const sortedClasses = [...allClasses].sort();
  
  const classSummary: ClassItem[] = sortedClasses.map((className) => {
    // Find students in this class - check both 'class' and 'kelas' fields
    const classStudents = students.filter((s) => {
      const studentClass = s.class || s.kelas || '';
      return studentClass === className;
    });
    const studentsWithChoice = classStudents.filter((s) => s.has_choice).length;

    return {
      kelas: className,
      student_count: classStudents.length,
      students_with_choice: studentsWithChoice,
    };
  });
  
  // Ensure all classes from API are included, even if they have 0 students
  // This is already handled by using allClasses.map(), but let's add explicit logging
  console.log("📋 Class Summary Generated:", {
    totalClasses: classSummary.length,
    classesWithStudents: classSummary.filter(c => c.student_count > 0).length,
    classesWithoutStudents: classSummary.filter(c => c.student_count === 0).length,
    allClassNames: classSummary.map(c => c.kelas)
  });

  // Debug logging
  useEffect(() => {
    console.log("📊 ClassesContent - allClasses:", allClasses);
    console.log("📊 ClassesContent - allClasses count:", allClasses.length);
    console.log("📊 ClassesContent - classSummary:", classSummary);
    console.log("📊 ClassesContent - classSummary count:", classSummary.length);
    console.log("📊 ClassesContent - students count:", students.length);
    console.log("📊 ClassesContent - refreshTrigger:", refreshTrigger);
    console.log("📊 ClassesContent - newlyAddedClass:", newlyAddedClass);
    
    // Log classes with 0 students
    const classesWithZeroStudents = classSummary.filter(c => c.student_count === 0);
    console.log("📊 ClassesContent - Classes with 0 students:", classesWithZeroStudents);
  }, [allClasses, classSummary, students, refreshTrigger, newlyAddedClass]);

  const handleDeleteClick = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedClass) {
      // Simulasi penghapusan kelas
      console.log("Menghapus kelas:", selectedClass.kelas);
      alert(`Kelas ${selectedClass.kelas} berhasil dihapus!`);
    }
    setShowDeleteModal(false);
    setSelectedClass(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedClass(null);
  };

  const handleEditClick = (classItem: ClassItem) => {
    setEditingClass(classItem);
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingClass(null);
  };

  const handleEditSave = (updatedClass: ClassItem) => {
    // Simulasi update kelas
    console.log("Mengupdate kelas:", updatedClass);
    alert(`Kelas ${updatedClass.kelas} berhasil diupdate!`);
    setShowEditModal(false);
    setEditingClass(null);
  };

  const handleDetailClick = (classItem: ClassItem) => {
    setViewingClass(classItem);
    setShowDetailModal(true);
  };

  const handleDetailClose = () => {
    setShowDetailModal(false);
    setViewingClass(null);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onAddClass}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          + Tambah Kelas
        </button>
      </div>

      {/* Statistik Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-green-900" : "bg-green-100"
              }`}
            >
              <svg
                className={`w-8 h-8 ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Kelas
              </p>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {classSummary.length}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-green-900" : "bg-green-100"
              }`}
            >
              <svg
                className={`w-8 h-8 ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Siswa
              </p>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {classSummary.reduce((sum, cls) => sum + cls.student_count, 0)}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-yellow-900" : "bg-yellow-100"
              }`}
            >
              <svg
                className={`w-8 h-8 ${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Siswa Memilih Jurusan
              </p>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {classSummary.reduce(
                  (sum, cls) => sum + cls.students_with_choice,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Kelas */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow`}
      >
        <div
          className={`px-6 py-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Daftar Kelas
            </h3>
            {loadingClasses && (
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Memuat...
              </span>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          {loadingClasses ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Memuat daftar kelas...</p>
            </div>
          ) : classSummary.length === 0 ? (
            <div className="p-8 text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Belum ada kelas yang terdaftar. Klik &quot;Tambah Kelas&quot; untuk menambahkan kelas baru.
              </p>
            </div>
          ) : (
          <table
            className={`min-w-full divide-y ${
              darkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Nama Kelas
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Jumlah Siswa
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Siswa Memilih Jurusan
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
              {classSummary.map((classItem) => {
                return (
                  <tr
                    key={classItem.kelas}
                    className={`${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {classItem.kelas}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {classItem.student_count}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {classItem.students_with_choice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-32">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDetailClick(classItem)}
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
                          onClick={() => handleEditClick(classItem)}
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
                          onClick={() => handleDeleteClick(classItem)}
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
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Kelas"
        message="Apakah Anda yakin ingin menghapus kelas ini?"
        itemName={
          selectedClass
            ? `${selectedClass.kelas} (${selectedClass.student_count} siswa)`
            : undefined
        }
        darkMode={darkMode}
      />

      {/* Class Detail Modal */}
      {viewingClass && (
        <ClassDetailModal
          isOpen={showDetailModal}
          onClose={handleDetailClose}
          classData={{
            class_id: 0,
            class_name: viewingClass.kelas,
            grade: viewingClass.kelas.split(" ")[0],
            total_students: viewingClass.student_count,
            total_tests: 0,
            completed_tests: 0,
            completion_rate:
              viewingClass.student_count > 0
                ? (viewingClass.students_with_choice /
                    viewingClass.student_count) *
                  100
                : 0,
            average_score: 0,
          }}
          darkMode={darkMode}
        />
      )}

      {/* Edit Class Modal */}
      {editingClass && (
        <EditClassModal
          isOpen={showEditModal}
          onClose={handleEditCancel}
          onSave={(classData) => {
            const updatedClass: ClassItem = {
              kelas: classData.class_name,
              student_count: classData.total_students,
              students_with_choice: Math.round(
                (classData.completion_rate / 100) * classData.total_students
              ),
            };
            handleEditSave(updatedClass);
          }}
          classData={{
            class_id: 0,
            class_name: editingClass.kelas,
            grade: editingClass.kelas.split(" ")[0],
            total_students: editingClass.student_count,
            total_tests: 0,
            completed_tests: 0,
            completion_rate:
              editingClass.student_count > 0
                ? (editingClass.students_with_choice /
                    editingClass.student_count) *
                  100
                : 0,
            average_score: 0,
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
