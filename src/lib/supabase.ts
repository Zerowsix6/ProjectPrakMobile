// ============================================================================
// KONFIGURASI SUPABASE CLIENT + SECURE TOKEN STORAGE
// [PERUBAHAN - KRITERIA 4]: Integrasi ExpoSecureStoreAdapter ke Supabase Auth
// [PERUBAHAN - KRITERIA 5]: Setup Supabase Client untuk Auth Flow
// ============================================================================

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { ExpoSecureStoreAdapter } from './secureStorage';

const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const rawSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured: boolean =
  Boolean(rawSupabaseUrl) &&
  Boolean(rawSupabaseAnonKey) &&
  !rawSupabaseUrl.includes('your-project-id') &&
  !rawSupabaseAnonKey.includes('your-anon-key');

// Fallback aman agar aplikasi tidak crash saat pertama kali dibuka sebelum .env diisi
const supabaseUrl = isSupabaseConfigured ? rawSupabaseUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawSupabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // [PERUBAHAN - KRITERIA 4]: Token sesi disimpan aman di expo-secure-store
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
