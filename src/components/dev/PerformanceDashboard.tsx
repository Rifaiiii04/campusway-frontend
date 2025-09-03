"use client";

import React, { useState, useEffect } from "react";
import { usePerformance } from "@/components/providers/PerformanceProvider";
import { clientCache } from "@/utils/cache";

export const PerformanceDashboard: React.FC = () => {
  const { getReport } = usePerformance();
  const [performanceReport, setPerformanceReport] = useState<any>({});
  const [cacheStats, setCacheStats] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setPerformanceReport(getReport());
      setCacheStats(clientCache.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, [getReport]);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Performance Dashboard"
      >
        <svg
          className="w-6 h-6"
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
      </button>

      {/* Performance Dashboard */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Performance Monitor
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cache Stats */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Cache Stats
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                Size: {cacheStats.size}/{cacheStats.maxSize}
              </div>
              <div>Hit Rate: {cacheStats.hitRate}%</div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Performance Metrics
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(performanceReport).map(
                ([operation, metrics]: [string, any]) => (
                  <div
                    key={operation}
                    className="text-xs border-b border-gray-100 pb-2"
                  >
                    <div
                      className="font-medium text-gray-800 truncate"
                      title={operation}
                    >
                      {operation}
                    </div>
                    <div className="text-gray-600">
                      Avg: {metrics.average?.toFixed(2)}ms | Count:{" "}
                      {metrics.count} | Latest: {metrics.latest?.toFixed(2)}ms
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-2 border-t border-gray-200">
            <button
              onClick={() => {
                clientCache.clear();
                setCacheStats(clientCache.getStats());
              }}
              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
            >
              Clear Cache
            </button>
          </div>
        </div>
      )}
    </>
  );
};
