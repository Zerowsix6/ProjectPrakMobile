// ============================================================================
// LAYOUT GRUP RUTE TERPROTEKSI ((app))
// [PERUBAHAN - KRITERIA 7]: Seluruh layar utama berada di dalam grup (app) yang dijaga Guard
// ============================================================================

import React from 'react';
import { Stack } from 'expo-router';
import { RentalProvider } from '../../context/RentalContext';

export const unstable_settings = {
  anchor: 'index',
};

export default function AppGroupLayout() {
  return (
    <RentalProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 16,
          },
          contentStyle: {
            backgroundColor: '#0F172A',
          },
          animation: 'slide_from_right',
        }}
      >
        {/* 1. Halaman Utama (Katalog Unit & Dashboard) */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        {/* 2. Halaman Rincian Unit & Form Pemesanan */}
        <Stack.Screen
          name="unit/[id]"
          options={{
            title: 'Rincian & Formulir Sewa',
            headerBackTitle: 'Kembali',
          }}
        />

        {/* 3. Halaman Konfirmasi Sukses Transaksi */}
        <Stack.Screen
          name="booking/success"
          options={{
            title: 'Bukti Pembayaran Sewa',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />

        {/* 4. Halaman Pemantauan Sesi Aktif (Live Countdown Timer) */}
        <Stack.Screen
          name="active-sessions"
          options={{
            title: '⏱️ Sesi Bermain Aktif',
            headerBackTitle: 'Beranda',
          }}
        />

        {/* [PERUBAHAN - KRITERIA 1, 2, 3]: Halaman Katalog Game External API */}
        <Stack.Screen
          name="external-games"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </RentalProvider>
  );
}
