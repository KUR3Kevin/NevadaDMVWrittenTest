import { Question } from '../data/questions'

export type QuizMode = 'all' | 'quick' | 'tf' | 'weak'

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function filterQuestions(
  questions: Question[],
  mode: QuizMode,
  weakIds: number[]
): Question[] {
  switch (mode) {
    case 'all':   return shuffleArray([...questions])
    case 'quick': return shuffleArray([...questions]).slice(0, 20)
    case 'tf':    return shuffleArray(questions.filter(q => q.options.length === 2))
    case 'weak':  return shuffleArray(questions.filter(q => weakIds.includes(q.id)))
  }
}

export function calculatePassFail(score: number, total: number): boolean {
  return total > 0 && score / total >= 0.8
}
