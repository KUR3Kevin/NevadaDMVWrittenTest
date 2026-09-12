import { QUESTIONS } from '../src/data/questions'
import { KEY_FACTS } from '../src/data/keyFacts'
import { ROAD_SIGNS } from '../src/data/roadSigns'

describe('question bank integrity', () => {
  it('has unique sequential-enough ids', () => {
    const ids = QUESTIONS.map(q => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every question has a valid correct index and non-empty copy', () => {
    QUESTIONS.forEach(q => {
      expect(q.question.trim().length).toBeGreaterThan(8)
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(q.options.length)
      expect(q.options[q.correct].trim().length).toBeGreaterThan(0)
      expect(q.explanation.trim().length).toBeGreaterThan(12)
      q.options.forEach(opt => expect(opt.trim().length).toBeGreaterThan(0))
    })
  })

  it('teaches Nevada HOV as 2+ occupants, not 3+', () => {
    const hov = QUESTIONS.find(q => q.id === 8)
    expect(hov).toBeDefined()
    expect(hov!.options[hov!.correct]).toMatch(/2/)
    expect(hov!.explanation).toMatch(/2\+/)
    expect(hov!.explanation).not.toMatch(/3\+ persons required/)
  })

  it('teaches uphill-with-curb parking as wheels away from the curb', () => {
    const parking = QUESTIONS.find(q => q.id === 4)
    expect(parking).toBeDefined()
    expect(parking!.options[parking!.correct].toLowerCase()).toMatch(/away from the curb/)
  })

  it('teaches 12 demerit points as a 6-month suspension', () => {
    const points = QUESTIONS.find(q => q.id === 10)
    expect(points).toBeDefined()
    expect(points!.options[points!.correct].toLowerCase()).toMatch(/6-month|6 months/)
    expect(points!.explanation.toLowerCase()).not.toMatch(/\$500\+ fine/)
  })

  it('teaches the official knowledge test as 25 questions / 80%', () => {
    const exam = QUESTIONS.find(q => q.id === 54)
    expect(exam).toBeDefined()
    expect(exam!.options[exam!.correct]).toMatch(/25/)
    expect(exam!.options[exam!.correct]).toMatch(/20/)
  })
})

describe('study content integrity', () => {
  it('key facts match corrected HOV and parking rules', () => {
    const hov = KEY_FACTS.find(f => f.id === 4)
    const uphill = KEY_FACTS.find(f => f.id === 24)
    expect(hov?.answer).toMatch(/2\+/)
    expect(uphill?.answer.toLowerCase()).toMatch(/away from the curb/)
  })

  it('HOV road sign copy says 2+ persons', () => {
    const sign = ROAD_SIGNS.find(s => s.id === 'hov')
    expect(sign?.meaning).toMatch(/2\+/)
    expect(sign?.tip).toMatch(/2\+/)
  })
})
