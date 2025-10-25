/**
 * Performance utilities for the application
 */

// Debounce utility for search and input
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll and resize
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization utility
export const memoize = (fn: (...args: unknown[]) => unknown) => {
  const cache = new Map();
  return (...args: unknown[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Image optimization
export const optimizeImageUrl = (
  url: string,
  width?: number,
  quality?: number
) => {
  if (process.env.NODE_ENV === "production") {
    const params = new URLSearchParams();
    if (width) params.set("w", width.toString());
    if (quality) params.set("q", quality.toString());

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${params.toString()}`;
  }
  return url;
};

// Dynamic imports for heavy libraries
export const loadChartJS = () => import("chart.js");
export const loadReactChartJS = () => import("react-chartjs-2");
export const loadHtml2Canvas = () => import("html2canvas");
export const loadJSPDF = () => import("jspdf");
