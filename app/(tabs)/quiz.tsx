import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useProgressStore } from '../../src/store/progress'
import { QUESTIONS } from '../../src/data/questions'
import type { QuizMode } from '../../src/lib/quizUtils'
import { Disclaimer } from '../../src/components/Disclaimer'
import { theme } from '../../src/theme'

type ModeCard = { mode: QuizMode; title: string; subtitle: string; recommended?: boolean }

const MODES: ModeCard[] = [
  { mode: 'exam', title: 'Practice Test', subtitle: '25 questions, just like the real Nevada test. Start here.', recommended: true },
  { mode: 'quick', title: 'Quick 20', subtitle: 'A shorter 20-question quiz.' },
  { mode: 'tf', title: 'True or False', subtitle: 'Simple yes-or-no questions.' },
  { mode: 'all', title: 'All Questions', subtitle: `Study every question in the bank (${QUESTIONS.length}).` },
]

export default function QuizTab() {
  const getBestScore = useProgressStore(s => s.getBestScore)
  const getWeakQuestionIds = useProgressStore(s => s.getWeakQuestionIds)
  const weakCount = getWeakQuestionIds().length

  const cards: ModeCard[] = [
    ...MODES,
    ...(weakCount > 0 ? [{ mode: 'weak' as QuizMode, title: 'Practice Missed Questions', subtitle: `${weakCount} questions you missed more than once` }] : []),
  ]

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading} accessibilityRole="header">Nevada DMV Practice</Text>
        <Text style={styles.sub}>Pass with 20 out of 25 correct (80%).</Text>
        <Text style={styles.howto}>Tap a big button below to begin. Use Study at the bottom for flashcards and road signs.</Text>
        {cards.map(card => {
          const best = getBestScore(card.mode)
          return (
            <TouchableOpacity
              key={card.mode}
              style={[styles.card, card.recommended && styles.cardRecommended]}
              onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: card.mode } })}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`${card.title}. ${card.subtitle}${best !== null ? `. Best score ${best} percent` : ''}`}
            >
              <View style={styles.cardLeft}>
                {card.recommended && <Text style={styles.badge}>START HERE</Text>}
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSub}>{card.subtitle}</Text>
                {best !== null && <Text style={styles.best}>Your best: {best}%</Text>}
              </View>
              <View style={styles.startPill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <Text style={styles.startText}>Start</Text>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.text} />
              </View>
            </TouchableOpacity>
          )
        })}
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
  heading: { fontSize: theme.font.h1, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginBottom: 8 },
  sub: { fontSize: 18, color: theme.colors.text, fontWeight: '700', marginBottom: 8 },
  howto: { fontSize: 16, color: theme.colors.textDim, lineHeight: 24, marginBottom: 24 },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 20,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: theme.tap,
    gap: 12,
  },
  cardRecommended: { borderColor: theme.colors.accent, borderWidth: 2 },
  cardLeft: { flex: 1 },
  badge: { fontSize: 12, fontWeight: '800', color: theme.colors.accent, letterSpacing: 0.8, marginBottom: 6 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.text, marginBottom: 6 },
  cardSub: { fontSize: 16, color: theme.colors.textDim, lineHeight: 22 },
  best: { fontSize: 15, color: theme.colors.success, fontWeight: '700', marginTop: 8 },
  startPill: {
    backgroundColor: theme.colors.accent,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 48,
  },
  startText: { color: theme.colors.text, fontSize: 16, fontWeight: '800' },
  disclaimerWrap: { marginTop: 16 },
})
