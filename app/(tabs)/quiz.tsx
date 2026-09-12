import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { router } from 'expo-router'
import { useProgressStore } from '../../src/store/progress'
import { QUESTIONS } from '../../src/data/questions'
import type { QuizMode } from '../../src/lib/quizUtils'
import { Disclaimer } from '../../src/components/Disclaimer'
import { theme } from '../../src/theme'

type ModeCard = { mode: QuizMode; title: string; subtitle: string }

const MODES: ModeCard[] = [
  { mode: 'exam', title: 'Practice Test', subtitle: '25 questions — same length as the official NV knowledge test' },
  { mode: 'all', title: 'Study Bank', subtitle: `${QUESTIONS.length} handbook questions covering signs, rules, and safety` },
  { mode: 'quick', title: 'Quick 20', subtitle: '20 random questions' },
  { mode: 'tf', title: 'True / False', subtitle: 'Yes/No questions only' },
]

export default function QuizTab() {
  const getBestScore = useProgressStore(s => s.getBestScore)
  const getWeakQuestionIds = useProgressStore(s => s.getWeakQuestionIds)
  const weakCount = getWeakQuestionIds().length

  const cards: ModeCard[] = [
    ...MODES,
    ...(weakCount > 0 ? [{ mode: 'weak' as QuizMode, title: 'Weak Areas', subtitle: `${weakCount} questions you keep missing` }] : []),
  ]

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Nevada DMV</Text>
        <Text style={styles.sub}>Official knowledge test: 20/25 (80%) to pass</Text>
        {cards.map(card => {
          const best = getBestScore(card.mode)
          return (
            <TouchableOpacity
              key={card.mode}
              style={styles.card}
              onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: card.mode } })}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSub}>{card.subtitle}</Text>
              </View>
              {best !== null && <Text style={styles.best}>Best {best}%</Text>}
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
  container: { padding: 24 },
  heading: { fontSize: theme.font.h1, fontWeight: '900', color: theme.colors.text, letterSpacing: -1, marginBottom: 4 },
  sub: { fontSize: theme.font.small, color: theme.colors.textMute, marginBottom: 32 },
  card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  cardSub: { fontSize: theme.font.small, color: theme.colors.textDim },
  best: { fontSize: theme.font.small, color: theme.colors.accent, fontWeight: '700', marginLeft: 12 },
  disclaimerWrap: { marginTop: 16 },
})
