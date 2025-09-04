# 🔧 Export Data Troubleshooting Guide

## 📋 **Problem**

Fungsi export data di dashboard teacher tidak berfungsi dan tidak mengexport data.

## 🔍 **Root Cause Analysis**

### **1. Authentication Issues**

- **Problem**: Token tidak dikirim dengan format yang benar
- **Solution**: Fixed `getAuthHeaders()` to use `Bearer ${token}` format consistently

### **2. API Endpoint Issues**

- **Problem**: Endpoint `/api/school/export-students` memerlukan authentication yang valid
- **Solution**: Ensure proper token format and middleware compatibility

### **3. Frontend Error Handling**

- **Problem**: Error messages tidak cukup detail untuk debugging
- **Solution**: Added comprehensive logging and error handling

## 🔧 **Fixes Applied**

### **1. Fixed Authentication Headers**

**Before:**

```typescript
const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }), // ❌ Missing Bearer prefix
  };
};
```

**After:**

```typescript
const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // ✅ Fixed Bearer prefix
  };
};
```

### **2. Removed Duplicate Authorization Headers**

**Before:**

```typescript
headers: {
  ...getAuthHeaders(),
  Authorization: `Bearer ${token}`, // ❌ Duplicate authorization
},
```

**After:**

```typescript
headers: getAuthHeaders(), // ✅ Single authorization header
```

### **3. Enhanced Logging**

**Added detailed logging:**

```typescript
console.log("🔑 Token exists:", !!token);
console.log("🔑 Token value:", token ? `${token.substring(0, 10)}...` : "null");
console.log("🏫 School data exists:", !!schoolData);
console.log("🏫 School data:", schoolData);
```

## 🧪 **Testing Steps**

### **1. Check Authentication**

```javascript
// In browser console
console.log("Token:", localStorage.getItem("school_token"));
console.log("School Data:", localStorage.getItem("school_data"));
```

### **2. Test API Endpoint**

```bash
# Test with valid token
curl -X GET "http://127.0.0.1:8000/api/school/export-students" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### **3. Check Backend Logs**

```bash
# Check Laravel logs
tail -f storage/logs/laravel.log
```

## 🔍 **Debug Information**

### **Frontend Logs to Check:**

1. **Token Validation:**

   ```
   🔑 Token exists: true/false
   🔑 Token value: abc1234567...
   ```

2. **API Call:**

   ```
   🌐 Export API URL: http://127.0.0.1:8000/api/school/export-students
   🔑 Auth headers: {Content-Type: "application/json", Authorization: "Bearer ..."}
   ```

3. **Response:**
   ```
   📡 Export response status: 200/401/500
   ✅ API response received: {success: true/false, data: ...}
   ```

### **Backend Logs to Check:**

1. **Authentication:**

   ```
   School auth middleware error: ...
   ```

2. **Export Process:**
   ```
   Export students error: ...
   ```

## 🚨 **Common Issues & Solutions**

### **Issue 1: 401 Unauthorized**

**Symptoms:**

- Export button doesn't work
- Console shows 401 error
- No data exported

**Solutions:**

1. Check if token exists in localStorage
2. Verify token format (should include Bearer prefix)
3. Check if token is expired (24 hours)
4. Re-login if necessary

### **Issue 2: 500 Server Error**

**Symptoms:**

- Export button shows loading but fails
- Console shows 500 error
- Backend logs show error

**Solutions:**

1. Check Laravel logs for specific error
2. Verify database connection
3. Check if school data exists
4. Verify student data structure

### **Issue 3: Empty Export Data**

**Symptoms:**

- Export succeeds but file is empty
- No students in exported data

**Solutions:**

1. Check if students exist in database
2. Verify school_id in request
3. Check student-school relationship
4. Verify student choice data

### **Issue 4: CORS Issues**

**Symptoms:**

- Network error in console
- CORS error messages

**Solutions:**

1. Check CORS configuration in Laravel
2. Verify API_BASE_URL in frontend
3. Check if backend server is running

## 🔧 **Manual Testing**

### **1. Test Login Flow**

```javascript
// Test login
const loginResponse = await fetch("http://127.0.0.1:8000/api/school/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    npsn: "12345678",
    password: "password123",
  }),
});
const loginData = await loginResponse.json();
console.log("Login result:", loginData);
```

### **2. Test Export with Token**

```javascript
// Test export
const token = localStorage.getItem("school_token");
const exportResponse = await fetch(
  "http://127.0.0.1:8000/api/school/export-students",
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);
const exportData = await exportResponse.json();
console.log("Export result:", exportData);
```

## 📊 **Expected Behavior**

### **Successful Export:**

1. **Button Click:** Export button shows loading state
2. **API Call:** Request sent to `/api/school/export-students`
3. **Authentication:** Token validated successfully
4. **Data Retrieval:** Students data fetched from database
5. **CSV Generation:** Data converted to CSV format
6. **File Download:** CSV file downloaded automatically
7. **Success Message:** Alert shows "Data berhasil diekspor! Total X siswa."

### **Failed Export:**

1. **Error Detection:** Error caught in try-catch
2. **Fallback:** Attempts to export with existing data
3. **Error Message:** User sees specific error message
4. **Console Logs:** Detailed error information logged

## 🔮 **Future Improvements**

### **1. Better Error Handling**

- More specific error messages
- Retry mechanism for failed requests
- User-friendly error dialogs

### **2. Progress Indicators**

- Real-time progress for large exports
- Cancel functionality
- Estimated time remaining

### **3. Export Options**

- Different file formats (Excel, PDF)
- Custom date ranges
- Filtered exports

### **4. Performance Optimization**

- Pagination for large datasets
- Background processing
- Caching for repeated exports

---

**Export functionality should now work correctly with proper authentication and error handling!** ✅
