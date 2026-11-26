// ============================================================================
// HALAMAN SIGN UP / REGISTRASI (AUTENTIKASI SUPABASE)
// [PERUBAHAN - KRITERIA 5]: Supabase Auth Flow (Sign Up & Loading States)
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
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { externalStyles } from '../../styles/externalStyles';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { signUp, isAuthActionLoading, authError, clearAuthError } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  // [PERUBAHAN - KRITERIA 2 & 5]: Custom async handler untuk proses Sign Up Supabase
  const handleRegister = async () => {
    clearAuthError();
    setLocalError(null);

    if (fullName.trim().length < 3) {
      setLocalError('Nama lengkap minimal 3 karakter.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Masukkan alamat email yang valid.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Konfirmasi password tidak cocok.');
      return;
    }

    const result = await signUp(fullName, email, password);
    if (result.error) {
      Alert.alert('Registrasi Gagal', result.error);
      return;
    }

    if (result.needsEmailVerification) {
      Alert.alert(
        'Registrasi Berhasil',
        'Silakan cek kotak masuk email Anda untuk verifikasi akun, lalu masuk melalui halaman Login.',
        [{ text: 'Ke Halaman Login', onPress: () => router.replace('/login') }]
      );
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
        <View style={styles.headerBox}>
          <Text style={styles.title}>Buat Akun Baru</Text>
          <Text style={styles.subtitle}>
            Daftar akun operator atau pelanggan RentalPs untuk mengakses layanan rental.
          </Text>
        </View>

        <View style={externalStyles.cardBase}>
          <Text style={externalStyles.inputLabel}>Nama Lengkap</Text>
          <TextInput
            style={externalStyles.inputField}
            placeholder="Contoh: Rian Pratama"
            placeholderTextColor="#64748B"
            editable={!isAuthActionLoading}
            value={fullName}
            onChangeText={setFullName}
          />

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

          <Text style={externalStyles.inputLabel}>Konfirmasi Password</Text>
          <TextInput
            style={externalStyles.inputField}
            placeholder="Ulangi password"
            placeholderTextColor="#64748B"
            secureTextEntry
            editable={!isAuthActionLoading}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {displayedError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {displayedError}</Text>
            </View>
          )}

          {/* [PERUBAHAN - KRITERIA 5]: Tombol Sign Up dengan Loading State Indicator */}
          <TouchableOpacity
            onPress={handleRegister}
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
                <Text style={externalStyles.primaryButtonText}>Mendaftarkan Akun...</Text>
              </View>
            ) : (
              <Text style={externalStyles.primaryButtonText}>Daftar (Sign Up) ➔</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isAuthActionLoading}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>Sudah punya akun? Kembali ke Masuk</Text>
          </TouchableOpacity>
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
  headerBox: {
    marginBottom: 20,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 6,
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
  backBtn: {
    alignItems: 'center',
    marginTop: 16,
  },
  backText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
});
