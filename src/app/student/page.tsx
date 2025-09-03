'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SchoolLogin from '../../components/SchoolLogin';
import PageTitle from '../../components/PageTitle';

export default function StudentLoginPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (token: string) => {
    setIsLoggedIn(true);
    // Redirect ke halaman tes siswa setelah login berhasil
    router.push('/student/dashboard');
  };

  return (
    <>
      <PageTitle 
        title="Login Siswa - Sistem TKA" 
        description="Halaman login untuk siswa mengakses tes TKA"
      />
      <SchoolLogin onLoginSuccess={handleLoginSuccess} userType="siswa" />
    </>
  );
}
