"use client";

import { useState, useEffect } from "react";
import { studentApiService } from "../../services/api";

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  type: string;
  priority: number;
}

interface StudentSubjectsData {
  student: {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    school_name: string;
  };
  major: {
    id: number;
    major_name: string;
    description: string;
    category: string;
  };
  education_level: string;
  subjects: {
    mandatory: Subject[];
    optional: Subject[];
    total_count: number;
  };
  rules: {
    mandatory_count: number;
    mandatory_subjects: string[];
    optional_count: number;
    optional_rules: string[];
    total_subjects: number;
  };
}

interface StudentSubjectsDisplayProps {
  studentId: number;
  onClose?: () => void;
}

export default function StudentSubjectsDisplay({
  studentId,
  onClose,
}: StudentSubjectsDisplayProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentSubjectsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudentSubjects();
  }, [studentId]);

  const loadStudentSubjects = async () => {
    try {
      setLoading(true);
      const response = await studentApiService.getStudentSubjects(studentId);

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || "Gagal memuat mata pelajaran");
      }
    } catch (error) {
      console.error("Error loading student subjects:", error);
      setError("Terjadi kesalahan saat memuat mata pelajaran");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat mata pelajaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-2">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-gray-500">
          <p>Tidak ada data mata pelajaran</p>
        </div>
      </div>
    );
  }

  const isSMK = data.education_level === "SMK/MAK";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Mata Uji yang Harus Dipelajari
          </h2>
          <p className="text-gray-600">
            {data.student.name} - {data.major.major_name}
          </p>
          <p className="text-sm text-gray-500">
            {data.student.kelas} | {data.student.school_name}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Education Level Badge */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isSMK
              ? "bg-orange-100 text-orange-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {isSMK ? "🏭" : "🎓"} {data.education_level}
        </span>
      </div>

      {/* Rules Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Aturan Mata Uji</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Mata Uji Wajib ({data.rules.mandatory_count})
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {data.rules.mandatory_subjects.map((subject, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {subject}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Mata Uji Pilihan ({data.rules.optional_count})
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {data.rules.optional_rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Total Mata Uji:</strong> {data.rules.total_subjects} mata
            pelajaran
          </p>
        </div>
      </div>

      {/* Mandatory Subjects */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
            {data.subjects.mandatory.length}
          </span>
          Mata Uji Wajib
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.subjects.mandatory.map((subject) => (
            <div
              key={subject.id}
              className="border border-green-200 rounded-lg p-4 bg-green-50"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">{subject.name}</h4>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                  {subject.code}
                </span>
              </div>
              <p className="text-sm text-green-600">{subject.description}</p>
              <div className="mt-2 flex items-center text-xs text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Wajib
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Subjects */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
            {data.subjects.optional.length}
          </span>
          Mata Uji Pilihan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.subjects.optional.map((subject, index) => (
            <div
              key={subject.id}
              className={`border rounded-lg p-4 ${
                subject.type === "Pilihan_Wajib"
                  ? "border-orange-200 bg-orange-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4
                  className={`font-medium ${
                    subject.type === "Pilihan_Wajib"
                      ? "text-orange-800"
                      : "text-blue-800"
                  }`}
                >
                  {subject.name}
                </h4>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    subject.type === "Pilihan_Wajib"
                      ? "bg-orange-200 text-orange-800"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {subject.code}
                </span>
              </div>
              <p
                className={`text-sm ${
                  subject.type === "Pilihan_Wajib"
                    ? "text-orange-600"
                    : "text-blue-600"
                }`}
              >
                {subject.description}
              </p>
              <div className="mt-2 flex items-center text-xs">
                <span
                  className={`w-2 h-2 rounded-full mr-1 ${
                    subject.type === "Pilihan_Wajib"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                ></span>
                <span
                  className={
                    subject.type === "Pilihan_Wajib"
                      ? "text-orange-500"
                      : "text-blue-500"
                  }
                >
                  {subject.type === "Pilihan_Wajib"
                    ? "Pilihan Wajib SMK"
                    : `Pilihan ${index + 1}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Ringkasan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.subjects.mandatory.length}
            </div>
            <div className="text-sm text-gray-600">Wajib</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {data.subjects.optional.length}
            </div>
            <div className="text-sm text-gray-600">Pilihan</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {data.subjects.total_count}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {data.education_level}
            </div>
            <div className="text-sm text-gray-600">Jenjang</div>
          </div>
        </div>
      </div>
    </div>
  );
}
