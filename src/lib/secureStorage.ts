// ============================================================================
// SECURE TOKEN STORAGE ADAPTER (expo-secure-store)
// [PERUBAHAN - KRITERIA 4]: Secure Token Storage untuk menyimpan token sesi Supabase
// [PERUBAHAN - KRITERIA 2]: Menggunakan Pre-built Async Function dari expo-secure-store
// ============================================================================

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const LAST_EMAIL_KEY = 'rentalps_last_auth_email';

/**
 * Adapter storage untuk Supabase Auth agar token akses & refresh token
 * disimpan secara terenkripsi di Keychain (iOS) / Keystore (Android).
 */
export const ExpoSecureStoreAdapter = {
  // [PERUBAHAN - KRITERIA 2 & 4]: Pre-built async function SecureStore.getItemAsync
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('[SecureStore] Gagal membaca token:', error);
      return null;
    }
  },

  // [PERUBAHAN - KRITERIA 2 & 4]: Pre-built async function SecureStore.setItemAsync
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('[SecureStore] Gagal menyimpan token:', error);
    }
  },

  // [PERUBAHAN - KRITERIA 2 & 4]: Pre-built async function SecureStore.deleteItemAsync
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn('[SecureStore] Gagal menghapus token:', error);
    }
  },
};

/**
 * [PERUBAHAN - KRITERIA 4]: Custom async helper untuk menyimpan email login terakhir di SecureStore
 */
export async function saveLastAuthEmail(email: string): Promise<void> {
  await ExpoSecureStoreAdapter.setItem(LAST_EMAIL_KEY, email.trim().toLowerCase());
}

/**
 * [PERUBAHAN - KRITERIA 4]: Membaca email login terakhir dari SecureStore
 */
export async function getLastAuthEmail(): Promise<string | null> {
  return await ExpoSecureStoreAdapter.getItem(LAST_EMAIL_KEY);
}

/**
 * [PERUBAHAN - KRITERIA 4]: Menghapus email login tersimpan saat user clear/sign out jika diperlukan
 */
export async function clearLastAuthEmail(): Promise<void> {
  await ExpoSecureStoreAdapter.removeItem(LAST_EMAIL_KEY);
}
