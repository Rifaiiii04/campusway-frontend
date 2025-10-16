// Environment Configuration for Campusway Frontend
const config = {
  development: {
    API_BASE_URL: 'http://103.23.198.101/super-admin/api/school',
    STUDENT_API_BASE_URL: 'http://103.23.198.101/super-admin/api/web',
    SUPERADMIN_API_URL: 'http://103.23.198.101/super-admin/api',
    BACKEND_URL: 'http://103.23.198.101/super-admin',
    CORS_ORIGIN: 'http://localhost:3000'
  },
  production: {
    API_BASE_URL: 'http://103.23.198.101/super-admin/api/school',
    STUDENT_API_BASE_URL: 'http://103.23.198.101/super-admin/api/web',
    SUPERADMIN_API_URL: 'http://103.23.198.101/super-admin/api',
    BACKEND_URL: 'http://103.23.198.101/super-admin',
    CORS_ORIGIN: 'http://103.23.198.101'
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];

