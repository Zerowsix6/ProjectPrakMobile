// ============================================================================
// MATERI 3.2: EXTERNAL STYLING
// ============================================================================
// File ini mendemonstrasikan EXTERNAL STYLING di React Native.
// Style dipisahkan ke dalam file modular tersendiri dan di-export
// agar dapat digunakan kembali (reusable) di berbagai komponen/screen.

import { StyleSheet } from 'react-native';

export const externalStyles = StyleSheet.create({
  // Container & Layout
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Typography
  titleLarge: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Card Styles (External reusable)
  cardBase: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHighlight: {
    borderColor: '#3B82F6',
    borderWidth: 1.5,
  },

  // Buttons
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontWeight: '600',
    fontSize: 13,
  },
  disabledButton: {
    backgroundColor: '#475569',
    opacity: 0.6,
  },

  // Badges & Tags
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tagItem: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },

  // Input & Form Elements
  inputField: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  // Separator & Utility
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
