'use client';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
  darkMode: boolean;
}

export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeMenu, 
  onMenuClick, 
  darkMode
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/teacher' },
    { id: 'students', label: 'Data Siswa', icon: '👥', path: '/teacher' },
    { id: 'classes', label: 'Manajemen Kelas', icon: '🏫', path: '/teacher' },
    { id: 'tests', label: 'Tes & Hasil', icon: '📝', path: '/teacher' },
    { id: 'reports', label: 'Laporan & Analisis', icon: '📋', path: '/teacher' },
    { id: 'settings', label: 'Pengaturan Sistem', icon: '⚙️', path: '/teacher' },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl transition-all duration-300 ease-in-out fixed left-0 top-0 h-full z-30 border-r`}>
      {/* Sidebar Header */}
      <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center px-3 shadow-lg relative">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white bg-blue-700 hover:bg-blue-800 p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95 z-50 border-2 border-blue-500 hover:border-blue-400 shadow-lg hover:shadow-xl mr-3"
          title={sidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-white text-lg font-bold tracking-wide whitespace-nowrap">TKA Guru</h1>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-6 px-2 pb-20">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuClick(item.id)}
            className={`w-full flex items-center px-3 py-3 text-left transition-all duration-300 rounded-lg mb-2 group relative ${
              activeMenu === item.id
                ? darkMode 
                  ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-blue-200 border-r-2 border-blue-400 shadow-sm font-semibold'
                  : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-r-2 border-blue-600 shadow-sm font-semibold'
                : darkMode
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100 hover:shadow-sm hover:scale-105'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm hover:scale-105'
            }`}
            title={sidebarOpen ? item.label : item.label}
          >
            <span className="text-xl mr-3 flex-shrink-0 transition-all duration-300">{item.icon}</span>
            <span 
              className={`font-medium transition-all duration-300 overflow-hidden ${
                sidebarOpen 
                  ? 'opacity-100 max-w-xs' 
                  : 'opacity-0 max-w-0'
              } ${activeMenu === item.id 
                  ? darkMode ? 'text-blue-200' : 'text-blue-700' 
                  : darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {item.label}
            </span>
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t shadow-inner ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-sm font-bold text-white">G</span>
          </div>
          <div 
            className={`ml-3 flex-1 min-w-0 transition-all duration-300 overflow-hidden ${
              sidebarOpen 
                ? 'opacity-100 max-w-xs' 
                : 'opacity-0 max-w-0'
            }`}
          >
            <p className={`text-sm font-semibold truncate leading-tight ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Guru TKA</p>
            <p className={`text-xs truncate leading-tight ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>guru@tka.sch.id</p>
          </div>
          {!sidebarOpen && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              <p className="font-semibold">Guru TKA</p>
              <p className="text-gray-300">guru@tka.sch.id</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
