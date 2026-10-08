// ============================================================================
// MATERI 2: KOMPONEN
// MATERI 3.1: INTERNAL STYLING & 3.3: INLINE STYLING
// MATERI 5.1: VARIABLE (useState typed, const, let)
// MATERI 5.2: CONDITIONS (if-else validation, ternary)
// MATERI 5.3.A & B: FUNCTIONS (Built-in & Custom)
// MATERI 5.3.C: CALLBACK FUNCTION
// MATERI 5.4.A: MAP() LOOP (Aksesoris)
// MATERI 5.4.C: PRIMITIVE LOOP (Rincian per jam dengan for-loop)
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { RentalUnit, PaymentMethod, BookingResult } from '../types/rental.types';
import { ACCESSORIES_DATA } from '../data/rentalData';
import { externalStyles } from '../styles/externalStyles';
import {
  formatRupiah,
  formatNamaKapital,
  hitungTotalBiayaRental,
  generateKodeBooking,
  hitungRincianJamDenganPrimitiveLoop,
} from '../utils/rentalFunctions';

interface BookingModalProps {
  visible: boolean;
  unit: RentalUnit | null;
  // [5.3.C] Callback Functions dari parent
  onClose: () => void;
  onConfirmBooking: (result: BookingResult) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  unit,
  onClose,
  onConfirmBooking,
}) => {
  // [5.1] VARIABLE & REACT STATE DENGAN TYPE EXPLICIT
  const [customerName, setCustomerName] = useState<string>('');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [selectedAccIds, setSelectedAccIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [showHourlyBreakdown, setShowHourlyBreakdown] = useState<boolean>(false);

  // Jika unit belum dipilih, jangan render apa-apa
  if (!unit) return null;

  // [5.4.A] Hitung total harga aksesoris terpilih
  const totalAccPrice: number = ACCESSORIES_DATA
    .filter((acc) => selectedAccIds.includes(acc.id))
    .reduce((total, acc) => total + acc.extraPrice, 0);

  // [5.3.B] FUNCTION CUSTOM: Menghitung total biaya rental
  const { subtotal, diskonNominal, grandTotal } = hitungTotalBiayaRental(
    unit.hourlyRate,
    durationHours,
    totalAccPrice
  );

  // [5.4.C] PRIMITIVE LOOP: Rincian tarif jam-demi-jam menggunakan for loop klasik
  const { breakdown } = hitungRincianJamDenganPrimitiveLoop(durationHours, unit.hourlyRate);

  // Handler penambahan durasi jam
  const handleUbahJam = (delta: number) => {
    // [5.2] CONDITIONS
    const jamBaru = durationHours + delta;
    if (jamBaru >= 1 && jamBaru <= 12) {
      setDurationHours(jamBaru);
    }
  };

  // Handler toggle aksesoris
  const toggleAksesoris = (accId: string) => {
    if (selectedAccIds.includes(accId)) {
      setSelectedAccIds(selectedAccIds.filter((id) => id !== accId));
    } else {
      setSelectedAccIds([...selectedAccIds, accId]);
    }
  };

  // Handler submit transaksi
  const handleSimpanTransaksi = () => {
    // [5.2] CONDITIONS: Validasi Input
    if (!customerName.trim()) {
      Alert.alert('Perhatian', 'Silakan masukkan nama penyewa terlebih dahulu!');
      return;
    }

    // [5.3.A] FUNCTION BAWAAN: formatNamaKapital (trim & toUpperCase)
    const namaFormatted = formatNamaKapital(customerName);

    // [5.3.B] FUNCTION CUSTOM: generateKodeBooking
    const bookingResult: BookingResult = {
      bookingId: generateKodeBooking(),
      unitId: unit.id,
      unitName: unit.name,
      customerName: namaFormatted,
      durationHours: durationHours,
      hourlyRate: unit.hourlyRate,
      subtotal: subtotal,
      accessoryTotal: totalAccPrice,
      discount: diskonNominal,
      grandTotal: grandTotal,
      paymentMethod: paymentMethod,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    };

    // [5.3.C] CALLBACK FUNCTION: Mengirim hasil ke parent component
    onConfirmBooking(bookingResult);

    // Reset Form State
    setCustomerName('');
    setDurationHours(2);
    setSelectedAccIds([]);
  };

  // [1.2] RETURN KOMPONEN REACT
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header Modal */}
          <View style={externalStyles.rowBetween}>
            <View>
              <Text style={styles.modalTitle}>⚡ Form Sewa Rental PS</Text>
              <Text style={styles.modalSubtitle}>{unit.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={externalStyles.divider} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Input Nama Penyewa */}
            <Text style={externalStyles.inputLabel}>Nama Penyewa (Wajib):</Text>
            <TextInput
              style={externalStyles.inputField}
              placeholder="Contoh: Rian Gaming"
              placeholderTextColor="#64748B"
              value={customerName}
              onChangeText={setCustomerName}
            />

            {/* Stepper Durasi Jam */}
            <Text style={externalStyles.inputLabel}>Durasi Sewa (Jam):</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                onPress={() => handleUbahJam(-1)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>

              <View style={styles.stepValueBox}>
                <Text style={styles.stepValueText}>{durationHours} Jam</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleUbahJam(1)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Promo Info Tag: [5.2] CONDITIONS */}
            {durationHours >= 3 && (
              <View style={styles.promoAlert}>
                <Text style={styles.promoText}>
                  🎉 Diskon Aktif: {durationHours >= 5 ? '15%' : '10%'} untuk sewa ≥ {durationHours >= 5 ? '5' : '3'} jam!
                </Text>
              </View>
            )}

            {/* [5.4.A] MAP() LOOP: Pilihan Aksesori Tambahan */}
            <Text style={[externalStyles.inputLabel, { marginTop: 12 }]}>
              Aksesoris Tambahan [5.4.A map()]:
            </Text>
            <View style={{ gap: 8 }}>
              {ACCESSORIES_DATA.map((acc) => {
                const isSelected = selectedAccIds.includes(acc.id);
                return (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => toggleAksesoris(acc.id)}
                    style={[
                      styles.accItem,
                      isSelected && styles.accItemSelected,
                    ]}
                  >
                    <View style={externalStyles.rowCenter}>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxActive,
                        ]}
                      >
                        {isSelected && <Text style={{ color: '#FFF', fontSize: 10 }}>✓</Text>}
                      </View>
                      <Text style={styles.accName}>{acc.name}</Text>
                    </View>
                    <Text style={styles.accPrice}>+{formatRupiah(acc.extraPrice)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Metode Pembayaran */}
            <Text style={[externalStyles.inputLabel, { marginTop: 14 }]}>
              Metode Pembayaran:
            </Text>
            <View style={styles.paymentRow}>
              {(['Cash', 'QRIS', 'Transfer Bank'] as PaymentMethod[]).map((metode) => (
                <TouchableOpacity
                  key={metode}
                  onPress={() => setPaymentMethod(metode)}
                  style={[
                    styles.payBadge,
                    paymentMethod === metode && styles.payBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.payBadgeText,
                      paymentMethod === metode && styles.payBadgeTextActive,
                    ]}
                  >
                    {metode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toggle Primitive Loop Hourly Breakdown */}
            <TouchableOpacity
              onPress={() => setShowHourlyBreakdown(!showHourlyBreakdown)}
              style={styles.accordionToggle}
            >
              <Text style={styles.accordionToggleText}>
                {showHourlyBreakdown ? '▼' : '►'} Rincian Jam-ke-Jam [5.4.C Primitive For-Loop]
              </Text>
            </TouchableOpacity>

            {/* [5.2] CONDITIONS: Tampilan Primitive Loop Breakdown */}
            {showHourlyBreakdown && (
              <View style={styles.breakdownBox}>
                {breakdown.map((item) => (
                  <View key={item.jamKe} style={externalStyles.rowBetween}>
                    <Text style={styles.breakdownItem}>
                      Jam ke-{item.jamKe} ({item.keterangan}):
                    </Text>
                    <Text style={styles.breakdownPrice}>
                      {formatRupiah(item.biayaJamIni)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Summary Tagihan */}
            <View style={styles.summaryContainer}>
              <View style={externalStyles.rowBetween}>
                <Text style={styles.summaryLabel}>Subtotal Sewa ({durationHours} Jam):</Text>
                <Text style={styles.summaryVal}>{formatRupiah(unit.hourlyRate * durationHours)}</Text>
              </View>
              {totalAccPrice > 0 && (
                <View style={externalStyles.rowBetween}>
                  <Text style={styles.summaryLabel}>Aksesoris Tambahan:</Text>
                  <Text style={styles.summaryVal}>+{formatRupiah(totalAccPrice)}</Text>
                </View>
              )}
              {diskonNominal > 0 && (
                <View style={externalStyles.rowBetween}>
                  <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Potongan Diskon:</Text>
                  <Text style={[styles.summaryVal, { color: '#10B981' }]}>-{formatRupiah(diskonNominal)}</Text>
                </View>
              )}
              <View style={[externalStyles.divider, { marginVertical: 8 }]} />
              <View style={externalStyles.rowBetween}>
                <Text style={styles.totalLabel}>TOTAL BAYAR:</Text>
                <Text style={styles.totalVal}>{formatRupiah(grandTotal)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Tombol Simpan Booking */}
          <TouchableOpacity
            onPress={handleSimpanTransaksi}
            style={[externalStyles.primaryButton, { marginTop: 12 }]}
          >
            <Text style={externalStyles.primaryButtonText}>
              ✓ Konfirmasi & Mulai Main ({formatRupiah(grandTotal)})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#38BDF8',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 14,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBtn: {
    backgroundColor: '#334155',
    width: 44,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  stepValueBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    height: 40,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepValueText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
  },
  promoAlert: {
    backgroundColor: '#064E3B',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  promoText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
  },
  accItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  accItemSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A8A22',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#64748B',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  accName: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  accPrice: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  payBadge: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  payBadgeActive: {
    borderColor: '#2563EB',
    backgroundColor: '#1E3A8A',
  },
  payBadgeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  payBadgeTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  accordionToggle: {
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 6,
    marginVertical: 6,
  },
  accordionToggleText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
  },
  breakdownBox: {
    backgroundColor: '#0B1120',
    padding: 10,
    borderRadius: 8,
    gap: 4,
    marginBottom: 8,
  },
  breakdownItem: {
    color: '#94A3B8',
    fontSize: 11,
  },
  breakdownPrice: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  summaryVal: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  totalLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  totalVal: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
  },
});
