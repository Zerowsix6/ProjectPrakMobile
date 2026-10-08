// ============================================================================
// MATERI 5.5.A: ARRAY OF OBJECT
// MATERI 5.1: VARIABLE (const, let, string, number, boolean)
// ============================================================================

import { RentalUnit, AccessoryItem, SyllabusModule } from '../types/rental.types';

/**
 * [5.1] PENGGUNAAN CONST & LET:
 * - 'const': nilai referensi tidak dapat di-reassign (direkomendasikan untuk data konstan)
 * - 'let': nilai variabel dapat diubah nilainya kemudian
 */
export const SHOP_NAME: string = "PlayStation Rental Pro - Garasi Gaming";
export const MIN_RENTAL_HOURS: number = 1;
export const MAX_RENTAL_HOURS: number = 12;
export const IS_OPEN_24_HOURS: boolean = true;

/**
 * [5.5.A] ARRAY OF OBJECT (Katalog Unit PlayStation)
 * Kumpulan objek dengan struktur interface 'RentalUnit'.
 */
export const INITIAL_RENTAL_UNITS: RentalUnit[] = [
  {
    id: 'PS-01',
    name: 'Unit 01 - PS5 Digital Arena',
    type: 'PS5',
    hourlyRate: 15000,
    status: 'Tersedia',
    isVip: true,
    tvSize: '55 Inch 4K HDR',
    controllerCount: 2,
    popularGames: ['EA FC 24', 'Spider-Man 2', 'God of War Ragnarok'],
  },
  {
    id: 'PS-02',
    name: 'Unit 02 - PS5 Disc Battle',
    type: 'PS5',
    hourlyRate: 15000,
    status: 'Sedang Dimainkan',
    isVip: true,
    tvSize: '50 Inch 4K UHD',
    controllerCount: 2,
    popularGames: ['Tekken 8', 'FC 24', 'GTA V Remastered'],
    activeDurationLeftMinutes: 45,
    currentRenterName: 'Rian Pratama',
  },
  {
    id: 'PS-03',
    name: 'Unit 03 - PS4 Pro Legends',
    type: 'PS4',
    hourlyRate: 10000,
    status: 'Tersedia',
    isVip: false,
    tvSize: '43 Inch Full HD',
    controllerCount: 2,
    popularGames: ['PES 2021 Season Update', 'Naruto Storm 4', 'UFC 4'],
  },
  {
    id: 'PS-04',
    name: 'Unit 04 - PS4 Slim Squad',
    type: 'PS4',
    hourlyRate: 8000,
    status: 'Sedang Dimainkan',
    isVip: false,
    tvSize: '40 Inch Full HD',
    controllerCount: 2,
    popularGames: ['FIFA 23', 'Mortal Kombat 11', 'Crash Bandicoot'],
    activeDurationLeftMinutes: 90,
    currentRenterName: 'Budi Santoso',
  },
  {
    id: 'PS-05',
    name: 'Unit 05 - PS VR2 Next-Gen Immersion',
    type: 'PS_VR2',
    hourlyRate: 25000,
    status: 'Tersedia',
    isVip: true,
    tvSize: '65 Inch OLED',
    controllerCount: 2,
    popularGames: ['Horizon Call of the Mountain', 'Resident Evil Village VR', 'Beat Saber'],
  },
  {
    id: 'PS-06',
    name: 'Unit 06 - PS3 Nostalgia Retro',
    type: 'PS3',
    hourlyRate: 5000,
    status: 'Tersedia',
    isVip: false,
    tvSize: '32 Inch HD',
    controllerCount: 2,
    popularGames: ['GTA San Andreas', 'Guitar Hero', 'Winning Eleven 9', 'Downhill'],
  },
  {
    id: 'PS-07',
    name: 'Unit 07 - PS4 Slim Standby',
    type: 'PS4',
    hourlyRate: 8000,
    status: 'Maintenance',
    isVip: false,
    tvSize: '40 Inch Full HD',
    controllerCount: 1,
    popularGames: ['Need for Speed Heat', 'Gran Turismo Sport'],
  },
];

/**
 * [5.5.A] ARRAY OF OBJECT (Tambahan Aksesori & Snack)
 */
export const ACCESSORIES_DATA: AccessoryItem[] = [
  { id: 'ACC-01', name: 'Stik Tambahan (Stick ke-3 & 4)', extraPrice: 5000 },
  { id: 'ACC-02', name: 'Gaming Headset Surround', extraPrice: 3000 },
  { id: 'ACC-03', name: 'Paket Minuman Dingin + Snack', extraPrice: 10000 },
  { id: 'ACC-04', name: 'Charging Dock & Thumb Grip Pro', extraPrice: 2000 },
];

/**
 * Data silabus materi untuk Tab Modul Belajar
 */
export const SYLLABUS_MODULES: SyllabusModule[] = [
  {
    id: 'M1',
    title: '1. STRUKTUR DASAR REACT',
    subtitle: 'Konsep import dan pengembalian komponen JSX',
    points: [
      {
        number: '1.1',
        topic: 'STRUKTUR IMPORT',
        explanation: 'Mengimpor library, hooks (useState), komponen React Native (View, Text, FlatList), serta modul lokal (types, styles, data).',
        codeSnippet: `import React, { useState } from 'react';\nimport { View, Text, StyleSheet } from 'react-native';\nimport { RentalUnit } from './types/rental.types';\nimport { externalStyles } from './styles/externalStyles';`
      },
      {
        number: '1.2',
        topic: 'RETURN KOMPONEN REACT',
        explanation: 'Setiap komponen React Native mengembalikan satu elemen root JSX, bisa menggunakan kondisi return untuk tampilan alternatif.',
        codeSnippet: `export default function App() {\n  return (\n    <View style={styles.container}>\n      <Text>Selamat Datang di Rental PS</Text>\n    </View>\n  );\n}`
      }
    ]
  },
  {
    id: 'M2',
    title: '2. KOMPONEN',
    subtitle: 'Modularisasi kode dengan functional component & props',
    points: [
      {
        number: '2.0',
        topic: 'CUSTOM FUNCTIONAL COMPONENT',
        explanation: 'Membuat komponen terpisah yang dapat digunakan berulang (reusable) seperti HeaderRental, RentalCard, dan StatusBadge.',
        codeSnippet: `interface CardProps {\n  item: RentalUnit;\n  onRent: (item: RentalUnit) => void;\n}\n\nexport const RentalCard = ({ item, onRent }: CardProps) => (\n  <View style={styles.card}>\n    <Text>{item.name}</Text>\n  </View>\n);`
      }
    ]
  },
  {
    id: 'M3',
    title: '3. STYLING DASAR',
    subtitle: 'Internal styling, external styling, dan inline styling',
    points: [
      {
        number: '3.1',
        topic: 'INTERNAL STYLING',
        explanation: 'Menggunakan StyleSheet.create() di dalam file yang sama dengan komponen untuk performa optimal.',
        codeSnippet: `const styles = StyleSheet.create({\n  headerText: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' }\n});`
      },
      {
        number: '3.2',
        topic: 'EXTERNAL STYLING',
        explanation: 'Menyimpan style di file terpisah (misal externalStyles.ts) dan di-export agar bisa dipakai di banyak komponen.',
        codeSnippet: `// Di file src/styles/externalStyles.ts\nexport const externalStyles = StyleSheet.create({ ... });\n\n// Di file komponen\nimport { externalStyles } from '../styles/externalStyles';`
      },
      {
        number: '3.3',
        topic: 'INLINE STYLING',
        explanation: 'Menuliskan style langsung pada properti style={{ ... }} tag JSX, sangat cocok untuk style dinamis berbasis variabel/state.',
        codeSnippet: `<View style={{ backgroundColor: isVip ? '#F59E0B' : '#64748B', padding: 8 }}>\n  <Text style={{ color: '#FFFFFF', fontSize: 12 }}>VIP Room</Text>\n</View>`
      }
    ]
  },
  {
    id: 'M4',
    title: '4. PACKAGE, LIBRARY, & DEPENDENCY',
    subtitle: 'Pengelolaan pustaka di ekosistem React Native & Expo',
    points: [
      {
        number: '4.0',
        topic: 'DEPENDENCY MANAGEMENT',
        explanation: 'File package.json mencatat paket seperti expo, react, react-native, expo-status-bar yang di-install via npm / npx expo install.',
        codeSnippet: `// package.json dependencies\n"dependencies": {\n  "expo": "~52.0.0",\n  "expo-status-bar": "~2.0.0",\n  "react": "18.3.1",\n  "react-native": "0.76.6"\n}`
      }
    ]
  },
  {
    id: 'M5',
    title: '5. SINTAKS DASAR TYPESCRIPT',
    subtitle: 'Variable, Conditions, Functions, Loops, Array of Object, Type & Interface',
    points: [
      {
        number: '5.1',
        topic: 'VARIABLE (const, let, type annotations)',
        explanation: 'Pendeklarasian tipe data eksplisit seperti string, number, boolean untuk mencegah bug tipe data saat kompilasi.',
        codeSnippet: `const rentalShop: string = "Garasi Gaming";\nlet durasiSewa: number = 2;\nconst isMember: boolean = true;`
      },
      {
        number: '5.2',
        topic: 'CONDITIONS (if-else, ternary, &&)',
        explanation: 'Pengambilan keputusan logika menggunakan if-else, ternary operator ( ? : ), dan short-circuit evaluation (&&).',
        codeSnippet: `// Ternary\nconst badgeColor = status === 'Tersedia' ? '#10B981' : '#EF4444';\n\n// Logical AND (&&)\n{item.isVip && <Text>⭐ Ruang VIP Ac</Text>}`
      },
      {
        number: '5.3',
        topic: 'FUNCTIONS (Bawaan, Custom, Callback)',
        explanation: 'A. Bawaan (toLocaleString, filter), B. Custom (hitungTotalBiaya), C. Callback (onPress, event listener, handler props).',
        codeSnippet: `// Function Custom\nfunction hitungTotal(jam: number, tarif: number): number {\n  return jam * tarif;\n}\n\n// Callback function\n<TouchableOpacity onPress={() => onSelectUnit(unit)} />`
      },
      {
        number: '5.4',
        topic: 'LOOPS (Map, FlatList, Primitive Loop)',
        explanation: 'A. array.map() merender komponen, B. <FlatList> merender list besar secara efisien, C. Primitive for/while loop untuk kalkulasi.',
        codeSnippet: `// Primitive Loop (C)\nlet diskonProgresif = 0;\nfor (let i = 1; i <= jam; i++) {\n  if (i > 3) diskonProgresif += 2000;\n}\n\n// FlatList (B)\n<FlatList data={units} renderItem={({ item }) => <RentalCard item={item} />} />`
      },
      {
        number: '5.5',
        topic: 'VARIABLE LANJUTAN (Array of Object, Type & Interface)',
        explanation: 'Menyusun kumpulan objek kompleks dengan Type dan Interface TypeScript untuk type-safety tingkat lanjut.',
        codeSnippet: `type PSVariant = 'PS3' | 'PS4' | 'PS5';\ninterface Unit { id: string; type: PSVariant; rate: number; }\nconst listUnit: Unit[] = [{ id: '1', type: 'PS5', rate: 15000 }];`
      }
    ]
  }
];
