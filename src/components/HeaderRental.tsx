// ============================================================================
// KOMPONEN: HEADER RENTAL PS
// [PERUBAHAN - KRITERIA 5 & 6]: Menampilkan info user dari AuthContext & tombol Sign Out + loading state
// [PERUBAHAN - KRITERIA 1]: Menambahkan tab navigasi ke layar katalog Game External API
// ============================================================================

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { externalStyles } from '../styles/externalStyles';
import { SHOP_NAME } from '../data/rentalData';
import { useRental } from '../context/RentalContext';
import { useAuth } from '../context/AuthContext';

interface HeaderRentalProps {
  currentRoute?: 'home' | 'active-sessions' | 'external-games';
}

export const HeaderRental: React.FC<HeaderRentalProps> = ({ currentRoute = 'home' }) => {
  const { availableCount, totalCount, activeSessions } = useRental();
  // [PERUBAHAN - KRITERIA 5 & 6]: Mengambil data user, signOut, dan loading state dari AuthContext
  const { user, signOut, isAuthActionLoading } = useAuth();

  // Hitung sesi aktif yang masih berjalan (remainingSeconds > 0)
  const runningSessionsCount = activeSessions.filter((s) => s.status !== 'COMPLETED').length;

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || 'Operator';

  // [PERUBAHAN - KRITERIA 5]: Handler Sign Out Supabase dengan konfirmasi & loading state
  const handleSignOut = () => {
    Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar dari sesi saat ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          const result = await signOut();
          if (result.error) {
            Alert.alert('Gagal Keluar', result.error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.headerWrapper}>
      {/* [PERUBAHAN - KRITERIA 5 & 6]: Bar Pengguna Login & Tombol Sign Out */}
      <View style={styles.authBar}>
        <Text style={styles.authUserText} numberOfLines={1}>
          👤 {displayName}
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          disabled={isAuthActionLoading}
          style={styles.signOutBtn}
        >
          {isAuthActionLoading ? (
            <ActivityIndicator size="small" color="#FCA5A5" />
          ) : (
            <Text style={styles.signOutText}>🚪 Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Brand & Store Status */}
      <View style={externalStyles.rowBetween}>
        <View style={{ flex: 1 }}>
          <View style={styles.badgeLabel}>
            <Text style={styles.badgeLabelText}>🎮 RENTAL PLAYSTATION</Text>
          </View>
          <Text style={styles.shopTitle} numberOfLines={1}>
            {SHOP_NAME}
          </Text>
          <Text style={styles.subtitle}>
            Siap Main:{' '}
            <Text style={{ color: '#10B981', fontWeight: '700' }}>{availableCount}</Text> dari{' '}
            {totalCount} Unit
          </Text>
        </View>

        {/* Live Active Sessions Indicator Button */}
        <TouchableOpacity
          onPress={() => {
            if (currentRoute !== 'active-sessions') {
              router.push('/active-sessions');
            }
          }}
          style={[
            styles.activeSessionsBtn,
            runningSessionsCount > 0 ? styles.activeSessionsBtnRunning : styles.activeSessionsBtnIdle,
          ]}
        >
          <Text style={styles.activeSessionsIcon}>⏱️</Text>
          <View>
            <Text style={styles.activeSessionsCount}>{runningSessionsCount} Sesi</Text>
            <Text style={styles.activeSessionsSub}>Bermain</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Navigasi Cepat Antar Halaman */}
      <View style={styles.navRow}>
        <TouchableOpacity
          onPress={() => {
            if (currentRoute !== 'home') {
              router.push('/');
            }
          }}
          style={[
            styles.navTab,
            currentRoute === 'home' ? styles.navTabActive : styles.navTabInactive,
          ]}
        >
          <Text
            style={[
              styles.navTabText,
              currentRoute === 'home' ? styles.navTabTextActive : styles.navTabTextInactive,
            ]}
          >
            🎮 Katalog
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentRoute !== 'active-sessions') {
              router.push('/active-sessions');
            }
          }}
          style={[
            styles.navTab,
            currentRoute === 'active-sessions' ? styles.navTabActive : styles.navTabInactive,
          ]}
        >
          <Text
            style={[
              styles.navTabText,
              currentRoute === 'active-sessions' ? styles.navTabTextActive : styles.navTabTextInactive,
            ]}
          >
            ⏱️ Sesi ({runningSessionsCount})
          </Text>
        </TouchableOpacity>

        {/* [PERUBAHAN - KRITERIA 1]: Tab Navigasi menuju halaman External API Game Catalog */}
        <TouchableOpacity
          onPress={() => {
            if (currentRoute !== 'external-games') {
              router.push('/external-games');
            }
          }}
          style={[
            styles.navTab,
            currentRoute === 'external-games' ? styles.navTabActive : styles.navTabInactive,
          ]}
        >
          <Text
            style={[
              styles.navTabText,
              currentRoute === 'external-games' ? styles.navTabTextActive : styles.navTabTextInactive,
            ]}
          >
            🌐 Game API
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  authBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  authUserText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  signOutBtn: {
    backgroundColor: '#7F1D1D55',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 74,
    alignItems: 'center',
  },
  signOutText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeLabel: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeLabelText: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  shopTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  activeSessionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  activeSessionsBtnRunning: {
    backgroundColor: '#1E3A8A44',
    borderColor: '#3B82F6',
  },
  activeSessionsBtnIdle: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  activeSessionsIcon: {
    fontSize: 18,
  },
  activeSessionsCount: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  activeSessionsSub: {
    color: '#94A3B8',
    fontSize: 10,
  },
  navRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  navTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  navTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  navTabInactive: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  navTabText: {
    fontSize: 11,
  },
  navTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  navTabTextInactive: {
    color: '#94A3B8',
    fontWeight: '500',
  },
});
