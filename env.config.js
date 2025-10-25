// Environment Configuration for Campusway Frontend
const config = {
  development: {
<<<<<<< HEAD
    API_BASE_URL: "http://103.23.198.101/super-admin/api/school",
    STUDENT_API_BASE_URL: "http://103.23.198.101/super-admin/api/web",
    SUPERADMIN_API_URL: "http://103.23.198.101/super-admin/api",
    BACKEND_URL: "http://103.23.198.101/super-admin",
    CORS_ORIGIN: "http://10.112.234.213:3000",
=======
    API_BASE_URL: 'http://127.0.0.1:8001/api/school',
    STUDENT_API_BASE_URL: 'http://127.0.0.1:8001/api/web',
    SUPERADMIN_API_URL: 'http://127.0.0.1:8001/api',
    BACKEND_URL: 'http://127.0.0.1:8001',
    CORS_ORIGIN: 'http://localhost:3000'
>>>>>>> 0900f3aa092b7358bff80f131b32a86b306ca50f
  },
  production: {
    API_BASE_URL: "http://103.23.198.101/super-admin/api/school",
    STUDENT_API_BASE_URL: "http://103.23.198.101/super-admin/api/web",
    SUPERADMIN_API_URL: "http://103.23.198.101/super-admin/api",
    BACKEND_URL: "http://103.23.198.101/super-admin",
    CORS_ORIGIN: "http://103.23.198.101",
  },
};

const env = process.env.NODE_ENV || "development";
module.exports = config[env];
