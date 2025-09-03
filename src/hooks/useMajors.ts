import useSWR from "swr";
import { studentApiService } from "../services/api";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Hook for fetching majors with caching
export function useMajors() {
  const { data, error, isLoading, mutate } = useSWR(
    "majors",
    () => studentApiService.getMajors(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  return {
    majors: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook for fetching major details with caching
export function useMajorDetails(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `major-${id}` : null,
    () => (id ? studentApiService.getMajorDetails(id) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  return {
    major: data?.data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook for fetching schools with caching
export function useSchools() {
  const { data, error, isLoading, mutate } = useSWR(
    "schools",
    () => studentApiService.getSchools(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 1800000, // 30 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  return {
    schools: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook for fetching student choice with caching
export function useStudentChoice(studentId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    studentId ? `student-choice-${studentId}` : null,
    () => (studentId ? studentApiService.getStudentChoice(studentId) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  return {
    choice: data?.data || null,
    isLoading,
    isError: error,
    mutate,
  };
}
