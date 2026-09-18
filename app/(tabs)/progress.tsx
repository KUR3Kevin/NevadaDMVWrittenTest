import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useProgressStore } from '../../src/store/progress'
import { QUESTIONS } from '../../src/data/questions'
import { MODE_LABELS } from '../../src/lib/quizUtils'
import { theme } from '../../src/theme'

export default function ProgressTab() {
  const { runs, currentStreak, longestStreak, wrongCounts } = useProgressStore()
  const getWeakQuestionIds = useProgressStore(s => s.getWeakQuestionIds)

  const weakIds = getWeakQuestionIds()
  const weakItems = weakIds
    .map(id => ({ q: QUESTIONS.find(q => q.id === id)!, count: wrongCounts[id] }))
    .filter(item => item.q)
    .sort((a, b) => b.count - a.count)

  const recentRuns = [...runs].reverse().slice(0, 10)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading} accessibilityRole="header">Your scores</Text>

        <View style={styles.row}>
          {[
            { num: currentStreak, label: 'Day streak' },
            { num: longestStreak, label: 'Best streak' },
            { num: runs.length, label: 'Quizzes taken' },
          ].map(({ num, label }) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {recentRuns.length > 0 && (
          <>
            <Text style={styles.section}>Recent quizzes</Text>
            {recentRuns.map((run, i) => {
              const pct = Math.round((run.score / run.total) * 100)
              const passed = pct >= 80
              return (
                <View key={`${run.date}-${i}`} style={styles.runRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.runMode}>{MODE_LABELS[run.mode] ?? run.mode}</Text>
                    <Text style={styles.runDate}>{run.score} of {run.total} correct · {run.date}</Text>
                  </View>
                  <Text style={[styles.runScore, passed ? styles.pass : styles.fail]}>{passed ? 'Pass' : 'Retry'} {pct}%</Text>
                </View>
              )
            })}
          </>
        )}

        {weakItems.length > 0 && (
          <>
            <View style={styles.weakHeader}>
              <Text style={styles.section}>Missed often ({weakItems.length})</Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: 'weak' } })}
                style={styles.drillBtn}
                accessibilityRole="button"
                accessibilityLabel="Practice missed questions"
              >
                <Text style={styles.drill}>Practice</Text>
              </TouchableOpacity>
            </View>
            {weakItems.map(({ q, count }) => (
              <View key={q.id} style={styles.weakItem}>
                <Text style={styles.weakQ}>{q.question}</Text>
                <Text style={styles.weakCount}>Missed {count}×</Text>
              </View>
            ))}
          </>
        )}

        {runs.length === 0 && (
          <>
            <Text style={styles.empty}>Take a quiz and your scores will show up here.</Text>
            <TouchableOpacity
              style={styles.cta}
              onPress={() => router.navigate('/(tabs)/quiz')}
              accessibilityRole="button"
              accessibilityLabel="Go home and start a quiz"
            >
              <Text style={styles.ctaText}>Go start a quiz</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  container: { padding: 24, paddingBottom: 40 },
  heading: { fontSize: theme.font.h1, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  stat: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '900', color: theme.colors.accent },
  statLabel: { fontSize: 13, color: theme.colors.textDim, fontWeight: '700', marginTop: 6, textAlign: 'center' },
  section: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 12 },
  runRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 10, gap: 12 },
  runMode: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  runDate: { fontSize: 14, color: theme.colors.textDim, marginTop: 4 },
  runScore: { fontSize: 16, fontWeight: '800' },
  pass: { color: theme.colors.success },
  fail: { color: theme.colors.accent },
  weakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8, gap: 12 },
  drillBtn: { backgroundColor: theme.colors.accent, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, minHeight: 44, justifyContent: 'center' },
  drill: { color: theme.colors.text, fontWeight: '800', fontSize: 15 },
  weakItem: { padding: 16, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 10 },
  weakQ: { fontSize: 16, color: theme.colors.text, lineHeight: 22, marginBottom: 6 },
  weakCount: { fontSize: 14, color: theme.colors.accent, fontWeight: '800' },
  empty: { color: theme.colors.textDim, textAlign: 'center', marginTop: 24, fontSize: 17, lineHeight: 26, marginBottom: 20 },
  cta: { backgroundColor: theme.colors.accent, paddingVertical: 18, borderRadius: theme.radius.md, alignItems: 'center', minHeight: theme.tap, justifyContent: 'center' },
  ctaText: { color: theme.colors.text, fontSize: 18, fontWeight: '800' },
})
