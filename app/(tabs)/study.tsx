import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { KEY_FACTS } from '../../src/data/keyFacts'
import { ROAD_SIGNS } from '../../src/data/roadSigns'
import { FlashCard } from '../../src/components/FlashCard'
import { RoadSignIcon } from '../../src/components/RoadSignIcon'
import { theme } from '../../src/theme'

type Tab = 'facts' | 'signs'

export default function StudyTab() {
  const [tab, setTab] = useState<Tab>('facts')
  const [expandedSign, setExpandedSign] = useState<string | null>(null)

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.heading} accessibilityRole="header">Study</Text>
      <View style={styles.segment} accessibilityRole="tablist">
        {(['facts', 'signs'] as Tab[]).map(t => {
          const selected = tab === t
          const label = t === 'facts' ? 'Key Facts' : 'Road Signs'
          return (
            <TouchableOpacity
              key={t}
              style={[styles.segBtn, selected && styles.segActive]}
              onPress={() => setTab(t)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
            >
              <Text style={[styles.segText, selected && styles.segTextActive]}>{label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {tab === 'facts' ? (
          <>
            <Text style={styles.hint}>Tap a card to see the answer. Tap again to hide it.</Text>
            {KEY_FACTS.map(fact => <FlashCard key={fact.id} fact={fact} />)}
          </>
        ) : (
          <>
            <Text style={styles.hint}>Tap a sign to read what it means.</Text>
            <View style={styles.grid}>
              {ROAD_SIGNS.map(sign => {
                const open = expandedSign === sign.id
                return (
                  <TouchableOpacity
                    key={sign.id}
                    style={[styles.signCard, open && styles.signCardExpanded]}
                    onPress={() => setExpandedSign(open ? null : sign.id)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: open }}
                    accessibilityLabel={`${sign.name}. ${sign.colorLabel} ${sign.shapeLabel} sign.${open ? ` ${sign.meaning}` : ' Double tap to read more.'}`}
                  >
                    <RoadSignIcon type={sign.type} size={80} />
                    <Text style={styles.signName}>{sign.name}</Text>
                    <Text style={styles.signMeta}>{sign.colorLabel} · {sign.shapeLabel}</Text>
                    {open && (
                      <>
                        <Text style={styles.signMeaning}>{sign.meaning}</Text>
                        <Text style={styles.signTip}>{sign.tip}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  heading: { fontSize: theme.font.h1, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, paddingHorizontal: 24, paddingTop: 8 },
  segment: { flexDirection: 'row', margin: 16, borderRadius: theme.radius.md, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  segBtn: { flex: 1, minHeight: 52, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  segActive: { backgroundColor: theme.colors.accent },
  segText: { color: theme.colors.textDim, fontWeight: '700', fontSize: 16 },
  segTextActive: { color: theme.colors.text },
  body: { padding: 16, paddingTop: 0, paddingBottom: 96 },
  hint: { fontSize: 16, color: theme.colors.textDim, textAlign: 'center', marginBottom: 16, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  signCard: { width: '47%', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 14, alignItems: 'center', minHeight: 140 },
  signCardExpanded: { width: '100%', borderColor: theme.colors.accent, borderWidth: 2 },
  signName: { fontSize: 16, color: theme.colors.text, fontWeight: '700', textAlign: 'center', marginTop: 10 },
  signMeta: { fontSize: 14, color: theme.colors.textDim, textAlign: 'center', marginTop: 4 },
  signMeaning: { fontSize: 16, color: theme.colors.textDim, lineHeight: 24, marginTop: 12, textAlign: 'center' },
  signTip: { fontSize: 16, color: theme.colors.accent, fontWeight: '700', marginTop: 8, textAlign: 'center', lineHeight: 22 },
})
