// ============================================================================
// ROOT LAYOUT EXPO ROUTER
// Menerapkan Stack Navigator, Provider State Global, dan Konfigurasi Layar
// ============================================================================

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RentalProvider } from '../context/RentalContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RentalProvider>
        <StatusBar style="light" />
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
        </Stack>
      </RentalProvider>
    </SafeAreaProvider>
  );
}
