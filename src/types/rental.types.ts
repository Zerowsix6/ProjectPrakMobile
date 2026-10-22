// ============================================================================
// TYPE & INTERFACE DEFINITION (TypeScript)
// Model Data Rental PlayStation & Manajemen State
// ============================================================================

/**
 * Type Alias untuk tipe konsol PlayStation yang didukung
 */
export type PSConsoleType = 'PS3' | 'PS4' | 'PS5' | 'PS_VR2';

/**
 * Type Alias untuk status ketersediaan unit rental
 */
export type UnitStatus = 'Tersedia' | 'Sedang Dimainkan' | 'Maintenance';

/**
 * Type Alias untuk metode pembayaran sewa
 */
export type PaymentMethod = 'Cash' | 'QRIS' | 'Transfer Bank';

/**
 * Interface untuk data item aksesori tambahan (stik ekstra, headset, dll.)
 */
export interface AccessoryItem {
  id: string;
  name: string;
  extraPrice: number;
  selected?: boolean;
}

/**
 * Interface utama model unit PlayStation
 */
export interface RentalUnit {
  id: string;
  name: string;
  type: PSConsoleType;
  hourlyRate: number;
  status: UnitStatus;
  isVip: boolean;
  tvSize: string;
  controllerCount: number;
  popularGames: string[];
  activeDurationLeftMinutes?: number;
  currentRenterName?: string;
}

/**
 * Interface form state pemesanan rental
 */
export interface BookingFormState {
  customerName: string;
  customerPhone: string;
  durationHours: number;
  selectedAccessories: string[];
  paymentMethod: PaymentMethod;
  notes: string;
}

/**
 * Interface hasil transaksi rental yang berhasil
 */
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
 * Interface sesi bermain aktif untuk pelacakan live countdown timer
 */
export interface ActiveSession {
  sessionId: string;
  unitId: string;
  unitName: string;
  customerName: string;
  startTime: string;
  initialDurationMinutes: number;
  remainingSeconds: number; // total sisa waktu dalam detik untuk live countdown
  totalPaid: number;
  status: 'ACTIVE' | 'WARNING' | 'COMPLETED';
}
