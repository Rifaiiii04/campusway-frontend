/**
 * Performance hooks for the application
 */
import { useState, useEffect, useCallback } from "react";
import { debounce, throttle } from "@/utils/performance-utils";

// Simple API hook with caching
export const useAPI = (apiCall: () => Promise<unknown>) => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Debounced search hook
export const useSearch = (
  searchFunction: (query: string) => Promise<unknown>,
  delay: number = 300
) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(() => {
    return debounce(async (...args: unknown[]) => {
      const searchQuery = args[0] as string;
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

  return { query, setQuery, results, loading };
};

// Throttled scroll hook
export const useScroll = (
  callback: (scrollY: number) => void,
  delay: number = 100
) => {
  const throttledCallback = useCallback(() => {
    return throttle((...args: unknown[]) => {
      const scrollY = args[0] as number;
      callback(scrollY);
    }, delay);
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

// Simple form hook
export const useForm = (
  initialValues: Record<string, unknown>,
  validationSchema?: (values: Record<string, unknown>) => Record<string, string>
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback(
    (field: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((field: string) => {
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
