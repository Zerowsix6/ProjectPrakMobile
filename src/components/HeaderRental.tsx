// ============================================================================
// KOMPONEN: HEADER RENTAL PS
// Header navigasi bersih tanpa label materi (Clean Production UI)
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { externalStyles } from '../styles/externalStyles';
import { SHOP_NAME } from '../data/rentalData';
import { useRental } from '../context/RentalContext';

interface HeaderRentalProps {
  currentRoute?: 'home' | 'active-sessions';
}

export const HeaderRental: React.FC<HeaderRentalProps> = ({ currentRoute = 'home' }) => {
  const { availableCount, totalCount, activeSessions } = useRental();

  // Hitung sesi aktif yang masih berjalan (remainingSeconds > 0)
  const runningSessionsCount = activeSessions.filter((s) => s.status !== 'COMPLETED').length;

  return (
    <View style={styles.headerWrapper}>
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
            Siap Main: <Text style={{ color: '#10B981', fontWeight: '700' }}>{availableCount}</Text> dari {totalCount} Unit
          </Text>
        </View>

        {/* Live Active Sessions Indicator Button (Menerapkan router.push) */}
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

      {/* Navigasi Cepat Antar Halaman (Katalog Unit & Sesi Aktif) */}
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
            🎮 Katalog Unit
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
            ⏱️ Sesi Aktif & Timer ({runningSessionsCount})
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
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
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
    gap: 8,
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
    fontSize: 12,
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
