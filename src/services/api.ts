const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/school";

const STUDENT_API_BASE_URL = "http://127.0.0.1:8000/api/web";

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
  email?: string;
  phone?: string;
  parent_phone?: string;
  password?: string;
  has_choice: boolean;
  chosen_major?: {
    id: number;
    name: string;
    description?: string;
    career_prospects?: string;
    category?: string;
    choice_date?: string;
    required_subjects?: string;
    preferred_subjects?: string;
    kurikulum_merdeka_subjects?: string;
    kurikulum_2013_ipa_subjects?: string;
    kurikulum_2013_ips_subjects?: string;
    kurikulum_2013_bahasa_subjects?: string;
  };
  choice_date?: string;
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
}

export interface Major {
  id: number;
  major_name: string;
  description?: string;
  career_prospects?: string;
  category?: string;
  subjects?: {
    required?: string[];
    preferred?: string[];
    kurikulum_merdeka?: string[];
    kurikulum_2013_ipa?: string[];
    kurikulum_2013_ips?: string[];
    kurikulum_2013_bahasa?: string[];
  };
}

export interface StudentChoice {
  id: number;
  major: Major;
  chosen_at: string;
}

// Helper function untuk mendapatkan token
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("school_token");
  }
  return null;
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
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
  };
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
  async login(npsn: string, password: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ npsn, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      return data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Timeout: Server tidak merespons dalam 8 detik");
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
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil data dashboard");
    }

    return data;
  },

  // Get All Students
  async getStudents(): Promise<{ success: boolean; data: StudentsResponse }> {
    const response = await fetch(`${API_BASE_URL}/students`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil data siswa");
    }

    return data;
  },

  // Get Student Detail
  async getStudentDetail(studentId: number) {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil detail siswa");
    }

    return data;
  },

  // Get Major Statistics
  async getMajorStatistics(): Promise<{
    success: boolean;
    data: MajorStatisticsResponse;
  }> {
    const response = await fetch(`${API_BASE_URL}/major-statistics`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil statistik jurusan");
    }

    return data;
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
  async updateStudent(studentId: number, studentData: {
    name: string;
    nisn: string;
    kelas: string;
    email?: string;
    phone?: string;
    parent_phone?: string;
    password?: string;
  }) {
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
};

// Student Web API Service
export const studentApiService = {
  // Student Login
  async login(nisn: string, password: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const response = await fetch(`${STUDENT_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nisn, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      return data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Timeout: Server tidak merespons dalam 8 detik");
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
      const response = await fetch(`${STUDENT_API_BASE_URL}/majors`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Gagal mengambil daftar jurusan");
      }

      return data;
    } catch (error) {
      console.error("❌ Error in getMajors:", error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Server tidak dapat diakses. Pastikan server backend berjalan di http://127.0.0.1:8000"
        );
      }

      throw error;
    }
  },

  // Get Major Details
  async getMajorDetails(
    majorId: number
  ): Promise<{ success: boolean; data: Major }> {
    const response = await fetch(`${STUDENT_API_BASE_URL}/majors/${majorId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil detail jurusan");
    }

    return data;
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
  async checkMajorStatus(
    studentId: number
  ): Promise<{
    success: boolean;
    data: { has_choice: boolean; selected_major_id: number | null };
  }> {
    try {
      const response = await fetch(
        `${STUDENT_API_BASE_URL}/major-status/${studentId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Gagal mengecek status pilihan jurusan"
        );
      }

      return data;
    } catch (error) {
      console.error("❌ Error in checkMajorStatus:", error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Server tidak dapat diakses. Pastikan server backend berjalan di http://127.0.0.1:8000"
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
      const response = await fetch(
        `${STUDENT_API_BASE_URL}/student-choice/${studentId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Gagal mengambil pilihan jurusan");
      }

      return data;
    } catch (error) {
      console.error("❌ Error in getStudentChoice:", error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Server tidak dapat diakses. Pastikan server backend berjalan di http://127.0.0.1:8000"
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
};
