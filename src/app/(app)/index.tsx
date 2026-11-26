// ============================================================================
// HALAMAN UTAMA: KATALOG & MONITORING RENTAL PLAYSTATION (TERPROTEKSI AUTH)
// [PERUBAHAN - KRITERIA 1, 2, 3]: Menampilkan ringkasan External API via .then() & Interface
// [PERUBAHAN - KRITERIA 7]: Dipindahkan ke grup (app) yang dijaga Route Protection Guard
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRental } from '../../context/RentalContext';
import { RentalUnit, PSConsoleType, ExternalGameItem } from '../../types/rental.types';
import { externalStyles } from '../../styles/externalStyles';
import { HeaderRental } from '../../components/HeaderRental';
import { QuickStats } from '../../components/QuickStats';
import { RentalCard } from '../../components/RentalCard';
import { formatSecondsToTime } from '../../utils/rentalFunctions';
import { fetchGameCatalogWithPromise } from '../../services/externalApiService';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { units, activeSessions } = useRental();

  // [STATE 1]: useState untuk query pencarian unit
  const [searchQuery, setSearchQuery] = useState<string>('');

  // [STATE 2]: useState untuk kategori konsol yang dipilih
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');

  // [PERUBAHAN - KRITERIA 1]: State untuk menampung preview Object dari External API
  const [featuredGames, setFeaturedGames] = useState<ExternalGameItem[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState<boolean>(true);

  // [PERUBAHAN - KRITERIA 1 & 3]: Mengambil data External API dengan .then() saat layar dimuat
  useEffect(() => {
    let isActive = true;

    fetchGameCatalogWithPromise(false, 3)
      .then((catalog) => {
        if (isActive) {
          setFeaturedGames(catalog.games);
        }
      })
      .catch(() => {
        if (isActive) {
          setFeaturedGames([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingGames(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Daftar kategori PlayStation
  const categories: string[] = ['SEMUA', 'PS5', 'PS4', 'PS_VR2', 'PS3'];

  // Sesi bermain yang sedang aktif
  const runningSessions = activeSessions.filter((s) => s.status !== 'COMPLETED');

  // Filter data unit berdasarkan input pencarian dan kategori konsol
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchCategory =
        selectedCategory === 'SEMUA' || unit.type === (selectedCategory as PSConsoleType);

      const matchSearch =
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.popularGames.some((game) =>
          game.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchCategory && matchSearch;
    });
  }, [units, selectedCategory, searchQuery]);

  // [NAVIGASI router.push]: Menavigasikan pengguna ke halaman rincian unit
  const handlePilihUnit = (unit: RentalUnit) => {
    if (unit.status !== 'Tersedia') {
      Alert.alert(
        'Unit Belum Siap',
        `Unit ${unit.name} saat ini berstatus ${unit.status}.\nSilakan pilih unit lain yang tersedia.`,
        [{ text: 'Mengerti', style: 'default' }]
      );
      return;
    }

    router.push({
      pathname: '/unit/[id]',
      params: { id: unit.id },
    });
  };

  return (
    <View style={[externalStyles.mainContainer, { paddingTop: insets.top }]}>
      {/* Header Rental Aplikasi */}
      <HeaderRental currentRoute="home" />

      {/* Bar Pencarian */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari konsol atau judul game (cth: FC 24, Tekken 8)..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchBtn}
          >
            <Text style={{ color: '#94A3B8', fontWeight: '700' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Horizontal Kategori Konsol */}
      <View style={styles.filterRow}>
        <View style={styles.filterPills}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? '#2563EB' : '#1E293B',
                    borderColor: isSelected ? '#3B82F6' : '#334155',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isSelected ? '#FFFFFF' : '#94A3B8',
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat === 'SEMUA' ? '🌐 Semua' : `🎮 ${cat}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Virtualized FlatList Katalog Unit */}
      <FlatList
        data={filteredUnits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RentalCard item={item} onRent={handlePilihUnit} />
        )}
        contentContainerStyle={styles.listPadding}
        ListHeaderComponent={
          <View>
            {/* Widget Pemantauan Sesi Aktif Berjalan */}
            {runningSessions.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/active-sessions')}
                style={styles.liveBanner}
              >
                <View style={externalStyles.rowBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 16 }}>⚡</Text>
                    <Text style={styles.liveBannerTitle}>
                      {runningSessions.length} Sesi Bermain Sedang Aktif
                    </Text>
                  </View>
                  <View style={styles.liveBadge}>
                    <Text style={styles.liveBadgeText}>LIVE TIMER</Text>
                  </View>
                </View>

                <View style={styles.livePreviewRow}>
                  <Text style={styles.livePreviewUnit} numberOfLines={1}>
                    {runningSessions[0].unitName} • {runningSessions[0].customerName}
                  </Text>
                  <Text style={styles.livePreviewCountdown}>
                    ⏱️ {formatSecondsToTime(runningSessions[0].remainingSeconds)}
                  </Text>
                </View>

                <Text style={styles.liveBannerFooter}>
                  Ketuk untuk memantau semua timer & perpanjang sewa ➔
                </Text>
              </TouchableOpacity>
            )}

            {/* [PERUBAHAN - KRITERIA 1]: Preview Katalog Game External API di Beranda */}
            <TouchableOpacity
              onPress={() => router.push('/external-games')}
              style={styles.apiPreviewCard}
            >
              <View style={externalStyles.rowBetween}>
                <Text style={styles.apiPreviewTitle}>🌐 Promo Game Terkini (External API)</Text>
                <Text style={styles.apiPreviewLink}>Lihat Semua ➔</Text>
              </View>

              {isLoadingGames ? (
                <View style={styles.apiLoadingRow}>
                  <ActivityIndicator size="small" color="#38BDF8" />
                  <Text style={styles.apiLoadingText}>Memuat data External API...</Text>
                </View>
              ) : featuredGames.length > 0 ? (
                <View style={{ marginTop: 8, gap: 4 }}>
                  {featuredGames.slice(0, 2).map((game) => (
                    <View key={game.id} style={styles.apiPreviewItem}>
                      <Text style={styles.apiGameTitle} numberOfLines={1}>
                        🎮 {game.title}
                      </Text>
                      <Text style={styles.apiGamePrice}>
                        ${game.salePriceUsd.toFixed(2)} (-{game.discountPercent}%)
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.apiLoadingText}>
                  Ketuk untuk membuka katalog game External API
                </Text>
              )}
            </TouchableOpacity>

            {/* Rekap Statistik Unit Rental */}
            <QuickStats units={units} />

            <View style={[externalStyles.rowBetween, { marginBottom: 12 }]}>
              <Text style={externalStyles.sectionTitle}>
                Katalog Unit Rental ({filteredUnits.length})
              </Text>
              <Text style={styles.subHint}>Ketuk unit untuk sewa</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 36 }}>🔍</Text>
            <Text style={styles.emptyTitle}>Unit Tidak Ditemukan</Text>
            <Text style={styles.emptySub}>
              Tidak ada unit yang cocok dengan filter atau kata kunci &quot;{searchQuery}&quot;.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
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
    top: 20,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    paddingBottom: 40,
    paddingTop: 4,
  },
  subHint: {
    fontSize: 11,
    color: '#64748B',
  },
  liveBanner: {
    backgroundColor: '#1E3A8A33',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2563EB',
    padding: 12,
    marginBottom: 12,
  },
  liveBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#93C5FD',
  },
  liveBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  livePreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#0F172A88',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  livePreviewUnit: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  livePreviewCountdown: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  liveBannerFooter: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'right',
  },
  apiPreviewCard: {
    backgroundColor: '#0F292E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0D9488',
    padding: 12,
    marginBottom: 14,
  },
  apiPreviewTitle: {
    color: '#5EEAD4',
    fontSize: 12,
    fontWeight: '800',
  },
  apiPreviewLink: {
    color: '#99F6E4',
    fontSize: 11,
    fontWeight: '700',
  },
  apiLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  apiLoadingText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  apiPreviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A88',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  apiGameTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  apiGamePrice: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
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
