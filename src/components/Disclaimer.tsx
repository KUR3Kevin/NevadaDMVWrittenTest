import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { theme } from '../theme'

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <Text style={[styles.text, compact && styles.compact]}>
      Unofficial study aid based on the Nevada Driver Handbook. Not affiliated with the Nevada DMV.
      Always verify current law at dmv.nv.gov.
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: theme.colors.textDim,
    lineHeight: 20,
    textAlign: 'center',
  },
  compact: {
    textAlign: 'left',
    marginTop: 8,
  },
})
