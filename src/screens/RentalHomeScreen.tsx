// ============================================================================
// SCREEN 1: RENTAL HOME SCREEN
// MATERI 1: STRUKTUR DASAR REACT (1.1 IMPORT, 1.2 RETURN)
// MATERI 2: KOMPONEN (Modular Integration)
// MATERI 3: STYLING (3.1 Internal, 3.2 External, 3.3 Inline)
// MATERI 5.1: VARIABLE
// MATERI 5.2: CONDITIONS
// MATERI 5.3: FUNCTIONS (A. Bawaan, B. Custom, C. Callback)
// MATERI 5.4: LOOPS (A. Map, B. <FlatList>, C. Primitive Loop)
// MATERI 5.5: VARIABLE LANJUTAN (A. Array of Object, B. Type & Interface)
// ============================================================================

// [1.1] STRUKTUR IMPORT: React & Hooks
import React, { useState, useMemo } from 'react';
// [1.1] STRUKTUR IMPORT: React Native Core Components
import {
  View,
  Text,
  FlatList, // [5.4.B] FLATLIST
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

// [1.1] STRUKTUR IMPORT: Type & Interface [5.5.B]
import { RentalUnit, PSConsoleType, BookingResult } from '../types/rental.types';

// [1.1] STRUKTUR IMPORT: Data Array of Object [5.5.A] & Konfigurasi [5.1]
import { INITIAL_RENTAL_UNITS } from '../data/rentalData';

// [1.1] STRUKTUR IMPORT: External Stylesheet [3.2]
import { externalStyles } from '../styles/externalStyles';

// [1.1] STRUKTUR IMPORT: Custom Reusable Components [2]
import { RentalCard } from '../components/RentalCard';
import { QuickStats } from '../components/QuickStats';
import { BookingModal } from '../components/BookingModal';

// [1.1] STRUKTUR IMPORT: Custom Functions [5.3.B] & Built-ins [5.3.A]
import { formatRupiah, selesaikanTransaksi } from '../utils/rentalFunctions';

interface RentalHomeScreenProps {
  onGoToMateri: () => void;
}

export const RentalHomeScreen: React.FC<RentalHomeScreenProps> = ({ onGoToMateri }) => {
  // [5.1] VARIABLE & STATE DENGAN TYPE ANNOTATIONS
  const [units, setUnits] = useState<RentalUnit[]>(INITIAL_RENTAL_UNITS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [selectedUnitForRent, setSelectedUnitForRent] = useState<RentalUnit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lastBooking, setLastBooking] = useState<BookingResult | null>(null);

  // Daftar Kategori Konsol untuk Filter
  const categories: string[] = ['SEMUA', 'PS5', 'PS4', 'PS_VR2', 'PS3'];

  // [5.3.A] FUNCTION BAWAAN (Array.prototype.filter & String.prototype.includes)
  // [5.2] CONDITIONS untuk memfilter unit berdasarkan tipe dan pencarian nama
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      // [5.2] Condition 1: Filter Kategori
      const matchCategory =
        selectedCategory === 'SEMUA' || unit.type === (selectedCategory as PSConsoleType);

      // [5.2] Condition 2: Pencarian teks
      const matchSearch =
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.popularGames.some((game) =>
          game.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchCategory && matchSearch;
    });
  }, [units, selectedCategory, searchQuery]);

  // [5.3.C] CALLBACK FUNCTION: Dijalankan saat tombol sewa pada kartu ditekan
  const handlePilihUnit = (unit: RentalUnit) => {
    // [5.2] CONDITIONS: Pengecekan unit tersedia
    if (unit.status !== 'Tersedia') {
      Alert.alert('Unit Tidak Tersedia', `Unit ${unit.name} saat ini ${unit.status}!`);
      return;
    }
    setSelectedUnitForRent(unit);
    setIsModalOpen(true);
  };

  // [5.3.C] CALLBACK FUNCTION: Konfirmasi pemesanan dari BookingModal
  const handleConfirmBooking = (result: BookingResult) => {
    // Update data state unit menjadi 'Sedang Dimainkan'
    setUnits((prevUnits) =>
      prevUnits.map((u) => {
        // [5.2] CONDITIONS (Ternary)
        return u.id === result.unitId
          ? {
              ...u,
              status: 'Sedang Dimainkan',
              currentRenterName: result.customerName,
              activeDurationLeftMinutes: result.durationHours * 60,
            }
          : u;
      })
    );

    setLastBooking(result);
    setIsModalOpen(false);

    // [5.3.C] Memanggil fungsi dengan Callback Handler sukses
    selesaikanTransaksi(
      selectedUnitForRent!,
      (pesan, unitId) => {
        Alert.alert(
          '🎉 Sewa Berhasil Dikonfirmasi!',
          `${pesan}\n\nID Transaksi: ${result.bookingId}\nPelanggan: ${result.customerName}\nDurasi: ${result.durationHours} Jam\nTotal: ${formatRupiah(result.grandTotal)} (${result.paymentMethod})`
        );
      }
    );
  };

  // [1.2] RETURN KOMPONEN REACT
  return (
    <View style={externalStyles.mainContainer}>
      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari Unit atau Judul Game (cth: FC 24)..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {/* [5.2] CONDITIONS: Tombol reset pencarian jika ada teks */}
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchBtn}
          >
            <Text style={{ color: '#94A3B8', fontWeight: '700' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* [5.4.A] MAP() LOOP: Filter Chips Horizontal */}
      <View style={styles.filterRow}>
        <Text style={styles.filterTitle}>Filter Konsol [5.4.A map]:</Text>
        <View style={styles.filterPills}>
          {/* [5.4.A] MAP() LOOP */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                // [5.3.C] Callback onPress
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterPill,
                  // [5.2] CONDITIONS & [3.3] INLINE STYLING
                  {
                    backgroundColor: isSelected ? '#2563EB' : '#1E293B',
                    borderColor: isSelected ? '#3B82F6' : '#334155',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isSelected ? '#FFFFFF' : '#94A3B8', fontWeight: isSelected ? '700' : '500' },
                  ]}
                >
                  {cat === 'SEMUA' ? '🌐 Semua' : `🎮 ${cat}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* [5.4.B] <FLATLIST> (BUKAN LOOP TAPI GUNANYA SAMA) */}
      {/* FlatList digunakan untuk merender list data besar secara teroptimasi (virtualized) */}
      <FlatList
        data={filteredUnits}
        // keyExtractor: Menentukan key unik untuk setiap item di daftar
        keyExtractor={(item) => item.id}
        // renderItem: Fungsi render untuk setiap item
        renderItem={({ item }) => (
          // [2. KOMPONEN] RentalCard Reusable
          <RentalCard
            item={item}
            // [5.3.C] Meneruskan callback function ke anak komponen
            onRent={handlePilihUnit}
          />
        )}
        contentContainerStyle={styles.listPadding}
        // ListHeaderComponent: Menampilkan komponen statistik di paling atas list
        ListHeaderComponent={
          <View>
            {/* [2. KOMPONEN] & [5.4.C PRIMITIVE LOOP] */}
            <QuickStats units={units} />

            {/* Notifikasi Transaksi Terakhir: [5.2] CONDITIONS (Logical &&) */}
            {lastBooking && (
              <View style={styles.lastBookingNotice}>
                <View style={externalStyles.rowBetween}>
                  <Text style={styles.lastBookingTitle}>
                    ⚡ SEWA TERBARU: {lastBooking.unitName}
                  </Text>
                  <Text style={styles.lastBookingTime}>{lastBooking.timestamp}</Text>
                </View>
                <Text style={styles.lastBookingDesc}>
                  Penyewa: <Text style={{ color: '#F8FAFC', fontWeight: '700' }}>{lastBooking.customerName}</Text> • Total: {formatRupiah(lastBooking.grandTotal)}
                </Text>
              </View>
            )}

            <View style={externalStyles.rowBetween}>
              <Text style={externalStyles.sectionTitle}>
                Daftar Unit Tersedia ({filteredUnits.length})
              </Text>
              <Text style={styles.flatListBadge}>[5.4.B FlatList Component]</Text>
            </View>
          </View>
        }
        // ListEmptyComponent: Tampilan jika data filter kosong
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 32 }}>🔍</Text>
            <Text style={styles.emptyTitle}>Tidak Ada Unit Yang Cocok</Text>
            <Text style={styles.emptySub}>
              Coba ganti kata kunci pencarian atau ubah filter kategori konsol.
            </Text>
          </View>
        }
      />

      {/* [2. KOMPONEN] Booking Modal */}
      <BookingModal
        visible={isModalOpen}
        unit={selectedUnitForRent}
        onClose={() => setIsModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />
    </View>
  );
};

// ============================================================================
// [3.1] INTERNAL STYLING
// ============================================================================
const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 13,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 28,
    top: 22,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  filterPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 4,
  },
  flatListBadge: {
    fontSize: 10,
    color: '#38BDF8',
    fontStyle: 'italic',
  },
  lastBookingNotice: {
    backgroundColor: '#1E3A8A33',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2563EB',
    padding: 12,
    marginBottom: 16,
  },
  lastBookingTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#93C5FD',
  },
  lastBookingTime: {
    fontSize: 10,
    color: '#60A5FA',
  },
  lastBookingDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
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
    paddingHorizontal: 32,
  },
});
