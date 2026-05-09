import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { KEY_FACTS } from '../../src/data/keyFacts'
import { ROAD_SIGNS } from '../../src/data/roadSigns'
import { FlashCard } from '../../src/components/FlashCard'
import { RoadSignIcon } from '../../src/components/RoadSignIcon'

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
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  segment: { flexDirection: 'row', margin: 16, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  segBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  segActive: { backgroundColor: '#e63329' },
  segText: { color: '#888', fontWeight: '600', fontSize: 14 },
  segTextActive: { color: '#fff' },
  body: { padding: 16, paddingTop: 0 },
  hint: { fontSize: 13, color: '#555', textAlign: 'center', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  signCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, alignItems: 'center' },
  signCardExpanded: { width: '100%', borderColor: 'rgba(230,51,41,0.4)' },
  signName: { fontSize: 13, color: '#f0f0f0', fontWeight: '600', textAlign: 'center', marginTop: 8 },
  signMeta: { fontSize: 11, color: '#555', textAlign: 'center', marginTop: 2 },
  signMeaning: { fontSize: 13, color: '#888', lineHeight: 20, marginTop: 10, textAlign: 'center' },
  signTip: { fontSize: 12, color: '#e63329', fontWeight: '600', marginTop: 6, textAlign: 'center' },
})
