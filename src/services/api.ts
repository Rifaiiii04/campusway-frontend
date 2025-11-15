import { clientCache, cacheKeys } from "@/utils/cache";
import { apiPerformance } from "@/utils/performanceMonitor";

// Dynamic API base URL based on current hostname
const getApiBaseUrl = () => {
  // Use production server with /super-admin path
  const url = "http://103.23.198.101/super-admin";

  // Only log in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const hostname = window.location.hostname;
    console.log("🔧 getApiBaseUrl hostname:", hostname);
    console.log("🔧 Using production backend URL:", url);
  }

  return url;
};

// Fallback API base URL for when main server is down
const getFallbackApiBaseUrl = () => {
  // Use production server as fallback
  return "http://103.23.198.101/super-admin";
};

// Get API base URL with proper network detection
const getApiBaseUrlWithNetworkDetection = () => {
  const baseUrl = getApiBaseUrl();
  return {
    school: `${baseUrl}/api/school`,
    web: `${baseUrl}/api/web`,
    superadmin: `${baseUrl}/api`,
  };
};

const apiUrls = getApiBaseUrlWithNetworkDetection();

const API_BASE_URL = apiUrls.school;
const STUDENT_API_BASE_URL = apiUrls.web;

// SuperAdmin API Base URL for ArahPotensi integration
const SUPERADMIN_API_BASE_URL = apiUrls.superadmin;

// Force override for network access
if (
  typeof window !== "undefined" &&
  window.location.hostname === "10.112.234.213"
) {
  const STUDENT_API_BASE_URL_OVERRIDE =
    "http://103.23.198.101/super-admin/api/web";

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log(
      "🔧 Overriding STUDENT_API_BASE_URL to:",
      STUDENT_API_BASE_URL_OVERRIDE
    );
  }
}

const SCHOOL_LEVEL_API_BASE_URL =
  process.env.NEXT_PUBLIC_SCHOOL_LEVEL_API_BASE_URL ||
  `${getApiBaseUrl()}/api/school-level`;

// Debug logging - only in development
if (process.env.NODE_ENV === "development") {
  console.log("🔧 getApiBaseUrl():", getApiBaseUrl());
  console.log("🔧 API_BASE_URL:", API_BASE_URL);
  console.log("🔧 STUDENT_API_BASE_URL:", STUDENT_API_BASE_URL);
  console.log("🔧 SUPERADMIN_API_BASE_URL:", SUPERADMIN_API_BASE_URL);
}

// Enhanced fetch with caching and performance monitoring
async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL: number = 3 * 60 * 1000, // 3 minutes default
  retryCount: number = 0
): Promise<T> {
  // Check cache first
  if (cacheKey && clientCache.has(cacheKey)) {
    const cachedData = clientCache.get<T>(cacheKey);
    if (cachedData) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Cache hit for ${cacheKey}`);
      }
      return cachedData;
    }
  }

  // Start performance monitoring
  const endTiming = apiPerformance.startRequest(url);

  let timeoutId: NodeJS.Timeout | undefined = undefined;

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🌐 fetchWithCache making request to:", url);
      console.log("🌐 fetchWithCache options:", options);
    }

    const controller = new AbortController();
    timeoutId = setTimeout(() => {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Request timeout for ${url}`);
      }
      controller.abort();
    }, 15000); // 15 seconds timeout

    const finalHeaders = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (process.env.NODE_ENV === "development") {
      console.log("🌐 fetchWithCache final headers:", finalHeaders);
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: finalHeaders,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("🌐 fetchWithCache response status:", response.status);
      console.log("🌐 fetchWithCache response ok:", response.ok);
    }

    // Clear timeout on successful response
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    endTiming();

    if (!response.ok) {
      // Retry for 500 errors up to 2 times
      if (response.status === 500 && retryCount < 2) {
        console.warn(
          `Server error 500, retrying... (attempt ${retryCount + 1}/2)`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        ); // Exponential backoff
        return fetchWithCache(url, options, cacheKey, cacheTTL, retryCount + 1);
      }

      // Try fallback URL for 500 errors on first attempt
      if (response.status === 500 && retryCount === 0) {
        console.warn(`Server error 500, trying fallback URL...`);
        const fallbackUrl = url.replace(
          getApiBaseUrl(),
          getFallbackApiBaseUrl()
        );
        console.log(`Trying fallback URL: ${fallbackUrl}`);
        try {
          return await fetchWithCache(
            fallbackUrl,
            options,
            cacheKey,
            cacheTTL,
            retryCount + 1
          );
        } catch (fallbackError) {
          console.warn(`Fallback URL also failed:`, fallbackError);
        }
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the response if cache key is provided
    if (cacheKey && data.success !== false) {
      clientCache.set(cacheKey, data, cacheTTL);
    }

    return data;
  } catch (error) {
      // Always clear timeout and end timing
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      endTiming();

      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            `Request timeout: Server tidak merespons dalam 15 detik`
          );
        }
        if (error.message.includes("Failed to fetch")) {
          // Check if it's blocked by client (ad blocker, etc.)
          // ERR_BLOCKED_BY_CLIENT can appear in different forms
          const errorLower = error.message.toLowerCase();
          if (
            errorLower.includes("blocked by client") ||
            errorLower.includes("err_blocked_by_client") ||
            errorLower.includes("net::err_blocked_by_client")
          ) {
            console.error("🚫 Request blocked by browser extension:", {
              url,
              error: error.message,
            });
            throw new Error(
              `Request diblokir oleh browser atau extension (ad blocker, privacy extension, dll).\n\n` +
              `Solusi:\n` +
              `1. Nonaktifkan ad blocker atau extension yang memblokir request\n` +
              `2. Tambahkan ${new URL(url).origin} ke whitelist extension\n` +
              `3. Coba gunakan mode incognito/private browsing\n` +
              `4. Cek browser console untuk detail error`
            );
          }
          // Check if it's a network connectivity issue
          if (
            error.message.includes("ERR_NETWORK_CHANGED") ||
            error.message.includes("ERR_INTERNET_DISCONNECTED")
          ) {
            throw new Error(
              `Koneksi internet terputus. Periksa koneksi internet Anda dan coba lagi.`
            );
          }
          // Check if it's a CORS issue
          if (
            error.message.includes("ERR_CERT_AUTHORITY_INVALID") ||
            error.message.includes("ERR_SSL_PROTOCOL_ERROR")
          ) {
            throw new Error(
              `Masalah keamanan koneksi. Silakan coba akses dengan HTTP atau periksa sertifikat SSL.`
            );
          }
          // Generic network error
          throw new Error(
            `Koneksi gagal: Pastikan server backend berjalan di ${getApiBaseUrl()}. Error: ${
              error.message
            }`
          );
        }
      }

      // Check for TypeError which can indicate blocked requests
      if (error instanceof TypeError) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("failed to fetch") ||
          errorMessage.includes("networkerror")
        ) {
          // This might be a blocked request - provide helpful message
          console.warn("⚠️ Possible blocked request detected:", {
            url,
            error: error.message,
          });
        }
      }

      throw error;
    }
}

// Types berdasarkan API documentation
export interface School {
  id: number;
  npsn: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Student {
  id: number;
  nisn: string;
  name: string;
  class: string;
  kelas?: string; // API returns 'kelas' field
  email?: string;
  phone?: string;
  parent_phone?: string;
  password?: string;
  has_choice: boolean;
  school_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  chosen_major?: {
    id: number;
    name: string;
    description?: string;
    career_prospects?: string;
    rumpun_ilmu?: string;
    choice_date?: string;
    required_subjects?: string[] | string;
    preferred_subjects?: string[] | string;
    optional_subjects?: string[] | string;
    kurikulum_merdeka_subjects?: string[] | string;
    kurikulum_2013_ipa_subjects?: string[] | string;
    kurikulum_2013_ips_subjects?: string[] | string;
    kurikulum_2013_bahasa_subjects?: string[] | string;
  };
  choice_date?: string;
  school_class?: {
    id: number;
    name: string;
  };
  latest_test_result?: {
    id: number;
    total_score: number;
    recommended_major: string;
    major_confidence: number;
  };
}

export interface MajorStatistics {
  major_id: string;
  major_name: string;
  description?: string;
  category?: string;
  student_count: number;
  percentage: number;
}

export interface DashboardData {
  school: School;
  statistics: {
    total_students: number;
    students_with_choice: number;
    students_without_choice: number;
    completion_percentage: number;
  };
  top_majors: Array<{
    major_id: string;
    major_name: string;
    category?: string;
    student_count: number;
  }>;
  students_by_class: Array<{
    kelas: string;
    student_count: number;
  }>;
}

export interface StudentsResponse {
  school: School;
  students: Student[];
  total_students: number;
}

export interface MajorStatisticsResponse {
  school: School;
  total_students_with_choice: number;
  major_statistics: MajorStatistics[];
}

// Student Web API Types
export interface StudentData {
  id: number;
  nisn: string;
  name: string;
  kelas: string;
  email?: string;
  phone?: string;
  parent_phone?: string;
  school_name: string;
  has_choice: boolean;
  school_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Major {
  id: number;
  major_name: string;
  description?: string;
  career_prospects?: string;
  category?: string;
  rumpun_ilmu?: string;
  subjects?: {
    required?: string[];
    preferred?: string[];
    kurikulum_merdeka?: string[];
    kurikulum_2013_ipa?: string[];
    kurikulum_2013_ips?: string[];
    kurikulum_2013_bahasa?: string[];
  };
  required_subjects?: string[];
  preferred_subjects?: string[];
  optional_subjects?: string[] | string;
  kurikulum_merdeka_subjects?: string[];
  kurikulum_2013_ipa_subjects?: string[];
  kurikulum_2013_ips_subjects?: string[];
  kurikulum_2013_bahasa_subjects?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Subject {
  id: number;
  subject_number: string;
  name: string;
  code: string;
  type: "wajib" | "pilihan";
  is_required: boolean;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RumpunIlmu {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramStudi {
  id: number;
  rumpun_ilmu_id: number;
  name: string;
  description?: string;
  is_active: boolean;
  rumpun_ilmu?: RumpunIlmu;
  created_at?: string;
  updated_at?: string;
}

export interface StudentChoice {
  id: number;
  major: Major;
  chosen_at: string;
  student_id?: number;
  major_id?: number;
  created_at?: string;
  updated_at?: string;
}

// ArahPotensi Schedule interfaces - PUSMENDIK Standard
export interface TkaSchedule {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  type: "regular" | "makeup" | "special";
  instructions?: string;
  target_schools?: number[] | undefined;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  school_id?: number;

  // PUSMENDIK Essential Fields
  gelombang?: "1" | "2";
  hari_pelaksanaan?: "Hari Pertama" | "Hari Kedua";
  exam_venue?: string;
  exam_room?: string;
  contact_person?: string;
  contact_phone?: string;
  requirements?: string;
  materials_needed?: string;

  // Accessors
  formatted_start_date?: string;
  formatted_end_date?: string;
  status_badge?: string;
  type_badge?: string;
}

// Helper function untuk mendapatkan token
const getToken = (): string | undefined => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("school_token") || undefined;
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🔑 getToken - Retrieved from localStorage:",
        token ? `${token.substring(0, 10)}...` : "NO TOKEN"
      );
    }
    return token;
  }
  if (process.env.NODE_ENV === "development") {
    console.log("🔑 getToken - Window undefined, returning undefined");
  }
  return undefined;
};

// Helper function untuk mendapatkan student token (currently unused but kept for future use)
// const getStudentToken = (): string | null => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("student_token");
//   }
//   return null;
// };

// Helper function untuk membuat headers dengan authorization
const getAuthHeaders = () => {
  const token = getToken();
  if (process.env.NODE_ENV === "development") {
    console.log(
      "🔑 getAuthHeaders - Token:",
      token ? `${token.substring(0, 10)}...` : "NO TOKEN"
    );
  }
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  if (process.env.NODE_ENV === "development") {
    console.log("🔑 getAuthHeaders - Headers:", headers);
  }
  return headers;
};

// Helper function untuk membuat headers dengan student authorization (currently unused but kept for future use)
// const getStudentAuthHeaders = () => {
//   const token = getStudentToken();
//   return {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: token }),
//   };
// };

// API Functions
export const apiService = {
  // Login
  // ...existing code...
  async login(npsn: string, password: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      console.log("🔍 School login attempt to:", `${API_BASE_URL}/login`);
      console.log("🔍 School login data:", { npsn, password: "***" });

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ npsn, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("🔍 School login response status:", response.status);
      console.log("🔍 School login response ok:", response.ok);

      const data = await response.json();
      console.log("🔍 School login response data:", data);

      if (!response.ok) {
        console.error("❌ School login failed:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Provide more specific error messages based on status code
        if (response.status === 401) {
          throw new Error("NPSN atau password salah");
        } else if (response.status === 404) {
          throw new Error("NPSN tidak ditemukan");
        } else if (response.status === 422) {
          throw new Error(data.message || "Data tidak valid");
        } else if (response.status >= 500) {
          throw new Error(
            `Server error (${response.status}): ${
              data.message ||
              "Server sedang mengalami masalah. Silakan coba lagi nanti"
            }`
          );
        } else {
          throw new Error(data.message || "Login gagal");
        }
      }

      return data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      console.error("💥 API Service login error:", {
        error,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        url: `${API_BASE_URL}/login`,
        npsn: npsn.substring(0, 3) + "***",
      });

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Timeout: Server tidak merespons dalam 15 detik");
      }
      throw error;
    }
  },

  // Logout
  async logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout gagal");
    }

    return data;
  },

  // Get Profile
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil profile");
    }

    return data;
  },

  // Get Dashboard Data
  async getDashboard(): Promise<{ success: boolean; data: DashboardData }> {
    const token = getToken();

    // Try authenticated endpoint first
    if (token) {
      try {
        return await fetchWithCache(
          `${API_BASE_URL}/dashboard`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
          "dashboard",
          5 * 60 * 1000 // 5 minutes cache
        );
      } catch (error) {
        console.warn(
          "Authenticated dashboard failed, trying test endpoint:",
          error
        );
      }
    }

    // Fallback to test endpoint for development/testing
    console.log("Using test dashboard endpoint");
    return fetchWithCache(
      `${API_BASE_URL}/test-dashboard-data`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      "test-dashboard",
      0 // No cache to ensure fresh data
    );
  },

  // Get All Students
  async getStudents(
    forceRefresh: boolean = false
  ): Promise<{ success: boolean; data: StudentsResponse }> {
    const token = getToken();

    // Try authenticated endpoint first
    if (token) {
      try {
        return await this.getStudentsAuthenticated(forceRefresh);
      } catch (error) {
        console.warn(
          "Authenticated students failed, trying test endpoint:",
          error
        );
      }
    }

    // Fallback to test endpoint
    console.log("Using test students endpoint");
    return fetchWithCache(
      `${API_BASE_URL}/test-students`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      "test-students",
      5 * 60 * 1000 // 5 minutes cache
    );
  },

  // Authenticated students method
  async getStudentsAuthenticated(
    forceRefresh: boolean = false
  ): Promise<{ success: boolean; data: StudentsResponse }> {
    const token = getToken();
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const schoolData = localStorage.getItem("school_data");
    const schoolId =
      schoolData && schoolData !== "undefined" && schoolData !== "null"
        ? JSON.parse(schoolData).id
        : "unknown";

    // If force refresh, bypass cache
    if (forceRefresh) {
      console.log("🔄 Force refreshing students data (bypassing cache)");
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat data siswa");
      }

      // Update cache with fresh data
      clientCache.set(cacheKeys.students(schoolId), data, 3 * 60 * 1000);

      return data;
    }

    const authHeaders = getAuthHeaders();
    console.log("🔍 getStudents - Auth headers:", authHeaders);
    console.log(
      "🔍 getStudents - Token from localStorage:",
      localStorage.getItem("school_token")
    );
    console.log(
      "🔍 getStudents - School data from localStorage:",
      localStorage.getItem("school_data")
    );
    console.log(
      "🔍 getStudents - All localStorage keys:",
      Object.keys(localStorage)
    );
    console.log("🔍 getStudents - API_BASE_URL:", API_BASE_URL);
    console.log("🔍 getStudents - Full URL:", `${API_BASE_URL}/students`);
    console.log(
      "🔍 getStudents - Token exists:",
      !!localStorage.getItem("school_token")
    );
    console.log(
      "🔍 getStudents - Token length:",
      localStorage.getItem("school_token")?.length || 0
    );
    console.log("🔍 getStudents - Current URL:", window.location.href);
    console.log("🔍 getStudents - User agent:", navigator.userAgent);

    return fetchWithCache(
      `${API_BASE_URL}/students`,
      {
        headers: authHeaders,
      },
      cacheKeys.students(schoolId),
      3 * 60 * 1000 // 3 minutes cache
    );
  },

  // Get Student Detail
  async getStudentDetail(studentId: number) {
    // Get token explicitly for debugging
    const token = getToken();
    console.log("🔑 getStudentDetail - Token check:", token ? `${token.substring(0, 20)}...` : "NO TOKEN FOUND");
    
    const headers = {
      ...getAuthHeaders(),
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const url = `${API_BASE_URL}/students/${studentId}`;
    console.log("🔍 Fetching student detail from:", url);
    console.log("🔍 Request headers:", {
      ...headers,
      Authorization: headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : "NO AUTHORIZATION HEADER"
    });

    // Add timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
        credentials: "same-origin",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("📡 Student detail response status:", response.status);

      // Check if response is HTML (redirect or error page)
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.clone().text();
        console.error("❌ Received non-JSON response:", text.substring(0, 500));
        throw new Error(
          "Server mengembalikan format yang tidak valid. Pastikan sudah login dan token valid."
        );
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("❌ Failed to parse JSON response:", jsonError);
        const text = await response.clone().text();
        console.error("❌ Response text:", text.substring(0, 500));
        throw new Error(`Server mengembalikan response yang tidak valid (${response.status})`);
      }

      if (!response.ok) {
        console.error("❌ Student detail API error:", {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        
        // Provide more specific error messages
        if (response.status === 500) {
          throw new Error(
            data?.message || 
            data?.error || 
            "Server error: Terjadi kesalahan di server. Silakan coba lagi atau hubungi administrator."
          );
        } else if (response.status === 404) {
          throw new Error(data?.message || "Siswa tidak ditemukan");
        } else if (response.status === 401) {
          // Clear invalid token
          if (typeof window !== "undefined") {
            console.warn("⚠️ 401 Unauthorized - Clearing token and redirecting to login");
            localStorage.removeItem("school_token");
            localStorage.removeItem("school_data");
            // Redirect to login after a short delay
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
          throw new Error("Sesi telah berakhir. Silakan login kembali.");
        } else {
          throw new Error(data?.message || `Gagal mengambil detail siswa (${response.status})`);
        }
      }

      console.log("✅ Student detail fetched successfully");
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error("❌ Error in getStudentDetail:", error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error("❌ Request timeout saat mengambil detail siswa");
          throw new Error("Request timeout. Server mungkin sedang sibuk. Silakan coba lagi.");
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_RESET')) {
          console.error("❌ Connection error saat mengambil detail siswa:", error.message);
          throw new Error("Koneksi terputus. Pastikan koneksi internet stabil dan coba lagi.");
        }
        if (error.message.includes('NetworkError') || error.message.includes('Network request failed')) {
          console.error("❌ Network error saat mengambil detail siswa:", error.message);
          throw new Error("Gagal terhubung ke server. Periksa koneksi internet Anda.");
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  },

  // Get Major Statistics
  async getMajorStatistics(): Promise<{
    success: boolean;
    data: MajorStatisticsResponse;
  }> {
    const token = getToken();

    // Try authenticated endpoint first
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/major-statistics`, {
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil statistik jurusan");
        }

        return data;
      } catch (error) {
        console.warn(
          "Authenticated major statistics failed, trying test endpoint:",
          error
        );
      }
    }

    // Fallback to test endpoint
    console.log("Using test major statistics endpoint");
    return fetchWithCache(
      `${API_BASE_URL}/test-major-statistics`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      "test-major-statistics",
      5 * 60 * 1000 // 5 minutes cache
    );
  },

  // Export Students Data - Fixed function
  async exportStudents(
    schoolId?: number
  ): Promise<{ success: boolean; data: unknown }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const token = getToken();
      const url = schoolId
        ? `${API_BASE_URL}/export-students?school_id=${schoolId}`
        : `${API_BASE_URL}/export-students`;

      console.log("🌐 Export API URL:", url);
      console.log("🔑 Token exists:", !!token);
      console.log("🏫 School ID:", schoolId);
      console.log(
        "🔑 Token value:",
        token ? `${token.substring(0, 10)}...` : "null"
      );
      console.log("🔑 Auth headers:", getAuthHeaders());

      const response = await fetch(url, {
        headers: getAuthHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("📡 Export response status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("❌ Non-JSON response:", textResponse);
        console.error("❌ Response status:", response.status);
        console.error(
          "❌ Response headers:",
          Object.fromEntries(response.headers.entries())
        );
        throw new Error(
          `Server mengembalikan response yang tidak valid (Status: ${response.status}). Pastikan server backend berjalan dengan benar.`
        );
      }

      const data = await response.json();
      console.log("📊 Export response data:", data);
      console.log("📊 Response success:", data.success);
      console.log("📊 Response data type:", typeof data.data);

      if (!response.ok) {
        console.error("❌ Response not OK:", response.status, data);
        throw new Error(
          data.message ||
            `Gagal mengekspor data siswa (Status: ${response.status})`
        );
      }

      if (!data.success) {
        console.error("❌ API returned success: false:", data);
        throw new Error(data.message || "API mengembalikan error");
      }

      return data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      console.error("❌ Export API error:", error);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Timeout: Server tidak merespons dalam 30 detik");
      }

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          `Server tidak dapat diakses. Pastikan server backend berjalan di ${getApiBaseUrl()}`
        );
      }

      throw error;
    }
  },

  // Get Students Without Choice
  async getStudentsWithoutChoice() {
    const response = await fetch(`${API_BASE_URL}/students-without-choice`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal mengambil siswa yang belum memilih"
      );
    }

    return data;
  },

  // Add New Student
  async addStudent(studentData: {
    name: string;
    nisn: string;
    kelas: string;
    email?: string;
    phone?: string;
    parent_phone?: string;
    password: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan siswa");
    }

    return data;
  },

  // Update Student
  async updateStudent(
    studentId: number,
    studentData: {
      name: string;
      nisn: string;
      kelas: string;
      email?: string;
      phone?: string;
      parent_phone?: string;
      password?: string;
    }
  ) {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal memperbarui data siswa");
    }

    return data;
  },

  // Delete Student
  async deleteStudent(studentId: number) {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menghapus siswa");
    }

    return data;
  },

  // Import Students
  async importStudents(formData: FormData) {
    const token = getToken();
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const response = await fetch(`${API_BASE_URL}/import-students`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengimport data siswa");
    }

    return data;
  },

  // Download Import Template
  async downloadImportTemplate() {
    const token = getToken();
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    console.log(
      "🔍 Downloading template from:",
      `${API_BASE_URL}/import-template`
    );
    console.log("🔍 Using token:", token ? "Token present" : "No token");

    const response = await fetch(`${API_BASE_URL}/import-template`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/csv, application/csv, */*",
      },
    });

    console.log("🔍 Response status:", response.status);
    console.log(
      "🔍 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Template download error:", errorText);
      throw new Error(
        `Gagal mengunduh template: ${response.status} ${response.statusText}`
      );
    }

    return response;
  },

  // Get Import Rules
  async getImportRules() {
    const response = await fetch(`${API_BASE_URL}/import-rules`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil aturan import");
    }

    return data;
  },

  // Get Classes List
  async getClasses(): Promise<{
    success: boolean;
    data: { classes: Array<{ name: string; value: string }> };
  }> {
    const token = getToken();
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const schoolData = localStorage.getItem("school_data");
    const schoolId =
      schoolData && schoolData !== "undefined" && schoolData !== "null"
        ? JSON.parse(schoolData).id
        : "unknown";

    return fetchWithCache(
      `${API_BASE_URL}/classes`,
      {
        headers: getAuthHeaders(),
      },
      cacheKeys.classes(schoolId),
      5 * 60 * 1000 // 5 minutes cache
    );
  },

  // Get ArahPotensi Schedules
  async getTkaSchedules(
    schoolId?: number
  ): Promise<{ success: boolean; data: TkaSchedule[] }> {
    try {
      const url = schoolId
        ? `${API_BASE_URL}/tka-schedules?school_id=${schoolId}`
        : `${API_BASE_URL}/tka-schedules`;

      console.log("🌐 ArahPotensi Schedules API URL:", url);

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📅 ArahPotensi Schedules response:", data);

      return data;
    } catch (error: unknown) {
      console.error("❌ ArahPotensi Schedules API error:", error);
      throw error;
    }
  },

  // Get Upcoming ArahPotensi Schedules
  async getUpcomingTkaSchedules(
    schoolId?: number
  ): Promise<{ success: boolean; data: TkaSchedule[] }> {
    try {
      const url = schoolId
        ? `${API_BASE_URL}/tka-schedules/upcoming?school_id=${schoolId}`
        : `${API_BASE_URL}/tka-schedules/upcoming`;

      console.log("🌐 Upcoming ArahPotensi Schedules API URL:", url);

      // Add timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        headers: {
          ...getAuthHeaders(), // Add auth headers (includes Content-Type)
          Accept: "application/json",
        },
        signal: controller.signal,
        credentials: "same-origin",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // If 401, clear token and redirect
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("school_token");
            localStorage.removeItem("school_data");
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📅 Upcoming ArahPotensi Schedules response:", data);

      return data;
    } catch (error: unknown) {
      // Handle connection reset and network errors gracefully
      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("ERR_CONNECTION_RESET") ||
          error.message.includes("NetworkError") ||
          error.name === "AbortError"
        ) {
          console.warn("⚠️ Network error loading TKA schedules, returning empty array");
          return { success: false, data: [] };
        }
      }
      console.error("❌ Upcoming ArahPotensi Schedules API error:", error);
      // Return empty array instead of throwing to prevent UI crashes
      return { success: false, data: [] };
    }
  },

  // Create ArahPotensi Schedule
  async createTkaSchedule(scheduleData: {
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    type: "regular" | "makeup" | "special";
    instructions?: string;
    target_schools?: number[];
  }) {
    const response = await fetch(`${API_BASE_URL}/tka-schedules`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(scheduleData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal membuat jadwal ArahPotensi");
    }

    return data;
  },

  // Update ArahPotensi Schedule
  async updateTkaSchedule(
    scheduleId: number,
    scheduleData: {
      title?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      status?: "scheduled" | "ongoing" | "completed" | "cancelled";
      type?: "regular" | "makeup" | "special";
      instructions?: string;
      target_schools?: number[];
      is_active?: boolean;
    }
  ) {
    const response = await fetch(
      `${API_BASE_URL}/tka-schedules/${scheduleId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(scheduleData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal memperbarui jadwal ArahPotensi");
    }

    return data;
  },

  // Delete ArahPotensi Schedule
  async deleteTkaSchedule(scheduleId: number) {
    const response = await fetch(
      `${API_BASE_URL}/tka-schedules/${scheduleId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menghapus jadwal ArahPotensi");
    }

    return data;
  },
};

// Student Web API Service
export const studentApiService = {
  // Student Login
  async login(nisn: string, password: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      console.log(
        "🔍 Student login attempt to:",
        `${STUDENT_API_BASE_URL}/login`
      );
      console.log("🔍 Student login data:", { nisn, password: "***" });

      const response = await fetch(`${STUDENT_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nisn, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("🔍 Student login response status:", response.status);
      console.log("🔍 Student login response ok:", response.ok);

      const data = await response.json();
      console.log("🔍 Student login response data:", data);

      if (!response.ok) {
        console.error("❌ Student login failed:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Provide more specific error messages based on status code
        if (response.status === 401) {
          throw new Error("NISN atau password salah");
        } else if (response.status === 404) {
          throw new Error("NISN tidak ditemukan");
        } else if (response.status === 422) {
          throw new Error(data.message || "Data tidak valid");
        } else if (response.status >= 500) {
          throw new Error(
            `Server error (${response.status}): ${
              data.message ||
              "Server sedang mengalami masalah. Silakan coba lagi nanti"
            }`
          );
        } else {
          throw new Error(data.message || "Login gagal");
        }
      }

      return data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      console.error("💥 Student login error:", error);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Timeout: Server tidak merespons dalam 15 detik");
        }
        if (error.message.includes("Failed to fetch")) {
          // Check if it's blocked by client (ad blocker, etc.)
          if (error.message.includes("ERR_BLOCKED_BY_CLIENT")) {
            throw new Error(
              `Request diblokir oleh browser atau extension. Silakan nonaktifkan ad blocker atau extension yang memblokir request.`
            );
          }
          // Check if it's a network connectivity issue
          if (
            error.message.includes("ERR_NETWORK_CHANGED") ||
            error.message.includes("ERR_INTERNET_DISCONNECTED")
          ) {
            throw new Error(
              `Koneksi internet terputus. Periksa koneksi internet Anda dan coba lagi.`
            );
          }
          // Check if it's a CORS issue
          if (
            error.message.includes("ERR_CERT_AUTHORITY_INVALID") ||
            error.message.includes("ERR_SSL_PROTOCOL_ERROR")
          ) {
            throw new Error(
              `Masalah keamanan koneksi. Silakan coba akses dengan HTTP atau periksa sertifikat SSL.`
            );
          }
          // Generic network error
          throw new Error(
            `Koneksi gagal: Pastikan server backend berjalan di ${STUDENT_API_BASE_URL}. Error: ${error.message}`
          );
        }
      }
      throw error;
    }
  },

  // Student Registration
  async register(studentData: {
    nisn: string;
    name: string;
    npsn_sekolah: string;
    nama_sekolah: string;
    kelas: string;
    email?: string;
    phone?: string;
    parent_phone?: string;
    password: string;
  }) {
    const response = await fetch(`${STUDENT_API_BASE_URL}/register-student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registrasi gagal");
    }

    return data;
  },

  // Get Available Schools
  async getSchools() {
    const response = await fetch(`${STUDENT_API_BASE_URL}/schools`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil daftar sekolah");
    }

    return data;
  },

  // Get All Active Majors
  async getMajors(): Promise<{ success: boolean; data: Major[] }> {
    try {
      // Force correct URL for network access
      let baseUrl = STUDENT_API_BASE_URL;
      if (
        typeof window !== "undefined" &&
        window.location.hostname === "10.112.234.213"
      ) {
        baseUrl = "http://103.23.198.101/super-admin/api/web";
        console.log("🔧 Using network URL override for getMajors:", baseUrl);
      }

      const url = `${baseUrl}/majors?t=${Date.now()}`;
      console.log("🔍 getMajors URL:", url);
      return fetchWithCache(
        url,
        {},
        cacheKeys.majors(),
        10 * 60 * 1000 // 10 minutes cache (majors don't change often)
      );
    } catch (error) {
      console.error("❌ Error in getMajors:", error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          `Server tidak dapat diakses. Pastikan server backend berjalan di ${getApiBaseUrl()}`
        );
      }

      throw error;
    }
  },

  // Get Major Details
  async getMajorDetails(
    majorId: number
  ): Promise<{ success: boolean; data: Major }> {
    return fetchWithCache(
      `${STUDENT_API_BASE_URL}/majors/${majorId}`,
      {},
      cacheKeys.majorDetails(majorId),
      10 * 60 * 1000 // 10 minutes cache
    );
  },

  // Choose Major
  async chooseMajor(studentId: number, majorId: number) {
    const response = await fetch(`${STUDENT_API_BASE_URL}/choose-major`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_id: studentId, major_id: majorId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal memilih jurusan");
    }

    return data;
  },

  // Check Student's Major Status
  async checkMajorStatus(studentId: number): Promise<{
    success: boolean;
    data: { has_choice: boolean; selected_major_id: number | undefined };
  }> {
    try {
      const url = `${STUDENT_API_BASE_URL}/major-status/${studentId}?t=${Date.now()}`;
      console.log("🔍 checkMajorStatus URL:", url);
      console.log("🔍 STUDENT_API_BASE_URL:", STUDENT_API_BASE_URL);
      console.log("🔍 studentId:", studentId);

      return fetchWithCache(
        url,
        {},
        cacheKeys.majorStatus(studentId),
        1 * 60 * 1000 // 1 minute cache (status can change frequently)
      );
    } catch (error) {
      console.error("❌ Error in checkMajorStatus:", error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          `Server tidak dapat diakses. Pastikan server backend berjalan di ${getApiBaseUrl()}`
        );
      }

      throw error;
    }
  },

  // Get Student's Chosen Major
  async getStudentChoice(
    studentId: number
  ): Promise<{ success: boolean; data: StudentChoice }> {
    try {
      // Force correct URL for network access
      let baseUrl = STUDENT_API_BASE_URL;
      if (
        typeof window !== "undefined" &&
        window.location.hostname === "10.112.234.213"
      ) {
        baseUrl = "http://103.23.198.101/super-admin/api/web";
        console.log("🔧 Using network URL override:", baseUrl);
      }

      const url = `${baseUrl}/student-choice/${studentId}`;
      console.log("🔍 getStudentChoice URL:", url);
      console.log("🔍 STUDENT_API_BASE_URL:", STUDENT_API_BASE_URL);
      console.log("🔍 studentId:", studentId);

      return fetchWithCache(
        url,
        {},
        cacheKeys.studentChoice(studentId),
        2 * 60 * 1000 // 2 minutes cache
      );
    } catch (error) {
      console.error("❌ Error in getStudentChoice:", error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          `Server tidak dapat diakses. Pastikan server backend berjalan di ${getApiBaseUrl()}`
        );
      }

      throw error;
    }
  },

  // Change Major Choice
  async changeMajor(studentId: number, majorId: number) {
    const response = await fetch(`${STUDENT_API_BASE_URL}/change-major`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_id: studentId, major_id: majorId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengubah pilihan jurusan");
    }

    return data;
  },

  // Get Student Profile
  async getStudentProfile(
    studentId: number
  ): Promise<{ success: boolean; data: StudentData }> {
    const response = await fetch(
      `${STUDENT_API_BASE_URL}/student-profile/${studentId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil profile siswa");
    }

    return data;
  },

  async getTkaSchedules(
    schoolId?: number
  ): Promise<{ success: boolean; data: TkaSchedule[] }> {
    try {
      const url = schoolId
        ? `${STUDENT_API_BASE_URL}/tka-schedules?school_id=${schoolId}`
        : `${STUDENT_API_BASE_URL}/tka-schedules`;

      console.log("🌐 Student ArahPotensi Schedules API URL:", url);
      console.log("🌐 STUDENT_API_BASE_URL:", STUDENT_API_BASE_URL);
      console.log("🌐 Full URL being called:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      console.log("🌐 Response status:", response.status);
      console.log(
        "🌐 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        console.error(
          `❌ ArahPotensi Schedules API error: ${response.status} ${response.statusText}`
        );
        const errorText = await response.text();
        console.error("❌ Error response body:", errorText);
        return { success: false, data: [] };
      }

      const data = await response.json();
      console.log("✅ ArahPotensi Schedules loaded:", data);

      return data;
    } catch (error: unknown) {
      console.error("❌ ArahPotensi Schedules API error:", error);
      console.error(
        "❌ Error details:",
        error instanceof Error ? error.message : String(error)
      );
      // Return empty data instead of throwing error to prevent UI crashes
      return { success: false, data: [] };
    }
  },

  async getUpcomingTkaSchedules(
    schoolId?: number
  ): Promise<{ success: boolean; data: TkaSchedule[] }> {
    try {
      const url = schoolId
        ? `${STUDENT_API_BASE_URL}/tka-schedules/upcoming?school_id=${schoolId}`
        : `${STUDENT_API_BASE_URL}/tka-schedules/upcoming`;

      console.log("🌐 Student Upcoming ArahPotensi Schedules API URL:", url);
      console.log("🌐 STUDENT_API_BASE_URL:", STUDENT_API_BASE_URL);
      console.log("🌐 Full URL being called:", url);

      // Add timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("🌐 Response status:", response.status);
      console.log(
        "🌐 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        console.error(
          `❌ Upcoming ArahPotensi Schedules API error: ${response.status} ${response.statusText}`
        );
        const errorText = await response.text();
        console.error("❌ Error response body:", errorText);
        return { success: false, data: [] };
      }

      const data = await response.json();
      console.log("✅ Upcoming ArahPotensi Schedules loaded:", data);

      return data;
    } catch (error: unknown) {
      // Handle connection reset and network errors gracefully
      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("ERR_CONNECTION_RESET") ||
          error.message.includes("NetworkError") ||
          error.name === "AbortError"
        ) {
          console.warn("⚠️ Network error loading TKA schedules (connection reset), returning empty array");
          return { success: false, data: [] };
        }
      }
      console.error("❌ Upcoming ArahPotensi Schedules API error:", error);
      console.error(
        "❌ Error details:",
        error instanceof Error ? error.message : String(error)
      );
      // Return empty data instead of throwing error to prevent UI crashes
      return { success: false, data: [] };
    }
  },

  // Get Student Subjects based on major choice
  async getStudentSubjects(studentId: number) {
    try {
      const response = await fetch(
        `${STUDENT_API_BASE_URL}/student-subjects/${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil mata pelajaran siswa");
      }

      return data;
    } catch (error) {
      console.error("Error getting student subjects:", error);
      throw error;
    }
  },

  // Get Subjects for Major (preview)
  async getSubjectsForMajor(majorId: number, educationLevel: string) {
    try {
      const response = await fetch(
        `${STUDENT_API_BASE_URL}/subjects-for-major?major_id=${majorId}&education_level=${educationLevel}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil mata pelajaran untuk jurusan"
        );
      }

      return data;
    } catch (error) {
      console.error("Error getting subjects for major:", error);
      throw error;
    }
  },
};

// SuperAdmin API Service for ArahPotensi integration
export const superAdminApiService = {
  // Get Schools from SuperAdmin
  async getSchools(): Promise<{ success: boolean; data: School[] }> {
    try {
      const url = `${SUPERADMIN_API_BASE_URL}/public/schools`;
      console.log("🌐 SuperAdmin API URL:", url);

      return fetchWithCache(
        url,
        {},
        "superadmin_schools",
        5 * 60 * 1000 // 5 minutes cache
      );
    } catch (error) {
      console.error("❌ Error in getSchools:", error);
      throw error;
    }
  },

  // Get Questions from SuperAdmin
  async getQuestions(): Promise<{ success: boolean; data: unknown[] }> {
    try {
      const url = `${SUPERADMIN_API_BASE_URL}/public/questions`;
      console.log("🌐 SuperAdmin Questions API URL:", url);

      return fetchWithCache(
        url,
        {},
        "superadmin_questions",
        10 * 60 * 1000 // 10 minutes cache
      );
    } catch (error) {
      console.error("❌ Error in getQuestions:", error);
      throw error;
    }
  },

  // Get Majors from SuperAdmin
  async getMajors(): Promise<{ success: boolean; data: Major[] }> {
    try {
      const url = `${SUPERADMIN_API_BASE_URL}/public/majors`;
      console.log("🌐 SuperAdmin Majors API URL:", url);

      return fetchWithCache(
        url,
        {},
        "superadmin_majors",
        10 * 60 * 1000 // 10 minutes cache
      );
    } catch (error) {
      console.error("❌ Error in getMajors:", error);
      throw error;
    }
  },

  // Health Check
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const url = `${SUPERADMIN_API_BASE_URL}/public/health`;
      console.log("🌐 SuperAdmin Health Check URL:", url);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error("❌ Error in healthCheck:", error);
      throw error;
    }
  },

  // Get TKA Schedules from SuperAdmin
  async getTkaSchedules(): Promise<{ success: boolean; data: TkaSchedule[] }> {
    try {
      const url = `${SUPERADMIN_API_BASE_URL}/admin/tka-schedules`;
      console.log("🌐 SuperAdmin TKA Schedules API URL:", url);

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memuat jadwal TKA");
      }

      return data;
    } catch (error) {
      console.error("❌ Error in getTkaSchedules:", error);
      throw error;
    }
  },

  // Get Upcoming TKA Schedules from SuperAdmin
  async getUpcomingTkaSchedules(): Promise<{
    success: boolean;
    data: TkaSchedule[];
  }> {
    try {
      const url = `${SUPERADMIN_API_BASE_URL}/admin/tka-schedules/upcoming`;
      console.log("🌐 SuperAdmin Upcoming TKA Schedules API URL:", url);

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal memuat jadwal TKA yang akan datang"
        );
      }

      return data;
    } catch (error) {
      console.error("❌ Error in getUpcomingTkaSchedules:", error);
      throw error;
    }
  },
};

// School Level API Service
export const schoolLevelApiService = {
  // Get major recommendations by school level
  async getMajorsBySchoolLevel(
    schoolLevel: "SMA/MA" | "SMK/MAK" = "SMA/MA"
  ): Promise<{
    success: boolean;
    data: Major[];
    school_level: string;
    total_subjects: number;
  }> {
    try {
      return fetchWithCache(
        `${SCHOOL_LEVEL_API_BASE_URL}/majors?school_level=${schoolLevel}`,
        {},
        `majors_${schoolLevel}`,
        5 * 60 * 1000 // 5 minutes cache
      );
    } catch (error) {
      console.error("❌ Error in getMajorsBySchoolLevel:", error);
      throw error;
    }
  },

  // Get subjects by school level
  async getSubjectsBySchoolLevel(
    schoolLevel: "SMA/MA" | "SMK/MAK" = "SMA/MA"
  ): Promise<{
    success: boolean;
    data: {
      id: number;
      subject_name: string;
      type: string;
      description?: string;
      subject_number?: string;
    }[];
    school_level: string;
    total: number;
  }> {
    try {
      return fetchWithCache(
        `${SCHOOL_LEVEL_API_BASE_URL}/subjects?school_level=${schoolLevel}`,
        {},
        `subjects_${schoolLevel}`,
        5 * 60 * 1000 // 5 minutes cache
      );
    } catch (error) {
      console.error("❌ Error in getSubjectsBySchoolLevel:", error);
      throw error;
    }
  },

  // Get school level statistics
  async getSchoolLevelStats(): Promise<{
    success: boolean;
    data: {
      sma_ma?: {
        majors_count?: number;
        subjects_count?: number;
        required_subjects?: number;
        optional_subjects?: number;
      };
      smk_mak?: {
        majors_count?: number;
        subjects_count?: number;
        pilihan_subjects?: number;
        produk_kreatif_subjects?: number;
      };
    };
  }> {
    try {
      return fetchWithCache(
        `${SCHOOL_LEVEL_API_BASE_URL}/stats`,
        {},
        "school_level_stats",
        10 * 60 * 1000 // 10 minutes cache
      );
    } catch (error) {
      console.error("❌ Error in getSchoolLevelStats:", error);
      throw error;
    }
  },

  async getUpcomingTkaSchedules(
    schoolId?: number
  ): Promise<{ success: boolean; data: TkaSchedule[] }> {
    try {
      const url = schoolId
        ? `${STUDENT_API_BASE_URL}/tka-schedules/upcoming?school_id=${schoolId}`
        : `${STUDENT_API_BASE_URL}/tka-schedules/upcoming`;

      console.log(
        "🌐 School Level Upcoming ArahPotensi Schedules API URL:",
        url
      );

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📅 Upcoming ArahPotensi Schedules response:", data);

      return data;
    } catch (error: unknown) {
      console.error("❌ Upcoming ArahPotensi Schedules API error:", error);
      throw error;
    }
  },
};
