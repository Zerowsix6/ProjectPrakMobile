// ============================================================================
// HALAMAN RINCIAN UNIT & FORMULIR SEWA
// Menerapkan:
// 1. useLocalSearchParams() untuk mengambil parameter rute dinamis [id]
// 2. Hook useState() untuk form state
// 3. Hook useEffect() untuk auto-kalkulasi biaya & validasi form
// 4. router.back() untuk kembali ke halaman sebelumnya
// 5. router.replace() untuk beralih ke halaman sukses tanpa menumpuk riwayat formulir
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useRental } from '../../context/RentalContext';
import { ACCESSORIES_DATA } from '../../data/rentalData';
import { PaymentMethod, BookingResult, AccessoryItem } from '../../types/rental.types';
import { externalStyles } from '../../styles/externalStyles';
import { StatusBadge } from '../../components/StatusBadge';
import {
  formatRupiah,
  hitungTotalBiayaRental,
  hitungDiskonPersen,
  generateKodeBooking,
} from '../../utils/rentalFunctions';

export default function UnitDetailScreen() {
  // [EXPO ROUTER HOOK]: Mengambil parameter URL dinamis '[id]'
  const { id } = useLocalSearchParams<{ id: string }>();

  const { getUnitById, addNewBooking } = useRental();
  const unit = getUnitById(id as string);

  // [STATE] 1: Form state untuk input pengguna
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [durationHours, setDurationHours] = useState<number>(2); // Default 2 jam
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [notes, setNotes] = useState<string>('');

  // [STATE] 2: State hasil kalkulasi biaya
  const [calculation, setCalculation] = useState({
    subtotal: 0,
    diskonNominal: 0,
    grandTotal: 0,
  });

  // [STATE] 3: State validasi formulir
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  // [HOOK useEffect] 1: Auto-recalculate biaya setiap kali durasi / aksesori berubah
  // Berjalan secara reaktif saat 'durationHours', 'selectedAccessories', atau 'unit' berubah
  useEffect(() => {
    if (!unit) return;

    // Hitung total harga aksesori tambahan
    const accessorySum = selectedAccessories.reduce((acc: number, accId: string) => {
      const item = ACCESSORIES_DATA.find((a: AccessoryItem) => a.id === accId);
      return acc + (item ? item.extraPrice : 0);
    }, 0);

    // Hitung total dengan diskon
    const result = hitungTotalBiayaRental(unit.hourlyRate, durationHours, accessorySum);
    setCalculation(result);
  }, [durationHours, selectedAccessories, unit]);

  // [HOOK useEffect] 2: Validasi Formulir secara Realtime
  // Berjalan secara reaktif saat 'customerName' atau 'durationHours' berubah
  useEffect(() => {
    if (customerName.trim().length === 0) {
      setValidationError('Nama pemesan wajib diisi.');
      setIsValid(false);
    } else if (customerName.trim().length < 3) {
      setValidationError('Nama pemesan minimal 3 karakter.');
      setIsValid(false);
    } else if (durationHours < 1 || durationHours > 12) {
      setValidationError('Durasi sewa antara 1 sampai 12 jam.');
      setIsValid(false);
    } else {
      setValidationError(null);
      setIsValid(true);
    }
  }, [customerName, durationHours]);

  // Handler toggle aksesori
  const handleToggleAccessory = (accId: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(accId) ? prev.filter((id) => id !== accId) : [...prev, accId]
    );
  };

  // Handler konfirmasi sewa
  const handleConfirmRental = () => {
    if (!isValid || !unit) {
      Alert.alert('Periksa Formulir', validationError || 'Lengkapi semua isian!');
      return;
    }

    // Buat objek hasil transaksi
    const bookingResult: BookingResult = {
      bookingId: generateKodeBooking(),
      unitId: unit.id,
      unitName: unit.name,
      customerName: customerName.trim(),
      durationHours,
      hourlyRate: unit.hourlyRate,
      subtotal: calculation.subtotal,
      accessoryTotal: calculation.subtotal - unit.hourlyRate * durationHours,
      discount: calculation.diskonNominal,
      grandTotal: calculation.grandTotal,
      paymentMethod,
      timestamp: new Date().toLocaleString('id-ID'),
    };

    // Simpan ke context global
    addNewBooking(bookingResult);

    // [NAVIGASI router.replace]:
    // Mengganti (replace) halaman ke bukti sukses agar pengguna tidak bisa menekan tombol kembali ke form sewa yang sudah diproses
    router.replace({
      pathname: '/booking/success',
      params: {
        bookingId: bookingResult.bookingId,
        unitName: bookingResult.unitName,
        customerName: bookingResult.customerName,
        durationHours: bookingResult.durationHours.toString(),
        grandTotal: bookingResult.grandTotal.toString(),
        paymentMethod: bookingResult.paymentMethod,
        timestamp: bookingResult.timestamp,
      },
    });
  };

  if (!unit) {
    return (
      <View style={[externalStyles.mainContainer, styles.center]}>
        <Text style={{ fontSize: 40 }}>❓</Text>
        <Text style={styles.notFoundTitle}>Unit Tidak Ditemukan</Text>
        <TouchableOpacity
          // [NAVIGASI router.back]: Kembali ke halaman beranda jika data tidak ada
          onPress={() => router.back()}
          style={[externalStyles.primaryButton, { marginTop: 16 }]}
        >
          <Text style={externalStyles.primaryButtonText}>Kembali ke Katalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const diskonPersen = hitungDiskonPersen(durationHours);

  return (
    <View style={externalStyles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Unit Info Card Header */}
        <View style={externalStyles.cardBase}>
          <View style={externalStyles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.unitName}>{unit.name}</Text>
              <Text style={styles.unitMeta}>
                📺 Layar: {unit.tvSize} • 🎮 {unit.controllerCount} Stik Bawaan
              </Text>
            </View>
            <StatusBadge status={unit.status} />
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.rateHighlight}>{formatRupiah(unit.hourlyRate)}</Text>
            <Text style={styles.rateSub}> / jam</Text>
          </View>

          <View style={styles.gamesBox}>
            <Text style={styles.gamesLabel}>Game Tersedia di Unit Ini:</Text>
            <View style={styles.gameTags}>
              {unit.popularGames.map((game: string, i: number) => (
                <View key={i} style={styles.gameTag}>
                  <Text style={styles.gameTagText}>🎮 {game}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Form Pemesanan */}
        <View style={styles.formSection}>
          <Text style={externalStyles.sectionTitle}>Formulir Penyewaan</Text>

          {/* Input Nama Pelanggan */}
          <View style={styles.fieldGroup}>
            <Text style={externalStyles.inputLabel}>
              Nama Lengkap Pelanggan <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <TextInput
              style={externalStyles.inputField}
              placeholder="Masukkan nama Anda..."
              placeholderTextColor="#64748B"
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          {/* Input Kontak / HP */}
          <View style={styles.fieldGroup}>
            <Text style={externalStyles.inputLabel}>Nomor WhatsApp / HP (Opsional)</Text>
            <TextInput
              style={externalStyles.inputField}
              placeholder="08123456789"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              value={customerPhone}
              onChangeText={setCustomerPhone}
            />
          </View>

          {/* Durasi Jam Sewa */}
          <View style={styles.fieldGroup}>
            <View style={externalStyles.rowBetween}>
              <Text style={externalStyles.inputLabel}>Durasi Sewa (Jam)</Text>
              {diskonPersen > 0 && (
                <Text style={styles.discountBadge}>🎉 Diskon Promo {diskonPersen}% Aktif</Text>
              )}
            </View>

            <View style={styles.durationSelector}>
              <TouchableOpacity
                onPress={() => setDurationHours((prev) => Math.max(1, prev - 1))}
                style={styles.durationBtn}
              >
                <Text style={styles.durationBtnText}>−</Text>
              </TouchableOpacity>

              <View style={styles.durationDisplay}>
                <Text style={styles.durationNumber}>{durationHours}</Text>
                <Text style={styles.durationUnit}>Jam Main</Text>
              </View>

              <TouchableOpacity
                onPress={() => setDurationHours((prev) => Math.min(12, prev + 1))}
                style={styles.durationBtn}
              >
                <Text style={styles.durationBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Preset Buttons */}
            <View style={styles.presetRow}>
              {[1, 2, 3, 5, 8].map((h) => (
                <TouchableOpacity
                  key={h}
                  onPress={() => setDurationHours(h)}
                  style={[
                    styles.presetBtn,
                    durationHours === h && styles.presetBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      durationHours === h && styles.presetTextActive,
                    ]}
                  >
                    {h} Jam
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Aksesori Tambahan */}
          <View style={styles.fieldGroup}>
            <Text style={externalStyles.inputLabel}>Tambahan Aksesori & Snack (Opsional)</Text>
            {ACCESSORIES_DATA.map((acc: AccessoryItem) => {
              const isChecked = selectedAccessories.includes(acc.id);
              return (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => handleToggleAccessory(acc.id)}
                  style={[
                    styles.accessoryItem,
                    isChecked && styles.accessoryItemActive,
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                      {isChecked && <Text style={{ color: '#FFFFFF', fontSize: 11 }}>✓</Text>}
                    </View>
                    <Text style={styles.accessoryName}>{acc.name}</Text>
                  </View>
                  <Text style={styles.accessoryPrice}>+{formatRupiah(acc.extraPrice)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Metode Pembayaran */}
          <View style={styles.fieldGroup}>
            <Text style={externalStyles.inputLabel}>Metode Pembayaran</Text>
            <View style={styles.paymentRow}>
              {(['QRIS', 'Cash', 'Transfer Bank'] as PaymentMethod[]).map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    style={[
                      styles.paymentPill,
                      isSelected && styles.paymentPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.paymentText,
                        isSelected && styles.paymentTextActive,
                      ]}
                    >
                      {method === 'QRIS' ? '📱 QRIS' : method === 'Cash' ? '💵 Tunai' : '🏦 Transfer'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Catatan Tambahan */}
          <View style={styles.fieldGroup}>
            <Text style={externalStyles.inputLabel}>Catatan Khusus (Opsional)</Text>
            <TextInput
              style={externalStyles.inputField}
              placeholder="Contoh: Tolong siapkan stik biru..."
              placeholderTextColor="#64748B"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        {/* Ringkasan Biaya Realtime (Dihitung oleh useEffect) */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>⚡ Rincian Biaya Sewa</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Sewa {unit.name} ({durationHours} Jam)
            </Text>
            <Text style={styles.summaryValue}>
              {formatRupiah(unit.hourlyRate * durationHours)}
            </Text>
          </View>

          {calculation.subtotal - unit.hourlyRate * durationHours > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Aksesori & Snack</Text>
              <Text style={styles.summaryValue}>
                +{formatRupiah(calculation.subtotal - unit.hourlyRate * durationHours)}
              </Text>
            </View>
          )}

          {calculation.diskonNominal > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#10B981' }]}>
                Diskon Durasi ({diskonPersen}%)
              </Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                −{formatRupiah(calculation.diskonNominal)}
              </Text>
            </View>
          )}

          <View style={externalStyles.divider} />

          <View style={externalStyles.rowBetween}>
            <Text style={styles.grandTotalLabel}>Total Pembayaran:</Text>
            <Text style={styles.grandTotalValue}>
              {formatRupiah(calculation.grandTotal)}
            </Text>
          </View>

          {validationError && (
            <Text style={styles.errorText}>⚠️ {validationError}</Text>
          )}
        </View>

        {/* Tombol Aksi: router.back() dan Konfirmasi */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            // [NAVIGASI router.back]: Kembali ke halaman sebelumnya
            onPress={() => router.back()}
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!isValid}
            onPress={handleConfirmRental}
            style={[
              externalStyles.primaryButton,
              styles.confirmBtn,
              !isValid && externalStyles.disabledButton,
            ]}
          >
            <Text style={externalStyles.primaryButtonText}>
              Bayar & Mulai Main ({formatRupiah(calculation.grandTotal)}) ➔
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  unitName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  unitMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
  },
  rateHighlight: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38BDF8',
  },
  rateSub: {
    color: '#64748B',
    fontSize: 13,
  },
  gamesBox: {
    marginTop: 12,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
  },
  gamesLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  gameTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gameTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gameTagText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  formSection: {
    marginTop: 8,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  discountBadge: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 6,
  },
  durationBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBtnText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  durationDisplay: {
    alignItems: 'center',
  },
  durationNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  durationUnit: {
    fontSize: 11,
    color: '#94A3B8',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  presetText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  accessoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  accessoryItemActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A8A33',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  accessoryName: {
    color: '#F8FAFC',
    fontSize: 13,
  },
  accessoryPrice: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentPill: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  paymentPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  paymentText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  summaryValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    backgroundColor: '#334155',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#CBD5E1',
    fontWeight: '700',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
  },
});
