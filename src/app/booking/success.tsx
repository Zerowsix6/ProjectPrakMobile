// ============================================================================
// HALAMAN BUKTI PEMBAYARAN & KONFIRMASI SUKSES
// Menerapkan:
// 1. useLocalSearchParams() untuk membaca rincian transaksi dari URL
// 2. Hook useState() untuk hitung mundur auto-redirect
// 3. Hook useEffect() dengan timer interval & cleanup untuk auto-navigasi
// 4. router.replace() untuk kembali ke beranda dengan riwayat bersih
// 5. router.push() untuk langsung menuju monitor sesi bermain aktif
// ============================================================================

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { externalStyles } from '../../styles/externalStyles';
import { formatRupiah } from '../../utils/rentalFunctions';

export default function BookingSuccessScreen() {
  // [EXPO ROUTER HOOK]: Mengambil parameter transaksi dari rute sebelumnya
  const params = useLocalSearchParams<{
    bookingId: string;
    unitName: string;
    customerName: string;
    durationHours: string;
    grandTotal: string;
    paymentMethod: string;
    timestamp: string;
  }>();

  // [STATE]: State hitung mundur detik untuk auto-redirect ke katalog
  const [countdown, setCountdown] = useState<number>(10);

  // [HOOK useEffect]: Timer interval untuk auto-redirect dengan fungsi Cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // [NAVIGASI router.replace]: Kembali ke halaman beranda saat timer habis
          router.replace('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // CLEANUP FUNCTION: Menghapus timer jika pengguna berpindah halaman secara manual
    return () => {
      clearInterval(timer);
    };
  }, []);

  const totalNominal = Number(params.grandTotal) || 0;

  return (
    <View style={[externalStyles.mainContainer, styles.container]}>
      {/* Icon Sukses & Pesan Utama */}
      <View style={styles.successIconCircle}>
        <Text style={{ fontSize: 44 }}>🎮</Text>
      </View>

      <Text style={styles.successTitle}>Sewa Berhasil Dikonfirmasi!</Text>
      <Text style={styles.successSubtitle}>
        Unit PlayStation telah disiapkan dan timer sesi bermain kini aktif.
      </Text>

      {/* Kartu Bukti Transaksi */}
      <View style={styles.receiptCard}>
        <View style={externalStyles.rowBetween}>
          <Text style={styles.receiptHeader}>STRUK BUKTI SEWA</Text>
          <View style={styles.paidBadge}>
            <Text style={styles.paidBadgeText}>LUNAS ({params.paymentMethod || 'QRIS'})</Text>
          </View>
        </View>

        <View style={externalStyles.divider} />

        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>ID Transaksi</Text>
          <Text style={styles.receiptValueHighlight}>{params.bookingId || 'TRX-0001'}</Text>
        </View>

        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Unit PlayStation</Text>
          <Text style={styles.receiptValue}>{params.unitName || 'PlayStation 5'}</Text>
        </View>

        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Nama Pelanggan</Text>
          <Text style={styles.receiptValue}>{params.customerName || 'Pelanggan'}</Text>
        </View>

        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Durasi Main</Text>
          <Text style={styles.receiptValue}>{params.durationHours || '1'} Jam</Text>
        </View>

        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Waktu Transaksi</Text>
          <Text style={styles.receiptValue}>{params.timestamp || 'Hari Ini'}</Text>
        </View>

        <View style={externalStyles.divider} />

        <View style={externalStyles.rowBetween}>
          <Text style={styles.receiptTotalLabel}>Total Dibayar:</Text>
          <Text style={styles.receiptTotalValue}>{formatRupiah(totalNominal)}</Text>
        </View>
      </View>

      {/* Indikator Hitung Mundur Auto-Redirect */}
      <Text style={styles.countdownNotice}>
        ⏱️ Otomatis kembali ke katalog dalam{' '}
        <Text style={{ fontWeight: '800', color: '#38BDF8' }}>{countdown} detik</Text>
      </Text>

      {/* Tombol Aksi Navigasi */}
      <View style={styles.buttonGroup}>
        {/* [NAVIGASI router.push]: Menuju ke halaman monitor sesi aktif */}
        <TouchableOpacity
          onPress={() => router.push('/active-sessions')}
          style={[externalStyles.primaryButton, styles.monitorBtn]}
        >
          <Text style={externalStyles.primaryButtonText}>
            ⏱️ Buka Monitor Sesi Bermain ➔
          </Text>
        </TouchableOpacity>

        {/* [NAVIGASI router.replace]: Kembali langsung ke katalog utama */}
        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={styles.homeBtn}
        >
          <Text style={styles.homeBtnText}>Kembali ke Beranda Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#1E3A8A44',
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  receiptHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  paidBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#10B981',
  },
  paidBadgeText: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '800',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  receiptValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  receiptValueHighlight: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800',
  },
  receiptTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  receiptTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
  },
  countdownNotice: {
    color: '#64748B',
    fontSize: 12,
    marginVertical: 16,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  monitorBtn: {
    width: '100%',
    paddingVertical: 14,
  },
  homeBtn: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#CBD5E1',
    fontWeight: '600',
    fontSize: 13,
  },
});
