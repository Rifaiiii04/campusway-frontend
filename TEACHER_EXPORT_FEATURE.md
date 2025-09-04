# 📊 **Fitur Export Data Siswa - Dashboard Guru**

## 🎯 **Overview**

Fitur export data siswa memungkinkan guru untuk mengekspor data lengkap siswa beserta pilihan jurusan dan mata pelajaran yang perlu dipelajari ke dalam format CSV.

## 🚀 **Fitur yang Tersedia**

### **Data yang Diekspor:**

- ✅ **Informasi Siswa**: Nama, NISN, Kelas, Email, No Handphone, No Orang Tua
- ✅ **Status Pilihan Jurusan**: Sudah Memilih / Belum Memilih
- ✅ **Tanggal Memilih**: Kapan siswa memilih jurusan
- ✅ **Detail Jurusan**: Nama jurusan, kategori, prospek karir
- ✅ **Mata Pelajaran Lengkap**:
  - Mata pelajaran wajib
  - Mata pelajaran diutamakan
  - Mata pelajaran kurikulum merdeka
  - Mata pelajaran kurikulum 2013 IPA
  - Mata pelajaran kurikulum 2013 IPS
  - Mata pelajaran kurikulum 2013 Bahasa

### **Format Export:**

- 📄 **CSV (Comma Separated Values)** - Kompatibel dengan Excel, Google Sheets
- 📅 **Nama File**: `Data_Siswa_{NamaSekolah}_{Tanggal}.csv`
- 🏫 **Header**: Informasi sekolah dan tanggal export

## 🔧 **Cara Menggunakan**

### **1. Akses Dashboard Guru**

```
1. Login sebagai guru/sekolah
2. Masuk ke dashboard guru
3. Klik tombol "Export Data" di header
```

### **2. Proses Export**

```
1. Sistem akan mengambil data dari database
2. Data dikonversi ke format CSV
3. File otomatis terdownload
4. Notifikasi sukses ditampilkan
```

## 📋 **Struktur Data Export**

### **Header File CSV:**

```csv
Data Siswa - {Nama Sekolah}
NPSN: {NPSN Sekolah}
Tanggal Export: {Tanggal dan Waktu}
```

### **Kolom Data:**

| No  | Kolom                                | Deskripsi                                  |
| --- | ------------------------------------ | ------------------------------------------ |
| 1   | Nama Siswa                           | Nama lengkap siswa                         |
| 2   | NISN                                 | Nomor Induk Siswa Nasional                 |
| 3   | Kelas                                | Kelas siswa                                |
| 4   | Email                                | Email siswa                                |
| 5   | No Handphone                         | Nomor handphone siswa                      |
| 6   | No Orang Tua                         | Nomor handphone orang tua                  |
| 7   | Status Pilihan Jurusan               | Sudah Memilih / Belum Memilih              |
| 8   | Tanggal Memilih                      | Tanggal siswa memilih jurusan              |
| 9   | Nama Jurusan                         | Nama jurusan yang dipilih                  |
| 10  | Kategori Jurusan                     | Saintek / Soshum                           |
| 11  | Prospek Karir                        | Prospek karir jurusan                      |
| 12  | Mata Pelajaran Wajib                 | Mata pelajaran yang wajib dipelajari       |
| 13  | Mata Pelajaran Diutamakan            | Mata pelajaran yang diutamakan             |
| 14  | Mata Pelajaran Kurikulum Merdeka     | Mata pelajaran untuk kurikulum merdeka     |
| 15  | Mata Pelajaran Kurikulum 2013 IPA    | Mata pelajaran untuk kurikulum 2013 IPA    |
| 16  | Mata Pelajaran Kurikulum 2013 IPS    | Mata pelajaran untuk kurikulum 2013 IPS    |
| 17  | Mata Pelajaran Kurikulum 2013 Bahasa | Mata pelajaran untuk kurikulum 2013 Bahasa |

## 🔗 **API Endpoints**

### **Backend Endpoint:**

```
GET /api/school/export-students
```

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "school": {
      "id": 1,
      "npsn": "12345678",
      "name": "SMA Negeri 1 Jakarta"
    },
    "export_data": [
      {
        "nama_siswa": "Ahmad Fadillah",
        "nisn": "1234567890",
        "kelas": "XII IPA 1",
        "email": "ahmad@email.com",
        "no_handphone": "081234567890",
        "no_orang_tua": "081234567891",
        "status_pilihan_jurusan": "Sudah Memilih",
        "tanggal_memilih": "01/01/2025 10:00",
        "nama_jurusan": "Teknik Informatika",
        "kategori_jurusan": "Saintek",
        "prospek_karir": "Software Engineer, Data Scientist",
        "mata_pelajaran_wajib": "Matematika, Bahasa Inggris, Bahasa Indonesia",
        "mata_pelajaran_diutamakan": "Matematika Tingkat Lanjut, Fisika, Kimia",
        "mata_pelajaran_kurikulum_merdeka": "Matematika Tingkat Lanjut, Fisika, Kimia",
        "mata_pelajaran_kurikulum_2013_ipa": "Matematika, Fisika, Kimia",
        "mata_pelajaran_kurikulum_2013_ips": "Matematika, Ekonomi, Sejarah",
        "mata_pelajaran_kurikulum_2013_bahasa": "Matematika, Bahasa Indonesia, Bahasa Inggris"
      }
    ],
    "total_students": 1,
    "students_with_choice": 1,
    "students_without_choice": 0,
    "export_date": "01/01/2025 10:00:00"
  }
}
```

## 🛠 **Implementasi Teknis**

### **Backend (Laravel):**

- **Controller**: `SchoolDashboardController@exportStudents`
- **Route**: `GET /api/school/export-students`
- **Middleware**: `school.auth`
- **Database**: Query dengan eager loading untuk performa optimal

### **Frontend (Next.js):**

- **Service**: `apiService.exportStudents()`
- **Component**: `TeacherDashboard`
- **Format**: CSV dengan encoding UTF-8
- **Download**: Automatic download menggunakan Blob API

## 📊 **Contoh Output CSV**

```csv
Data Siswa - SMA Negeri 1 Jakarta
NPSN: 12345678
Tanggal Export: 01/01/2025 10:00:00

"Nama Siswa","NISN","Kelas","Email","No Handphone","No Orang Tua","Status Pilihan Jurusan","Tanggal Memilih","Nama Jurusan","Kategori Jurusan","Prospek Karir","Mata Pelajaran Wajib","Mata Pelajaran Diutamakan","Mata Pelajaran Kurikulum Merdeka","Mata Pelajaran Kurikulum 2013 IPA","Mata Pelajaran Kurikulum 2013 IPS","Mata Pelajaran Kurikulum 2013 Bahasa"
"Ahmad Fadillah","1234567890","XII IPA 1","ahmad@email.com","081234567890","081234567891","Sudah Memilih","01/01/2025 10:00","Teknik Informatika","Saintek","Software Engineer, Data Scientist","Matematika, Bahasa Inggris, Bahasa Indonesia","Matematika Tingkat Lanjut, Fisika, Kimia","Matematika Tingkat Lanjut, Fisika, Kimia","Matematika, Fisika, Kimia","Matematika, Ekonomi, Sejarah","Matematika, Bahasa Indonesia, Bahasa Inggris"
```

## ✅ **Keunggulan Fitur**

### **1. Data Lengkap:**

- Semua informasi siswa dan jurusan
- Detail mata pelajaran untuk berbagai kurikulum
- Status dan tanggal pilihan jurusan

### **2. Format Kompatibel:**

- CSV format yang universal
- Bisa dibuka di Excel, Google Sheets, LibreOffice
- Encoding UTF-8 untuk karakter Indonesia

### **3. User Friendly:**

- One-click export
- Automatic download
- Progress indicator
- Error handling

### **4. Performa Optimal:**

- Eager loading di database
- Caching untuk data yang sering diakses
- Efficient CSV generation

## 🔒 **Keamanan**

- ✅ **Authentication Required**: Hanya guru yang login bisa export
- ✅ **School Isolation**: Data hanya sekolah yang bersangkutan
- ✅ **Token Validation**: Validasi token di setiap request
- ✅ **Error Handling**: Tidak expose sensitive information

## 🎉 **Hasil Akhir**

Guru sekarang bisa dengan mudah mengekspor data lengkap siswa beserta pilihan jurusan dan mata pelajaran yang perlu dipelajari dalam format CSV yang kompatibel dengan berbagai aplikasi spreadsheet.

**Fitur export sudah siap digunakan!** 🚀
