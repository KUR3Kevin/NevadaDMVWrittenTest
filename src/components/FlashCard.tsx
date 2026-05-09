import React, { useState } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { KeyFact } from '../data/keyFacts'

export function FlashCard({ fact }: { fact: KeyFact }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <TouchableOpacity style={styles.card} onPress={() => setFlipped(f => !f)} activeOpacity={0.85}>
      <Text style={styles.hint}>{flipped ? 'Answer' : 'Tap to reveal'}</Text>
      <Text style={styles.text}>{flipped ? fact.answer : fact.prompt}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', padding: 24, marginBottom: 12, minHeight: 100, justifyContent: 'center' },
  hint: { fontSize: 11, color: '#e63329', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  text: { fontSize: 16, color: '#f0f0f0', lineHeight: 24 },
})
