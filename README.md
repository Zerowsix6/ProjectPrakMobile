# 🎮 RentalPs - Sistem Manajemen Rental PlayStation

Aplikasi Mobile React Native (Expo) dengan TypeScript yang dirancang untuk kebutuhan **Praktikum Pemrograman Mobile (Semester 5)** dengan implementasi lengkap modul **STATE, HOOKS, & NAVIGASI PAGE**.

---

## 🚀 Cara Menjalankan Proyek dengan Expo

Pastikan Anda berada di direktori proyek:
```bash
cd "d:\KULIAH\SMESTER5\PRAKTIKUM MOBILE\ProjekPrakMobile"
```

Jalankan perintah berikut:
```bash
# 1. Menjalankan server development Expo (Expo Router)
npx expo start
# atau
npm start

# 2. Untuk membuka langsung di emulator Android:
npm run android

# 3. Untuk membuka di browser Web:
npm run web
```

> **Tips:** Buka aplikasi **Expo Go** pada ponsel fisik Android/iOS Anda dan scan QR Code yang muncul di terminal untuk langsung mencoba di HP.

---

## 📚 Implementasi Modul: STATE, HOOKS, & NAVIGASI PAGE

Sesuai instruksi praktikum, seluruh bagian pada aplikasi yang sebelumnya menampilkan tempat materi (tab "Lab Materi" dan label kode materi pada UI) telah dihilangkan sehingga tampilan menjadi bersih, modern, dan profesional layaknya aplikasi komersial nyata.

Materi yang diimplementasikan:

### 1. Hook `useState()`
- **Manajemen Form & Input**: Digunakan di [unit/[id].tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/unit/[id].tsx) untuk mengelola state `customerName`, `customerPhone`, `durationHours`, `selectedAccessories`, `paymentMethod`, `notes`, dan hasil kalkulasi dinamis.
- **Pencarian & Filter**: Digunakan di [index.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/index.tsx) (`searchQuery`, `selectedCategory`) dan [active-sessions.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/active-sessions.tsx) (`filterStatus`, `searchRenter`).
- **Global State Context**: Digunakan di [RentalContext.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/context/RentalContext.tsx) untuk menyimpan array unit rental, riwayat pemesanan, dan sesi bermain yang sedang berjalan.

### 2. Hook `useEffect()`
- **Live Countdown Timer dengan Cleanup**: Diterapkan di [RentalContext.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/context/RentalContext.tsx) menggunakan `setInterval` yang berjalan setiap detik untuk menghitung mundur sisa waktu bermain, dan otomatis mengembalikan status konsol menjadi 'Tersedia' saat waktu habis, lengkap dengan fungsi cleanup `clearInterval` untuk mencegah kebocoran memori.
- **Auto-Kalkulasi Biaya Dinamis**: Diterapkan di [unit/[id].tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/unit/[id].tsx) dengan dependency array `[durationHours, selectedAccessories, unit]` untuk menghitung ulang subtotal, diskon durasi promo, dan total bayar secara reaktif saat opsi disesuaikan.
- **Validasi Formulir Realtime**: Diterapkan di [unit/[id].tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/unit/[id].tsx) dengan dependency array `[customerName, durationHours]` untuk memeriksa validitas form dan menampilkan pesan peringatan jika nama kosong.
- **Auto-Redirect Timer**: Diterapkan di [booking/success.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/booking/success.tsx) dengan interval hitung mundur 10 detik yang otomatis mengarahkan kembali ke beranda, dengan cleanup `clearInterval`.
- **Peringatan Batas Waktu**: Diterapkan di [active-sessions.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/active-sessions.tsx) untuk mendeteksi secara reaktif jika ada sesi yang sisa waktunya kurang dari 5 menit.

### 3. Navigasi Expo Router (`push()`, `back()`, dan fungsi lainnya)
- **`router.push()`**:
  - Berpindah dari Katalog Beranda ke Halaman Rincian Unit: `router.push({ pathname: '/unit/[id]', params: { id: unit.id } })` di [index.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/index.tsx).
  - Berpindah dari Beranda ke Monitor Sesi Bermain: `router.push('/active-sessions')` di [HeaderRental.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/HeaderRental.tsx) dan [index.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/index.tsx).
  - Berpindah dari halaman bukti pembayaran ke monitor sesi: `router.push('/active-sessions')` di [booking/success.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/booking/success.tsx).
- **`router.back()`**:
  - Tombol Batal/Kembali pada formulir rincian unit di [unit/[id].tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/unit/[id].tsx).
  - Tombol Kembali ke Beranda pada monitor sesi aktif di [active-sessions.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/active-sessions.tsx).
- **Fungsi Expo Router Lainnya**:
  - **`router.replace()`**: Digunakan saat transaksi sewa selesai agar riwayat rute diganti dengan halaman bukti pembayaran `router.replace({ pathname: '/booking/success', params: { ... } })`, mencegah pengguna menekan tombol kembali ke form sewa yang sudah lunas. Juga digunakan saat auto-redirect kembali ke katalog utama.
  - **`useLocalSearchParams()`**: Hook Expo Router untuk membaca parameter URL rute dinamis `id` di [unit/[id].tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/unit/[id].tsx) dan parameter struk pembayaran di [booking/success.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/booking/success.tsx).
  - **`router.canGoBack()`**: Digunakan di [active-sessions.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/app/active-sessions.tsx) untuk memastikan navigasi mundur aman.

---

## 📁 Struktur Direktori Proyek

```text
ProjekPrakMobile/
├── app.json                          # Konfigurasi Expo & skema URL 'rentalps'
├── package.json                      # Dependensi Expo 57, Expo Router, & TypeScript
├── tsconfig.json                     # Konfigurasi TypeScript
├── README.md                         # Dokumentasi proyek
└── src/
    ├── app/                          # File-based Routing Expo Router
    │   ├── _layout.tsx               # Root Stack Navigator & RentalProvider
    │   ├── index.tsx                 # [Halaman 1] Katalog & Beranda Rental PS (router.push)
    │   ├── unit/
    │   │   └── [id].tsx              # [Halaman 2] Form & Rincian Sewa (useLocalSearchParams, useState, useEffect, router.back, router.replace)
    │   ├── booking/
    │   │   └── success.tsx           # [Halaman 3] Bukti Pembayaran & Auto-Redirect (useState, useEffect, router.replace, router.push)
    │   └── active-sessions.tsx       # [Halaman 4] Monitor Sesi & Live Timer (useState, useEffect, router.back)
    ├── context/
    │   └── RentalContext.tsx         # Global State & Live Interval Timer Hook useEffect dengan Cleanup
    ├── components/
    │   ├── HeaderRental.tsx          # Header Reusable & Navigasi Cepat Sesi Aktif
    │   ├── RentalCard.tsx            # Kartu Unit Konsol & Status
    │   ├── QuickStats.tsx            # Live Statistik Unit (Tersedia, Terpakai, Perbaikan)
    │   └── StatusBadge.tsx           # Badge Status Ketersediaan
    ├── data/
    │   └── rentalData.ts             # Data Awal Katalog PS & Aksesori
    ├── types/
    │   └── rental.types.ts           # Model Data & Interface TypeScript
    ├── styles/
    │   └── externalStyles.ts         # External Theme Slate & Blue
    └── utils/
        └── rentalFunctions.ts        # Fungsi Perhitungan, Format Rupiah & Timer
```
