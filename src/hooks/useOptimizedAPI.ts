/**
 * Optimized API hooks for better performance
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { debounce, throttle } from "@/utils/bundle-optimizer";

// Generic API hook with caching and error handling
export const useOptimizedAPI = <T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = [],
  options: {
    enabled?: boolean;
    cacheTime?: number;
    staleTime?: number;
    retryCount?: number;
  } = {}
) => {
  const {
    enabled = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 1 * 60 * 1000, // 1 minute
    retryCount = 3,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);

  const cacheRef = useRef<{ data: T; timestamp: number } | null>(null);
  const retryCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    if (cacheRef.current) {
      const now = Date.now();
      const cacheAge = now - cacheRef.current.timestamp;

      if (cacheAge < cacheTime) {
        setData(cacheRef.current.data);
        setIsStale(cacheAge > staleTime);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      setIsStale(false);

      // Update cache
      cacheRef.current = {
        data: result,
        timestamp: Date.now(),
      };

      retryCountRef.current = 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);

      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setTimeout(() => fetchData(), 1000 * retryCountRef.current);
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, enabled, cacheTime, staleTime, retryCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    cacheRef.current = null;
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isStale,
    refetch,
  };
};

// Debounced search hook
export const useDebouncedSearch = (
  searchFunction: (query: string) => Promise<unknown>,
  delay: number = 300
) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(() => {
    return debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchFunction(searchQuery);
        setResults(
          Array.isArray(data)
            ? data
            : (data as { results?: unknown[] }).results || []
        );
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);
  }, [searchFunction, delay]);

  useEffect(() => {
    const debouncedFn = debouncedSearch();
    debouncedFn(query);
  }, [query, debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    loading,
  };
};

// Throttled scroll hook
export const useThrottledScroll = (
  callback: (scrollY: number) => void,
  delay: number = 100
) => {
  const throttledCallback = useCallback(() => {
    return throttle(callback, delay);
  }, [callback, delay]);

  useEffect(() => {
    const throttledFn = throttledCallback();
    const handleScroll = () => {
      throttledFn(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [throttledCallback]);
};

// Optimized form hook with validation
export const useOptimizedForm = <T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema?: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback(
    (field: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field as string]) {
        setErrors((prev) => ({ ...prev, [field as string]: "" }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback(() => {
    if (!validationSchema) return true;

    const newErrors = validationSchema(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};
