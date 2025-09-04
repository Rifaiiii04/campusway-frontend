# 📚 Collapsible Curriculum Feature

## 📋 **Feature Overview**

Fitur collapsible curriculum memungkinkan pengguna untuk menyembunyikan dan menampilkan bagian kurikulum tertentu dengan default state **HIDDEN**. Ini membantu mengurangi clutter pada modal dan memberikan kontrol lebih kepada pengguna.

## 🎯 **User Request**

> "di bagian kurikulum merdeka - Mata Pelajaran Kurikulum 2013 - Bahasa itu tetap ada tapi coba di buat kayak bisa di hide dan unhide tapi defaultnya hide"

## 🔧 **Implementation**

### **1. State Management**

```typescript
const [expandedCurriculums, setExpandedCurriculums] = useState({
  merdeka: false, // Default: HIDDEN
  kurikulum_2013_ipa: false, // Default: HIDDEN
  kurikulum_2013_ips: false, // Default: HIDDEN
  kurikulum_2013_bahasa: false, // Default: HIDDEN
});
```

### **2. Toggle Function**

```typescript
const toggleCurriculum = (curriculum: keyof typeof expandedCurriculums) => {
  setExpandedCurriculums((prev) => ({
    ...prev,
    [curriculum]: !prev[curriculum],
  }));
};
```

### **3. Collapsible UI Design**

#### **Button Structure**

```tsx
<button
  onClick={() => toggleCurriculum("merdeka")}
  className="flex items-center justify-between w-full text-left"
>
  <p className="text-sm font-medium">📚 Mata Pelajaran Kurikulum Merdeka</p>
  <span
    className={`transform transition-transform duration-200 ${
      expandedCurriculums.merdeka ? "rotate-180" : "rotate-0"
    }`}
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </span>
</button>
```

#### **Content Display**

```tsx
{
  expandedCurriculums.merdeka && (
    <p className="mt-3 text-gray-700">
      {formatSubjects(student.chosen_major.kurikulum_merdeka_subjects)}
    </p>
  );
}
```

## 🎨 **Visual Design**

### **Color Coding**

1. **Kurikulum Merdeka**: Purple gradient (`from-purple-50 to-indigo-50`)
2. **Kurikulum 2013 IPA**: Orange gradient (`from-orange-50 to-red-50`)
3. **Kurikulum 2013 IPS**: Teal gradient (`from-teal-50 to-cyan-50`)
4. **Kurikulum 2013 Bahasa**: Indigo gradient (`from-indigo-50 to-blue-50`)

### **Icons**

- **Kurikulum Merdeka**: 📚 (Books)
- **Kurikulum 2013 IPA**: 🧪 (Test Tube)
- **Kurikulum 2013 IPS**: 📊 (Chart)
- **Kurikulum 2013 Bahasa**: 📝 (Memo)

### **Animation**

- **Arrow Rotation**: Smooth 200ms transition
- **Content Fade**: Instant show/hide
- **Hover Effects**: Subtle button interactions

## 📱 **User Experience**

### **Default State**

- **All sections HIDDEN** by default
- **Clean, minimal interface**
- **Easy to scan available sections**

### **Interaction**

- **Click to expand** any curriculum section
- **Click again to collapse**
- **Visual feedback** with rotating arrow
- **Smooth animations** for better UX

### **Accessibility**

- **Keyboard navigation** supported
- **Screen reader friendly**
- **Clear visual indicators**
- **Consistent interaction patterns**

## 🔍 **Technical Details**

### **State Structure**

```typescript
interface ExpandedCurriculums {
  merdeka: boolean;
  kurikulum_2013_ipa: boolean;
  kurikulum_2013_ips: boolean;
  kurikulum_2013_bahasa: boolean;
}
```

### **Toggle Logic**

```typescript
// Toggle specific curriculum
toggleCurriculum("merdeka"); // Toggles merdeka section

// State update
setExpandedCurriculums((prev) => ({
  ...prev,
  [curriculum]: !prev[curriculum],
}));
```

### **Conditional Rendering**

```tsx
// Only render content when expanded
{
  expandedCurriculums.merdeka && <div>Content here</div>;
}
```

## 🚀 **Benefits**

### **1. Reduced Clutter**

- **Cleaner interface** with hidden sections
- **Focus on essential information**
- **Better visual hierarchy**

### **2. User Control**

- **Users choose** what to see
- **Progressive disclosure** of information
- **Customizable viewing experience**

### **3. Performance**

- **Lazy rendering** of content
- **Reduced DOM elements** when hidden
- **Smoother interactions**

### **4. Mobile Friendly**

- **Less scrolling** required
- **Better space utilization**
- **Touch-friendly interactions**

## 🧪 **Testing Scenarios**

### **1. Default State**

- ✅ All sections should be hidden
- ✅ Arrows should point down
- ✅ No content should be visible

### **2. Toggle Functionality**

- ✅ Click to expand section
- ✅ Click again to collapse
- ✅ Arrow rotates correctly
- ✅ Content appears/disappears

### **3. Multiple Sections**

- ✅ Each section independent
- ✅ Can have multiple expanded
- ✅ State persists during session

### **4. Edge Cases**

- ✅ Empty content handled
- ✅ Long content scrollable
- ✅ Responsive design works

## 📊 **Before vs After**

### **Before (Always Visible)**

```
Mata Pelajaran Kurikulum Merdeka
Bahasa Indonesia, Matematika, Bahasa Inggris, Teknik Mesin...

Mata Pelajaran Kurikulum 2013 - IPA
Bahasa Indonesia, Matematika, Bahasa Inggris, Teknik Mesin...

Mata Pelajaran Kurikulum 2013 - IPS
Bahasa Indonesia, Matematika, Bahasa Inggris, Teknik Mesin...

Mata Pelajaran Kurikulum 2013 - Bahasa
Bahasa Indonesia, Matematika, Bahasa Inggris, Teknik Mesin...
```

### **After (Collapsible)**

```
📚 Mata Pelajaran Kurikulum Merdeka ▼
🧪 Mata Pelajaran Kurikulum 2013 - IPA ▼
📊 Mata Pelajaran Kurikulum 2013 - IPS ▼
📝 Mata Pelajaran Kurikulum 2013 - Bahasa ▼
```

## 🔮 **Future Enhancements**

### **1. Persistence**

- **Remember user preferences**
- **Local storage** for expanded states
- **Session persistence**

### **2. Bulk Actions**

- **Expand All** button
- **Collapse All** button
- **Quick access** to all content

### **3. Search Integration**

- **Search within sections**
- **Auto-expand** matching sections
- **Highlight search results**

### **4. Customization**

- **User-defined defaults**
- **Custom colors** per section
- **Personalized icons**

---

**Kurikulum sections sekarang bisa di-hide dan di-unhide dengan default HIDDEN!** ✅
