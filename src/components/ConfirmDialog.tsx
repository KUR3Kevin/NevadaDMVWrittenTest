import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { theme } from '../theme'

type Props = {
  visible: boolean
  title: string
  message: string
  cancelLabel?: string
  confirmLabel: string
  destructive?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel = 'Keep going',
  confirmLabel,
  destructive = false,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop} accessibilityViewIsModal>
        <View style={styles.card} accessibilityRole="alert">
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.cancel}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirm, destructive && styles.confirmDanger]}
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text },
  message: { fontSize: 17, color: theme.colors.textDim, lineHeight: 24, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12 },
  cancel: {
    flex: 1,
    minHeight: theme.tap,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  cancelText: { color: theme.colors.text, fontSize: 17, fontWeight: '700' },
  confirm: {
    flex: 1,
    minHeight: theme.tap,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  confirmDanger: { backgroundColor: theme.colors.accent },
  confirmText: { color: theme.colors.text, fontSize: 17, fontWeight: '800' },
})
