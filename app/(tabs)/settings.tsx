import React, { useState } from 'react'
import { View, Text, StyleSheet, Switch, Alert, TouchableOpacity, SafeAreaView, ScrollView, Platform, Linking } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useProgressStore } from '../../src/store/progress'
import { requestNotificationPermission, scheduleReminder, cancelReminder } from '../../src/lib/notifications'
import { Disclaimer } from '../../src/components/Disclaimer'
import { theme } from '../../src/theme'

const HANDBOOK_URL = 'https://dmv.nv.gov/pdfforms/dlbook.pdf'
const GITHUB_URL = 'https://github.com/KUR3Kevin/NevadaDMVWrittenTest'
const DMV_URL = 'https://dmv.nv.gov/'

export default function SettingsTab() {
  const {
    notificationsEnabled, notificationHour, notificationMinute,
    setNotificationsEnabled, setNotificationTime, reset,
  } = useProgressStore()
  const [showPicker, setShowPicker] = useState(false)

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission()
      if (!granted) {
        Alert.alert('Permission needed', 'Turn on notifications in your device Settings to get daily reminders.')
        return
      }
      await scheduleReminder(notificationHour, notificationMinute)
    } else {
      await cancelReminder()
    }
    setNotificationsEnabled(value)
  }

  const handleTimeChange = async (_: unknown, date?: Date) => {
    if (Platform.OS !== 'ios') setShowPicker(false)
    if (!date) return
    const h = date.getHours()
    const m = date.getMinutes()
    setNotificationTime(h, m)
    if (notificationsEnabled) await scheduleReminder(h, m)
  }

  const confirmReset = () => {
    const message = 'This deletes all quiz history, streaks, and missed-question lists. This cannot be undone.'
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Reset all progress?\n\n${message}`)) reset()
      return
    }
    Alert.alert(
      'Reset all progress?',
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: reset },
      ]
    )
  }

  const timeDate = new Date()
  timeDate.setHours(notificationHour, notificationMinute, 0, 0)
  const timeLabel = `${String(notificationHour).padStart(2, '0')}:${String(notificationMinute).padStart(2, '0')}`

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading} accessibilityRole="header">Help & settings</Text>
        <Text style={styles.lead}>This app helps you practice for the Nevada written driving test. It is not the real DMV test.</Text>

        {Platform.OS !== 'web' && (
          <>
            <Text style={styles.section}>Daily reminder</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Remind me to study</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ true: theme.colors.accent }}
                thumbColor={theme.colors.text}
                accessibilityLabel="Remind me to study"
              />
            </View>

            {notificationsEnabled && (
              <TouchableOpacity style={styles.row} onPress={() => setShowPicker(true)} accessibilityRole="button" accessibilityLabel={`Reminder time ${timeLabel}`}>
                <Text style={styles.label}>Reminder time</Text>
                <Text style={styles.value}>{timeLabel}</Text>
              </TouchableOpacity>
            )}

            {showPicker && (
              <DateTimePicker value={timeDate} mode="time" is24Hour={false} onChange={handleTimeChange} />
            )}
          </>
        )}

        {Platform.OS === 'web' && (
          <>
            <Text style={styles.section}>Daily reminder</Text>
            <Text style={styles.note}>Study reminders work in the iPhone and Android apps.</Text>
          </>
        )}

        <Text style={[styles.section, { marginTop: 32 }]}>Official sources</Text>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(HANDBOOK_URL)} accessibilityRole="link" accessibilityLabel="Open Nevada Driver Handbook PDF">
          <Text style={styles.label}>Nevada Driver Handbook (PDF)</Text>
          <Text style={styles.value}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(DMV_URL)} accessibilityRole="link" accessibilityLabel="Open official Nevada DMV website">
          <Text style={styles.label}>Official Nevada DMV website</Text>
          <Text style={styles.value}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(GITHUB_URL)} accessibilityRole="link" accessibilityLabel="Open GitHub repository">
          <Text style={styles.label}>Project on GitHub</Text>
          <Text style={styles.value}>Open</Text>
        </TouchableOpacity>

        <Text style={[styles.section, { marginTop: 32 }]}>Your data</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={confirmReset} accessibilityRole="button" accessibilityLabel="Reset all progress">
          <Text style={styles.resetText}>Reset all progress</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Nevada DMV Written Test · v1.0.0</Text>
        <Disclaimer compact />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  container: { padding: 24, paddingBottom: 48 },
  heading: { fontSize: theme.font.h1, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginBottom: 10 },
  lead: { fontSize: 16, color: theme.colors.textDim, lineHeight: 24, marginBottom: 24 },
  section: { fontSize: 15, fontWeight: '800', color: theme.colors.text, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: 12, minHeight: 56 },
  label: { fontSize: 17, color: theme.colors.text, flex: 1 },
  value: { fontSize: 16, color: theme.colors.accent, fontWeight: '700' },
  note: { fontSize: 16, color: theme.colors.textDim, lineHeight: 24, marginBottom: 8 },
  resetBtn: { padding: 18, borderRadius: theme.radius.md, borderWidth: 2, borderColor: theme.colors.accent, alignItems: 'center', marginTop: 8, minHeight: theme.tap, justifyContent: 'center' },
  resetText: { color: theme.colors.accent, fontSize: 17, fontWeight: '800' },
  version: { color: theme.colors.textDim, fontSize: 14, textAlign: 'center', marginTop: 48, marginBottom: 8 },
})
