/**
 * Production optimization utilities
 * This file contains utilities to optimize the app for production
 */

// Check if we're in production
export const isProduction = process.env.NODE_ENV === "production";

// Conditional logging - only logs in development
export const devLog = (...args: any[]) => {
  if (!isProduction) {
    console.log(...args);
  }
};

export const devWarn = (...args: any[]) => {
  if (!isProduction) {
    console.warn(...args);
  }
};

export const devError = (...args: any[]) => {
  if (!isProduction) {
    console.error(...args);
  }
};

// Performance monitoring - only in development
export const devPerformance = {
  mark: (name: string) => {
    if (!isProduction && typeof window !== "undefined" && window.performance) {
      window.performance.mark(name);
    }
  },
  measure: (name: string, startMark: string, endMark?: string) => {
    if (!isProduction && typeof window !== "undefined" && window.performance) {
      window.performance.measure(name, startMark, endMark);
    }
  },
  getEntriesByName: (name: string) => {
    if (!isProduction && typeof window !== "undefined" && window.performance) {
      return window.performance.getEntriesByName(name);
    }
    return [];
  },
};

// API optimization
export const getOptimizedHeaders = (
  additionalHeaders: Record<string, string> = {}
) => {
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add cache control for production
  if (isProduction) {
    baseHeaders["Cache-Control"] = "no-cache";
  }

  return {
    ...baseHeaders,
    ...additionalHeaders,
  };
};

// Cache optimization
export const getCacheConfig = (defaultTTL: number = 300000) => {
  return {
    enabled: isProduction,
    ttl: isProduction ? defaultTTL : 0, // No cache in development
    maxSize: isProduction ? 50 : 10, // Smaller cache in development
  };
};

// Bundle optimization
export const shouldIncludeDevTools = () => {
  return !isProduction;
};

// Error reporting optimization
export const reportError = (error: Error, context?: string) => {
  if (isProduction) {
    // In production, you might want to send errors to a service like Sentry
    // For now, we'll just log to console in a structured way
    console.error("Production Error:", {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  } else {
    // In development, show full error details
    console.error("Development Error:", error, context);
  }
};
