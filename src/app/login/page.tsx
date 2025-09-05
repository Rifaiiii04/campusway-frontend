'use client';

import { useRouter } from 'next/navigation';
import SchoolLogin from '../../components/SchoolLogin';
import PageTitle from '../../components/PageTitle';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
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
