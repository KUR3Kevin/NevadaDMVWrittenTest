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
      <View style={styles.segment}>
        {(['facts', 'signs'] as Tab[]).map(t => (
          <TouchableOpacity key={t} style={[styles.segBtn, tab === t && styles.segActive]} onPress={() => setTab(t)}>
            <Text style={[styles.segText, tab === t && styles.segTextActive]}>
              {t === 'facts' ? 'Key Facts' : 'Road Signs'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {tab === 'facts' ? (
          <>
            <Text style={styles.hint}>Tap a card to reveal the answer.</Text>
            {KEY_FACTS.map(fact => <FlashCard key={fact.id} fact={fact} />)}
          </>
        ) : (
          <View style={styles.grid}>
            {ROAD_SIGNS.map(sign => (
              <TouchableOpacity
                key={sign.id}
                style={[styles.signCard, expandedSign === sign.id && styles.signCardExpanded]}
                onPress={() => setExpandedSign(expandedSign === sign.id ? null : sign.id)}
                activeOpacity={0.8}
              >
                <RoadSignIcon type={sign.type} size={72} />
                <Text style={styles.signName}>{sign.name}</Text>
                <Text style={styles.signMeta}>{sign.colorLabel} · {sign.shapeLabel}</Text>
                {expandedSign === sign.id && (
                  <>
                    <Text style={styles.signMeaning}>{sign.meaning}</Text>
                    <Text style={styles.signTip}>{sign.tip}</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  segment: { flexDirection: 'row', margin: 16, borderRadius: theme.radius.md, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  segBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  segActive: { backgroundColor: theme.colors.accent },
  segText: { color: theme.colors.textDim, fontWeight: '600', fontSize: 14 },
  segTextActive: { color: theme.colors.text },
  body: { padding: 16, paddingTop: 0 },
  hint: { fontSize: 13, color: theme.colors.textMute, textAlign: 'center', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  signCard: { width: '47%', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 12, alignItems: 'center' },
  signCardExpanded: { width: '100%', borderColor: theme.colors.accent },
  signName: { fontSize: 13, color: theme.colors.text, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  signMeta: { fontSize: 11, color: theme.colors.textMute, textAlign: 'center', marginTop: 2 },
  signMeaning: { fontSize: 13, color: theme.colors.textDim, lineHeight: 20, marginTop: 10, textAlign: 'center' },
  signTip: { fontSize: 12, color: theme.colors.accent, fontWeight: '600', marginTop: 6, textAlign: 'center' },
})
