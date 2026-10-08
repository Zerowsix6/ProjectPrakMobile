// ============================================================================
// MATERI 2: KOMPONEN
// MATERI 3.1: INTERNAL STYLING
// MATERI 5.4.C: PRIMITIVE LOOP (Menampilkan hasil kalkulasi For-Of Loop)
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RentalUnit } from '../types/rental.types';
import { hitungStatistikDenganForOfLoop, formatRupiah } from '../utils/rentalFunctions';

interface QuickStatsProps {
  units: RentalUnit[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ units }) => {
  // [5.4.C] Memanggil kalkulasi yang menggunakan PRIMITIVE FOR-OF LOOP
  const stats = hitungStatistikDenganForOfLoop(units);

  return (
    <View style={styles.statsCard}>
      <View style={styles.headerRow}>
        <Text style={styles.statsTitle}>📊 STATUS RENTAL REALTIME</Text>
        <Text style={styles.statSub}>[5.4.C Primitive Loop Summary]</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumberGreen}>{stats.tersedia}</Text>
          <Text style={styles.statLabel}>Tersedia</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumberAmber}>{stats.dimainkan}</Text>
          <Text style={styles.statLabel}>Dimainkan</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumberRed}>{stats.maintenance}</Text>
          <Text style={styles.statLabel}>Perbaikan</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumberBlue}>{stats.totalUnit}</Text>
          <Text style={styles.statLabel}>Total Unit</Text>
        </View>
      </View>

      <View style={styles.incomeBadge}>
        <Text style={styles.incomeText}>
          ⚡ Potensi Tarif Maksimal:{' '}
          <Text style={{ fontWeight: '800', color: '#38BDF8' }}>
            {formatRupiah(stats.potensiPendapatanPerJam)} / jam
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  statSub: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumberGreen: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  statNumberAmber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F59E0B',
  },
  statNumberRed: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EF4444',
  },
  statNumberBlue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  incomeBadge: {
    marginTop: 10,
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  incomeText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
});
