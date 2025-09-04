# 📊 **Panduan Format Export CSV - Dashboard Guru**

## 🎯 **Overview**

Export CSV telah diperbaiki untuk memastikan kolom-kolom terpisah dengan benar di Excel dan memiliki styling yang baik.

## ✅ **Perbaikan yang Dilakukan**

### **1. Pemisahan Kolom yang Benar:**

- ✅ **Setiap kolom terpisah** dengan koma (`,`)
- ✅ **Nama siswa di kolom A**, **NISN di kolom B**, **Kelas di kolom C**, dst.
- ✅ **Jurusan di kolom terpisah** (bukan gabung dengan nama siswa)
- ✅ **Mata pelajaran di kolom masing-masing**

### **2. CSV Format yang Proper:**

```csv
Nama Siswa,NISN,Kelas,Email,No Handphone,No Orang Tua,Status Pilihan Jurusan,Tanggal Memilih,Nama Jurusan,Kategori Jurusan,Prospek Karir,Mata Pelajaran Wajib,Mata Pelajaran Diutamakan,Mata Pelajaran Kurikulum Merdeka,Mata Pelajaran Kurikulum 2013 IPA,Mata Pelajaran Kurikulum 2013 IPS,Mata Pelajaran Kurikulum 2013 Bahasa
```

### **3. Excel Compatibility:**

- ✅ **BOM (Byte Order Mark)** ditambahkan untuk UTF-8
- ✅ **Karakter Indonesia** ditampilkan dengan benar
- ✅ **Encoding UTF-8** untuk kompatibilitas universal

### **4. Enhanced Styling:**

- ✅ **Header informasi sekolah** di bagian atas
- ✅ **Statistik ringkasan** (total siswa, sudah memilih, belum memilih)
- ✅ **Baris kosong** untuk pemisahan visual
- ✅ **Escape character** untuk field yang mengandung koma/quote

## 📋 **Struktur File CSV**

### **Header Informasi:**

```csv
Data Siswa - SMA Negeri 1 Jakarta
NPSN: 12345678
Tanggal Export: 01/01/2025 10:00:00
Total Siswa: 3
Siswa Sudah Memilih: 3
Siswa Belum Memilih: 0

```

### **Header Kolom:**

```csv
Nama Siswa,NISN,Kelas,Email,No Handphone,No Orang Tua,Status Pilihan Jurusan,Tanggal Memilih,Nama Jurusan,Kategori Jurusan,Prospek Karir,Mata Pelajaran Wajib,Mata Pelajaran Diutamakan,Mata Pelajaran Kurikulum Merdeka,Mata Pelajaran Kurikulum 2013 IPA,Mata Pelajaran Kurikulum 2013 IPS,Mata Pelajaran Kurikulum 2013 Bahasa
```

### **Data Rows:**

```csv
Ahmad Fadillah,1234567890,XII IPA 1,ahmad@email.com,081234567890,081234567891,Sudah Memilih,01/01/2025 10:00,Teknik Informatika,Saintek,Software Engineer Data Scientist,Matematika Bahasa Inggris Bahasa Indonesia,Matematika Tingkat Lanjut Fisika Kimia,Matematika Tingkat Lanjut Fisika Kimia,Matematika Fisika Kimia,Matematika Ekonomi Sejarah,Matematika Bahasa Indonesia Bahasa Inggris
```

## 🔧 **Technical Implementation**

### **1. CSV Field Escaping:**

```typescript
const escapeCSVField = (field: string) => {
  // Jika field mengandung koma, quote, atau newline, wrap dengan quotes
  if (
    field.includes(",") ||
    field.includes('"') ||
    field.includes("\n") ||
    field.includes("\r")
  ) {
    // Escape quotes dengan double quotes
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};
```

### **2. BOM untuk Excel:**

```typescript
const BOM = "\uFEFF";
const csvWithBOM = BOM + content;
```

### **3. Proper Column Separation:**

```typescript
// Header kolom
headers.map(escapeCSVField).join(","),
// Data rows
...rows.map(row => row.map(escapeCSVField).join(","))
```

## 📊 **Contoh Output di Excel**

| A              | B          | C         | D               | E                | F                | G                          | H                   | I                  | J                    | K                                 | L                                            | M                                        | N                                        | O                                     | P                                     | Q                                            |
| -------------- | ---------- | --------- | --------------- | ---------------- | ---------------- | -------------------------- | ------------------- | ------------------ | -------------------- | --------------------------------- | -------------------------------------------- | ---------------------------------------- | ---------------------------------------- | ------------------------------------- | ------------------------------------- | -------------------------------------------- |
| **Nama Siswa** | **NISN**   | **Kelas** | **Email**       | **No Handphone** | **No Orang Tua** | **Status Pilihan Jurusan** | **Tanggal Memilih** | **Nama Jurusan**   | **Kategori Jurusan** | **Prospek Karir**                 | **Mata Pelajaran Wajib**                     | **Mata Pelajaran Diutamakan**            | **Mata Pelajaran Kurikulum Merdeka**     | **Mata Pelajaran Kurikulum 2013 IPA** | **Mata Pelajaran Kurikulum 2013 IPS** | **Mata Pelajaran Kurikulum 2013 Bahasa**     |
| Ahmad Fadillah | 1234567890 | XII IPA 1 | ahmad@email.com | 081234567890     | 081234567891     | Sudah Memilih              | 01/01/2025 10:00    | Teknik Informatika | Saintek              | Software Engineer, Data Scientist | Matematika, Bahasa Inggris, Bahasa Indonesia | Matematika Tingkat Lanjut, Fisika, Kimia | Matematika Tingkat Lanjut, Fisika, Kimia | Matematika, Fisika, Kimia             | Matematika, Ekonomi, Sejarah          | Matematika, Bahasa Indonesia, Bahasa Inggris |

## 🎨 **Styling Features**

### **1. Header Information:**

- **Nama sekolah** dengan format yang jelas
- **NPSN** untuk identifikasi
- **Tanggal export** dengan timestamp
- **Statistik ringkasan** untuk overview cepat

### **2. Visual Separation:**

- **Baris kosong** antara header info dan data
- **Header kolom** yang jelas dan terstruktur
- **Data terorganisir** dalam kolom yang rapi

### **3. Data Quality:**

- **Field kosong** ditampilkan sebagai "-"
- **Tanggal** dalam format Indonesia
- **Status** dalam bahasa Indonesia yang jelas

## 🔍 **Troubleshooting**

### **Jika Kolom Masih Gabung di Excel:**

1. **Buka Excel** → File → Open
2. **Pilih file CSV** yang didownload
3. **Pilih "Delimited"** → Next
4. **Pilih "Comma"** sebagai delimiter → Next
5. **Finish**

### **Jika Karakter Indonesia Tidak Tampil:**

1. **File sudah menggunakan UTF-8** dengan BOM
2. **Excel seharusnya** otomatis detect encoding
3. **Jika masih bermasalah**, buka dengan **Google Sheets** atau **LibreOffice**

### **Jika Data Tidak Lengkap:**

1. **Cek console logs** untuk debugging
2. **Pastikan server backend** berjalan
3. **Gunakan fallback mode** jika API gagal

## 🎉 **Hasil Akhir**

**Export CSV sekarang memiliki:**

- ✅ **Kolom terpisah dengan benar** di Excel
- ✅ **Styling yang professional** dengan header info
- ✅ **Kompatibilitas Excel** yang sempurna
- ✅ **Karakter Indonesia** yang ditampilkan dengan benar
- ✅ **Data lengkap** dengan semua informasi siswa dan jurusan

**File CSV siap digunakan untuk analisis data, laporan, atau backup!** 🚀
