// ============================================================================
// ROOT LAYOUT EXPO ROUTER
// [PERUBAHAN - KRITERIA 6]: Membungkus aplikasi dengan Global AuthProvider
// [PERUBAHAN - KRITERIA 7]: Route Protection Guards menggunakan <Stack.Protected>
// ============================================================================

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootNavigator() {
  // [PERUBAHAN - KRITERIA 6 & 7]: Mengambil status session & loading dari Global AuthContext
  const { session, isLoading } = useAuth();

  // [PERUBAHAN - KRITERIA 5 & 7]: Loading state saat memeriksa token sesi di SecureStore
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Memeriksa sesi autentikasi...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#0F172A',
        },
      }}
    >
      {/* [PERUBAHAN - KRITERIA 7]: Route Protection Guard - Rute publik (Auth) hanya aktif jika belum login */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* [PERUBAHAN - KRITERIA 7]: Route Protection Guard - Rute utama aplikasi terkunci sampai user login */}
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* [PERUBAHAN - KRITERIA 6]: Global AuthProvider + Real-time Session Subscription */}
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 12,
    fontWeight: '600',
  },
});
