import * as Notifications from 'expo-notifications'

const MESSAGES = [
  "You need 40/50 to pass. Quick quiz before bed?",
  "Failure to yield is Nevada's #1 accident cause. Know your right-of-way?",
  "Daily streak — don't break it. 5 minutes is all it takes.",
  "HOV lane requires 3+ persons. What else do you know?",
  "Test day is coming. One quiz a day keeps the DMV away.",
]

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleReminder(hour: number, minute: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
  const body = MESSAGES[new Date().getDay() % MESSAGES.length]
  await Notifications.scheduleNotificationAsync({
    content: { title: 'NevadaDMV Study Time', body, sound: true },
    trigger: { hour, minute, repeats: true },
  })
}

export async function cancelReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}
