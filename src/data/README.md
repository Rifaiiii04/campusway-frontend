# Data Files untuk Sistem ArahPotensi

Folder ini berisi file-file data yang digunakan untuk sistem Tes Kemampuan Akademik (ArahPotensi).

## 📁 File yang Tersedia

### 1. `guru.json` - Data Akun Guru/Sekolah

Berisi data akun login untuk guru dan sekolah yang dapat mengakses dashboard guru.

**Struktur Data:**

```json
{
  "guru": [
    {
      "id": 1,
      "npsn": "20212345",
      "name": "SMA Negeri 1 Jakarta",
      "password": "guru123",
      "email": "admin@sman1jakarta.sch.id",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "demo_account": {
    "npsn": "20212345",
    "password": "guru123",
    "description": "Akun demo untuk testing"
  }
}
```

**Akun Demo Guru:**

- **NPSN:** 20212345
- **Password:** guru123
- **Sekolah:** SMA Negeri 1 Jakarta

### 2. `siswa.json` - Data Siswa

Berisi data siswa yang dapat mengikuti tes ArahPotensi.

**Struktur Data:**

```json
{
  "siswa": [
    {
      "id": 1,
      "school_id": 1,
      "nisn": "2024001",
      "name": "Ahmad Rizki",
      "class": "X IPA 1",
      "phone": "081234567890",
      "email": "ahmad.rizki@student.sch.id",
      "parent_phone": "081234567891",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "demo_student": {
    "nisn": "2024001",
    "password": "siswa123",
    "description": "Akun demo siswa"
  }
}
```

**Akun Demo Siswa:**

- **NISN:** 2024001
- **Password:** siswa123
- **Nama:** Ahmad Rizki
- **Kelas:** X IPA 1

### 3. `soal.json` - Bank Soal ArahPotensi

Berisi kumpulan soal tes kemampuan akademik dengan 3 mata pelajaran.

**Struktur Data:**

```json
{
  "questions": [
    {
      "id": 1,
      "subject": "Matematika",
      "question_text": "Berapakah hasil dari 15 × 8 + 12 ÷ 3?",
      "type": "multiple_choice",
      "options": [
        {
          "option_label": "A",
          "option_text": "124",
          "is_correct": false
        },
        {
          "option_label": "B",
          "option_text": "126",
          "is_correct": true
        }
      ]
    }
  ],
  "test_config": {
    "duration_minutes": 60,
    "total_questions": 15,
    "questions_per_subject": {
      "Matematika": 5,
      "Bahasa Indonesia": 5,
      "Bahasa Inggris": 5
    },
    "scoring": {
      "correct_answer": 20,
      "max_score": 100
    }
  }
}
```

## 🎯 Komposisi Soal

### Matematika (5 Soal)

1. Operasi hitung campuran
2. Sistem persamaan linear
3. Akar kuadrat
4. Perpangkatan
5. Perkalian desimal

### Bahasa Indonesia (5 Soal)

1. Jenis kata (pronomina relatif)
2. Sinonim
3. Jenis kata (verba)
4. Pola kalimat
5. Antonim

### Bahasa Inggris (5 Soal)

1. Jenis kata (adjective)
2. Simple Present Tense
3. Past Tense
4. Sinonim
5. To be (am/is/are)

## 🔐 Cara Login

### Untuk Guru:

1. Buka halaman login guru (`/login`)
2. Masukkan NPSN: `20212345`
3. Masukkan Password: `guru123`
4. Klik "Login"

### Untuk Siswa:

1. Buka halaman login siswa (`/student`)
2. Masukkan NISN: `2024001`
3. Masukkan Password: `siswa123`
4. Klik "Login"

## 📊 Sistem Scoring

- **Skor per jawaban benar:** 20 poin
- **Skor maksimal:** 100 poin
- **Durasi tes:** 60 menit
- **Jumlah soal:** 15 soal

## 🎓 Rekomendasi Jurusan

Berdasarkan skor tes, sistem akan merekomendasikan jurusan:

- **Skor 80-100:** IPA
- **Skor 60-79:** IPS
- **Skor 40-59:** Bahasa
- **Skor 0-39:** Agama

## 🔄 Integrasi dengan Database

Data dalam file JSON ini sesuai dengan struktur database SQL Server yang ada di file `db`. Struktur tabel:

- `schools` → `guru.json`
- `students` → `siswa.json`
- `questions` + `question_options` → `soal.json`
- `results` → Hasil tes
- `recommendations` → Rekomendasi jurusan

## 📝 Catatan Pengembangan

- File ini dapat digunakan untuk development dan testing
- Untuk production, data sebaiknya disimpan di database
- Password dalam file ini adalah plain text, untuk production harus di-hash
- Struktur data dapat disesuaikan dengan kebutuhan aplikasi
