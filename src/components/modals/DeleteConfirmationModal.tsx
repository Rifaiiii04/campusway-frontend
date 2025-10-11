'use client';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  darkMode: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  darkMode
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/30 via-red-900/20 to-gray-900/30 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-800/95' : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95'} backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full flex flex-col border ${darkMode ? 'border-gray-600/50' : 'border-gray-200/50'}`}>
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b ${darkMode ? 'border-gray-600/50 bg-gradient-to-r from-gray-700/90 via-gray-800/90 to-gray-700/90' : 'border-gray-200/50 bg-gradient-to-r from-red-50/90 via-pink-50/90 to-orange-50/90'} backdrop-blur-sm rounded-t-2xl flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
                             <div>
                 <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
                 <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Konfirmasi tindakan penghapusan</p>
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
        <div className="flex-1 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
                         <div className="ml-4 flex-1">
               <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                 {message}
               </h3>
               {itemName && (
                 <div className={`mb-4 p-4 rounded-xl border ${darkMode ? 'bg-gradient-to-r from-red-900/50 to-pink-900/50 border-red-700/50' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50'}`}>
                   <p className={`font-medium text-sm ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                     <span className="font-semibold">Item yang akan dihapus:</span>
                   </p>
                   <p className={`mt-1 font-semibold text-sm ${darkMode ? 'text-red-100' : 'text-red-700'}`}>{itemName}</p>
                 </div>
               )}
               <div className={`rounded-xl p-4 border ${darkMode ? 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-700/50' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200/50'}`}>
                 <div className="flex items-start">
                   <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                   </svg>
                   <div>
                     <p className={`font-medium text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>Peringatan</p>
                     <p className={`text-xs mt-1 ${darkMode ? 'text-yellow-100' : 'text-yellow-700'}`}>
                       Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara permanen.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-5 border-t ${darkMode ? 'border-gray-600/50 bg-gradient-to-r from-gray-700/90 to-gray-800/90' : 'border-gray-200/50 bg-gradient-to-r from-gray-50/90 to-red-50/90'} backdrop-blur-sm rounded-b-2xl flex-shrink-0`}>
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
            type="button"
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white hover:from-red-700 hover:via-pink-700 hover:to-rose-700 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Hapus</span>
            </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
