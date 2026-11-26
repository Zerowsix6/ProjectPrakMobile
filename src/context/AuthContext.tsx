// ============================================================================
// GLOBAL AUTH CONTEXT & REAL-TIME SESSION SUBSCRIPTION
// [PERUBAHAN - KRITERIA 6]: Global AuthContext & Real-time Session Subscription
// [PERUBAHAN - KRITERIA 5]: Supabase Auth Flow (Sign Up, Sign In, Sign Out, Loading States)
// [PERUBAHAN - KRITERIA 2 & 3]: Custom/Pre-built Async Function & .then()
// ============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLastAuthEmail, saveLastAuthEmail } from '../lib/secureStorage';

export interface AuthActionResult {
  error: string | null;
}

export interface SignUpResult extends AuthActionResult {
  needsEmailVerification: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthActionLoading: boolean;
  isConfigured: boolean;
  authError: string | null;
  lastEmail: string | null;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (fullName: string, email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<AuthActionResult>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  // [PERUBAHAN - KRITERIA 5]: Loading states untuk inisialisasi sesi & aksi autentikasi
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [isAuthActionLoading, setIsAuthActionLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // [PERUBAHAN - KRITERIA 3 & 4]: Membaca email tersimpan di SecureStore menggunakan .then()
    getLastAuthEmail().then((storedEmail) => {
      if (isMounted && storedEmail) {
        setLastEmail(storedEmail);
      }
    });

    if (!isSupabaseConfigured) {
      return () => {
        isMounted = false;
      };
    }

    // [PERUBAHAN - KRITERIA 3 & 6]: Mengambil sesi awal dari SecureStore via Supabase dengan .then()
    supabase.auth
      .getSession()
      .then(({ data: { session: activeSession }, error }) => {
        if (!isMounted) return;
        if (error) {
          setAuthError(error.message);
        }
        setSession(activeSession);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setAuthError(err instanceof Error ? err.message : 'Gagal memuat sesi awal.');
        setIsLoading(false);
      });

    // [PERUBAHAN - KRITERIA 6]: Real-time Session Subscription menggunakan onAuthStateChange
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    // Cleanup subscription saat provider unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // [PERUBAHAN - KRITERIA 2 & 5]: Custom Async Function untuk Sign In Supabase + Loading State
  const signIn = async (email: string, password: string): Promise<AuthActionResult> => {
    if (!isSupabaseConfigured) {
      const msg =
        'Supabase belum dikonfigurasi. Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env.';
      setAuthError(msg);
      return { error: msg };
    }

    setAuthError(null);
    setIsAuthActionLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      // [PERUBAHAN - KRITERIA 2 & 5]: Pre-built async function supabase.auth.signInWithPassword
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setAuthError(error.message);
        return { error: error.message };
      }

      await saveLastAuthEmail(cleanEmail);
      setLastEmail(cleanEmail);
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat masuk.';
      setAuthError(message);
      return { error: message };
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // [PERUBAHAN - KRITERIA 2 & 5]: Custom Async Function untuk Sign Up Supabase + Loading State
  const signUp = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<SignUpResult> => {
    if (!isSupabaseConfigured) {
      const msg =
        'Supabase belum dikonfigurasi. Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env.';
      setAuthError(msg);
      return { error: msg, needsEmailVerification: false };
    }

    setAuthError(null);
    setIsAuthActionLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      // [PERUBAHAN - KRITERIA 2 & 5]: Pre-built async function supabase.auth.signUp
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return { error: error.message, needsEmailVerification: false };
      }

      await saveLastAuthEmail(cleanEmail);
      setLastEmail(cleanEmail);

      // Jika konfirmasi email aktif di Supabase, session bernilai null sampai user verifikasi email
      const needsEmailVerification = !data.session;
      return { error: null, needsEmailVerification };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat mendaftar.';
      setAuthError(message);
      return { error: message, needsEmailVerification: false };
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // [PERUBAHAN - KRITERIA 2 & 5]: Custom Async Function untuk Sign Out Supabase + Loading State
  const signOut = async (): Promise<AuthActionResult> => {
    setAuthError(null);
    setIsAuthActionLoading(true);
    try {
      // [PERUBAHAN - KRITERIA 2 & 5]: Pre-built async function supabase.auth.signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthError(error.message);
        return { error: error.message };
      }
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal keluar dari akun.';
      setAuthError(message);
      return { error: message };
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        isAuthActionLoading,
        isConfigured: isSupabaseConfigured,
        authError,
        lastEmail,
        signIn,
        signUp,
        signOut,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
