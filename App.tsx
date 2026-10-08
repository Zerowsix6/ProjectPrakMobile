// ============================================================================
// PROJEK: RentalPs (Sistem Manajemen Rental PlayStation)
// PRAKTIKUM PEMROGRAMAN MOBILE - MATERI DASAR SINTAKS & UI DASAR
// ============================================================================
// DAFTAR MATERI YANG DIIMPLEMENTASIKAN:
// 1. STRUKTUR DASAR REACT
//    1.1. STRUKTUR IMPORT
//    1.2. RETURN KOMPONEN REACT
// 2. KOMPONEN
// 3. STYLING DASAR
//    3.1. INTERNAL STYLING
//    3.2. EXTERNAL STYLING
//    3.3. INLINE STYLING
// 4. PACKAGE, LIBRARY, & DEPENDENCY
// 5. SINTAKS DASAR TYPESCRIPT
//    5.1. VARIABLE
//    5.2. CONDITIONS
//    5.3. FUNCTIONS (A. Bawaan, B. Custom, C. Callback Bonus)
//    5.4. LOOPS (A. Map, B. <FlatList>, C. Primitive Loop)
//    5.5. VARIABLE LANJUTAN (A. Array of Object, B. Type & Interface)
// ============================================================================

// [1.1] STRUKTUR IMPORT: 1. Core React dan Hooks
import React, { useState } from 'react';

// [1.1] STRUKTUR IMPORT: 2. Core Komponen React Native
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';

// [1.1] STRUKTUR IMPORT: 3. Third-party Expo Library [4. PACKAGE & DEPENDENCY]
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// [1.1] STRUKTUR IMPORT: 4. Data & Types Modular [5.5.A & 5.5.B]
import { INITIAL_RENTAL_UNITS } from './src/data/rentalData';

// [1.1] STRUKTUR IMPORT: 5. Styling External [3.2]
import { externalStyles } from './src/styles/externalStyles';

// [1.1] STRUKTUR IMPORT: 6. Komponen Modular Buatan Sendiri [2. KOMPONEN]
import { HeaderRental } from './src/components/HeaderRental';
import { RentalHomeScreen } from './src/screens/RentalHomeScreen';
import { MateriScreen } from './src/screens/MateriScreen';

/**
 * [1. STRUKTUR DASAR REACT]
 * Komponen Utama Aplikasi (App)
 */
export default function App() {
  // [5.1] VARIABLE & STATE MANAGEMENT DENGAN TYPESCRIPT
  const [activeTab, setActiveTab] = useState<'rental' | 'materi'>('rental');

  // Menghitung jumlah unit yang siap disewa
  const availableCount = INITIAL_RENTAL_UNITS.filter((u) => u.status === 'Tersedia').length;
  const totalCount = INITIAL_RENTAL_UNITS.length;

  // [1.2] RETURN KOMPONEN REACT:
  // Mengembalikan hirarki komponen JSX yang dibungkus dengan SafeAreaView
  return (
    <SafeAreaView
      // [3.2] EXTERNAL STYLING dipadukan dengan [3.1] INTERNAL STYLING
      style={[externalStyles.safeArea, styles.androidSafeArea]}
    >
      {/* Pengaturan Status Bar untuk perangkat mobile (Expo Status Bar) */}
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* [2. KOMPONEN] HeaderRental: Komponen reusable dengan callback tab switcher */}
      <HeaderRental
        activeTab={activeTab}
        // [5.3.C] CALLBACK FUNCTION: Mengubah tab state ketika tombol ditekan
        onTabChange={(tab) => setActiveTab(tab)}
        availableCount={availableCount}
        totalCount={totalCount}
      />

      {/* [5.2] CONDITIONS: Conditional Rendering Tab Tampilan */}
      <View style={{ flex: 1 }}>
        {activeTab === 'rental' ? (
          // Tab 1: Aplikasi Rental PS Utama (FlatList, Map, Booking, dll.)
          <RentalHomeScreen onGoToMateri={() => setActiveTab('materi')} />
        ) : (
          // Tab 2: Lab Materi & Silabus Interaktif
          <MateriScreen />
        )}
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// [3.1] INTERNAL STYLING:
// StyleSheet.create yang dibuat khusus di dalam berkas App.tsx ini
// ============================================================================
const styles = StyleSheet.create({
  androidSafeArea: {
    // Memberi padding atas pada sistem operasi Android agar tidak tertutup notch/status bar
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
