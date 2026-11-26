// ============================================================================
// HALAMAN PEMANTAUAN SESI AKTIF & LIVE COUNTDOWN TIMER (TERPROTEKSI AUTH)
// [PERUBAHAN - KRITERIA 7]: Dipindahkan ke grup (app) di bawah Route Protection Guard
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useRental } from '../../context/RentalContext';
import { ActiveSession } from '../../types/rental.types';
import { externalStyles } from '../../styles/externalStyles';
import { formatRupiah, formatSecondsToTime } from '../../utils/rentalFunctions';

export default function ActiveSessionsScreen() {
  const { activeSessions, finishSession, extendSession } = useRental();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [searchRenter, setSearchRenter] = useState<string>('');

  const warningMessage = useMemo(() => {
    const criticalSessions = activeSessions.filter(
      (s) => s.status !== 'COMPLETED' && s.remainingSeconds > 0 && s.remainingSeconds <= 300
    );

    if (criticalSessions.length > 0) {
      return `Perhatian: ${criticalSessions.length} sesi bermain tersisa kurang dari 5 menit!`;
    }
    return null;
  }, [activeSessions]);

  const filteredSessions = useMemo(() => {
    return activeSessions.filter((session) => {
      const matchFilter =
        filterStatus === 'ALL' ||
        (filterStatus === 'ACTIVE' && session.status !== 'COMPLETED') ||
        (filterStatus === 'COMPLETED' && session.status === 'COMPLETED');

      const matchSearch =
        session.customerName.toLowerCase().includes(searchRenter.toLowerCase()) ||
        session.unitName.toLowerCase().includes(searchRenter.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [activeSessions, filterStatus, searchRenter]);

  const handleExtend = (sessionId: string, minutes: number) => {
    extendSession(sessionId, minutes);
    Alert.alert(
      'Waktu Ditambahkan!',
      `Sesi bermain berhasil diperpanjang sebanyak +${minutes} menit.`
    );
  };

  const handleFinish = (session: ActiveSession) => {
    Alert.alert(
      'Selesaikan Sesi Main?',
      `Konfirmasi pengembalian konsol ${session.unitName} oleh ${session.customerName}? Unit akan langsung berstatus 'Tersedia'.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Selesaikan',
          style: 'destructive',
          onPress: () => finishSession(session.sessionId),
        },
      ]
    );
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={externalStyles.mainContainer}>
      <View style={styles.topControlContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari penyewa atau unit..."
          placeholderTextColor="#64748B"
          value={searchRenter}
          onChangeText={setSearchRenter}
        />

        <View style={styles.filterTabsRow}>
          {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((status) => {
            const isSelected = filterStatus === status;
            const label =
              status === 'ALL'
                ? `Semua (${activeSessions.length})`
                : status === 'ACTIVE'
                ? `Sedang Main (${activeSessions.filter((s) => s.status !== 'COMPLETED').length})`
                : `Selesai (${activeSessions.filter((s) => s.status === 'COMPLETED').length})`;

            return (
              <TouchableOpacity
                key={status}
                onPress={() => setFilterStatus(status)}
                style={[styles.filterTab, isSelected && styles.filterTabActive]}
              >
                <Text style={[styles.filterTabText, isSelected && styles.filterTabTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {warningMessage && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>⚠️ {warningMessage}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.sessionId}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => {
          const isCompleted = item.status === 'COMPLETED';
          const isWarning = item.status === 'WARNING';

          return (
            <View
              style={[
                styles.sessionCard,
                isWarning && styles.sessionCardWarning,
                isCompleted && styles.sessionCardCompleted,
              ]}
            >
              <View style={externalStyles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionUnitName}>{item.unitName}</Text>
                  <Text style={styles.sessionCustomer}>
                    Penyewa:{' '}
                    <Text style={{ color: '#F8FAFC', fontWeight: '700' }}>
                      {item.customerName}
                    </Text>
                  </Text>
                  <Text style={styles.sessionMeta}>
                    Mulai: {item.startTime} • Total: {formatRupiah(item.totalPaid)}
                  </Text>
                </View>

                <View style={styles.timerBox}>
                  <Text style={styles.timerLabel}>
                    {isCompleted ? 'SESI BERAKHIR' : 'SISA WAKTU'}
                  </Text>
                  <Text
                    style={[
                      styles.timerDigits,
                      isWarning && styles.timerDigitsWarning,
                      isCompleted && styles.timerDigitsCompleted,
                    ]}
                  >
                    {isCompleted ? '00:00' : formatSecondsToTime(item.remainingSeconds)}
                  </Text>
                </View>
              </View>

              {!isCompleted && (
                <View style={styles.sessionActionRow}>
                  <Text style={styles.extendLabel}>Perpanjang:</Text>
                  <TouchableOpacity
                    onPress={() => handleExtend(item.sessionId, 30)}
                    style={styles.extendBtn}
                  >
                    <Text style={styles.extendBtnText}>+30 Mnt</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleExtend(item.sessionId, 60)}
                    style={styles.extendBtn}
                  >
                    <Text style={styles.extendBtnText}>+1 Jam</Text>
                  </TouchableOpacity>

                  <View style={{ flex: 1 }} />

                  <TouchableOpacity onPress={() => handleFinish(item)} style={styles.finishBtn}>
                    <Text style={styles.finishBtnText}>Selesaikan</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 36 }}>⏱️</Text>
            <Text style={styles.emptyTitle}>Tidak Ada Sesi Bermain</Text>
            <Text style={styles.emptySub}>
              Belum ada data sesi untuk kategori filter yang dipilih.
            </Text>
          </View>
        }
      />

      <View style={styles.footerBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅ Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topControlContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#0F172A',
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: '#F8FAFC',
    fontSize: 13,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  filterTab: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  warningBanner: {
    backgroundColor: '#78350F44',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  warningText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '700',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 80,
  },
  sessionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sessionCardWarning: {
    borderColor: '#F59E0B',
    backgroundColor: '#2A2315',
  },
  sessionCardCompleted: {
    opacity: 0.65,
    backgroundColor: '#151D2C',
  },
  sessionUnitName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sessionCustomer: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 3,
  },
  sessionMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  timerBox: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 100,
  },
  timerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  timerDigits: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38BDF8',
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  timerDigitsWarning: {
    color: '#F59E0B',
  },
  timerDigitsCompleted: {
    color: '#64748B',
  },
  sessionActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  extendLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  extendBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  extendBtnText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '700',
  },
  finishBtn: {
    backgroundColor: '#7F1D1D44',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  finishBtnText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  backButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 13,
  },
});
