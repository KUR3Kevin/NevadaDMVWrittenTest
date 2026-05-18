import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../theme'

export function StreakBadge({ streak }: { streak: number }) {
  if (streak < 3) return null
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>🔥 {streak}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.accent, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  text: { color: theme.colors.accent, fontSize: 12, fontWeight: '700' },
})
