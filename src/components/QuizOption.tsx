import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { theme } from '../theme'

export type OptionState = 'default' | 'correct' | 'wrong' | 'disabled'

type Props = { letter: string; text: string; state: OptionState; onPress: () => void }

export function QuizOption({ letter, text, state, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.row, state === 'correct' && styles.rowCorrect, state === 'wrong' && styles.rowWrong]}
      onPress={onPress}
      disabled={state !== 'default'}
      activeOpacity={0.7}
    >
      <View style={[styles.badge, state === 'correct' && styles.badgeCorrect, state === 'wrong' && styles.badgeWrong]}>
        <Text style={styles.badgeText}>{letter}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, marginBottom: 10 },
  rowCorrect: { borderColor: theme.colors.success, backgroundColor: theme.colors.surfaceHi },
  rowWrong: { borderColor: theme.colors.accent, backgroundColor: theme.colors.surfaceHi },
  badge: { width: 32, height: 32, borderRadius: theme.radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceHi, borderWidth: 1, borderColor: theme.colors.border },
  badgeCorrect: { backgroundColor: theme.colors.success, borderColor: theme.colors.success },
  badgeWrong: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  badgeText: { color: theme.colors.text, fontSize: 12, fontWeight: '800' },
  text: { color: theme.colors.text, fontSize: 15, lineHeight: 22, flex: 1 },
})
