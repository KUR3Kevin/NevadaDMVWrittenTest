import React, { useState, useCallback, useRef } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { QUESTIONS } from '../../src/data/questions'
import { useProgressStore } from '../../src/store/progress'
import { filterQuestions, isQuizMode, shuffleQuestionOptions, MODE_LABELS } from '../../src/lib/quizUtils'
import type { QuizMode } from '../../src/lib/quizUtils'
import { QuizOption, OptionState } from '../../src/components/QuizOption'
import { StreakBadge } from '../../src/components/StreakBadge'
import { ConfirmDialog } from '../../src/components/ConfirmDialog'
import { theme } from '../../src/theme'

async function hapticSuccess() {
  if (Platform.OS === 'web') return
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  } catch {
    // Native haptics are optional.
  }
}

async function hapticError() {
  if (Platform.OS === 'web') return
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  } catch {
    // Native haptics are optional.
  }
}

function parseMode(raw: string | string[] | undefined): QuizMode {
  const value = Array.isArray(raw) ? raw[0] : raw
  return isQuizMode(value) ? value : 'exam'
}

function leaveQuiz() {
  if (router.canGoBack()) router.back()
  else router.replace('/(tabs)/quiz')
}

export default function QuizScreen() {
  const params = useLocalSearchParams<{ mode: string }>()
  const mode = parseMode(params.mode)
  const getWeakQuestionIds = useProgressStore(s => s.getWeakQuestionIds)
  const addRun = useProgressStore(s => s.addRun)

  const [questions] = useState(() =>
    filterQuestions(QUESTIONS, mode, getWeakQuestionIds()).map(shuffleQuestionOptions)
  )
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [optionStates, setOptionStates] = useState<OptionState[]>([])
  const [streak, setStreak] = useState(0)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)

  const scoreRef = useRef(0)
  const missedIdsRef = useRef<number[]>([])

  const q = questions[index]
  const modeLabel = MODE_LABELS[mode]

  const askToLeave = useCallback(() => setLeaveOpen(true), [])

  const pick = useCallback((choice: number) => {
    if (answered || !q) return
    setAnswered(true)
    const isCorrect = choice === q.correct
    setLastCorrect(isCorrect)

    setOptionStates(q.options.map((_, i) => {
      if (i === q.correct) return 'correct'
      if (i === choice && !isCorrect) return 'wrong'
      return 'disabled'
    }))

    if (isCorrect) {
      void hapticSuccess()
      scoreRef.current += 1
      setStreak(s => s + 1)
    } else {
      void hapticError()
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

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No questions yet</Text>
          <Text style={styles.emptyBody}>
            {mode === 'weak'
              ? 'Miss the same question twice and it will show up here for extra practice.'
              : 'This quiz has no questions right now.'}
          </Text>
          <TouchableOpacity style={styles.nextBtn} onPress={leaveQuiz} accessibilityRole="button" accessibilityLabel="Go back home">
            <Text style={styles.nextText}>Go home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (!q) return null

  const progress = ((index + 1) / questions.length) * 100
  const nextLabel = index < questions.length - 1 ? 'Next question' : 'See my results'

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progressTrack} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progress) }}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.modeLabel}>{modeLabel}</Text>
          <Text style={styles.counter}>Question {index + 1} of {questions.length}</Text>
        </View>
        <StreakBadge streak={streak} />
        <TouchableOpacity
          onPress={askToLeave}
          style={styles.exitBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Exit quiz"
        >
          <Text style={styles.exit}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.question}>{q.question}</Text>
        {q.options.map((opt, i) => (
          <QuizOption
            key={`${q.id}-${i}`}
            letter={String.fromCharCode(65 + i)}
            text={opt}
            state={optionStates[i] ?? 'default'}
            onPress={() => pick(i)}
          />
        ))}

        {answered && (
          <View style={styles.explain} accessibilityLiveRegion="polite">
            <Text style={[styles.explainHead, { color: lastCorrect ? theme.colors.success : theme.colors.accent }]}>
              {lastCorrect ? 'Correct' : `Not quite — the answer is ${String.fromCharCode(65 + q.correct)}`}
            </Text>
            <Text style={styles.explainBody}>{q.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {answered && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} onPress={next} accessibilityRole="button" accessibilityLabel={nextLabel}>
            <Text style={styles.nextText}>{nextLabel}</Text>
          </TouchableOpacity>
        </View>
      )}
      <ConfirmDialog
        visible={leaveOpen}
        title="Leave this quiz?"
        message="Your answers will not be saved."
        cancelLabel="Keep going"
        confirmLabel="Leave"
        destructive
        onCancel={() => setLeaveOpen(false)}
        onConfirm={leaveQuiz}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  progressTrack: { height: 6, backgroundColor: theme.colors.border },
  progressFill: { height: 6, backgroundColor: theme.colors.accent },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  headerText: { flex: 1, minWidth: 0 },
  modeLabel: { fontSize: 14, color: theme.colors.textDim, fontWeight: '700', marginBottom: 2 },
  counter: { fontSize: 18, color: theme.colors.text, fontWeight: '800' },
  exitBtn: { minHeight: 48, minWidth: 64, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exit: { fontSize: 16, color: theme.colors.text, fontWeight: '700' },
  body: { padding: 20, paddingBottom: 140 },
  question: { fontSize: 22, fontWeight: '800', color: theme.colors.text, lineHeight: 30, marginBottom: 22 },
  explain: { marginTop: 8, padding: 16, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  explainHead: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  explainBody: { fontSize: 16, color: theme.colors.textDim, lineHeight: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 28, backgroundColor: theme.colors.bg, borderTopWidth: 1, borderTopColor: theme.colors.border },
  nextBtn: { backgroundColor: theme.colors.accent, paddingVertical: 18, borderRadius: theme.radius.md, alignItems: 'center', minHeight: theme.tap, justifyContent: 'center' },
  nextText: { color: theme.colors.text, fontSize: 18, fontWeight: '800' },
  empty: { flex: 1, justifyContent: 'center', padding: 32, gap: 16 },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: theme.colors.text, textAlign: 'center' },
  emptyBody: { fontSize: 17, color: theme.colors.textDim, lineHeight: 24, textAlign: 'center', marginBottom: 12 },
})
