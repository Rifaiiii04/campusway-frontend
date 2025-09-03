"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SchoolLogin from "../../components/SchoolLogin";
import PageTitle from "../../components/PageTitle";

export default function StudentLoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Redirect ke halaman tes siswa setelah login berhasil
    router.push("/student/dashboard");
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
