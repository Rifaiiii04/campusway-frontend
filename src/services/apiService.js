// Enhanced API Service for Campusway Frontend
import { API_CONFIG, buildApiUrl, checkApiHealth } from '../config/api.config';

class ApiService {
  constructor() {
    this.baseConfig = API_CONFIG;
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  // Generic request method with retry logic
  async request(endpoint, options = {}) {
    const config = {
      method: 'GET',
      headers: { ...this.baseConfig.DEFAULT_HEADERS },
      ...this.baseConfig.CORS,
      ...options,
    };

    // Merge headers
    if (options.headers) {
      config.headers = { ...config.headers, ...options.headers };
    }

    const url = buildApiUrl(endpoint);
    
    // Add request to queue for rate limiting
    return this.addToQueue(() => this.makeRequest(url, config));
  }

  // Make actual HTTP request with timeout and error handling
  async makeRequest(url, config, retryCount = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.baseConfig.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response types
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }

    } catch (error) {
      clearTimeout(timeoutId);

      // Retry logic for specific errors
      if (this.shouldRetry(error, retryCount)) {
        console.warn(`🔄 Retrying request (${retryCount + 1}/${this.baseConfig.RETRY_ATTEMPTS}):`, url);
        await this.delay(this.baseConfig.RETRY_DELAY * (retryCount + 1));
        return this.makeRequest(url, config, retryCount + 1);
      }

      throw this.handleError(error, url);
    }
  }

  // Check if request should be retried
  shouldRetry(error, retryCount) {
    if (retryCount >= this.baseConfig.RETRY_ATTEMPTS) {
      return false;
    }

    const retryableErrors = [
      'Failed to fetch',
      'NetworkError',
      'TypeError',
      'ERR_BLOCKED_BY_CLIENT',
      'err_blocked_by_client',
      'timeout',
      'TimeoutError',
    ];

    return retryableErrors.some(errorType => 
      error.message.toLowerCase().includes(errorType.toLowerCase())
    );
  }

  // Handle different types of errors
  handleError(error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('err_blocked_by_client')) {
      return new Error('Request diblokir oleh browser atau extension. Silakan nonaktifkan ad blocker.');
    }

    if (errorMessage.includes('failed to fetch')) {
      return new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }

    if (errorMessage.includes('timeout')) {
      return new Error('Server tidak merespons dalam waktu yang ditentukan.');
    }

    if (errorMessage.includes('cors')) {
      return new Error('Masalah CORS: Server tidak mengizinkan request dari domain ini.');
    }

    return error;
  }

  // Add request to queue for rate limiting
  async addToQueue(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  // Process request queue
  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const { requestFn, resolve, reject } = this.requestQueue.shift();
      
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Small delay between requests
      await this.delay(100);
    }

    this.isProcessingQueue = false;
  }

  // Utility method for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Specific API methods
  async schoolLogin(npsn, password) {
    return this.request(this.baseConfig.ENDPOINTS.SCHOOL_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ npsn, password }),
    });
  }

  async studentLogin(nisn, password) {
    return this.request(this.baseConfig.ENDPOINTS.STUDENT_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ nisn, password }),
    });
  }

  async getSchools() {
    return this.request(this.baseConfig.ENDPOINTS.SCHOOLS);
  }

  async getMajors() {
    return this.request(this.baseConfig.ENDPOINTS.MAJORS);
  }

  async getQuestions() {
    return this.request(this.baseConfig.ENDPOINTS.QUESTIONS);
  }

  async getTkaSchedules() {
    return this.request(this.baseConfig.ENDPOINTS.TKA_SCHEDULES);
  }

  async healthCheck() {
    return checkApiHealth();
  }

  // Test connection to backend
  async testConnection() {
    try {
      const health = await this.healthCheck();
      console.log('🏥 API Health Check:', health);
      return health;
    } catch (error) {
      console.error('❌ API Connection Test Failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

