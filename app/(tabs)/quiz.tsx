import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { router } from 'expo-router'
import { useProgressStore } from '../../src/store/progress'
import type { QuizMode } from '../../src/lib/quizUtils'

type ModeCard = { mode: QuizMode; title: string; subtitle: string }

const MODES: ModeCard[] = [
  { mode: 'all', title: 'Full Quiz', subtitle: '53 questions — mirrors the real test' },
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
        <Text style={styles.heading}>NevadaDMV</Text>
        <Text style={styles.sub}>Need 40/50 (80%) to pass · Las Vegas, NV</Text>
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
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  container: { padding: 24 },
  heading: { fontSize: 32, fontWeight: '900', color: '#f0f0f0', letterSpacing: -1, marginBottom: 4 },
  sub: { fontSize: 13, color: '#555', marginBottom: 32 },
  card: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#f0f0f0', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#888' },
  best: { fontSize: 13, color: '#e63329', fontWeight: '700', marginLeft: 12 },
})
