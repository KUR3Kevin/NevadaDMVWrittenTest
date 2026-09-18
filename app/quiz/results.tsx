import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { QUESTIONS } from '../../src/data/questions'
import { ScoreCircle } from '../../src/components/ScoreCircle'
import { calculatePassFail, isQuizMode, MODE_LABELS } from '../../src/lib/quizUtils'
import { Disclaimer } from '../../src/components/Disclaimer'
import { goToTab } from '../../src/lib/navigation'
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
  const hasValidScore = Number.isFinite(scoreNum) && Number.isFinite(totalNum) && totalNum > 0
  const missedIds = parseMissed(missed)
  const missedQuestions = missedIds.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean) as typeof QUESTIONS
  const rawMode = Array.isArray(mode) ? mode[0] : mode
  const quizMode = isQuizMode(rawMode) ? rawMode : 'exam'
  const modeLabel = MODE_LABELS[quizMode]

  if (!hasValidScore) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title} accessibilityRole="header">Results not found</Text>
          <Text style={styles.sub}>That quiz result is missing. Start a new practice test from Home.</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => goToTab('quiz')}
            accessibilityRole="button"
            accessibilityLabel="Go home"
          >
            <Text style={styles.primaryText}>Go home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const passed = calculatePassFail(scoreNum, totalNum)
  const needed = Math.ceil(totalNum * 0.8)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.kicker}>{modeLabel}</Text>
        <ScoreCircle score={scoreNum} total={totalNum} />

        <Text style={styles.title} accessibilityRole="header">
          {passed ? 'You passed' : 'Keep practicing'}
        </Text>
        <Text style={styles.sub}>
          {passed
            ? `${scoreNum} out of ${totalNum} correct. That meets Nevada's 80% passing score.`
            : `${scoreNum} out of ${totalNum} correct. You need ${needed} to pass — ${Math.max(needed - scoreNum, 0)} more.`}
        </Text>

        {missedQuestions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Review these ({missedQuestions.length})</Text>
            {missedQuestions.map(q => (
              <View key={q.id} style={styles.missItem}>
                <Text style={styles.missQ}>{q.question}</Text>
                <Text style={styles.missA}>Correct answer: {q.options[q.correct]}</Text>
                <Text style={styles.missWhy}>{q.explanation}</Text>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace({ pathname: '/quiz/[mode]', params: { mode: quizMode } })}
          accessibilityRole="button"
          accessibilityLabel={`Try ${modeLabel} again`}
        >
          <Text style={styles.primaryText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => goToTab('quiz')}
          accessibilityRole="button"
          accessibilityLabel="Go home"
        >
          <Text style={styles.outlineText}>Go home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => goToTab('study')}
          accessibilityRole="button"
          accessibilityLabel="Open study flashcards"
        >
          <Text style={styles.outlineText}>Study flashcards</Text>
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
  container: { padding: 24, paddingBottom: 40 },
  kicker: { fontSize: 15, color: theme.colors.textDim, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text, textAlign: 'center', marginBottom: 10 },
  sub: { fontSize: 17, color: theme.colors.textDim, textAlign: 'center', marginBottom: 32, lineHeight: 26 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 12 },
  missItem: { padding: 16, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 10 },
  missQ: { fontSize: 16, color: theme.colors.text, marginBottom: 8, lineHeight: 24 },
  missA: { fontSize: 16, color: theme.colors.success, fontWeight: '700' },
  missWhy: { fontSize: 16, color: theme.colors.textDim, lineHeight: 24, marginTop: 8 },
  primaryBtn: { backgroundColor: theme.colors.accent, paddingVertical: 18, borderRadius: theme.radius.md, alignItems: 'center', marginTop: 24, marginBottom: 12, minHeight: theme.tap, justifyContent: 'center' },
  primaryText: { color: theme.colors.text, fontSize: 18, fontWeight: '800' },
  outlineBtn: { borderWidth: 2, borderColor: theme.colors.border, paddingVertical: 16, borderRadius: theme.radius.md, alignItems: 'center', marginBottom: 10, minHeight: theme.tap, justifyContent: 'center' },
  outlineText: { color: theme.colors.text, fontSize: 17, fontWeight: '700' },
  disclaimerWrap: { marginTop: 20 },
})
