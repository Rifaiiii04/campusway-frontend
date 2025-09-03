// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing an operation
  startTiming(operation: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetric(operation, duration);

      // Log slow operations
      if (duration > 1000) {
        // 1 second
        console.warn(
          `Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`
        );
      }
    };
  }

  // Record a metric
  recordMetric(operation: string, value: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }

    const values = this.metrics.get(operation)!;
    values.push(value);

    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  // Get average time for an operation
  getAverageTime(operation: string): number {
    const values = this.metrics.get(operation);
    if (!values || values.length === 0) return 0;

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  // Get performance report
  getReport(): Record<
    string,
    { average: number; count: number; latest: number }
  > {
    const report: Record<
      string,
      { average: number; count: number; latest: number }
    > = {};

    for (const [operation, values] of this.metrics.entries()) {
      if (values.length > 0) {
        report[operation] = {
          average: this.getAverageTime(operation),
          count: values.length,
          latest: values[values.length - 1],
        };
      }
    }

    return report;
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
  }
}

// Global instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Performance decorator
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  operationName?: string
): T {
  return ((...args: Parameters<T>) => {
    const operation = operationName || fn.name || "anonymous";
    const endTiming = performanceMonitor.startTiming(operation);

    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.finally(endTiming);
      }

      endTiming();
      return result;
    } catch (error) {
      endTiming();
      throw error;
    }
  }) as T;
}

// API performance monitoring
export const apiPerformance = {
  startRequest: (url: string) => {
    return performanceMonitor.startTiming(`API: ${url}`);
  },

  recordResponse: (url: string, duration: number) => {
    performanceMonitor.recordMetric(`API: ${url}`, duration);
  },
};

// Component performance monitoring
export const componentPerformance = {
  startRender: (componentName: string) => {
    return performanceMonitor.startTiming(`Component: ${componentName}`);
  },

  recordRender: (componentName: string, duration: number) => {
    performanceMonitor.recordMetric(`Component: ${componentName}`, duration);
  },
};
