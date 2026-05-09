import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'

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
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', marginBottom: 10 },
  rowCorrect: { borderColor: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.15)' },
  rowWrong: { borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.15)' },
  badge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  badgeCorrect: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
  badgeWrong: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  text: { color: '#f0f0f0', fontSize: 15, lineHeight: 22, flex: 1 },
})
