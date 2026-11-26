// ============================================================================
// LAYOUT GRUP RUTE AUTENTIKASI ((auth))
// [PERUBAHAN - KRITERIA 7]: Grup rute terproteksi untuk pengguna yang belum login
// ============================================================================

import React from 'react';
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: 'login',
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#0F172A',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
