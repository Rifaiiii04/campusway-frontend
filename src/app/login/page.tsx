"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SchoolLogin from "../../components/SchoolLogin";
import PageTitle from "../../components/PageTitle";

export default function LoginPage() {
  const router = useRouter();

  // Security: Clear any sensitive data from storage on page mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear any potentially sensitive data from previous sessions
      const sensitiveKeys = ['token', 'password', 'credential', 'secret', 'key', 'auth'];
      sensitiveKeys.forEach(key => {
        Object.keys(localStorage).forEach(localKey => {
          if (localKey.toLowerCase().includes(key)) {
            console.warn(`🔒 Security: Removing sensitive data from localStorage: ${localKey}`);
            localStorage.removeItem(localKey);
          }
        });
        Object.keys(sessionStorage).forEach(sessionKey => {
          if (sessionKey.toLowerCase().includes(key)) {
            console.warn(`🔒 Security: Removing sensitive data from sessionStorage: ${sessionKey}`);
            sessionStorage.removeItem(sessionKey);
          }
        });
      });
    }
  }, []);

  const handleLoginSuccess = (token: string) => {
    console.log("🎉 Login success, redirecting to teacher dashboard with token:", token ? `${token.substring(0, 10)}...` : "NO TOKEN");
    // Redirect ke dashboard guru setelah login berhasil
    router.push("/teacher");
  };

  return (
    <>
      <PageTitle
        title="Login Guru - Sistem ArahPotensi"
        description="Halaman login untuk guru mengakses dashboard ArahPotensi"
      />
      <SchoolLogin onLoginSuccess={handleLoginSuccess} userType="guru" />
    </>
  );
}
