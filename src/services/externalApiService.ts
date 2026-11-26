// ============================================================================
// SERVICE: EXTERNAL API, CUSTOM & PRE-BUILT ASYNC FUNCTION, DAN PROMISE
// [PERUBAHAN - KRITERIA 1]: Mengambil data dari External API & mapping ke Object Interface
// [PERUBAHAN - KRITERIA 2]: Custom Async Function & Pre-built Async Function
// [PERUBAHAN - KRITERIA 3]: Penggunaan .then(), Promise.resolve(), dan Promise.reject()
// ============================================================================

import {
  ExternalGameApiResponse,
  ExternalGameCatalogObject,
  ExternalGameItem,
  BookingValidationResult,
} from '../types/rental.types';

const CHEAPSHARK_API_URL =
  'https://www.cheapshark.com/api/1.0/deals?upperPrice=25&sortBy=Deal%20Rating';

// Cache in-memory untuk demonstrasi Promise.resolve() saat data sudah tersedia
let cachedGameCatalog: ExternalGameCatalogObject | null = null;

// ============================================================================
// [PERUBAHAN - KRITERIA 1 & 2]: CUSTOM ASYNC FUNCTION + PRE-BUILT ASYNC (fetch)
// Mengambil data dari External API dan memasukkannya ke dalam Object via Interface
// ============================================================================
export async function fetchExternalGameCatalog(
  limit: number = 6
): Promise<ExternalGameCatalogObject> {
  if (limit <= 0) {
    // [PERUBAHAN - KRITERIA 3]: Menggunakan Promise.reject() untuk parameter tidak valid
    return Promise.reject(new Error('Jumlah limit katalog game harus lebih dari 0.'));
  }

  // [PERUBAHAN - KRITERIA 2]: Pre-built Async Function (fetch & response.json)
  const response = await fetch(`${CHEAPSHARK_API_URL}&pageSize=${limit}`);

  if (!response.ok) {
    throw new Error(`Gagal mengambil data dari External API (HTTP ${response.status})`);
  }

  // [PERUBAHAN - KRITERIA 2]: Pre-built Async Function response.json()
  const rawData: ExternalGameApiResponse[] = await response.json();

  // [PERUBAHAN - KRITERIA 1]: Memasukkan data mentah External API ke Object sesuai Interface
  const mappedGames: ExternalGameItem[] = rawData.map((raw): ExternalGameItem => {
    const mappedItem: ExternalGameItem = {
      id: raw.dealID,
      title: raw.title,
      normalPriceUsd: Number.parseFloat(raw.normalPrice) || 0,
      salePriceUsd: Number.parseFloat(raw.salePrice) || 0,
      discountPercent: Math.round(Number.parseFloat(raw.savings) || 0),
      metacriticScore: Number.parseInt(raw.metacriticScore, 10) || 0,
      ratingLabel: raw.steamRatingText || 'Populer',
      dealRating: raw.dealRating || '0.0',
      thumbnailUrl: raw.thumb,
      fetchedAt: new Date().toLocaleTimeString('id-ID'),
    };
    return mappedItem;
  });

  // [PERUBAHAN - KRITERIA 1]: Membentuk Object pembungkus berdasar Interface ExternalGameCatalogObject
  const catalogObject: ExternalGameCatalogObject = {
    source: 'CheapShark Public Game API',
    totalItems: mappedGames.length,
    lastSyncedAt: new Date().toLocaleTimeString('id-ID'),
    games: mappedGames,
  };

  cachedGameCatalog = catalogObject;
  return catalogObject;
}

// ============================================================================
// [PERUBAHAN - KRITERIA 3]: FUNGSI .then(), .resolve(), DAN .reject()
// Mengambil katalog dengan Promise chaining .then() dan Promise.resolve()
// ============================================================================
export function fetchGameCatalogWithPromise(
  forceRefresh: boolean = false,
  limit: number = 6
): Promise<ExternalGameCatalogObject> {
  if (!forceRefresh && cachedGameCatalog !== null) {
    // [PERUBAHAN - KRITERIA 3]: Promise.resolve() mengembalikan data cache secara instan
    return Promise.resolve(cachedGameCatalog);
  }

  // [PERUBAHAN - KRITERIA 3]: Menggunakan .then() untuk memproses hasil Promise dari async function
  return fetchExternalGameCatalog(limit).then((catalog) => {
    if (!catalog.games || catalog.games.length === 0) {
      // [PERUBAHAN - KRITERIA 3]: Promise.reject() jika hasil API kosong
      return Promise.reject(new Error('Katalog game dari External API kosong.'));
    }
    return Promise.resolve(catalog);
  });
}

// ============================================================================
// [PERUBAHAN - KRITERIA 3]: VALIDASI BOOKING DENGAN new Promise(resolve, reject)
// Mendemonstrasikan resolve() dan reject() secara eksplisit sebelum transaksi
// ============================================================================
export function validateBookingWithPromise(
  customerName: string,
  durationHours: number,
  unitStatus: string
): Promise<BookingValidationResult> {
  return new Promise((resolve, reject) => {
    const trimmedName = customerName.trim();

    if (unitStatus !== 'Tersedia') {
      // [PERUBAHAN - KRITERIA 3]: Memanggil reject() saat status unit tidak tersedia
      reject(new Error(`Unit sedang berstatus "${unitStatus}" dan tidak dapat disewa.`));
      return;
    }

    if (trimmedName.length < 3) {
      // [PERUBAHAN - KRITERIA 3]: Memanggil reject() saat nama penyewa kurang dari 3 karakter
      reject(new Error('Nama penyewa minimal harus terdiri dari 3 karakter.'));
      return;
    }

    if (durationHours < 1 || durationHours > 12) {
      // [PERUBAHAN - KRITERIA 3]: Memanggil reject() saat durasi di luar rentang 1-12 jam
      reject(new Error('Durasi sewa harus antara 1 hingga 12 jam.'));
      return;
    }

    // [PERUBAHAN - KRITERIA 3]: Memanggil resolve() dengan Object bertipe BookingValidationResult
    const bonusMinutes = durationHours >= 5 ? 15 : 0;
    resolve({
      valid: true,
      normalizedCustomerName: trimmedName,
      estimatedBonusMinutes: bonusMinutes,
      verifiedAt: new Date().toLocaleTimeString('id-ID'),
    });
  });
}

// ============================================================================
// [PERUBAHAN - KRITERIA 2 & 3]: CUSTOM ASYNC FUNCTION DENGAN .then()
// Menghitung estimasi kuota promo jam main menggunakan Promise.resolve / reject
// ============================================================================
export function checkPromoEligibilityPromise(durationHours: number): Promise<string> {
  if (durationHours <= 0) {
    return Promise.reject(new Error('Durasi tidak valid untuk pengecekan promo.'));
  }

  if (durationHours >= 5) {
    return Promise.resolve('Bonus Promo VIP: Diskon 15% + Free 15 Menit!');
  }

  if (durationHours >= 3) {
    return Promise.resolve('Promo Hemat: Diskon 10% Aktif!');
  }

  return Promise.resolve('Tarif Reguler (Sewa >= 3 jam untuk mendapat diskon).');
}
