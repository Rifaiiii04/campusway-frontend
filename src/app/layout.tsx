import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PerformanceProvider } from "@/components/providers/PerformanceProvider";
import { PerformanceDashboard } from "@/components/dev/PerformanceDashboard";

export const metadata: Metadata = {
  title: {
    default: "Sistem ArahPotensi - Dashboard Guru",
    template: "%s | Sistem ArahPotensi",
  },
  description:
    "Sistem Tes Kemampuan Akademik untuk membantu siswa menentukan jurusan yang tepat",
  keywords: [
    "ArahPotensi",
    "ArahPotensi - Tes Kemampuan Akademik",
    "Jurusan",
    "Siswa",
    "Dashboard",
    "Guru",
  ],
  authors: [{ name: "ArahPotensi Team" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://tka-system.com",
    title: "Sistem ArahPotensi - Dashboard Guru",
    description:
      "Sistem Tes Kemampuan Akademik untuk membantu siswa menentukan jurusan yang tepat",
    siteName: "Sistem ArahPotensi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistem ArahPotensi - Dashboard Guru",
    description:
      "Sistem Tes Kemampuan Akademik untuk membantu siswa menentukan jurusan yang tepat",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//127.0.0.1:8001" />
      </head>
      <body className={`antialiased bg-white dark:bg-gray-900`}>
        <ErrorBoundary>
          <PerformanceProvider>
            {children}
            <PerformanceDashboard />
          </PerformanceProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
