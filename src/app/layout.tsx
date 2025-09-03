import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PerformanceProvider } from "@/components/providers/PerformanceProvider";
import { PerformanceDashboard } from "@/components/dev/PerformanceDashboard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Sistem TKA - Dashboard Guru",
    template: "%s | Sistem TKA",
  },
  description:
    "Sistem Tes Kemampuan Akademik untuk membantu siswa menentukan jurusan yang tepat",
  keywords: [
    "TKA",
    "Tes Kemampuan Akademik",
    "Jurusan",
    "Siswa",
    "Dashboard",
    "Guru",
  ],
  authors: [{ name: "TKA Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://tka-system.com",
    title: "Sistem TKA - Dashboard Guru",
    description:
      "Sistem Tes Kemampuan Akademik untuk membantu siswa menentukan jurusan yang tepat",
    siteName: "Sistem TKA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistem TKA - Dashboard Guru",
    description:
      "Sistem Tes Kemampuan Akademik untuk membantu siswa menentukan jurusan yang tepat",
  },
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
        <link rel="dns-prefetch" href="//127.0.0.1:8000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900`}
      >
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
