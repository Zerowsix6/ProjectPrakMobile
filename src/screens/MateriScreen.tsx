// ============================================================================
// SCREEN 2: LAB MATERI SCREEN (SILABUS & SINTAKS DASAR)
// Menampilkan seluruh materi 1 - 5 secara terstruktur dan interaktif.
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SYLLABUS_MODULES } from '../data/rentalData';
import { externalStyles } from '../styles/externalStyles';
import {
  formatRupiah,
  formatNamaKapital,
  hitungDiskonPersen,
  hitungRincianJamDenganPrimitiveLoop,
  hitungSlotWaktuDenganWhileLoop,
} from '../utils/rentalFunctions';

export const MateriScreen: React.FC = () => {
  // [5.1] VARIABLE: state modul yang sedang dibuka (Accordion)
  const [expandedModuleId, setExpandedModuleId] = useState<string>('M1');

  // State untuk Live Sandbox Demo
  const [demoHour, setDemoHour] = useState<number>(4);
  const [callbackLog, setCallbackLog] = useState<string>('Belum ada callback yang dipanggil.');

  // Toggle modul accordion
  const handleToggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? '' : id);
  };

  // Demo 5.3.C: Callback function tester
  const handleTestCallback = () => {
    // Definisi fungsi callback
    const myCallback = (statusText: string, timestamp: number) => {
      const hasil = `✅ Callback terpanggil pada ${new Date(timestamp).toLocaleTimeString()}: "${statusText}"`;
      setCallbackLog(hasil);
      Alert.alert('Callback Berhasil', hasil);
    };

    // Panggil fungsi yang menerima callback
    executeCustomCallback('Pembayaran Rental Disetujui!', myCallback);
  };

  const executeCustomCallback = (
    pesan: string,
    callback: (pesan: string, waktu: number) => void
  ) => {
    // Eksekusi callback
    callback(pesan, Date.now());
  };

  // Kalkulasi live primitive loop untuk demo 5.4.C
  const primitiveResult = hitungRincianJamDenganPrimitiveLoop(demoHour, 15000);
  const whileResult = hitungSlotWaktuDenganWhileLoop(demoHour * 60);

  return (
    <ScrollView style={externalStyles.mainContainer} contentContainerStyle={styles.containerPadding}>
      {/* Intro Banner */}
      <View style={styles.introCard}>
        <Text style={styles.introBadge}>📖 BUKU PANDUAN PRAKTIKUM</Text>
        <Text style={styles.introTitle}>Silabus Sintaks & UI Dasar React Native</Text>
        <Text style={styles.introDesc}>
          Proyek <Text style={{ color: '#38BDF8', fontWeight: '700' }}>RentalPs</Text> ini dirancang mencakup seluruh modul pembelajaran pemrograman mobile berbasis TypeScript dan React Native (Expo).
        </Text>
      </View>

      {/* Interactive Live Playground: Menjalankan Sintaks TypeScript */}
      <View style={styles.playgroundCard}>
        <View style={externalStyles.rowBetween}>
          <Text style={styles.playgroundHeader}>⚡ LIVE PLAYGROUND SINTAKS TS</Text>
          <Text style={{ fontSize: 10, color: '#F59E0B', fontWeight: '700' }}>INTERAKTIF</Text>
        </View>

        {/* Demo 5.3 Functions & 5.4.C Primitive Loop */}
        <View style={{ marginTop: 8 }}>
          <Text style={styles.playLabel}>1. Uji Primitive For-Loop & Function Diskon (5.3 & 5.4.C):</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              onPress={() => setDemoHour(Math.max(1, demoHour - 1))}
              style={styles.stepMiniBtn}
            >
              <Text style={styles.stepBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.stepCurrentText}>Simulasi Sewa: {demoHour} Jam</Text>
            <TouchableOpacity
              onPress={() => setDemoHour(Math.min(10, demoHour + 1))}
              style={styles.stepMiniBtn}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              • Diskon [5.3.B Custom]: {hitungDiskonPersen(demoHour)}%
            </Text>
            <Text style={styles.resultText}>
              • Total Tagihan [5.4.C For Loop]: {formatRupiah(primitiveResult.totalDariLoop)}
            </Text>
            <Text style={styles.resultText}>
              • Pembagian Slot [5.4.C While Loop]: {whileResult.length} sesi
            </Text>
          </View>
        </View>

        {/* Demo 5.3.C Callback Function */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.playLabel}>2. Uji Callback Function (5.3.C Bonus):</Text>
          <TouchableOpacity
            onPress={handleTestCallback}
            style={[externalStyles.primaryButton, { paddingVertical: 8, marginTop: 4 }]}
          >
            <Text style={externalStyles.primaryButtonText}>▶ Jalankan Callback Handler</Text>
          </TouchableOpacity>
          <Text style={styles.logText}>{callbackLog}</Text>
        </View>
      </View>

      {/* Daftar Modul Silabus Pembelajaran */}
      <Text style={[externalStyles.sectionTitle, { marginTop: 16 }]}>
        Daftar Modul Silabus Materi
      </Text>

      {SYLLABUS_MODULES.map((modul) => {
        const isExpanded = expandedModuleId === modul.id;
        return (
          <View key={modul.id} style={styles.moduleCard}>
            <TouchableOpacity
              onPress={() => handleToggleModule(modul.id)}
              style={styles.moduleHeader}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleTitle}>{modul.title}</Text>
                <Text style={styles.moduleSubtitle}>{modul.subtitle}</Text>
              </View>
              <Text style={styles.accordionIcon}>{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {/* Konten Rincian Modul */}
            {isExpanded && (
              <View style={styles.moduleBody}>
                {modul.points.map((pt, idx) => (
                  <View key={idx} style={styles.pointItem}>
                    <View style={styles.pointBadge}>
                      <Text style={styles.pointNumber}>{pt.number}</Text>
                      <Text style={styles.pointTopic}>{pt.topic}</Text>
                    </View>
                    <Text style={styles.pointExplanation}>{pt.explanation}</Text>

                    {/* Code Snippet Box */}
                    <View style={styles.codeContainer}>
                      <Text style={styles.codeText}>{pt.codeSnippet}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerPadding: {
    padding: 16,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#38BDF8',
  },
  introBadge: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  introTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  introDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 18,
  },
  playgroundCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2563EB',
    marginBottom: 14,
  },
  playgroundHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#93C5FD',
  },
  playLabel: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
    marginBottom: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  stepMiniBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepBtnText: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: 14,
  },
  stepCurrentText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  resultBox: {
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    gap: 2,
  },
  resultText: {
    color: '#E2E8F0',
    fontSize: 11,
  },
  logText: {
    color: '#A7F3D0',
    fontSize: 11,
    marginTop: 6,
    fontFamily: 'monospace',
  },
  moduleCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#1E293B',
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  moduleSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  accordionIcon: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
  },
  moduleBody: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  pointItem: {
    marginBottom: 14,
  },
  pointBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pointNumber: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pointTopic: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  pointExplanation: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 6,
  },
  codeContainer: {
    backgroundColor: '#020617',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  codeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
