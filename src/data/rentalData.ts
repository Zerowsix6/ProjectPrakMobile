// ============================================================================
// DATA MODULAR: KATALOG RENTAL PLAYSTATION & AKSESORI
// ============================================================================

import { RentalUnit, AccessoryItem, ActiveSession } from '../types/rental.types';

export const SHOP_NAME: string = "PlayStation Rental Pro - Garasi Gaming";
export const MIN_RENTAL_HOURS: number = 1;
export const MAX_RENTAL_HOURS: number = 12;
export const IS_OPEN_24_HOURS: boolean = true;

/**
 * Katalog Unit PlayStation Awal
 */
export const INITIAL_RENTAL_UNITS: RentalUnit[] = [
  {
    id: 'PS-01',
    name: 'Unit 01 - PS5 Digital Arena',
    type: 'PS5',
    hourlyRate: 15000,
    status: 'Tersedia',
    isVip: true,
    tvSize: '55 Inch 4K HDR',
    controllerCount: 2,
    popularGames: ['EA FC 24', 'Spider-Man 2', 'God of War Ragnarok'],
  },
  {
    id: 'PS-02',
    name: 'Unit 02 - PS5 Disc Battle',
    type: 'PS5',
    hourlyRate: 15000,
    status: 'Sedang Dimainkan',
    isVip: true,
    tvSize: '50 Inch 4K UHD',
    controllerCount: 2,
    popularGames: ['Tekken 8', 'FC 24', 'GTA V Remastered'],
    activeDurationLeftMinutes: 45,
    currentRenterName: 'Rian Pratama',
  },
  {
    id: 'PS-03',
    name: 'Unit 03 - PS4 Pro Legends',
    type: 'PS4',
    hourlyRate: 10000,
    status: 'Tersedia',
    isVip: false,
    tvSize: '43 Inch Full HD',
    controllerCount: 2,
    popularGames: ['PES 2021 Season Update', 'Naruto Storm 4', 'UFC 4'],
  },
  {
    id: 'PS-04',
    name: 'Unit 04 - PS4 Slim Squad',
    type: 'PS4',
    hourlyRate: 8000,
    status: 'Sedang Dimainkan',
    isVip: false,
    tvSize: '40 Inch Full HD',
    controllerCount: 2,
    popularGames: ['FIFA 23', 'Mortal Kombat 11', 'Crash Bandicoot'],
    activeDurationLeftMinutes: 90,
    currentRenterName: 'Budi Santoso',
  },
  {
    id: 'PS-05',
    name: 'Unit 05 - PS VR2 Next-Gen Immersion',
    type: 'PS_VR2',
    hourlyRate: 25000,
    status: 'Tersedia',
    isVip: true,
    tvSize: '65 Inch OLED',
    controllerCount: 2,
    popularGames: ['Horizon Call of the Mountain', 'Resident Evil Village VR', 'Beat Saber'],
  },
  {
    id: 'PS-06',
    name: 'Unit 06 - PS3 Nostalgia Retro',
    type: 'PS3',
    hourlyRate: 5000,
    status: 'Tersedia',
    isVip: false,
    tvSize: '32 Inch HD',
    controllerCount: 2,
    popularGames: ['GTA San Andreas', 'Guitar Hero', 'Winning Eleven 9', 'Downhill'],
  },
  {
    id: 'PS-07',
    name: 'Unit 07 - PS4 Slim Standby',
    type: 'PS4',
    hourlyRate: 8000,
    status: 'Maintenance',
    isVip: false,
    tvSize: '40 Inch Full HD',
    controllerCount: 1,
    popularGames: ['Need for Speed Heat', 'Gran Turismo Sport'],
  },
];

/**
 * Daftar Item Aksesori Tambahan & Snack
 */
export const ACCESSORIES_DATA: AccessoryItem[] = [
  { id: 'ACC-01', name: 'Stik Tambahan (Stick ke-3 & 4)', extraPrice: 5000 },
  { id: 'ACC-02', name: 'Gaming Headset Surround 7.1', extraPrice: 3000 },
  { id: 'ACC-03', name: 'Paket Minuman Dingin + Snack', extraPrice: 10000 },
  { id: 'ACC-04', name: 'Charging Dock & Thumb Grip Pro', extraPrice: 2000 },
];

/**
 * Data Sesi Bermain Aktif Awal (untuk demonstrasi Live Countdown Hook useEffect)
 */
export const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    sessionId: 'SES-901',
    unitId: 'PS-02',
    unitName: 'Unit 02 - PS5 Disc Battle',
    customerName: 'Rian Pratama',
    startTime: '13:00 WIB',
    initialDurationMinutes: 120,
    remainingSeconds: 45 * 60, // 45 menit tersisa
    totalPaid: 30000,
    status: 'ACTIVE',
  },
  {
    sessionId: 'SES-902',
    unitId: 'PS-04',
    unitName: 'Unit 04 - PS4 Slim Squad',
    customerName: 'Budi Santoso',
    startTime: '13:30 WIB',
    initialDurationMinutes: 180,
    remainingSeconds: 90 * 60, // 90 menit tersisa
    totalPaid: 24000,
    status: 'ACTIVE',
  },
];
