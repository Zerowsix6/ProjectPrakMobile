// ============================================================================
// MATERI 2: KOMPONEN
// MATERI 3.1: INTERNAL STYLING
// MATERI 3.2: EXTERNAL STYLING
// MATERI 3.3: INLINE STYLING
// MATERI 5.2: CONDITIONS (if-else, ternary, short-circuit &&)
// MATERI 5.3.A: FUNCTION BAWAAN
// MATERI 5.3.C: CALLBACK FUNCTION (BONUS)
// MATERI 5.4.A: MAP() LOOP
// ============================================================================

// [1.1] STRUKTUR IMPORT
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RentalUnit } from '../types/rental.types';
import { StatusBadge } from './StatusBadge';
import { externalStyles } from '../styles/externalStyles';
import { formatRupiah } from '../utils/rentalFunctions';

interface RentalCardProps {
  item: RentalUnit;
  // [5.3.C] Callback Function: Fungsi dikirimkan dari komponen parent (RentalHomeScreen)
  onRent: (unit: RentalUnit) => void;
  onDetail?: (unit: RentalUnit) => void;
}

/**
 * [2. KOMPONEN] RentalCard Component
 * Menampilkan rincian unit PlayStation dan tombol aksi pemesanan.
 */
export const RentalCard: React.FC<RentalCardProps> = ({ item, onRent, onDetail }) => {
  // [5.2] CONDITIONS: boolean flag
  const isAvailable = item.status === 'Tersedia';
  const isPlaying = item.status === 'Sedang Dimainkan';

  // [1.2] RETURN KOMPONEN REACT
  return (
    <View
      // [3.2] EXTERNAL STYLING dipadukan dengan [3.3] INLINE STYLING dinamis
      style={[
        externalStyles.cardBase,
        // [3.3] INLINE STYLING: Memberikan style langsung berdasarkan kondisi data
        {
          borderColor: item.isVip ? '#F59E0B' : '#334155', // [5.2] Ternary condition
          backgroundColor: item.isVip ? '#1A2238' : '#1E293B',
          shadowColor: item.isVip ? '#F59E0B' : '#000000',
        },
      ]}
    >
      {/* Top Header: Nama & Badge */}
      <View style={externalStyles.rowBetween}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.unitName}>{item.name}</Text>
            {/* [5.2] CONDITIONS: Logical AND (&&) Short-Circuit Rendering */}
            {item.isVip && (
              <View
                // [3.3] INLINE STYLING
                style={{
                  backgroundColor: '#78350F',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  borderWidth: 0.5,
                  borderColor: '#F59E0B',
                }}
              >
                <Text style={{ color: '#FDE68A', fontSize: 10, fontWeight: '800' }}>
                  ★ VIP ROOM
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.consoleSpec}>
            📺 Layar: {item.tvSize} • 🎮 {item.controllerCount} Stick Controller
          </Text>
        </View>

        {/* [2. KOMPONEN] Memanggil Komponen StatusBadge */}
        <StatusBadge status={item.status} />
      </View>

      {/* Rincian Game Populer: [5.4.A] MAP() LOOP */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.gameSectionLabel}>Pilihan Game Terinstall:</Text>
        <View style={styles.gameTagsContainer}>
          {/* [5.4.A] MAP() LOOP: Mengubah array string menjadi daftar elemen visual */}
          {item.popularGames.map((game, index) => (
            <View key={index} style={styles.gameChip}>
              <Text style={styles.gameChipText}>🎮 {game}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* [5.2] CONDITIONS: Informasi Penyewa jika sedang dimainkan */}
      {isPlaying && (
        <View style={styles.activePlayNotice}>
          <Text style={styles.activePlayText}>
            ⏱️ Dimainkan oleh: <Text style={{ fontWeight: '700' }}>{item.currentRenterName || 'Pengguna'}</Text>
            {item.activeDurationLeftMinutes !== undefined &&
              ` (Sisa: ${item.activeDurationLeftMinutes} Menit)`}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View style={externalStyles.divider} />

      {/* Footer: Harga per Jam & Tombol Action */}
      <View style={externalStyles.rowBetween}>
        <View>
          <Text style={styles.priceLabel}>Tarif Sewa:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            {/* [5.3.A] FUNCTION BAWAAN (formatRupiah) */}
            <Text style={styles.priceValue}>{formatRupiah(item.hourlyRate)}</Text>
            <Text style={styles.priceUnit}> / jam</Text>
          </View>
        </View>

        {/* [5.3.C] CALLBACK FUNCTION: Action Button */}
        <TouchableOpacity
          disabled={!isAvailable}
          // [5.3.C] Menjalankan callback 'onRent' yang dilempar dari parent
          onPress={() => onRent(item)}
          style={[
            externalStyles.primaryButton,
            // [3.3] INLINE STYLING & [5.2] CONDITION
            {
              backgroundColor: isAvailable ? '#2563EB' : '#475569',
              paddingVertical: 9,
              paddingHorizontal: 16,
            },
          ]}
        >
          <Text style={externalStyles.primaryButtonText}>
            {/* [5.2] CONDITIONS (Ternary Operator) */}
            {isAvailable ? '⚡ Sewa Sekarang' : isPlaying ? '⏳ Masih Digunakan' : '🔧 Maintenance'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================================================
// [3.1] INTERNAL STYLING:
// ============================================================================
const styles = StyleSheet.create({
  unitName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  consoleSpec: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  gameSectionLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  gameTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  gameChip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gameChipText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  activePlayNotice: {
    backgroundColor: '#451A03',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  activePlayText: {
    color: '#FDE68A',
    fontSize: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#38BDF8',
  },
  priceUnit: {
    fontSize: 12,
    color: '#64748B',
  },
});
