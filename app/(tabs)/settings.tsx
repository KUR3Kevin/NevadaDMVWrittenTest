import React, { useState } from 'react'
import { View, Text, StyleSheet, Switch, Alert, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useProgressStore } from '../../src/store/progress'
import { requestNotificationPermission, scheduleReminder, cancelReminder } from '../../src/lib/notifications'

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
        Alert.alert('Permission Required', 'Enable notifications in iOS Settings to receive daily reminders.')
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

        <Text style={styles.section}>Daily Reminder</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable reminder</Text>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} trackColor={{ true: '#e63329' }} thumbColor="#fff" />
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

        <Text style={[styles.section, { marginTop: 32 }]}>Data</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={confirmReset}>
          <Text style={styles.resetText}>Reset All Progress</Text>
        </TouchableOpacity>

        <Text style={styles.version}>NevadaDMVWrittenTest · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  container: { padding: 24 },
  heading: { fontSize: 32, fontWeight: '900', color: '#f0f0f0', letterSpacing: -1, marginBottom: 24 },
  section: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, color: '#555', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  label: { fontSize: 15, color: '#f0f0f0' },
  value: { fontSize: 15, color: '#e63329', fontWeight: '600' },
  resetBtn: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e74c3c', alignItems: 'center', marginTop: 8 },
  resetText: { color: '#e74c3c', fontSize: 15, fontWeight: '700' },
  version: { color: '#333', fontSize: 12, textAlign: 'center', marginTop: 48 },
})
