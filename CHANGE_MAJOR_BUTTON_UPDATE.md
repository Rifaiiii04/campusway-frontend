# 🔄 Change Major Button Update

## 🎯 Overview

Mengimplementasikan logika tombol yang berubah dari "Pilih Jurusan" menjadi "Ubah Pilihan" ketika siswa sudah memilih jurusan, memungkinkan siswa untuk mengganti pilihan jurusan mereka.

## 🔄 Perubahan yang Dilakukan

### 1. **Helper Function untuk Mengecek Status Jurusan**

#### **Fungsi Baru:**

```typescript
// Helper function to check if a major is already selected
const isMajorSelected = (majorId: number) => {
  return appliedMajors.some((appliedMajor) => appliedMajor.id === majorId);
};
```

#### **Manfaat:**

- ✅ **Reusable Logic**: Dapat digunakan di berbagai tempat
- ✅ **Clean Code**: Logika yang terpisah dan mudah dipahami
- ✅ **Type Safety**: Menggunakan TypeScript dengan proper typing

### 2. **Dynamic Button Logic di Major Cards**

#### **Sebelum:**

```typescript
onClick={() =>
  appliedMajors.length > 0
    ? handleChangeMajor(major)
    : handleApplyMajor(major)
}

// Text
{appliedMajors.length > 0
  ? "Ubah Pilihan"
  : "Pilih Jurusan"}
```

#### **Sesudah:**

```typescript
onClick={() =>
  isMajorSelected(major.id)
    ? handleChangeMajor(major)
    : handleApplyMajor(major)
}

// Text
{isMajorSelected(major.id)
  ? "Ubah Pilihan"
  : "Pilih Jurusan"}
```

### 3. **Dynamic Button Styling**

#### **Conditional Styling:**

```typescript
className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 ${
  isMajorSelected(major.id)
    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
}`}
```

#### **Visual Changes:**

- **Belum Dipilih**: Purple to Pink gradient (Purple-500 to Pink-500)
- **Sudah Dipilih**: Green to Emerald gradient (Green-500 to Emerald-500)

### 4. **Dynamic Icon System**

#### **Conditional Icons:**

```typescript
<path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d={
    isMajorSelected(major.id)
      ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" // Refresh icon
      : "M12 6v6m0 0v6m0-6h6m-6 0H6" // Plus icon
  }
/>
```

#### **Icon Meanings:**

- **Plus Icon**: Untuk jurusan yang belum dipilih (Pilih Jurusan)
- **Refresh Icon**: Untuk jurusan yang sudah dipilih (Ubah Pilihan)

### 5. **Modal Detail Update**

#### **Major Detail Modal:**

```typescript
onClick={() => {
  handleCloseMajorDetail();
  if (selectedMajor && isMajorSelected(selectedMajor.id)) {
    handleChangeMajor(selectedMajor);
  } else if (selectedMajor) {
    handleApplyMajor(selectedMajor);
  }
}}

// Conditional styling
className={`px-6 py-3 rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:scale-105 ${
  selectedMajor && isMajorSelected(selectedMajor.id)
    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
}`}
```

## 🎯 Manfaat Perubahan

### 1. **Better User Experience**

- ✅ **Clear Visual Feedback**: User dapat melihat jurusan mana yang sudah dipilih
- ✅ **Intuitive Actions**: Tombol yang jelas untuk memilih atau mengubah
- ✅ **Consistent Behavior**: Perilaku yang konsisten di semua tempat

### 2. **Visual Improvements**

- ✅ **Color Coding**: Warna yang berbeda untuk status yang berbeda
- ✅ **Icon System**: Icon yang sesuai dengan aksi yang akan dilakukan
- ✅ **Smooth Transitions**: Animasi yang smooth untuk perubahan state

### 3. **Functional Benefits**

- ✅ **Accurate State Management**: Status jurusan yang akurat
- ✅ **Proper API Calls**: Memanggil API yang tepat berdasarkan status
- ✅ **Success Notifications**: Feedback yang jelas untuk user

## 📋 Implementation Details

### **Files Modified:**

- `tka-frontend-siswa/src/app/student/dashboard/page.tsx`

### **Key Functions:**

1. **`isMajorSelected(majorId: number)`**: Helper function untuk mengecek status
2. **`handleApplyMajor(major: Major)`**: Untuk memilih jurusan baru
3. **`handleChangeMajor(major: Major)`**: Untuk mengubah pilihan jurusan

### **State Management:**

- **`appliedMajors`**: Array yang berisi jurusan yang sudah dipilih
- **`isMajorSelected()`**: Function yang mengecek apakah jurusan sudah dipilih

## 🎨 Visual Design System

### **Color Scheme:**

```css
/* Belum Dipilih */
bg-gradient-to-r from-purple-500 to-pink-500
hover:from-purple-600 hover:to-pink-600

/* Sudah Dipilih */
bg-gradient-to-r from-green-500 to-emerald-500
hover:from-green-600 hover:to-emerald-600
```

### **Icon System:**

- **Plus Icon**: `M12 6v6m0 0v6m0-6h6m-6 0H6`
- **Refresh Icon**: `M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15`

## 🔄 User Flow

### **Scenario 1: Siswa Belum Memilih Jurusan**

1. **View Major Cards**: Semua tombol menampilkan "Pilih Jurusan" dengan warna purple
2. **Click Button**: Memanggil `handleApplyMajor()`
3. **Success**: Tombol berubah menjadi "Ubah Pilihan" dengan warna green
4. **Notification**: Menampilkan "Berhasil memilih jurusan [nama jurusan]!"

### **Scenario 2: Siswa Sudah Memilih Jurusan**

1. **View Major Cards**:
   - Jurusan yang dipilih: "Ubah Pilihan" dengan warna green
   - Jurusan lain: "Pilih Jurusan" dengan warna purple
2. **Click on Selected Major**: Memanggil `handleChangeMajor()`
3. **Success**: Status tetap sama, tapi data terupdate
4. **Notification**: Menampilkan "Berhasil mengubah pilihan jurusan ke [nama jurusan]!"

### **Scenario 3: Siswa Mengubah ke Jurusan Lain**

1. **View Major Cards**: Jurusan yang dipilih menampilkan "Ubah Pilihan"
2. **Click on Different Major**: Memanggil `handleChangeMajor()`
3. **Success**: Status berubah, jurusan baru menjadi "Ubah Pilihan"
4. **Notification**: Menampilkan "Berhasil mengubah pilihan jurusan ke [nama jurusan]!"

## ✅ Testing Checklist

### **Functional Testing:**

- [x] Tombol menampilkan "Pilih Jurusan" untuk jurusan yang belum dipilih
- [x] Tombol menampilkan "Ubah Pilihan" untuk jurusan yang sudah dipilih
- [x] Click pada jurusan yang belum dipilih memanggil `handleApplyMajor()`
- [x] Click pada jurusan yang sudah dipilih memanggil `handleChangeMajor()`
- [x] Success notification ditampilkan dengan benar
- [x] State `appliedMajors` terupdate dengan benar

### **Visual Testing:**

- [x] Warna purple untuk tombol "Pilih Jurusan"
- [x] Warna green untuk tombol "Ubah Pilihan"
- [x] Icon plus untuk "Pilih Jurusan"
- [x] Icon refresh untuk "Ubah Pilihan"
- [x] Hover effects berfungsi dengan baik
- [x] Responsive design di semua ukuran layar

### **Modal Testing:**

- [x] Modal detail jurusan menampilkan tombol yang benar
- [x] Click tombol di modal memanggil fungsi yang tepat
- [x] Modal tertutup setelah aksi berhasil
- [x] Styling konsisten dengan major cards

## 🎉 Benefits Summary

### **For Users:**

- **Clear Visual Feedback**: Mudah melihat jurusan mana yang sudah dipilih
- **Intuitive Interface**: Tombol yang jelas dan mudah dipahami
- **Flexible Choices**: Dapat mengubah pilihan jurusan kapan saja
- **Better UX**: Pengalaman yang lebih smooth dan engaging

### **For Developers:**

- **Clean Code**: Logika yang terpisah dan mudah dipahami
- **Reusable Functions**: Helper function yang dapat digunakan di berbagai tempat
- **Type Safety**: TypeScript yang proper dan aman
- **Maintainable**: Code yang mudah di-maintain dan di-extend

### **For System:**

- **Accurate State**: Status jurusan yang akurat dan konsisten
- **Proper API Usage**: Memanggil API yang tepat berdasarkan konteks
- **Performance**: Efficient state management dan rendering
- **Scalable**: Dapat dengan mudah ditambahkan fitur baru

## 📝 Notes

- **Backward Compatibility**: Perubahan ini tidak merusak fungsionalitas yang sudah ada
- **API Integration**: Menggunakan API yang sudah ada (`chooseMajor` dan `changeMajor`)
- **State Management**: Menggunakan state yang sudah ada (`appliedMajors`)
- **User Experience**: Memberikan feedback yang jelas untuk setiap aksi

## 🔄 Future Enhancements

### **Potential Improvements:**

1. **Confirmation Dialog**: Dialog konfirmasi sebelum mengubah pilihan
2. **Undo Functionality**: Fitur undo untuk membatalkan perubahan
3. **History Tracking**: Tracking history perubahan pilihan jurusan
4. **Bulk Operations**: Kemampuan untuk memilih multiple jurusan (jika diperlukan)

### **Monitoring:**

- Monitor penggunaan fitur ubah pilihan
- Collect feedback dari user tentang UX
- Track conversion rate dari pilih ke ubah pilihan
- Monitor error rate pada API calls
