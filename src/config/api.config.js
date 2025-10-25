// API Configuration for Campusway Frontend
const API_CONFIG = {
  // Base URLs
  BASE_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://103.23.198.101/super-admin",
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://103.23.198.101/super-admin/api/school",
  STUDENT_API_BASE_URL:
    process.env.NEXT_PUBLIC_STUDENT_API_BASE_URL ||
    "http://103.23.198.101/super-admin/api/web",
  SUPERADMIN_API_URL:
    process.env.NEXT_PUBLIC_SUPERADMIN_API_URL ||
    "http://103.23.198.101/super-admin/api",

  // Timeout settings
  TIMEOUT: 15000, // 15 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },

  // CORS settings
  CORS: {
    credentials: "include",
    mode: "cors",
  },

  // Endpoints
  ENDPOINTS: {
    // School authentication
    SCHOOL_LOGIN: "/api/school/login",
    SCHOOL_LOGOUT: "/api/school/logout",
    SCHOOL_PROFILE: "/api/school/profile",
    SCHOOL_DASHBOARD: "/api/school/dashboard",

    // Student authentication
    STUDENT_LOGIN: "/api/web/login",
    STUDENT_REGISTER: "/api/web/register-student",
    STUDENT_PROFILE: "/api/web/student-profile",

    // Data endpoints
    SCHOOLS: "/api/web/schools",
    MAJORS: "/api/web/majors",
    QUESTIONS: "/api/web/questions",
    TKA_SCHEDULES: "/api/web/tka-schedules",

    // Health check
    HEALTH: "/api/web/health",
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get API configuration
export const getApiConfig = () => {
  return API_CONFIG;
};

// Helper function to check if URL is accessible
export const checkApiHealth = async () => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.HEALTH), {
      method: "GET",
      headers: API_CONFIG.DEFAULT_HEADERS,
      ...API_CONFIG.CORS,
    });

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: buildApiUrl(API_CONFIG.ENDPOINTS.HEALTH),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url: buildApiUrl(API_CONFIG.ENDPOINTS.HEALTH),
    };
  }
};

export default API_CONFIG;
