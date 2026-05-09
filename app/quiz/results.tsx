import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { QUESTIONS } from '../../src/data/questions'
import { ScoreCircle } from '../../src/components/ScoreCircle'

export default function ResultsScreen() {
  const { score, total, missed, mode } = useLocalSearchParams<{
    score: string; total: string; missed: string; mode: string
  }>()

  const scoreNum = Number(score)
  const totalNum = Number(total)
  const missedIds: number[] = JSON.parse(missed ?? '[]')
  const missedQuestions = missedIds.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean) as typeof QUESTIONS

  const passed = scoreNum / totalNum >= 0.8
  const needed = Math.ceil(totalNum * 0.8)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScoreCircle score={scoreNum} total={totalNum} />

        <Text style={styles.title}>{passed ? 'You Passed! 🎉' : 'Keep Studying'}</Text>
        <Text style={styles.sub}>
          {passed
            ? `${scoreNum}/${totalNum} correct — you met Nevada's 80% passing score.`
            : `${scoreNum}/${totalNum} correct. Need ${needed} to pass (${needed - scoreNum} more).`}
        </Text>

        {missedQuestions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Review These ({missedQuestions.length})</Text>
            {missedQuestions.map(q => (
              <View key={q.id} style={styles.missItem}>
                <Text style={styles.missQ}>{q.question}</Text>
                <Text style={styles.missA}>✓ {q.options[q.correct]}</Text>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace({ pathname: '/quiz/[mode]', params: { mode } })}>
          <Text style={styles.primaryText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => router.replace('/(tabs)/quiz')}>
          <Text style={styles.outlineText}>Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  container: { padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#f0f0f0', textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  sectionTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, color: '#555', marginBottom: 12 },
  missItem: { padding: 16, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 8 },
  missQ: { fontSize: 14, color: '#f0f0f0', marginBottom: 6, lineHeight: 20 },
  missA: { fontSize: 13, color: '#2ecc71', fontWeight: '700' },
  primaryBtn: { backgroundColor: '#e63329', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32, marginBottom: 10 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  outlineBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 12, alignItems: 'center' },
  outlineText: { color: '#888', fontSize: 15, fontWeight: '600' },
})
