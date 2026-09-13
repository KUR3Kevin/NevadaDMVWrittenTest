import React, { useState } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { KeyFact } from '../data/keyFacts'
import { theme } from '../theme'

export function FlashCard({ fact }: { fact: KeyFact }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setFlipped(f => !f)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ expanded: flipped }}
      accessibilityLabel={flipped ? `Answer: ${fact.answer}. Double tap to hide.` : `${fact.prompt}. Double tap to reveal the answer.`}
    >
      <Text style={styles.hint}>{flipped ? 'Answer' : 'Tap to see the answer'}</Text>
      <Text style={styles.text}>{flipped ? fact.answer : fact.prompt}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 22,
    marginBottom: 12,
    minHeight: 108,
    justifyContent: 'center',
  },
  hint: { fontSize: 13, color: theme.colors.accent, fontWeight: '800', letterSpacing: 0.4, marginBottom: 8 },
  text: { fontSize: 18, color: theme.colors.text, lineHeight: 26 },
})
