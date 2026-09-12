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
        Alert.alert('Permission Required', 'Enable notifications in device Settings to receive daily reminders.')
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
    Alert.alert(
      'Reset All Progress',
      'This deletes all quiz history, streaks, and weak areas. Cannot be undone.',
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
        <Text style={styles.heading}>Settings</Text>

        {Platform.OS !== 'web' && (
          <>
            <Text style={styles.section}>Daily Reminder</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Enable reminder</Text>
              <Switch value={notificationsEnabled} onValueChange={toggleNotifications} trackColor={{ true: theme.colors.accent }} thumbColor={theme.colors.text} />
            </View>

            {notificationsEnabled && (
              <TouchableOpacity style={styles.row} onPress={() => setShowPicker(true)}>
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
            <Text style={styles.section}>Daily Reminder</Text>
            <Text style={styles.note}>Study reminders are available in the iOS and Android apps.</Text>
          </>
        )}

        <Text style={[styles.section, { marginTop: 32 }]}>Sources</Text>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(HANDBOOK_URL)}>
          <Text style={styles.label}>Nevada Driver Handbook (PDF)</Text>
          <Text style={styles.value}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(DMV_URL)}>
          <Text style={styles.label}>Official Nevada DMV</Text>
          <Text style={styles.value}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(GITHUB_URL)}>
          <Text style={styles.label}>GitHub repository</Text>
          <Text style={styles.value}>Open</Text>
        </TouchableOpacity>

        <Text style={[styles.section, { marginTop: 32 }]}>Data</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={confirmReset}>
          <Text style={styles.resetText}>Reset All Progress</Text>
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
  heading: { fontSize: theme.font.h1, fontWeight: '900', color: theme.colors.text, letterSpacing: -1, marginBottom: 24 },
  section: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, color: theme.colors.textMute, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: 12 },
  label: { fontSize: 15, color: theme.colors.text, flex: 1 },
  value: { fontSize: 15, color: theme.colors.accent, fontWeight: '600' },
  note: { fontSize: 14, color: theme.colors.textDim, lineHeight: 22, marginBottom: 8 },
  resetBtn: { padding: 16, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.accent, alignItems: 'center', marginTop: 8 },
  resetText: { color: theme.colors.accent, fontSize: 15, fontWeight: '700' },
  version: { color: theme.colors.textMute, fontSize: 12, textAlign: 'center', marginTop: 48, marginBottom: 8 },
})
