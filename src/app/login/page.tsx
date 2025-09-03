'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SchoolLogin from '../../components/SchoolLogin';
import PageTitle from '../../components/PageTitle';

export default function LoginPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (token: string) => {
    setIsLoggedIn(true);
    // Redirect ke dashboard guru setelah login berhasil
    router.push('/teacher');
  };

  return (
    <>
      <PageTitle 
        title="Login Guru - Sistem TKA" 
        description="Halaman login untuk guru mengakses dashboard TKA"
      />
      <SchoolLogin onLoginSuccess={handleLoginSuccess} userType="guru" />
    </>
  );
}
