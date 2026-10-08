// ============================================================================
// MATERI 2: KOMPONEN (Modular Functional Component)
// MATERI 3.1: INTERNAL STYLING (StyleSheet.create dalam file yang sama)
// MATERI 5.2: CONDITIONS (Ternary Operator & Equality Check)
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UnitStatus } from '../types/rental.types';

interface StatusBadgeProps {
  status: UnitStatus;
  size?: 'small' | 'medium';
}

/**
 * [2. KOMPONEN] Komponen StatusBadge reusable
 * Menerima props 'status' dan 'size'.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  // [5.2] CONDITIONS: Penentuan warna & icon dengan Ternary & if-else logic
  const isTersedia = status === 'Tersedia';
  const isDimainkan = status === 'Sedang Dimainkan';

  // [5.2] Nested Ternary Operator
  const badgeBg = isTersedia
    ? '#064E3B' // Emerald 900
    : isDimainkan
    ? '#78350F' // Amber 900
    : '#7F1D1D'; // Rose 900

  const badgeBorder = isTersedia
    ? '#059669' // Emerald 600
    : isDimainkan
    ? '#D97706' // Amber 600
    : '#DC2626'; // Rose 600

  const textColor = isTersedia
    ? '#6EE7B7' // Emerald 300
    : isDimainkan
    ? '#FCD34D' // Amber 300
    : '#FCA5A5'; // Rose 300

  const icon = isTersedia ? '🟢' : isDimainkan ? '🟡' : '🔴';

  // [1.2] RETURN KOMPONEN REACT
  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: badgeBg,
          borderColor: badgeBorder,
          paddingVertical: size === 'medium' ? 6 : 4,
          paddingHorizontal: size === 'medium' ? 10 : 8,
        },
      ]}
    >
      <Text style={styles.iconText}>{icon}</Text>
      <Text style={[styles.badgeText, { color: textColor }]}>{status}</Text>
    </View>
  );
};

// ============================================================================
// [3.1] INTERNAL STYLING:
// StyleSheet.create yang dibuat khusus di dalam berkas komponen ini sendiri.
// ============================================================================
const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconText: {
    fontSize: 10,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
