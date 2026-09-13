import { localDateString, yesterdayLocalString } from '../src/lib/dates'

describe('localDateString', () => {
  it('formats a local calendar date as YYYY-MM-DD', () => {
    expect(localDateString(new Date(2026, 8, 13, 23, 30))).toBe('2026-09-13')
  })

  it('matches the machine local calendar, not Date.toISOString', () => {
    const date = new Date(Date.UTC(2026, 8, 14, 7, 0, 0))
    const expected = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-')
    expect(localDateString(date)).toBe(expected)
  })
})

describe('yesterdayLocalString', () => {
  it('returns the previous local calendar day', () => {
    expect(yesterdayLocalString(new Date(2026, 8, 13, 8, 0))).toBe('2026-09-12')
  })

  it('crosses month boundaries', () => {
    expect(yesterdayLocalString(new Date(2026, 8, 1, 8, 0))).toBe('2026-08-31')
  })
})
