"use client";

import { useState } from "react";
import ApiHealthCheck from "@/components/ApiHealthCheck";
import PerformanceMonitor from "@/components/PerformanceMonitor";

export default function PerformanceAdminPage() {
  const [activeTab, setActiveTab] = useState<"health" | "performance">(
    "health"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            API Performance Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and optimize API performance for ArahPotensi Student Web
            Application
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("health")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "health"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Health Check
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "performance"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Performance Monitor
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTab === "health" && (
            <div className="lg:col-span-2">
              <ApiHealthCheck />
            </div>
          )}

          {activeTab === "performance" && (
            <div className="lg:col-span-2">
              <PerformanceMonitor />
            </div>
          )}
        </div>

        {/* API Endpoints Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Optimized API Endpoints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Student Endpoints (Optimized)
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  •{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    GET /api/optimized/health
                  </code>{" "}
                  - Health check
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    GET /api/optimized/majors
                  </code>{" "}
                  - Majors list (cached)
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    GET /api/optimized/schools
                  </code>{" "}
                  - Schools list (cached)
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    POST /api/optimized/login
                  </code>{" "}
                  - Student login
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    GET /api/optimized/student-choice/{"{id}"}
                  </code>{" "}
                  - Student choice (cached)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Performance Features
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• ✅ Auto-caching for frequently accessed data</li>
                <li>• ✅ Query optimization with specific column selection</li>
                <li>• ✅ Response time monitoring</li>
                <li>• ✅ Memory usage tracking</li>
                <li>• ✅ Slow query detection and logging</li>
                <li>• ✅ OPcache enabled for better performance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            Performance Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-700">
            <div>
              <h4 className="font-medium mb-2">Frontend Optimization:</h4>
              <ul className="space-y-1">
                <li>• Use optimized endpoints for faster response</li>
                <li>• Implement proper error handling</li>
                <li>• Add loading states for better UX</li>
                <li>• Cache API responses when appropriate</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Backend Optimization:</h4>
              <ul className="space-y-1">
                <li>• Database queries are optimized</li>
                <li>• Caching is enabled for static data</li>
                <li>• Memory usage is monitored</li>
                <li>• Slow queries are logged automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
