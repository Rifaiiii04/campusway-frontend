# Perubahan Port Frontend

## Port yang Digunakan

Frontend sekarang berjalan di **port 3001** (sebelumnya port 3000).

## Script yang Diubah

Semua script di `package.json` telah diupdate:

- `npm run dev` → Menjalankan di port **3001**
- `npm run dev:network` → Menjalankan di port **3001** dengan akses network
- `npm start` → Menjalankan di port **3001**
- `npm run start:prod` → Menjalankan di port **3001** (production)

## Cara Menggunakan

### Development Mode:
```bash
cd campusway-frontend
npm run dev
```
Frontend akan berjalan di: **http://localhost:3001**

### Network Mode (untuk akses dari device lain):
```bash
npm run dev:network
```
Frontend akan berjalan di: **http://0.0.0.0:3001** (dapat diakses dari IP lokal)

## Mengubah Port ke Nilai Lain

Jika ingin menggunakan port lain, edit file `package.json` dan ubah angka `3001` di semua script:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",  // Ubah 3001 ke port yang diinginkan
    "dev:network": "next dev --turbopack --hostname 0.0.0.0 --port 3001",
    "start": "next start -p 3001",
    "start:prod": "NODE_ENV=production next start -p 3001"
  }
}
```

## Port yang Disarankan

- **3001** - Port alternatif untuk development (tidak konflik dengan port 3000)
- **3002** - Port alternatif lainnya
- **8080** - Port umum untuk web server
- **5000** - Port alternatif

## Catatan

- Pastikan port yang dipilih tidak digunakan oleh aplikasi lain
- Untuk production, biasanya menggunakan web server (Apache/Nginx) di port 80 atau 443
- Port backend tetap di `103.23.198.101` (tanpa port, menggunakan port 80 default)





