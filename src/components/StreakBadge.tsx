import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function StreakBadge({ streak }: { streak: number }) {
  if (streak < 3) return null
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>🔥 {streak}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { backgroundColor: 'rgba(230,51,41,0.12)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  text: { color: '#e63329', fontSize: 12, fontWeight: '700' },
})
