// Types for school data
export interface School {
  id: number;
  npsn: string;
  name: string;
  school_level: string;
}

export interface SchoolsApiResponse {
  success: boolean;
  data: School[];
}

/**
 * Fetches schools data from the public API endpoint
 * @returns Promise<School[]> - Array of school objects
 * @throws Error if the API request fails or returns unsuccessful response
 */
export async function fetchSchools(): Promise<School[]> {
  try {
    const response = await fetch("http://103.23.198.101:8080/api/web/schools", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache control for better performance
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SchoolsApiResponse = await response.json();

    if (!result.success) {
      throw new Error("API returned unsuccessful response");
    }

    return result.data;
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Failed to fetch schools: ${error.message}`);
    }
    throw new Error("Failed to fetch schools: Unknown error occurred");
  }
}
