import React, { useState, useCallback, useRef } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { QUESTIONS } from '../../src/data/questions'
import { useProgressStore } from '../../src/store/progress'
import { filterQuestions } from '../../src/lib/quizUtils'
import { QuizOption, OptionState } from '../../src/components/QuizOption'
import { StreakBadge } from '../../src/components/StreakBadge'
import type { QuizMode } from '../../src/lib/quizUtils'
import { theme } from '../../src/theme'

export default function QuizScreen() {
  const { mode } = useLocalSearchParams<{ mode: QuizMode }>()
  const getWeakQuestionIds = useProgressStore(s => s.getWeakQuestionIds)
  const addRun = useProgressStore(s => s.addRun)

  const [questions] = useState(() => filterQuestions(QUESTIONS, mode, getWeakQuestionIds()))
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [optionStates, setOptionStates] = useState<OptionState[]>([])
  const [streak, setStreak] = useState(0)

  const scoreRef = useRef(0)
  const missedIdsRef = useRef<number[]>([])

  const q = questions[index]

  const pick = useCallback((choice: number) => {
    if (answered || !q) return
    setAnswered(true)
    const isCorrect = choice === q.correct

    setOptionStates(q.options.map((_, i) => {
      if (i === q.correct) return 'correct'
      if (i === choice && !isCorrect) return 'wrong'
      return 'disabled'
    }))

    if (isCorrect) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      scoreRef.current += 1
      setStreak(s => s + 1)
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      missedIdsRef.current = [...missedIdsRef.current, q.id]
      setStreak(0)
    }
  }, [answered, q])

  const next = useCallback(() => {
    if (index < questions.length - 1) {
      setIndex(i => i + 1)
      setAnswered(false)
      setOptionStates([])
    } else {
      addRun({ mode, score: scoreRef.current, total: questions.length, missedIds: missedIdsRef.current })
      router.replace({
        pathname: '/quiz/results',
        params: {
          score: String(scoreRef.current),
          total: String(questions.length),
          mode,
          missed: JSON.stringify(missedIdsRef.current),
        },
      })
    }
  }, [index, questions.length, mode, addRun])

  if (!q) return null

  const progress = ((index + 1) / questions.length) * 100
  const lastAnswerCorrect = answered && !missedIdsRef.current.includes(q.id)

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.header}>
        <Text style={styles.counter}>Q{index + 1} / {questions.length}</Text>
        <StreakBadge streak={streak} />
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.exit}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.question}>{q.question}</Text>
        {q.options.map((opt, i) => (
          <QuizOption
            key={i}
            letter={String.fromCharCode(65 + i)}
            text={opt}
            state={optionStates[i] ?? 'default'}
            onPress={() => pick(i)}
          />
        ))}

        {answered && (
          <View style={styles.explain}>
            <Text style={[styles.explainHead, { color: lastAnswerCorrect ? theme.colors.success : theme.colors.accent }]}>
              {lastAnswerCorrect ? 'Correct!' : `Incorrect — Answer: ${String.fromCharCode(65 + q.correct)}`}
            </Text>
            <Text style={styles.explainBody}>{q.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {answered && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextText}>{index < questions.length - 1 ? 'Next →' : 'See Results →'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  progressTrack: { height: 3, backgroundColor: theme.colors.border },
  progressFill: { height: 3, backgroundColor: theme.colors.accent },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  counter: { fontSize: 13, color: theme.colors.textDim, fontWeight: '600' },
  exit: { fontSize: 18, color: theme.colors.textMute },
  body: { padding: 20, paddingBottom: 120 },
  question: { fontSize: 18, fontWeight: '700', color: theme.colors.text, lineHeight: 26, marginBottom: 24 },
  explain: { marginTop: 16, padding: 16, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  explainHead: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  explainBody: { fontSize: 14, color: theme.colors.textDim, lineHeight: 22 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 32, backgroundColor: theme.colors.bg, borderTopWidth: 1, borderTopColor: theme.colors.border },
  nextBtn: { backgroundColor: theme.colors.accent, padding: 16, borderRadius: theme.radius.md, alignItems: 'center' },
  nextText: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
})
