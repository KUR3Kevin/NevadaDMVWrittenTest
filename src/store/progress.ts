import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type QuizMode = 'all' | 'quick' | 'tf' | 'weak'

export type Run = {
  mode: QuizMode
  score: number
  total: number
  date: string
  missedIds: number[]
}

type State = {
  runs: Run[]
  wrongCounts: Record<number, number>
  currentStreak: number
  longestStreak: number
  lastStudyDate: string
  notificationsEnabled: boolean
  notificationHour: number
  notificationMinute: number
}

type Actions = {
  addRun: (run: Omit<Run, 'date'>) => void
  getWeakQuestionIds: () => number[]
  getBestScore: (mode: QuizMode) => number | null
  reset: () => void
  setNotificationsEnabled: (enabled: boolean) => void
  setNotificationTime: (hour: number, minute: number) => void
}

const INITIAL_STATE: State = {
  runs: [],
  wrongCounts: {},
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  notificationsEnabled: false,
  notificationHour: 19,
  notificationMinute: 0,
}

export const useProgressStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addRun: (run) => {
        const today = new Date().toISOString().split('T')[0]
        const { lastStudyDate, currentStreak, longestStreak, wrongCounts } = get()

        const newWrongCounts = { ...wrongCounts }
        run.missedIds.forEach(id => {
          newWrongCounts[id] = (newWrongCounts[id] ?? 0) + 1
        })

        let newStreak = currentStreak
        if (lastStudyDate !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]
          newStreak = lastStudyDate === yesterdayStr ? currentStreak + 1 : 1
        }

        set(state => ({
          runs: [...state.runs, { ...run, date: today }],
          wrongCounts: newWrongCounts,
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastStudyDate: today,
        }))
      },

      getWeakQuestionIds: () =>
        Object.entries(get().wrongCounts)
          .filter(([, count]) => count >= 2)
          .map(([id]) => Number(id)),

      getBestScore: (mode) => {
        const modeRuns = get().runs.filter(r => r.mode === mode)
        if (modeRuns.length === 0) return null
        return Math.max(...modeRuns.map(r => Math.round((r.score / r.total) * 100)))
      },

      reset: () => set(INITIAL_STATE),

      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      setNotificationTime: (hour, minute) => set({ notificationHour: hour, notificationMinute: minute }),
    }),
    {
      name: 'nevada-dmv-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
