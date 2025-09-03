"use client";

import { useState } from "react";

interface PerformanceMetrics {
  endpoint: string;
  responseTime: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const testEndpoint = async (
    endpoint: string,
    name: string
  ): Promise<PerformanceMetrics> => {
    const startTime = Date.now();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/optimized${endpoint}`
      );
      const endTime = Date.now();

      return {
        endpoint: name,
        responseTime: endTime - startTime,
        timestamp: new Date(),
        success: response.ok,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };
    } catch (error) {
      return {
        endpoint: name,
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const runPerformanceTest = async () => {
    setIsMonitoring(true);
    const newMetrics: PerformanceMetrics[] = [];

    // Test different endpoints
    const endpoints = [
      { path: "/health", name: "Health Check" },
      { path: "/majors", name: "Majors List" },
      { path: "/schools", name: "Schools List" },
      { path: "/majors/1", name: "Major Details" },
    ];

    for (const endpoint of endpoints) {
      const metric = await testEndpoint(endpoint.path, endpoint.name);
      newMetrics.push(metric);
      setMetrics((prev) => [...prev, metric]);

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setIsMonitoring(false);
  };

  const clearMetrics = () => {
    setMetrics([]);
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 500) return "text-green-600";
    if (time < 1000) return "text-yellow-600";
    return "text-red-600";
  };

  const getSuccessColor = (success: boolean) => {
    return success ? "text-green-600" : "text-red-600";
  };

  const averageResponseTime =
    metrics.length > 0
      ? Math.round(
          metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length
        )
      : 0;

  const successRate =
    metrics.length > 0
      ? Math.round(
          (metrics.filter((m) => m.success).length / metrics.length) * 100
        )
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          API Performance Monitor
        </h3>
        <div className="flex gap-2">
          <button
            onClick={runPerformanceTest}
            disabled={isMonitoring}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMonitoring ? "Testing..." : "Run Test"}
          </button>
          <button
            onClick={clearMetrics}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-sm text-blue-600 font-medium">Total Tests</div>
            <div className="text-2xl font-bold text-blue-800">
              {metrics.length}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-sm text-green-600 font-medium">
              Avg Response
            </div>
            <div
              className={`text-2xl font-bold ${getResponseTimeColor(
                averageResponseTime
              )}`}
            >
              {averageResponseTime}ms
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-sm text-purple-600 font-medium">
              Success Rate
            </div>
            <div
              className={`text-2xl font-bold ${getSuccessColor(
                successRate === 100
              )}`}
            >
              {successRate}%
            </div>
          </div>
        </div>
      )}

      {/* Metrics List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-800">{metric.endpoint}</div>
              <div className="text-sm text-gray-500">
                {metric.timestamp.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`font-medium ${getResponseTimeColor(
                  metric.responseTime
                )}`}
              >
                {metric.responseTime}ms
              </div>
              <div
                className={`text-sm font-medium ${getSuccessColor(
                  metric.success
                )}`}
              >
                {metric.success ? "✓" : "✗"}
              </div>
            </div>
            {metric.error && (
              <div
                className="text-xs text-red-600 max-w-xs truncate"
                title={metric.error}
              >
                {metric.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>
            No performance data yet. Click &quot;Run Test&quot; to start
            monitoring.
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-xs text-yellow-700">
          <strong>Performance Guidelines:</strong>
          <br />• Green: &lt; 500ms (Excellent)
          <br />• Yellow: 500-1000ms (Good)
          <br />• Red: &gt; 1000ms (Needs optimization)
        </p>
      </div>
    </div>
  );
}
