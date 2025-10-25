/**
 * Bundle optimization utilities
 * This file contains utilities to optimize bundle size and performance
 */
import React from "react";

// Lazy loading utilities
export const lazyLoadComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// Dynamic imports for heavy libraries
export const loadChartJS = () => import("chart.js");
export const loadReactChartJS = () => import("react-chartjs-2");
export const loadHtml2Canvas = () => import("html2canvas");
export const loadJSPDF = () => import("jspdf");

// Memoization utilities
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Debounce utility for search and input
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll and resize
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Image optimization
export const optimizeImageUrl = (
  url: string,
  width?: number,
  quality?: number
) => {
  if (process.env.NODE_ENV === "production") {
    // Add image optimization parameters
    const params = new URLSearchParams();
    if (width) params.set("w", width.toString());
    if (quality) params.set("q", quality.toString());

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${params.toString()}`;
  }
  return url;
};

// Code splitting utilities
export const createAsyncComponent = <T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc);

  return (props: unknown) => {
    const FallbackComponent = fallback || (() => <div>Loading...</div>);
    return (
      <React.Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
};

// Bundle analyzer helper
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    // Add bundle analysis in development
    console.log("Bundle analysis available in development mode");
  }
};
