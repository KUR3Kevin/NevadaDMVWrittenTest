import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { router } from 'expo-router'
import { useProgressStore } from '../../src/store/progress'
import { QUESTIONS } from '../../src/data/questions'

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
        <Text style={styles.heading}>Progress</Text>

        <View style={styles.row}>
          {[
            { num: currentStreak, label: 'Day Streak' },
            { num: longestStreak, label: 'Best Streak' },
            { num: runs.length, label: 'Total Runs' },
          ].map(({ num, label }) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {recentRuns.length > 0 && (
          <>
            <Text style={styles.section}>Recent Runs</Text>
            {recentRuns.map((run, i) => {
              const pct = Math.round((run.score / run.total) * 100)
              return (
                <View key={i} style={styles.runRow}>
                  <View>
                    <Text style={styles.runMode}>{run.mode.toUpperCase()}</Text>
                    <Text style={styles.runDate}>{run.date}</Text>
                  </View>
                  <Text style={[styles.runScore, pct >= 80 ? styles.pass : styles.fail]}>{pct}%</Text>
                </View>
              )
            })}
          </>
        )}

        {weakItems.length > 0 && (
          <>
            <View style={styles.weakHeader}>
              <Text style={styles.section}>Weak Areas ({weakItems.length})</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: 'weak' } })}>
                <Text style={styles.drill}>Drill →</Text>
              </TouchableOpacity>
            </View>
            {weakItems.map(({ q, count }) => (
              <View key={q.id} style={styles.weakItem}>
                <Text style={styles.weakQ} numberOfLines={2}>{q.question}</Text>
                <Text style={styles.weakCount}>×{count}</Text>
              </View>
            ))}
          </>
        )}

        {runs.length === 0 && (
          <Text style={styles.empty}>Complete a quiz to see your progress here.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  container: { padding: 24 },
  heading: { fontSize: 32, fontWeight: '900', color: '#f0f0f0', letterSpacing: -1, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 16, alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '900', color: '#e63329' },
  statLabel: { fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, textAlign: 'center' },
  section: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, color: '#555', marginBottom: 12 },
  runRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 8 },
  runMode: { fontSize: 13, fontWeight: '700', color: '#f0f0f0' },
  runDate: { fontSize: 12, color: '#555', marginTop: 2 },
  runScore: { fontSize: 18, fontWeight: '900' },
  pass: { color: '#2ecc71' },
  fail: { color: '#e74c3c' },
  weakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  drill: { color: '#e63329', fontWeight: '700', fontSize: 14 },
  weakItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 8 },
  weakQ: { fontSize: 13, color: '#f0f0f0', flex: 1, marginRight: 12 },
  weakCount: { fontSize: 13, color: '#e74c3c', fontWeight: '800' },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 15, lineHeight: 24 },
})
