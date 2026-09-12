import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { QUESTIONS } from '../../src/data/questions'
import { ScoreCircle } from '../../src/components/ScoreCircle'
import { calculatePassFail, isQuizMode } from '../../src/lib/quizUtils'
import { Disclaimer } from '../../src/components/Disclaimer'
import { theme } from '../../src/theme'

function parseMissed(raw: string | string[] | undefined): number[] {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value) return []
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === 'number') : []
  } catch {
    return []
  }
}

export default function ResultsScreen() {
  const { score, total, missed, mode } = useLocalSearchParams<{
    score: string; total: string; missed: string; mode: string
  }>()

  const scoreNum = Number(score)
  const totalNum = Number(total)
  const missedIds = parseMissed(missed)
  const missedQuestions = missedIds.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean) as typeof QUESTIONS
  const rawMode = Array.isArray(mode) ? mode[0] : mode
  const quizMode = isQuizMode(rawMode) ? rawMode : 'exam'

  const passed = calculatePassFail(scoreNum, totalNum)
  const needed = Math.ceil(totalNum * 0.8)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScoreCircle score={scoreNum} total={totalNum} />

        <Text style={styles.title}>{passed ? 'You Passed! 🎉' : 'Keep Studying'}</Text>
        <Text style={styles.sub}>
          {passed
            ? `${scoreNum}/${totalNum} correct — you met the 80% passing score used on Nevada's knowledge test.`
            : `${scoreNum}/${totalNum} correct. Need ${needed} to pass (${Math.max(needed - scoreNum, 0)} more).`}
        </Text>

        {missedQuestions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Review These ({missedQuestions.length})</Text>
            {missedQuestions.map(q => (
              <View key={q.id} style={styles.missItem}>
                <Text style={styles.missQ}>{q.question}</Text>
                <Text style={styles.missA}>✓ {q.options[q.correct]}</Text>
                <Text style={styles.missWhy}>{q.explanation}</Text>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace({ pathname: '/quiz/[mode]', params: { mode: quizMode } })}>
          <Text style={styles.primaryText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => router.replace('/(tabs)/quiz')}>
          <Text style={styles.outlineText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.disclaimerWrap}>
          <Disclaimer />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  container: { padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.text, textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 14, color: theme.colors.textDim, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  sectionTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, color: theme.colors.textMute, marginBottom: 12 },
  missItem: { padding: 16, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 8 },
  missQ: { fontSize: 14, color: theme.colors.text, marginBottom: 6, lineHeight: 20 },
  missA: { fontSize: 13, color: theme.colors.success, fontWeight: '700' },
  missWhy: { fontSize: 13, color: theme.colors.textDim, lineHeight: 20, marginTop: 8 },
  primaryBtn: { backgroundColor: theme.colors.accent, padding: 16, borderRadius: theme.radius.md, alignItems: 'center', marginTop: 32, marginBottom: 10 },
  primaryText: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
  outlineBtn: { borderWidth: 1, borderColor: theme.colors.border, padding: 16, borderRadius: theme.radius.md, alignItems: 'center' },
  outlineText: { color: theme.colors.textDim, fontSize: 15, fontWeight: '600' },
  disclaimerWrap: { marginTop: 24 },
})
