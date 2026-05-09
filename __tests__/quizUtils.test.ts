import { filterQuestions, shuffleArray, calculatePassFail } from '../src/lib/quizUtils'
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

describe('filterQuestions', () => {
  it('all: returns all 53 questions', () => {
    expect(filterQuestions(QUESTIONS, 'all', [])).toHaveLength(53)
  })
  it('quick: returns exactly 20 questions', () => {
    expect(filterQuestions(QUESTIONS, 'quick', [])).toHaveLength(20)
  })
  it('tf: returns only 2-option questions', () => {
    const result = filterQuestions(QUESTIONS, 'tf', [])
    result.forEach(q => expect(q.options).toHaveLength(2))
    expect(result.length).toBeGreaterThan(0)
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
    expect(calculatePassFail(40, 50)).toBe(true)
  })
  it('returns true above 80%', () => {
    expect(calculatePassFail(53, 53)).toBe(true)
  })
  it('returns false below 80%', () => {
    expect(calculatePassFail(39, 50)).toBe(false)
  })
  it('returns false for 0/N', () => {
    expect(calculatePassFail(0, 53)).toBe(false)
  })
})
