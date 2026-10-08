// ============================================================================
// MATERI 5.5.B: TYPE & INTERFACE (TypeScript)
// MATERI 5.1: VARIABLE & TYPE SYSTEM
// ============================================================================

/**
 * [5.5.B] TYPE ALIAS:
 * Digunakan untuk mendefinisikan union type atau tipe data khusus.
 */
export type PSConsoleType = 'PS3' | 'PS4' | 'PS5' | 'PS_VR2';

export type UnitStatus = 'Tersedia' | 'Sedang Dimainkan' | 'Maintenance';

export type PaymentMethod = 'Cash' | 'QRIS' | 'Transfer Bank';

/**
 * [5.5.B] INTERFACE:
 * Digunakan untuk membuat struktur kontrak objek (OOP / Data Contract).
 * Bisa di-extends dan sangat umum dipakai untuk model data & props komponen React.
 */
export interface AccessoryItem {
  id: string;             // [5.1] Variable tipe string
  name: string;           // [5.1] Variable tipe string
  extraPrice: number;     // [5.1] Variable tipe number
  selected?: boolean;     // [5.1] Variable tipe boolean (opsional)
}

export interface RentalUnit {
  id: string;                      // [5.1] string
  name: string;                    // [5.1] string
  type: PSConsoleType;             // [5.5.B] Menggunakan custom type union
  hourlyRate: number;              // [5.1] number
  status: UnitStatus;              // [5.5.B] Custom status union
  isVip: boolean;                  // [5.1] boolean
  tvSize: string;                  // [5.1] string
  controllerCount: number;         // [5.1] number
  popularGames: string[];          // Array of string
  activeDurationLeftMinutes?: number; // Sisa menit sewa (opsional)
  currentRenterName?: string;      // Nama penyewa aktif (opsional)
}

export interface BookingFormState {
  customerName: string;
  durationHours: number;
  selectedAccessories: string[];
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface BookingResult {
  bookingId: string;
  unitId: string;
  unitName: string;
  customerName: string;
  durationHours: number;
  hourlyRate: number;
  subtotal: number;
  accessoryTotal: number;
  discount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
}

/**
 * Interface untuk struktur materi pembelajaran di aplikasi
 */
export interface SyllabusModule {
  id: string;
  title: string;
  subtitle: string;
  points: {
    number: string;
    topic: string;
    explanation: string;
    codeSnippet: string;
  }[];
}
