import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { theme } from '../theme'

export type OptionState = 'default' | 'correct' | 'wrong' | 'disabled'

type Props = { letter: string; text: string; state: OptionState; onPress: () => void }

export function QuizOption({ letter, text, state, onPress }: Props) {
  const label =
    state === 'correct' ? `${letter}. ${text}. Correct answer.` :
    state === 'wrong' ? `${letter}. ${text}. Incorrect.` :
    `${letter}. ${text}`

  return (
    <TouchableOpacity
      style={[
        styles.row,
        state === 'correct' && styles.rowCorrect,
        state === 'wrong' && styles.rowWrong,
        state === 'disabled' && styles.rowDisabled,
      ]}
      onPress={onPress}
      disabled={state !== 'default'}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: state !== 'default', selected: state === 'correct' || state === 'wrong' }}
      accessibilityLabel={label}
    >
      <View style={[styles.badge, state === 'correct' && styles.badgeCorrect, state === 'wrong' && styles.badgeWrong]}>
        <Text style={styles.badgeText}>{letter}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginBottom: 12,
    minHeight: 56,
  },
  rowCorrect: { borderColor: theme.colors.success, backgroundColor: theme.colors.surfaceHi },
  rowWrong: { borderColor: theme.colors.accent, backgroundColor: theme.colors.surfaceHi },
  rowDisabled: { opacity: 0.55 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceHi,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeCorrect: { backgroundColor: theme.colors.success, borderColor: theme.colors.success },
  badgeWrong: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  badgeText: { color: theme.colors.text, fontSize: 16, fontWeight: '800' },
  text: { color: theme.colors.text, fontSize: 17, lineHeight: 24, flex: 1 },
})
