// ============================================================================
// HALAMAN KATALOG & PROMO GAME (EXTERNAL API)
// [PERUBAHAN - KRITERIA 1]: Menampilkan data External API yang sudah dimasukkan ke Object Interface
// [PERUBAHAN - KRITERIA 2]: Memanggil Custom & Pre-built Async Function
// [PERUBAHAN - KRITERIA 3]: Menggunakan .then(), Promise.resolve() (cache), dan Promise.reject()
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderRental } from '../../components/HeaderRental';
import { externalStyles } from '../../styles/externalStyles';
import { ExternalGameCatalogObject, ExternalGameItem } from '../../types/rental.types';
import {
  fetchExternalGameCatalog,
  fetchGameCatalogWithPromise,
} from '../../services/externalApiService';

export default function ExternalGamesScreen() {
  const insets = useSafeAreaInsets();
  const [catalog, setCatalog] = useState<ExternalGameCatalogObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusInfo, setStatusInfo] = useState<string>('Memuat data dari External API...');

  // [PERUBAHAN - KRITERIA 3]: Mengonsumsi Promise menggunakan .then() dan .catch()
  const loadWithPromiseThen = (forceRefresh: boolean) => {
    setIsLoading(true);
    setErrorMsg(null);

    fetchGameCatalogWithPromise(forceRefresh, 8)
      .then((resultObject: ExternalGameCatalogObject) => {
        setCatalog(resultObject);
        setStatusInfo(
          forceRefresh
            ? `Sinkronisasi API selesai (${resultObject.totalItems} game)`
            : `Data dimuat cepat via Promise.resolve() (${resultObject.totalItems} game)`
        );
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Gagal mengambil data API.';
        setErrorMsg(message);
        setStatusInfo('Terjadi kesalahan saat memuat API');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // [PERUBAHAN - KRITERIA 2]: Memanggil Custom Async Function secara langsung dengan async/await
  const handleForceRefreshAsync = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const freshCatalog = await fetchExternalGameCatalog(8);
      setCatalog(freshCatalog);
      setStatusInfo(`Refresh async berhasil pada ${freshCatalog.lastSyncedAt}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal menyegarkan data.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  // [PERUBAHAN - KRITERIA 3]: Simulasi pemanggilan Promise.reject() dan penangkapannya dengan .then() / .catch()
  const handleTestRejectPromise = () => {
    fetchExternalGameCatalog(0)
      .then((res) => {
        setCatalog(res);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Promise ditolak.';
        Alert.alert('Promise.reject() Terpicu', msg);
      });
  };

  useEffect(() => {
    let isActive = true;

    fetchGameCatalogWithPromise(false, 8)
      .then((resultObject: ExternalGameCatalogObject) => {
        if (!isActive) return;
        setCatalog(resultObject);
        setStatusInfo(`Data dimuat via Promise.resolve() (${resultObject.totalItems} game)`);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        const message = error instanceof Error ? error.message : 'Gagal mengambil data API.';
        setErrorMsg(message);
        setStatusInfo('Terjadi kesalahan saat memuat API');
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const renderGameItem = ({ item }: { item: ExternalGameItem }) => (
    <View style={styles.gameCard}>
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.gameMeta}>
          ⭐ {item.ratingLabel} • Skor {item.metacriticScore || '-'} • Rating Deal {item.dealRating}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.salePrice}>${item.salePriceUsd.toFixed(2)}</Text>
          <Text style={styles.normalPrice}>${item.normalPriceUsd.toFixed(2)}</Text>
          {item.discountPercent > 0 && (
            <View style={styles.discountPill}>
              <Text style={styles.discountText}>-{item.discountPercent}%</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[externalStyles.mainContainer, { paddingTop: insets.top }]}>
      <HeaderRental currentRoute="external-games" />

      <View style={styles.controlSection}>
        <Text style={externalStyles.sectionTitle}>🌐 Katalog Promo Game (External API)</Text>
        <Text style={styles.statusText}>
          Sumber: {catalog?.source ?? 'CheapShark Public Game API'} • {statusInfo}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleForceRefreshAsync} style={styles.actionBtnPrimary}>
            <Text style={styles.actionBtnText}>🔄 Refresh Async</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => loadWithPromiseThen(false)} style={styles.actionBtnSecondary}>
            <Text style={styles.actionBtnText}>⚡ Cache (.resolve)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTestRejectPromise} style={styles.actionBtnDanger}>
            <Text style={styles.actionBtnText}>🧪 Uji .reject()</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingHint}>Mengambil data External API...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>⚠️ Gagal Memuat Data</Text>
          <Text style={styles.errorSub}>{errorMsg}</Text>
          <TouchableOpacity
            onPress={() => loadWithPromiseThen(true)}
            style={[externalStyles.primaryButton, { marginTop: 14 }]}
          >
            <Text style={externalStyles.primaryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={catalog?.games ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderGameItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  controlSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: '#0F766E',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnDanger: {
    flex: 1,
    backgroundColor: '#7F1D1D',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  thumb: {
    width: 96,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gameTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  gameMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  salePrice: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '800',
  },
  normalPrice: {
    color: '#64748B',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  discountPill: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '800',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingHint: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 10,
  },
  errorTitle: {
    color: '#FCA5A5',
    fontSize: 16,
    fontWeight: '700',
  },
  errorSub: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
});
