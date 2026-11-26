// ============================================================================
// HALAMAN SIGN IN (AUTENTIKASI SUPABASE)
// [PERUBAHAN - KRITERIA 5]: Supabase Auth Flow (Sign In & Loading States)
// [PERUBAHAN - KRITERIA 4 & 6]: Membaca lastEmail dari SecureStore & state dari AuthContext
// ============================================================================

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { externalStyles } from '../../styles/externalStyles';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, isAuthActionLoading, isConfigured, authError, clearAuthError, lastEmail } =
    useAuth();

  const [email, setEmail] = useState<string>(lastEmail ?? '');
  const [password, setPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  // [PERUBAHAN - KRITERIA 2 & 5]: Custom async handler untuk proses Sign In Supabase
  const handleLogin = async () => {
    clearAuthError();
    setLocalError(null);

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Masukkan alamat email yang valid.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password minimal 6 karakter.');
      return;
    }

    const result = await signIn(email, password);
    if (result.error) {
      Alert.alert('Gagal Masuk', result.error);
    }
  };

  const displayedError = localError || authError;

  return (
    <KeyboardAvoidingView
      style={[externalStyles.mainContainer, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandBox}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🎮</Text>
          </View>
          <Text style={styles.brandTitle}>RentalPs Pro</Text>
          <Text style={styles.brandSubtitle}>
            Masuk untuk mengelola katalog unit, booking sewa, dan live timer bermain.
          </Text>
        </View>

        {!isConfigured && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Konfigurasi Supabase Diperlukan</Text>
            <Text style={styles.warningDesc}>
              Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY pada file .env agar
              autentikasi Supabase dapat terhubung.
            </Text>
          </View>
        )}

        <View style={externalStyles.cardBase}>
          <Text style={styles.formHeading}>Masuk ke Akun</Text>

          <Text style={externalStyles.inputLabel}>Email</Text>
          <TextInput
            style={externalStyles.inputField}
            placeholder="nama@email.com"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isAuthActionLoading}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={externalStyles.inputLabel}>Password</Text>
          <TextInput
            style={externalStyles.inputField}
            placeholder="Minimal 6 karakter"
            placeholderTextColor="#64748B"
            secureTextEntry
            editable={!isAuthActionLoading}
            value={password}
            onChangeText={setPassword}
          />

          {displayedError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {displayedError}</Text>
            </View>
          )}

          {/* [PERUBAHAN - KRITERIA 5]: Tombol Sign In dengan Loading State Indicator */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isAuthActionLoading}
            style={[
              externalStyles.primaryButton,
              styles.submitBtn,
              isAuthActionLoading && externalStyles.disabledButton,
            ]}
          >
            {isAuthActionLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={externalStyles.primaryButtonText}>Memproses Masuk...</Text>
              </View>
            ) : (
              <Text style={externalStyles.primaryButtonText}>Masuk (Sign In) ➔</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerLinkRow}>
            <Text style={styles.footerHint}>Belum punya akun? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity disabled={isAuthActionLoading}>
                <Text style={styles.footerLink}>Daftar di sini</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#1E3A8A44',
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 36,
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
  },
  warningBox: {
    backgroundColor: '#78350F44',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  warningTitle: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  warningDesc: {
    color: '#FCD34D',
    fontSize: 11,
    lineHeight: 16,
  },
  formHeading: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#7F1D1D44',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 4,
    paddingVertical: 14,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerHint: {
    color: '#94A3B8',
    fontSize: 13,
  },
  footerLink: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
});
