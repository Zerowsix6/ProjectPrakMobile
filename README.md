# 🎮 RentalPs - Sistem Manajemen Rental PlayStation

Aplikasi Mobile React Native (Expo) dengan TypeScript yang dirancang untuk kebutuhan **Praktikum Pemrograman Mobile (Semester 5)** dengan cakupan materi lengkap **SINTAKS & UI DASAR**.

---

## 🚀 Cara Menjalankan Proyek dengan Expo

Pastikan Anda berada di direktori proyek:
```bash
cd "d:\KULIAH\SMESTER5\PRAKTIKUM MOBILE\ProjekPrakMobile"
```

Jalankan perintah berikut:
```bash
# 1. Menjalankan server development Expo
npx expo start
# atau
npm start

# 2. Untuk membuka langsung di emulator Android:
npm run android

# 3. Untuk membuka di browser Web (opsional jika paket web terpasang):
npm run web
```

> **Tips:** Buka aplikasi **Expo Go** pada ponsel fisik Android/iOS Anda dan scan QR Code yang muncul di terminal untuk langsung mencoba di HP.

---

## 📚 Pemetaan Materi Silabus ke Kode Program

Setiap materi yang diminta telah diimplementasikan secara terstruktur dan terdokumentasi lengkap di dalam kode:

| No | Modul Silabus | File Lokasi Implementasi | Penjelasan & Baris Kode |
|---|---|---|---|
| **1.1** | **Struktur Import** | [App.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/App.tsx), [RentalHomeScreen.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/screens/RentalHomeScreen.tsx) | Import React, hooks, React Native components, third-party Expo, Types, Styles, dan Data lokal |
| **1.2** | **Return Komponen React** | [App.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/App.tsx), [RentalCard.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/RentalCard.tsx) | Pengembalian hirarki JSX tunggal, conditional return, JSX nesting |
| **2** | **Komponen (Modular & Reusable)** | [HeaderRental.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/HeaderRental.tsx), [RentalCard.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/RentalCard.tsx), [StatusBadge.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/StatusBadge.tsx), [BookingModal.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/BookingModal.tsx), [QuickStats.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/QuickStats.tsx) | Komponen modular fungsional dengan TypeScript props interface |
| **3.1** | **Internal Styling** | [StatusBadge.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/StatusBadge.tsx), [HeaderRental.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/HeaderRental.tsx) | `StyleSheet.create({ ... })` yang dibuat di dalam file yang sama dengan komponen |
| **3.2** | **External Styling** | [externalStyles.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/styles/externalStyles.ts) | File terpisah berisi desain global tema Slate & Blue yang di-export dan di-import |
| **3.3** | **Inline Styling** | [RentalCard.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/RentalCard.tsx) | `style={{ borderColor: item.isVip ? '#F59E0B' : '#334155', backgroundColor: ... }}` |
| **4** | **Package, Library, & Dependency** | [package.json](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/package.json) | Konfigurasi dependensi: `expo`, `react`, `react-native`, `expo-status-bar`, devDependencies TS |
| **5.1** | **Variable (const, let, types)** | [rental.types.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/types/rental.types.ts), [rentalData.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/data/rentalData.ts) | Variable `const`, `let`, tipe data primitif `string`, `number`, `boolean`, generic state |
| **5.2** | **Conditions** | [rentalFunctions.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/utils/rentalFunctions.ts), [RentalCard.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/RentalCard.tsx) | `if-else` diskon, ternary operator `status === 'Tersedia' ? ... : ...`, logical `&&` |
| **5.3.A** | **Function Bawaan** | [rentalFunctions.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/utils/rentalFunctions.ts) | `toLocaleString('id-ID')`, `toUpperCase()`, `trim()`, `Math.min()`, `Math.max()`, `filter()` |
| **5.3.B** | **Function Custom** | [rentalFunctions.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/utils/rentalFunctions.ts) | `hitungTotalBiayaRental()`, `hitungDiskonPersen()`, `formatRupiah()`, `generateKodeBooking()` |
| **5.3.C** | **Callback Function (Bonus)** | [rentalFunctions.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/utils/rentalFunctions.ts), [RentalHomeScreen.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/screens/RentalHomeScreen.tsx) | `prosesDaftarUnitDenganCallback()`, `selesaikanTransaksi(unit, callback)`, `onRent`, `onConfirmBooking` |
| **5.4.A** | **Map() Loop** | [RentalHomeScreen.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/screens/RentalHomeScreen.tsx), [RentalCard.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/components/RentalCard.tsx) | Iterasi `categories.map()`, `item.popularGames.map()`, `ACCESSORIES_DATA.map()` |
| **5.4.B** | **<FlatList>** | [RentalHomeScreen.tsx](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/screens/RentalHomeScreen.tsx) | Komponen virtualisasi `<FlatList data={filteredUnits} renderItem={...} keyExtractor={...} />` |
| **5.4.C** | **Primitive Loop** | [rentalFunctions.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/utils/rentalFunctions.ts) | `for (let i = 1; i <= durasi; i++)`, `for (const unit of units)`, `while (sisaMenit >= 30)` |
| **5.5.A** | **Array of Object** | [rentalData.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/data/rentalData.ts) | `INITIAL_RENTAL_UNITS: RentalUnit[]`, `ACCESSORIES_DATA: AccessoryItem[]` |
| **5.5.B** | **Type & Interface** | [rental.types.ts](file:///d:/KULIAH/SMESTER5/PRAKTIKUM%20MOBILE/ProjekPrakMobile/src/types/rental.types.ts) | `type PSConsoleType`, `type UnitStatus`, `interface RentalUnit`, `interface BookingResult` |

---

## 📁 Struktur Direktori

```text
ProjekPrakMobile/
├── App.tsx                      # Root component, Safe Area, Tab Navigator
├── app.json                     # Konfigurasi nama dan slug Expo "RentalPs"
├── package.json                 # Dependensi & NPM scripts
├── tsconfig.json                # Konfigurasi TypeScript
├── README.md                    # Dokumentasi lengkap
└── src/
    ├── types/
    │   └── rental.types.ts      # [5.5.B] Types & Interfaces TypeScript
    ├── data/
    │   └── rentalData.ts        # [5.5.A] Array of Objects (Katalog PS, Aksesoris, Silabus)
    ├── styles/
    │   └── externalStyles.ts    # [3.2] External Stylesheet (Theme Slate & Blue)
    ├── utils/
    │   └── rentalFunctions.ts   # [5.3] Functions (Bawaan, Custom, Callback) & [5.4.C] Primitive Loops
    ├── components/
    │   ├── HeaderRental.tsx     # [2] Reusable Header & Tab Switcher
    │   ├── RentalCard.tsx       # [2] Reusable Card, [3.3] Inline Styles, [5.4.A] Map
    │   ├── StatusBadge.tsx      # [2] Reusable Badge, [3.1] Internal Styles
    │   ├── QuickStats.tsx       # [2] Live stats dari Primitive Loop
    │   └── BookingModal.tsx     # [2] Modal Form Sewa, Perhitungan & Callback
    └── screens/
        ├── RentalHomeScreen.tsx # [5.4.B] FlatList, Search, Filter & Transaksi
        └── MateriScreen.tsx     # Lab Pembelajaran Interaktif (Semua Modul 1-5)
```
