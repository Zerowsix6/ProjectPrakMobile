// ============================================================================
// HALAMAN RINCIAN UNIT & FORMULIR SEWA (TERPROTEKSI AUTH)
// [PERUBAHAN - KRITERIA 2 & 3]: Validasi booking menggunakan Promise (resolve, reject, .then)
// [PERUBAHAN - KRITERIA 6]: Prefill nama pelanggan dari user AuthContext jika tersedia
// [PERUBAHAN - KRITERIA 7]: Dipindahkan ke grup (app) di bawah Route Protection Guard
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
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
import { useRental } from '../../../context/RentalContext';
import { useAuth } from '../../../context/AuthContext';
import { ACCESSORIES_DATA } from '../../../data/rentalData';
import { PaymentMethod, BookingResult, AccessoryItem } from '../../../types/rental.types';
import { externalStyles } from '../../../styles/externalStyles';
import { StatusBadge } from '../../../components/StatusBadge';
import {
  formatRupiah,
  hitungTotalBiayaRental,
  hitungDiskonPersen,
  generateKodeBooking,
} from '../../../utils/rentalFunctions';
import {
  checkPromoEligibilityPromise,
  validateBookingWithPromise,
} from '../../../services/externalApiService';

export default function UnitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { getUnitById, addNewBooking } = useRental();
  const { user } = useAuth();
  const unit = getUnitById(id as string);

  const defaultUserName = (user?.user_metadata?.full_name as string | undefined) || '';

  const [customerName, setCustomerName] = useState<string>(defaultUserName);
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [notes, setNotes] = useState<string>('');
  // [PERUBAHAN - KRITERIA 3]: Status promo yang diambil via Promise.resolve / .then()
  const [promoNote, setPromoNote] = useState<string>('');

  const calculation = useMemo(() => {
    if (!unit) {
      return { subtotal: 0, diskonNominal: 0, grandTotal: 0 };
    }

    const accessorySum = selectedAccessories.reduce((acc: number, accId: string) => {
      const item = ACCESSORIES_DATA.find((a: AccessoryItem) => a.id === accId);
      return acc + (item ? item.extraPrice : 0);
    }, 0);

    return hitungTotalBiayaRental(unit.hourlyRate, durationHours, accessorySum);
  }, [durationHours, selectedAccessories, unit]);

  // [PERUBAHAN - KRITERIA 3]: Memanggil checkPromoEligibilityPromise dengan .then()
  useEffect(() => {
    checkPromoEligibilityPromise(durationHours)
      .then((message) => setPromoNote(message))
      .catch((err: unknown) => {
        setPromoNote(err instanceof Error ? err.message : '');
      });
  }, [durationHours]);

  const { validationError, isValid } = useMemo(() => {
    if (customerName.trim().length === 0) {
      return { validationError: 'Nama pemesan wajib diisi.', isValid: false };
    }
    if (customerName.trim().length < 3) {
      return { validationError: 'Nama pemesan minimal 3 karakter.', isValid: false };
    }
    if (durationHours < 1 || durationHours > 12) {
      return { validationError: 'Durasi sewa antara 1 sampai 12 jam.', isValid: false };
    }
    return { validationError: null, isValid: true };
  }, [customerName, durationHours]);

  const handleToggleAccessory = (accId: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(accId) ? prev.filter((itemId) => itemId !== accId) : [...prev, accId]
    );
  };

  // [PERUBAHAN - KRITERIA 3]: Konfirmasi rental menggunakan validateBookingWithPromise (.resolve, .reject, .then)
  const handleConfirmRental = () => {
    if (!unit) return;

    validateBookingWithPromise(customerName, durationHours, unit.status)
      .then((validation) => {
        const bookingResult: BookingResult = {
          bookingId: generateKodeBooking(),
          unitId: unit.id,
          unitName: unit.name,
          customerName: validation.normalizedCustomerName,
          durationHours,
          hourlyRate: unit.hourlyRate,
          subtotal: calculation.subtotal,
          accessoryTotal: calculation.subtotal - unit.hourlyRate * durationHours,
          discount: calculation.diskonNominal,
          grandTotal: calculation.grandTotal,
          paymentMethod,
          timestamp: new Date().toLocaleString('id-ID'),
        };

        addNewBooking(bookingResult);

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
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Lengkapi semua isian!';
        Alert.alert('Periksa Formulir', message);
      });
  };

  if (!unit) {
    return (
      <View style={[externalStyles.mainContainer, styles.center]}>
        <Text style={{ fontSize: 40 }}>❓</Text>
        <Text style={styles.notFoundTitle}>Unit Tidak Ditemukan</Text>
        <TouchableOpacity
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

        <View style={styles.formSection}>
          <Text style={externalStyles.sectionTitle}>Formulir Penyewaan</Text>

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

            {promoNote.length > 0 && <Text style={styles.promoNoteText}>✨ {promoNote}</Text>}

            <View style={styles.presetRow}>
              {[1, 2, 3, 5, 8].map((h) => (
                <TouchableOpacity
                  key={h}
                  onPress={() => setDurationHours(h)}
                  style={[styles.presetBtn, durationHours === h && styles.presetBtnActive]}
                >
                  <Text
                    style={[styles.presetText, durationHours === h && styles.presetTextActive]}
                  >
                    {h} Jam
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={externalStyles.inputLabel}>Tambahan Aksesori & Snack (Opsional)</Text>
            {ACCESSORIES_DATA.map((acc: AccessoryItem) => {
              const isChecked = selectedAccessories.includes(acc.id);
              return (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => handleToggleAccessory(acc.id)}
                  style={[styles.accessoryItem, isChecked && styles.accessoryItemActive]}
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

          <View style={styles.fieldGroup}>
            <Text style={externalStyles.inputLabel}>Metode Pembayaran</Text>
            <View style={styles.paymentRow}>
              {(['QRIS', 'Cash', 'Transfer Bank'] as PaymentMethod[]).map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    style={[styles.paymentPill, isSelected && styles.paymentPillActive]}
                  >
                    <Text style={[styles.paymentText, isSelected && styles.paymentTextActive]}>
                      {method === 'QRIS'
                        ? '📱 QRIS'
                        : method === 'Cash'
                        ? '💵 Tunai'
                        : '🏦 Transfer'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

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
            <Text style={styles.grandTotalValue}>{formatRupiah(calculation.grandTotal)}</Text>
          </View>

          {validationError && <Text style={styles.errorText}>⚠️ {validationError}</Text>}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
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
  promoNoteText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
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
