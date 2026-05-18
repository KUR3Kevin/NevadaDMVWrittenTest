import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../theme'

type Props = { score: number; total: number }

export function ScoreCircle({ score, total }: Props) {
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 80
  return (
    <View style={[styles.circle, passed ? styles.pass : styles.fail]}>
      <Text style={[styles.pct, passed ? styles.passText : styles.failText]}>{pct}%</Text>
      <Text style={styles.fraction}>{score} / {total}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', borderWidth: 2, backgroundColor: theme.colors.surface, alignSelf: 'center', marginBottom: 20 },
  pass: { borderColor: theme.colors.success },
  fail: { borderColor: theme.colors.accent },
  pct: { fontSize: 42, fontWeight: '900', lineHeight: 46 },
  passText: { color: theme.colors.success },
  failText: { color: theme.colors.accent },
  fraction: { fontSize: 12, color: theme.colors.textDim, marginTop: 4 },
})
