import { Question } from '../data/questions'

export type QuizMode = 'exam' | 'all' | 'quick' | 'tf' | 'weak'

/** Official Nevada Class C knowledge test length (NV DMV). */
export const EXAM_LENGTH = 25
export const PASS_RATIO = 0.8
export const QUIZ_MODES: QuizMode[] = ['exam', 'all', 'quick', 'tf', 'weak']

export const MODE_LABELS: Record<QuizMode, string> = {
  exam: 'Practice Test',
  all: 'Study Bank',
  quick: 'Quick 20',
  tf: 'True / False',
  weak: 'Weak Areas',
}

export function isQuizMode(value: unknown): value is QuizMode {
  return typeof value === 'string' && (QUIZ_MODES as string[]).includes(value)
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Shuffle answer order so letter-memorization does not leak the key. */
export function shuffleQuestionOptions(question: Question): Question {
  const indexed = question.options.map((text, i) => ({ text, i }))
  const shuffled = shuffleArray(indexed)
  return {
    ...question,
    options: shuffled.map(item => item.text),
    correct: shuffled.findIndex(item => item.i === question.correct),
  }
}

export function filterQuestions(
  questions: Question[],
  mode: QuizMode,
  weakIds: number[]
): Question[] {
  switch (mode) {
    case 'exam':
      return shuffleArray([...questions]).slice(0, Math.min(EXAM_LENGTH, questions.length))
    case 'all':
      return shuffleArray([...questions])
    case 'quick':
      return shuffleArray([...questions]).slice(0, Math.min(20, questions.length))
    case 'tf':
      return shuffleArray(questions.filter(q => q.options.length === 2))
    case 'weak':
      return shuffleArray(questions.filter(q => weakIds.includes(q.id)))
  }
}

export function calculatePassFail(score: number, total: number): boolean {
  return total > 0 && score / total >= PASS_RATIO
}
