"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { performanceMonitor } from "@/utils/performanceMonitor";

interface PerformanceContextType {
  startTiming: (operation: string) => () => void;
  recordMetric: (operation: string, value: number) => void;
  getReport: () => Record<
    string,
    { average: number; count: number; latest: number }
  >;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
}) => {
  useEffect(() => {
    // Initialize performance monitoring
    const startTime = performance.now();

    // Monitor page load performance
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      performanceMonitor.recordMetric("page_load", loadTime);
    };

    // Monitor route changes
    const handleRouteChange = () => {
      performanceMonitor.recordMetric("route_change", performance.now());
    };

    window.addEventListener("load", handleLoad);
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("beforeunload", handleRouteChange);
    };
  }, []);

  const contextValue: PerformanceContextType = {
    startTiming: performanceMonitor.startTiming.bind(performanceMonitor),
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getReport: performanceMonitor.getReport.bind(performanceMonitor),
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};
