import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { requestNotificationPermission, scheduleReminder } from '../src/lib/notifications'
import { useProgressStore } from '../src/store/progress'

export default function RootLayout() {
  const { notificationsEnabled, notificationHour, notificationMinute } = useProgressStore()

  useEffect(() => {
    requestNotificationPermission().then(granted => {
      if (granted && notificationsEnabled) {
        scheduleReminder(notificationHour, notificationMinute)
      }
    })
  }, [])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0a0a0a' } }} />
    </>
  )
}
