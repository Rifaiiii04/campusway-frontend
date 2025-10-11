import Link from "next/link";

// import { useEffect, useState } from "react";

export default function Navigation() {
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#800000] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ArahPotensi</h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Fitur
              </Link>
              <Link
                href="#about"
                className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Tentang
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Kontak
              </Link>
              <Link
                href="/login"
                className="ml-4 bg-[#800000] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#800000] transition-colors duration-200"
              >
                Login Guru
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
