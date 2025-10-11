"use client";

import React from "react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  feature,
  description = "Fitur ini sedang dalam pengembangan dan akan segera hadir.",
}: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-xl">⏰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">📤</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {feature}
              </h4>
              <p className="text-gray-600 mb-6">{description}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-600 text-lg mt-0.5 flex-shrink-0">
                  ⏰
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800">
                    Fitur Sedang Dikembangkan
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Tim developer sedang bekerja keras untuk menghadirkan fitur
                    ini. Terima kasih atas kesabaran Anda!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span>📥</span>
                <span>Import Excel/CSV</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  Soon
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span>📤</span>
                <span>Template Download</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Oke, Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
