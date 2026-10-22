// ============================================================================
// CONTEXT: RENTAL STATE MANAGEMENT
// Menerapkan useState & useEffect untuk sinkronisasi data global & live timer
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RentalUnit, ActiveSession, BookingResult } from '../types/rental.types';
import { INITIAL_RENTAL_UNITS, INITIAL_ACTIVE_SESSIONS } from '../data/rentalData';

interface RentalContextType {
  units: RentalUnit[];
  activeSessions: ActiveSession[];
  bookingHistory: BookingResult[];
  availableCount: number;
  totalCount: number;
  addNewBooking: (booking: BookingResult) => void;
  finishSession: (sessionId: string) => void;
  extendSession: (sessionId: string, additionalMinutes: number) => void;
  getUnitById: (id: string) => RentalUnit | undefined;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // [STATE] 1: useState untuk katalog unit rental
  const [units, setUnits] = useState<RentalUnit[]>(INITIAL_RENTAL_UNITS);

  // [STATE] 2: useState untuk sesi bermain yang sedang berjalan
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_ACTIVE_SESSIONS);

  // [STATE] 3: useState untuk riwayat transaksi
  const [bookingHistory, setBookingHistory] = useState<BookingResult[]>([]);

  // [HOOK useEffect] 1: Live Countdown Timer Interval dengan Fungsi Cleanup
  // Menghitung mundur sisa detik sesi bermain aktif setiap 1 detik
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setActiveSessions((prevSessions) => {
        // Cek jika tidak ada sesi aktif
        if (prevSessions.length === 0) return prevSessions;

        return prevSessions.map((session) => {
          if (session.status === 'COMPLETED') {
            return session;
          }

          const nextSeconds = session.remainingSeconds - 1;

          if (nextSeconds <= 0) {
            // Sesi bermain telah habis! Otomatis ubah status unit jadi Tersedia
            setUnits((prevUnits) =>
              prevUnits.map((u) =>
                u.id === session.unitId
                  ? {
                      ...u,
                      status: 'Tersedia',
                      currentRenterName: undefined,
                      activeDurationLeftMinutes: undefined,
                    }
                  : u
              )
            );

            return {
              ...session,
              remainingSeconds: 0,
              status: 'COMPLETED',
            };
          }

          return {
            ...session,
            remainingSeconds: nextSeconds,
            status: nextSeconds <= 300 ? 'WARNING' : 'ACTIVE', // Warning jika < 5 menit
          };
        });
      });
    }, 1000);

    // CLEANUP FUNCTION: Menghapus interval saat komponen unmount untuk cegah memory leak
    return () => {
      clearInterval(timerInterval);
    };
  }, []); // Dependency array kosong: berjalan sekali saat provider dimount

  // Menghitung jumlah unit siap sewa
  const availableCount = units.filter((u) => u.status === 'Tersedia').length;
  const totalCount = units.length;

  // Fungsi menambah transaksi baru
  const addNewBooking = (booking: BookingResult) => {
    // 1. Update status unit
    setUnits((prevUnits) =>
      prevUnits.map((u) =>
        u.id === booking.unitId
          ? {
              ...u,
              status: 'Sedang Dimainkan',
              currentRenterName: booking.customerName,
              activeDurationLeftMinutes: booking.durationHours * 60,
            }
          : u
      )
    );

    // 2. Tambah sesi aktif baru
    const newSession: ActiveSession = {
      sessionId: `SES-${Date.now().toString().slice(-4)}`,
      unitId: booking.unitId,
      unitName: booking.unitName,
      customerName: booking.customerName,
      startTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      initialDurationMinutes: booking.durationHours * 60,
      remainingSeconds: booking.durationHours * 3600,
      totalPaid: booking.grandTotal,
      status: 'ACTIVE',
    };

    setActiveSessions((prev) => [newSession, ...prev]);

    // 3. Tambah riwayat transaksi
    setBookingHistory((prev) => [booking, ...prev]);
  };

  // Fungsi menyelesaikan sesi bermain lebih awal
  const finishSession = (sessionId: string) => {
    const targetSession = activeSessions.find((s) => s.sessionId === sessionId);
    if (!targetSession) return;

    // Set unit kembali Tersedia
    setUnits((prevUnits) =>
      prevUnits.map((u) =>
        u.id === targetSession.unitId
          ? {
              ...u,
              status: 'Tersedia',
              currentRenterName: undefined,
              activeDurationLeftMinutes: undefined,
            }
          : u
      )
    );

    // Set status session selesai
    setActiveSessions((prev) =>
      prev.map((s) => (s.sessionId === sessionId ? { ...s, remainingSeconds: 0, status: 'COMPLETED' } : s))
    );
  };

  // Fungsi perpanjang durasi main
  const extendSession = (sessionId: string, additionalMinutes: number) => {
    setActiveSessions((prev) =>
      prev.map((s) =>
        s.sessionId === sessionId
          ? {
              ...s,
              remainingSeconds: s.remainingSeconds + additionalMinutes * 60,
              status: 'ACTIVE',
            }
          : s
      )
    );
  };

  const getUnitById = (id: string) => {
    return units.find((u) => u.id === id);
  };

  return (
    <RentalContext.Provider
      value={{
        units,
        activeSessions,
        bookingHistory,
        availableCount,
        totalCount,
        addNewBooking,
        finishSession,
        extendSession,
        getUnitById,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental harus digunakan di dalam RentalProvider');
  }
  return context;
};
