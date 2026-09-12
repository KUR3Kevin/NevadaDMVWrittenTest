import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { SchedulableTriggerInputTypes } from 'expo-notifications'

const MESSAGES = [
  "You need 20/25 (80%) to pass the official knowledge test. Quick quiz?",
  "Failure to yield is Nevada's #1 crash cause. Know your right-of-way?",
  "Daily streak — don't break it. 5 minutes is all it takes.",
  "Nevada HOV lanes require 2+ persons. What else do you know?",
  "Test day is coming. One quiz a day keeps the DMV away.",
]

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleReminder(hour: number, minute: number): Promise<void> {
  if (Platform.OS === 'web') return
  await Notifications.cancelAllScheduledNotificationsAsync()
  const body = MESSAGES[new Date().getDay() % MESSAGES.length]
  await Notifications.scheduleNotificationAsync({
    content: { title: 'NevadaDMV Study Time', body, sound: true },
    trigger: { type: SchedulableTriggerInputTypes.DAILY, hour, minute },
  })
}

export async function cancelReminder(): Promise<void> {
  if (Platform.OS === 'web') return
  await Notifications.cancelAllScheduledNotificationsAsync()
}
