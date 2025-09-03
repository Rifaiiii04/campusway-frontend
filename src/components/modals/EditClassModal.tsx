'use client';

import { useState, useEffect } from 'react';

interface ClassSummary {
  class_id: number;
  class_name: string;
  grade: string;
  total_students: number;
  total_tests: number;
  completed_tests: number;
  completion_rate: number;
  average_score: number;
}

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: ClassSummary) => void;
  classData: ClassSummary | null;
  darkMode: boolean;
}

export default function EditClassModal({ isOpen, onClose, onSave, classData, darkMode }: EditClassModalProps) {
  const [formData, setFormData] = useState<ClassSummary>({
    class_id: 0,
    class_name: '',
    grade: '',
    total_students: 0,
    total_tests: 0,
    completed_tests: 0,
    completion_rate: 0,
    average_score: 0
  });

  useEffect(() => {
    if (classData) {
      setFormData(classData);
    }
  }, [classData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_students' || name === 'total_tests' || name === 'completed_tests' || name === 'average_score' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/30 to-gray-900/20 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-800/95' : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95'} backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border ${darkMode ? 'border-gray-600/50' : 'border-gray-200/50'}`}>
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b ${darkMode ? 'border-gray-600/50 bg-gradient-to-r from-gray-700/90 via-gray-800/90 to-gray-700/90' : 'border-gray-200/50 bg-gradient-to-r from-green-50/90 via-emerald-50/90 to-teal-50/90'} backdrop-blur-sm rounded-t-2xl flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Kelas</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ubah informasi kelas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <svg className={`w-5 h-5 transition-colors ${darkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Class Name */}
              <div>
                <label htmlFor="class_name" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Nama Kelas
                </label>
                <input
                  type="text"
                  id="class_name"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-300' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Masukkan nama kelas (contoh: IPA-1)"
                  required
                />
              </div>

              {/* Grade */}
              <div>
                <label htmlFor="grade" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Tingkat Kelas
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="">Pilih tingkat kelas</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>

              {/* Total Students */}
              <div>
                <label htmlFor="total_students" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Total Siswa
                </label>
                <input
                  type="number"
                  id="total_students"
                  name="total_students"
                  value={formData.total_students}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-300' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Masukkan jumlah siswa"
                  required
                />
              </div>

              {/* Total Tests */}
              <div>
                <label htmlFor="total_tests" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Total Tes
                </label>
                <input
                  type="number"
                  id="total_tests"
                  name="total_tests"
                  value={formData.total_tests}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-300' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Masukkan jumlah tes"
                  required
                />
              </div>

              {/* Completed Tests */}
              <div>
                <label htmlFor="completed_tests" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Tes Selesai
                </label>
                <input
                  type="number"
                  id="completed_tests"
                  name="completed_tests"
                  value={formData.completed_tests}
                  onChange={handleInputChange}
                  min="0"
                  max={formData.total_tests}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-300' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Masukkan jumlah tes selesai"
                  required
                />
              </div>

              {/* Average Score */}
              <div>
                <label htmlFor="average_score" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Rata-rata Nilai
                </label>
                <input
                  type="number"
                  id="average_score"
                  name="average_score"
                  value={formData.average_score}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-300' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Masukkan rata-rata nilai (0-100)"
                  required
                />
              </div>
            </div>

            {/* Info Box */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-gray-700/80 to-gray-800/80 border-gray-600/50' : 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200/50'} border rounded-xl p-5 mb-6`}>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="space-y-2.5">
                  <h4 className={`font-semibold ${darkMode ? 'text-green-300' : 'text-green-900'}`}>
                    Informasi Penting
                  </h4>
                  <ul className={`text-sm space-y-1.5 ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
                    <li>• Pastikan data yang dimasukkan akurat dan terverifikasi</li>
                    <li>• Jumlah tes selesai tidak boleh melebihi total tes</li>
                    <li>• Rata-rata nilai harus dalam rentang 0-100</li>
                    <li>• Perubahan akan langsung tersimpan ke database</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-5 border-t ${darkMode ? 'border-gray-600/50 bg-gradient-to-r from-gray-700/90 to-gray-800/90' : 'border-gray-200/50 bg-gradient-to-r from-gray-50/90 to-green-50/90'} backdrop-blur-sm rounded-b-2xl flex-shrink-0`}>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 ${
                darkMode 
                  ? 'border-gray-500 text-gray-300 hover:bg-gray-600 hover:border-gray-400' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Batal</span>
              </div>
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 border-2 border-transparent hover:border-green-400"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Simpan Perubahan</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
