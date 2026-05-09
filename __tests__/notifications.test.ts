jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-id')),
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}))

import * as Notifications from 'expo-notifications'
import { requestNotificationPermission, scheduleReminder, cancelReminder } from '../src/lib/notifications'

beforeEach(() => jest.clearAllMocks())

describe('requestNotificationPermission', () => {
  it('returns true when permission granted', async () => {
    expect(await requestNotificationPermission()).toBe(true)
  })

  it('returns false when permission denied', async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'denied' })
    expect(await requestNotificationPermission()).toBe(false)
  })
})

describe('scheduleReminder', () => {
  it('cancels existing notifications before scheduling', async () => {
    await scheduleReminder(19, 0)
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled()
  })

  it('schedules a daily repeating notification at given hour/minute', async () => {
    await scheduleReminder(20, 30)
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ hour: 20, minute: 30 }),
      })
    )
  })
})

describe('cancelReminder', () => {
  it('cancels all scheduled notifications', async () => {
    await cancelReminder()
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled()
  })
})
