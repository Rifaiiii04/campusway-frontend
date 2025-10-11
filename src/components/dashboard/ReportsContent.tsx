"use client";

import { Bar, Doughnut } from "react-chartjs-2";
import { Student, MajorStatistics, DashboardData } from "../../services/api";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReportsContentProps {
  students: Student[];
  majorStatistics: MajorStatistics[];
  dashboardData: DashboardData | null;
  darkMode: boolean;
}

export default function ReportsContent({
  students,
  majorStatistics,
  dashboardData,
  darkMode,
}: ReportsContentProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    try {
      // Create a completely isolated iframe to avoid any external CSS interference
      const iframe = document.createElement("iframe");
      iframe.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 800px;
        height: 600px;
        border: none;
        background: white;
      `;

      document.body.appendChild(iframe);

      // Wait for iframe to load
      await new Promise((resolve) => {
        iframe.onload = resolve;
        iframe.src = "about:blank";
      });

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Could not access iframe document");
      }

      // Create completely isolated HTML content
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              background: white;
              color: black;
              padding: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #dc2626;
              text-align: center;
            }
            .stats-section {
              display: flex;
              gap: 20px;
              margin-bottom: 30px;
              flex-wrap: wrap;
            }
            .stat-card {
              padding: 20px;
              border-radius: 8px;
              flex: 1;
              min-width: 150px;
              color: white;
            }
            .completion-card {
              background: linear-gradient(to right, #ef4444, #dc2626);
            }
            .total-card {
              background: linear-gradient(to right, #22c55e, #16a34a);
            }
            .choice-card {
              background: linear-gradient(to right, #eab308, #ca8a04);
            }
            .popular-card {
              background: linear-gradient(to right, #a855f7, #9333ea);
            }
            .stat-label {
              font-size: 14px;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
            }
            .charts-section {
              display: flex;
              gap: 20px;
              margin-bottom: 30px;
              flex-wrap: wrap;
            }
            .chart-card {
              background: white;
              border: 1px solid #e5e7eb;
              padding: 20px;
              border-radius: 8px;
              flex: 1;
              min-width: 300px;
            }
            .chart-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #111827;
            }
            .chart-content {
              text-align: center;
              color: #6b7280;
            }
            .chart-item {
              margin: 5px 0;
              padding: 5px;
              color: white;
              border-radius: 4px;
            }
            .chart-item-0 { background-color: #ef4444; }
            .chart-item-1 { background-color: #fbbf24; }
            .chart-item-2 { background-color: #a855f7; }
            .chart-item-3 { background-color: #22c55e; }
            .chart-item-4 { background-color: #eab308; }
          </style>
        </head>
        <body>
          <h1 class="title">Laporan & Analisis - ArahPotensi</h1>
          
          <div class="stats-section">
            <div class="stat-card completion-card">
              <div class="stat-label">Tingkat Penyelesaian</div>
              <div class="stat-value">${
                dashboardData?.statistics.completion_percentage?.toFixed(1) ||
                "0"
              }%</div>
            </div>
            <div class="stat-card total-card">
              <div class="stat-label">Total Siswa</div>
              <div class="stat-value">${
                dashboardData?.statistics.total_students || "0"
              }</div>
            </div>
            <div class="stat-card choice-card">
              <div class="stat-label">Siswa Memilih Jurusan</div>
              <div class="stat-value">${
                dashboardData?.statistics.students_with_choice || "0"
              }</div>
            </div>
            <div class="stat-card popular-card">
              <div class="stat-label">Jurusan Populer</div>
              <div class="stat-value">${
                dashboardData?.top_majors[0]?.major_name || "N/A"
              }</div>
            </div>
          </div>
          
          <div class="charts-section">
            <div class="chart-card">
              <h3 class="chart-title">Distribusi Kelas</h3>
              <div class="chart-content">
                ${
                  dashboardData?.students_by_class
                    .map(
                      (cls, index) =>
                        `<div class="chart-item chart-item-${index % 5}">${
                          cls.kelas
                        }: ${cls.student_count} siswa</div>`
                    )
                    .join("") || "Tidak ada data"
                }
              </div>
            </div>
            <div class="chart-card">
              <h3 class="chart-title">Statistik Jurusan</h3>
              <div class="chart-content">
                ${
                  majorStatistics
                    .map(
                      (major, index) =>
                        `<div class="chart-item chart-item-${index % 5}">${
                          major.major_name
                        }: ${major.student_count} siswa</div>`
                    )
                    .join("") || "Tidak ada data"
                }
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for content to render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create canvas from the iframe content
      const canvas = await html2canvas(iframeDoc.body, {
        useCORS: true,
        allowTaint: true,
        background: "#ffffff",
        width: 800,
        height: iframeDoc.body.scrollHeight,
      });

      // Clean up
      document.body.removeChild(iframe);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save("laporan-arahpotensi.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mengexport PDF. Silakan coba lagi.");
    }
  };
  const classChartData = {
    labels: dashboardData?.students_by_class.map((cls) => cls.kelas) || [],
    datasets: [
      {
        label: "Jumlah Siswa",
        data:
          dashboardData?.students_by_class.map((cls) => cls.student_count) ||
          [],
        backgroundColor: [
          "rgba(128, 0, 0, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(128, 0, 0, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const majorData = {
    labels: majorStatistics.map((major) => major.major_name),
    datasets: [
      {
        label: "Jumlah Siswa",
        data: majorStatistics.map((major) => major.student_count),
        backgroundColor: [
          "rgba(128, 0, 0, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(128, 0, 0, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6" ref={reportRef}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={handleExportPDF}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-white bg-opacity-30 mr-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-red-100">
                Tingkat Penyelesaian
              </p>
              <p className="text-2xl font-semibold">
                {dashboardData?.statistics.completion_percentage?.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-white bg-opacity-30 mr-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-green-100">Total Siswa</p>
              <p className="text-2xl font-semibold">
                {dashboardData?.statistics.total_students}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-white bg-opacity-30 mr-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-yellow-100">
                Siswa Memilih Jurusan
              </p>
              <p className="text-2xl font-semibold">
                {dashboardData?.statistics.students_with_choice}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-white bg-opacity-30 mr-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-purple-100">
                Jurusan Populer
              </p>
              <p className="text-2xl font-semibold">
                {dashboardData?.top_majors[0]?.major_name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? "bg-red-900" : "bg-red-100"
              } mr-3`}
            >
              <svg
                className={`w-6 h-6 ${
                  darkMode ? "text-red-300" : "text-red-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Distribusi Kelas
            </h3>
          </div>
          <div className="h-64">
            <Doughnut
              data={classChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? "bg-green-900" : "bg-green-100"
              } mr-3`}
            >
              <svg
                className={`w-6 h-6 ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Statistik Jurusan
            </h3>
          </div>
          <div className="h-64">
            <Bar data={majorData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow p-6`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? "bg-purple-900" : "bg-purple-100"
              } mr-3`}
            >
              <svg
                className={`w-6 h-6 ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Persentase Jurusan
            </h3>
          </div>
          <div className="h-64">
            <Doughnut
              data={{
                labels: majorStatistics.map((major) => major.major_name),
                datasets: [
                  {
                    data: majorStatistics.map((major) => major.percentage),
                    backgroundColor: [
                      "rgba(54, 162, 235, 0.8)",
                      "rgba(255, 99, 132, 0.8)",
                      "rgba(255, 205, 86, 0.8)",
                      "rgba(75, 192, 192, 0.8)",
                      "rgba(153, 102, 255, 0.8)",
                      "rgba(255, 159, 64, 0.8)",
                    ],
                    borderColor: [
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 99, 132, 1)",
                      "rgba(255, 205, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Siswa yang Sudah Memilih Jurusan */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow`}
        >
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-green-900" : "bg-green-100"
                } mr-3`}
              >
                <svg
                  className={`w-6 h-6 ${
                    darkMode ? "text-green-300" : "text-green-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Siswa yang Sudah Memilih Jurusan
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {students
                .filter((s) => s.has_choice)
                .slice(0, 5)
                .map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0
                            ? "bg-green-500"
                            : index === 1
                            ? "bg-red-500"
                            : index === 2
                            ? "bg-yellow-500"
                            : "bg-purple-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {student.name}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {student.class}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student.chosen_major?.name}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {student.choice_date
                          ? new Date(student.choice_date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Statistik Kelas */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow`}
        >
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-purple-900" : "bg-purple-100"
                } mr-3`}
              >
                <svg
                  className={`w-6 h-6 ${
                    darkMode ? "text-purple-300" : "text-purple-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Statistik Kelas
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData?.students_by_class.map((classItem, index) => {
                const studentsInClass = students.filter(
                  (student) => student.class === classItem.kelas
                );
                const studentsWithChoice = studentsInClass.filter(
                  (student) => student.has_choice
                ).length;
                const completionRate =
                  classItem.student_count > 0
                    ? (studentsWithChoice / classItem.student_count) * 100
                    : 0;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0
                            ? "bg-green-500"
                            : index === 1
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {classItem.kelas}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {classItem.student_count} siswa
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {studentsWithChoice}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {completionRate.toFixed(1)}% selesai
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
