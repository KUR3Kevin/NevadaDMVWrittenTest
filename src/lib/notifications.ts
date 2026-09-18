import { Platform } from 'react-native'

type NotificationsModule = typeof import('expo-notifications')

/**
 * expo-notifications registers web listeners at import time and logs a warning
 * that push tokens are unsupported on web. Loading it lazily keeps the web
 * bundle quiet; every caller already returns early on web.
 */
function loadNotifications(): NotificationsModule {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('expo-notifications') as NotificationsModule
}

const MESSAGES = [
  "You need 20/25 (80%) to pass the official knowledge test. Quick quiz?",
  "Failure to yield is Nevada's #1 crash cause. Know your right-of-way?",
  "Daily streak — don't break it. 5 minutes is all it takes.",
  "Nevada HOV lanes require 2+ persons. What else do you know?",
  "Test day is coming. One quiz a day keeps the DMV away.",
]

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false
  const Notifications = loadNotifications()
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleReminder(hour: number, minute: number): Promise<void> {
  if (Platform.OS === 'web') return
  const Notifications = loadNotifications()
  await Notifications.cancelAllScheduledNotificationsAsync()
  const body = MESSAGES[new Date().getDay() % MESSAGES.length]
  await Notifications.scheduleNotificationAsync({
    content: { title: 'NevadaDMV Study Time', body, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  })
}

export async function cancelReminder(): Promise<void> {
  if (Platform.OS === 'web') return
  const Notifications = loadNotifications()
  await Notifications.cancelAllScheduledNotificationsAsync()
}
