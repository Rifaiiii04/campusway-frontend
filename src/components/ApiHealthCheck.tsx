"use client";

import { useState, useEffect } from "react";

interface HealthData {
  status: string;
  timestamp: string;
  database: string;
  response_time: string;
  memory_usage: string;
  memory_peak: string;
}

export default function ApiHealthCheck() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const checkHealth = async () => {
    setLoading(true);
    setError("");

    try {
      const startTime = Date.now();
      const response = await fetch(
        "http://127.0.0.1:8001/api/optimized/health"
      );
      const endTime = Date.now();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setHealthData({
        ...data,
        response_time: `${endTime - startTime}ms (client)`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const getDatabaseColor = (db: string) => {
    return db === "connected" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          API Health Monitor
        </h3>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Checking..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {healthData && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                healthData.status
              )}`}
            >
              {healthData.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Database:</span>
            <span
              className={`text-sm font-medium ${getDatabaseColor(
                healthData.database
              )}`}
            >
              {healthData.database}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Response Time:
            </span>
            <span className="text-sm font-medium text-red-600">
              {healthData.response_time}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Memory Usage:
            </span>
            <span className="text-sm font-medium text-gray-800">
              {healthData.memory_usage}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Memory Peak:
            </span>
            <span className="text-sm font-medium text-gray-800">
              {healthData.memory_peak}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Last Check:
            </span>
            <span className="text-sm text-gray-500">
              {new Date(healthData.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
        <p className="text-xs text-red-700">
          <strong>Optimized API:</strong> Using cached endpoints for faster
          response times. Auto-refreshes every 30 seconds.
        </p>
      </div>
    </div>
  );
}
