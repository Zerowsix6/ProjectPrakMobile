// ============================================================================
// MATERI 5.3: FUNCTIONS
//   5.3.A: FUNCTION BAWAAN (Built-in Methods)
//   5.3.B: FUNCTION CUSTOM (User-defined Functions)
//   5.3.C: CALLBACK FUNCTION (Bonus)
// MATERI 5.4.C: PRIMITIVE LOOP (for loop, while loop, for-of loop)
// ============================================================================

import { RentalUnit, UnitStatus, PaymentMethod } from '../types/rental.types';

// ============================================================================
// 5.3.A: FUNCTION BAWAAN (BUILT-IN JAVASCRIPT / TYPESCRIPT FUNCTIONS)
// ============================================================================

/**
 * [5.3.A] Function bawaan: Number.toLocaleString() & Math.round()
 * Memformat angka menjadi format mata uang Rupiah standar Indonesia.
 */
export const formatRupiah = (nominal: number): string => {
  // Built-in Math.round()
  const dibulatkan: number = Math.round(nominal);
  // Built-in toLocaleString('id-ID')
  return 'Rp ' + dibulatkan.toLocaleString('id-ID');
};

/**
 * [5.3.A] Function bawaan: String.toUpperCase() & String.trim()
 * Memformat kode atau nama dengan fungsi bawaan manipulasi string.
 */
export const formatNamaKapital = (teks: string): string => {
  if (!teks) return '';
  return teks.trim().toUpperCase(); // Built-in trim() & toUpperCase()
};

/**
 * [5.3.A] Function bawaan: Math.max() & Math.min()
 * Membatasi durasi jam sewa agar selalu dalam rentang aman.
 */
export const batasiDurasiJam = (jamInput: number, minJam: number = 1, maxJam: number = 12): number => {
  return Math.min(Math.max(jamInput, minJam), maxJam);
};

/**
 * Memformat sisa waktu dalam detik menjadi format "HH:MM:SS" atau "MM:SS"
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

// ============================================================================
// 5.3.B: FUNCTION CUSTOM (USER-DEFINED BUSINESS FUNCTIONS)
// ============================================================================

/**
 * [5.3.B] Function custom: Menghitung diskon berdasarkan durasi sewa
 * - Sewa >= 5 jam : diskon 15%
 * - Sewa >= 3 jam : diskon 10%
 * - Sewa < 3 jam  : diskon 0%
 */
export function hitungDiskonPersen(durasiJam: number): number {
  if (durasiJam >= 5) {
    return 15;
  } else if (durasiJam >= 3) {
    return 10;
  } else {
    return 0;
  }
}

/**
 * [5.3.B] Function custom: Menghitung total biaya rental lengkap
 */
export function hitungTotalBiayaRental(
  tarifPerJam: number,
  durasiJam: number,
  totalAksesori: number = 0
): { subtotal: number; diskonNominal: number; grandTotal: number } {
  const subtotal: number = (tarifPerJam * durasiJam) + totalAksesori;
  const persenDiskon: number = hitungDiskonPersen(durasiJam);
  const diskonNominal: number = (subtotal * persenDiskon) / 100;
  const grandTotal: number = subtotal - diskonNominal;

  return { subtotal, diskonNominal, grandTotal };
}

/**
 * [5.3.B] Function custom: Cek status ketersediaan unit
 */
export function cekApakahTersedia(status: UnitStatus): boolean {
  return status === 'Tersedia';
}

/**
 * [5.3.B] Function custom: Generate ID Transaksi acak
 */
export function generateKodeBooking(): string {
  const timestamp: number = Date.now();
  const randomNum: number = Math.floor(Math.random() * 900) + 100;
  return `TRX-${timestamp.toString().slice(-4)}${randomNum}`;
}

// ============================================================================
// 5.3.C: CALLBACK FUNCTION (BONUS)
// ============================================================================

/**
 * [5.3.C] Higher-Order Function yang menerima CALLBACK FUNCTION
 * Callback dipanggil untuk memproses tiap unit atau memfilter data berdasarkan kondisi tertentu.
 */
export function prosesDaftarUnitDenganCallback<T>(
  daftarUnit: RentalUnit[],
  callbackFilter: (unit: RentalUnit, index: number) => boolean,
  callbackTransform: (unit: RentalUnit) => T
): T[] {
  const hasil: T[] = [];
  for (let i = 0; i < daftarUnit.length; i++) {
    // Memanggil callbackFilter untuk menentukan apakah data masuk
    if (callbackFilter(daftarUnit[i], i)) {
      // Memanggil callbackTransform untuk memformat data
      hasil.push(callbackTransform(daftarUnit[i]));
    }
  }
  return hasil;
}

/**
 * [5.3.C] Function dengan Callback saat transaksi berhasil (Callback Handler)
 */
export function selesaikanTransaksi(
  unit: RentalUnit,
  onSuksesCallback: (pesan: string, unitId: string) => void
): void {
  const pesanNotif = `Transaksi untuk ${unit.name} berhasil diproses!`;
  // Menjalankan fungsi callback yang diberikan dari luar (bonus konsep callback)
  onSuksesCallback(pesanNotif, unit.id);
}

// ============================================================================
// 5.4.C: PRIMITIVE LOOP (for loop, while loop, for-of loop)
// ============================================================================

export interface HourlyBreakdown {
  jamKe: number;
  biayaJamIni: number;
  keterangan: string;
}

/**
 * [5.4.C] PRIMITIVE LOOP 1: FOR LOOP KLASIK (for i = 1; i <= n; i++)
 * Menghitung rincian tagihan per jam secara iteratif
 * dan memberikan tarif promo untuk jam ke-4 dan seterusnya.
 */
export function hitungRincianJamDenganPrimitiveLoop(
  durasiJam: number,
  tarifPerJam: number
): { breakdown: HourlyBreakdown[]; totalDariLoop: number } {
  const breakdown: HourlyBreakdown[] = [];
  let totalDariLoop: number = 0;

  // [5.4.C] Primitive For Loop
  for (let i = 1; i <= durasiJam; i++) {
    let tarifJamIni: number = tarifPerJam;
    let keterangan: string = 'Tarif Normal';

    if (i >= 4) {
      tarifJamIni = tarifPerJam * 0.85; // Diskon 15% mulai jam ke-4
      keterangan = 'Tarif Hemat Main Lama (-15%)';
    }

    totalDariLoop += tarifJamIni;

    breakdown.push({
      jamKe: i,
      biayaJamIni: tarifJamIni,
      keterangan: keterangan,
    });
  }

  return { breakdown, totalDariLoop };
}

/**
 * [5.4.C] PRIMITIVE LOOP 2: FOR-OF LOOP (Iterasi primitif pada array)
 * Menghitung rekapitulasi data unit PS (Tersedia, Terpakai, Maintenance).
 */
export function hitungStatistikDenganForOfLoop(units: RentalUnit[]): {
  totalUnit: number;
  tersedia: number;
  dimainkan: number;
  maintenance: number;
  potensiPendapatanPerJam: number;
} {
  let tersedia = 0;
  let dimainkan = 0;
  let maintenance = 0;
  let potensi = 0;

  // [5.4.C] Primitive For...Of Loop
  for (const unit of units) {
    potensi += unit.hourlyRate;

    if (unit.status === 'Tersedia') {
      tersedia++;
    } else if (unit.status === 'Sedang Dimainkan') {
      dimainkan++;
    } else if (unit.status === 'Maintenance') {
      maintenance++;
    }
  }

  return {
    totalUnit: units.length,
    tersedia,
    dimainkan,
    maintenance,
    potensiPendapatanPerJam: potensi,
  };
}

/**
 * [5.4.C] PRIMITIVE LOOP 3: WHILE LOOP
 * Menghitung pembagian slot waktu main dalam kelipatan 30 menit.
 */
export function hitungSlotWaktuDenganWhileLoop(totalMenit: number): string[] {
  const daftarSlot: string[] = [];
  let sisaMenit: number = totalMenit;
  let nomorSlot: number = 1;

  // [5.4.C] Primitive While Loop
  while (sisaMenit >= 30) {
    daftarSlot.push(`Sesi ${nomorSlot}: 30 Menit`);
    sisaMenit -= 30;
    nomorSlot++;
  }

  if (sisaMenit > 0) {
    daftarSlot.push(`Sesi Tambahan: ${sisaMenit} Menit`);
  }

  return daftarSlot;
}
