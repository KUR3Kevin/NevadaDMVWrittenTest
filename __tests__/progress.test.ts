import { useProgressStore } from '../src/store/progress'

const INITIAL = {
  runs: [], wrongCounts: {}, currentStreak: 0,
  longestStreak: 0, lastStudyDate: '',
  notificationsEnabled: false, notificationHour: 19, notificationMinute: 0,
}

beforeEach(() => {
  useProgressStore.setState(INITIAL)
  require('@react-native-async-storage/async-storage').__resetStore()
})

describe('addRun', () => {
  it('appends a run with today date', () => {
    useProgressStore.getState().addRun({ mode: 'all', score: 45, total: 53, missedIds: [] })
    const { runs } = useProgressStore.getState()
    expect(runs).toHaveLength(1)
    expect(runs[0].score).toBe(45)
    expect(runs[0].date).toBe(new Date().toISOString().split('T')[0])
  })

  it('increments wrongCounts for each missed question id', () => {
    useProgressStore.getState().addRun({ mode: 'all', score: 50, total: 53, missedIds: [3, 7] })
    useProgressStore.getState().addRun({ mode: 'quick', score: 18, total: 20, missedIds: [3] })
    const { wrongCounts } = useProgressStore.getState()
    expect(wrongCounts[3]).toBe(2)
    expect(wrongCounts[7]).toBe(1)
  })

  it('starts streak at 1 on first run', () => {
    useProgressStore.getState().addRun({ mode: 'all', score: 45, total: 53, missedIds: [] })
    expect(useProgressStore.getState().currentStreak).toBe(1)
    expect(useProgressStore.getState().longestStreak).toBe(1)
  })

  it('does not increment streak twice on same day', () => {
    const today = new Date().toISOString().split('T')[0]
    useProgressStore.setState({ lastStudyDate: today, currentStreak: 3, longestStreak: 5 })
    useProgressStore.getState().addRun({ mode: 'quick', score: 18, total: 20, missedIds: [] })
    expect(useProgressStore.getState().currentStreak).toBe(3)
  })

  it('resets streak to 1 when last study was >1 day ago', () => {
    useProgressStore.setState({ lastStudyDate: '2020-01-01', currentStreak: 5, longestStreak: 5 })
    useProgressStore.getState().addRun({ mode: 'all', score: 45, total: 53, missedIds: [] })
    expect(useProgressStore.getState().currentStreak).toBe(1)
  })

  it('preserves longestStreak when current resets', () => {
    useProgressStore.setState({ lastStudyDate: '2020-01-01', currentStreak: 5, longestStreak: 10 })
    useProgressStore.getState().addRun({ mode: 'all', score: 45, total: 53, missedIds: [] })
    expect(useProgressStore.getState().longestStreak).toBe(10)
  })
})

describe('getWeakQuestionIds', () => {
  it('returns ids with wrongCount >= 2', () => {
    useProgressStore.setState({ wrongCounts: { 1: 3, 2: 1, 5: 2, 10: 0 } })
    const ids = useProgressStore.getState().getWeakQuestionIds()
    expect(ids).toContain(1)
    expect(ids).toContain(5)
    expect(ids).not.toContain(2)
    expect(ids).not.toContain(10)
  })
})

describe('getBestScore', () => {
  it('returns null when no runs for mode', () => {
    expect(useProgressStore.getState().getBestScore('all')).toBeNull()
  })

  it('returns highest score percentage for mode', () => {
    useProgressStore.setState({
      runs: [
        { mode: 'all', score: 40, total: 53, date: '2026-01-01', missedIds: [] },
        { mode: 'all', score: 50, total: 53, date: '2026-01-02', missedIds: [] },
        { mode: 'quick', score: 18, total: 20, date: '2026-01-01', missedIds: [] },
      ],
    })
    expect(useProgressStore.getState().getBestScore('all')).toBe(Math.round((50/53)*100))
    expect(useProgressStore.getState().getBestScore('quick')).toBe(90)
  })
})

describe('reset', () => {
  it('clears all runs and counts', () => {
    useProgressStore.setState({ runs: [{ mode: 'all', score: 50, total: 53, date: '2026-01-01', missedIds: [] }], wrongCounts: { 1: 2 }, currentStreak: 5 })
    useProgressStore.getState().reset()
    const state = useProgressStore.getState()
    expect(state.runs).toHaveLength(0)
    expect(state.wrongCounts).toEqual({})
    expect(state.currentStreak).toBe(0)
  })
})
