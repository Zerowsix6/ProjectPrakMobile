// ============================================================================
// MATERI 1.1: STRUKTUR IMPORT
// MATERI 1.2: RETURN KOMPONEN REACT
// MATERI 2: KOMPONEN
// MATERI 3.1: INTERNAL STYLING
// MATERI 3.2: EXTERNAL STYLING
// ============================================================================

// [1.1] Struktur Import: Library utama
import React from 'react';
// [1.1] Struktur Import: Komponen bawaan React Native
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// [1.1] Struktur Import: External Stylesheet (3.2)
import { externalStyles } from '../styles/externalStyles';
// [1.1] Struktur Import: Types (5.5.B)
import { SHOP_NAME } from '../data/rentalData';

interface HeaderRentalProps {
  activeTab: 'rental' | 'materi';
  // [5.3.C] Callback Function Prop
  onTabChange: (tab: 'rental' | 'materi') => void;
  availableCount: number;
  totalCount: number;
}

/**
 * [2. KOMPONEN] HeaderRental Component
 */
export const HeaderRental: React.FC<HeaderRentalProps> = ({
  activeTab,
  onTabChange,
  availableCount,
  totalCount,
}) => {
  // [1.2] RETURN KOMPONEN REACT:
  // Mengembalikan hierarki JSX tunggal
  return (
    <View style={styles.headerWrapper}>
      {/* Brand Header */}
      <View style={externalStyles.rowBetween}>
        <View style={{ flex: 1 }}>
          <View style={styles.badgeLabel}>
            <Text style={styles.badgeLabelText}>🎮 SISTEM RENTAL PS</Text>
          </View>
          <Text style={styles.shopTitle} numberOfLines={1}>
            {SHOP_NAME}
          </Text>
          <Text style={styles.subtitle}>
            Unit Siap Main: {availableCount} dari {totalCount} Unit
          </Text>
        </View>
      </View>

      {/* [5.2] CONDITIONS & [5.3.C] CALLBACK EVENT: Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          // [5.3.C] Callback Function dipanggil saat ditekan
          onPress={() => onTabChange('rental')}
          style={[
            styles.tabButton,
            // [5.2] CONDITIONS (Ternary untuk styling aktif)
            activeTab === 'rental' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'rental' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            🕹️ Katalog & Sewa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTabChange('materi')}
          style={[
            styles.tabButton,
            activeTab === 'materi' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'materi' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            📚 Lab Materi (Silabus)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================================================
// [3.1] INTERNAL STYLING:
// StyleSheet.create khusus untuk HeaderRental
// ============================================================================
const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  badgeLabel: {
    backgroundColor: '#1E3A8A', // Blue 900
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeLabelText: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginTop: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: '#94A3B8',
  },
});
