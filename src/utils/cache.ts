// Client-side caching utility
class ClientCache {
  private cache = new Map<
    string,
    { data: unknown; timestamp: number; ttl: number }
  >();
  private maxSize = 100; // Maximum number of items in cache

  set<T>(key: string, data: T, expiresIn: number = 3 * 60 * 1000): void {
    // Reduced to 3 minutes
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: expiresIn,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) {
      return false;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // TODO: Implement hit rate tracking
    };
  }
}

// Global cache instance
export const clientCache = new ClientCache();

// Auto-cleanup every 2 minutes
setInterval(() => {
  clientCache.cleanup();
}, 2 * 60 * 1000);

// Cache key generators
export const cacheKeys = {
  majors: () => "majors",
  majorDetails: (id: number) => `major_${id}`,
  studentChoice: (studentId: number) => `student_choice_${studentId}`,
  majorStatus: (studentId: number) => `major_status_${studentId}`,
  dashboard: (schoolId: number) => `dashboard_${schoolId}`,
  students: (schoolId: number) => `students_${schoolId}`,
  majorStatistics: (schoolId: number) => `major_stats_${schoolId}`,
};
