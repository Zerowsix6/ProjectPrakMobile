// ============================================================================
// PROJEK: RentalPs (Sistem Manajemen Rental PlayStation)
// Menerapkan: State, Hooks (useState, useEffect), & Navigasi Page Expo Router
// ============================================================================

import React from 'react';
import RootLayout from './src/app/_layout';

/**
 * Entry fallback untuk App jika dipanggil langsung
 * Menjalankan RootLayout berbasis Expo Router & RentalProvider
 */
export default function App() {
  return <RootLayout />;
}
