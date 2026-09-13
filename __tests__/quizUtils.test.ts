import { filterQuestions, shuffleArray, calculatePassFail, shuffleQuestionOptions, EXAM_LENGTH, MODE_LABELS } from '../src/lib/quizUtils'
import { QUESTIONS } from '../src/data/questions'

describe('shuffleArray', () => {
  it('returns same length', () => {
    expect(shuffleArray([1,2,3,4,5])).toHaveLength(5)
  })
  it('contains same elements', () => {
    expect(shuffleArray([1,2,3]).sort()).toEqual([1,2,3])
  })
  it('does not mutate original', () => {
    const arr = [1,2,3]
    shuffleArray(arr)
    expect(arr).toEqual([1,2,3])
  })
})

describe('shuffleQuestionOptions', () => {
  it('keeps the same correct answer text after shuffling', () => {
    const original = QUESTIONS[0]
    const shuffled = shuffleQuestionOptions(original)
    expect(shuffled.options[shuffled.correct]).toBe(original.options[original.correct])
    expect(shuffled.options.slice().sort()).toEqual(original.options.slice().sort())
  })
})

describe('filterQuestions', () => {
  it('all: returns every question', () => {
    expect(filterQuestions(QUESTIONS, 'all', [])).toHaveLength(QUESTIONS.length)
  })
  it('exam: returns 25 questions like the official knowledge test', () => {
    expect(filterQuestions(QUESTIONS, 'exam', [])).toHaveLength(EXAM_LENGTH)
  })
  it('quick: returns exactly 20 questions', () => {
    expect(filterQuestions(QUESTIONS, 'quick', [])).toHaveLength(20)
  })
  it('tf: returns only 2-option questions with both true and false answers', () => {
    const result = filterQuestions(QUESTIONS, 'tf', [])
    result.forEach(q => expect(q.options).toHaveLength(2))
    expect(result.length).toBeGreaterThan(0)
    const labels = QUESTIONS.filter(q => q.options.length === 2).map(q => q.options[q.correct].toLowerCase())
    expect(labels).toContain('true')
    expect(labels).toContain('false')
  })
  it('weak: returns only questions matching weakIds', () => {
    const result = filterQuestions(QUESTIONS, 'weak', [1, 5, 10])
    expect(result.map(q => q.id).sort((a, b) => a - b)).toEqual([1, 5, 10])
  })
  it('weak: returns empty array when weakIds is empty', () => {
    expect(filterQuestions(QUESTIONS, 'weak', [])).toHaveLength(0)
  })
})

describe('calculatePassFail', () => {
  it('returns true at exactly 80%', () => {
    expect(calculatePassFail(20, 25)).toBe(true)
    expect(calculatePassFail(40, 50)).toBe(true)
  })
  it('returns true above 80%', () => {
    expect(calculatePassFail(25, 25)).toBe(true)
  })
  it('returns false below 80%', () => {
    expect(calculatePassFail(19, 25)).toBe(false)
  })
  it('returns false for 0/N', () => {
    expect(calculatePassFail(0, 25)).toBe(false)
  })
  it('returns false when total is 0', () => {
    expect(calculatePassFail(0, 0)).toBe(false)
  })
})

describe('MODE_LABELS', () => {
  it('uses plain-language names for every quiz mode', () => {
    expect(MODE_LABELS.exam).toBe('Practice Test')
    expect(MODE_LABELS.tf).toMatch(/True/)
    expect(MODE_LABELS.weak).toBe('Weak Areas')
  })
})
