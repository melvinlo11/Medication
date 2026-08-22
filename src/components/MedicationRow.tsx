import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '@/theme';
import type { Medication } from '@/types';

export function MedicationRow({
  medication,
  scheduleSummary,
  intakeState,
  onTaken,
  onSnooze,
  onEdit
}: {
  medication: Medication;
  scheduleSummary?: string;
  intakeState?: string;
  onTaken: () => void;
  onSnooze: () => void;
  onEdit: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.meta}>{medication.dosage}</Text>
        </View>
        {medication.paused ? (
          <View style={styles.pausedPill}>
            <Text style={styles.pausedText}>Paused</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.stateRow}>
        <View
          style={[
            styles.statePill,
            intakeState === 'Taken' && styles.statePillGood,
            intakeState === 'Snoozed' && styles.statePillWarn,
            intakeState === 'Missed' && styles.statePillDanger
          ]}
        >
          <Text style={styles.stateText}>{intakeState ?? 'Pending'}</Text>
        </View>
      </View>
      {scheduleSummary ? <Text style={styles.schedule}>{scheduleSummary}</Text> : null}
      {!!medication.notes && <Text style={styles.notes}>{medication.notes}</Text>}
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={onTaken}>
          <Text style={styles.actionText}>Taken</Text>
        </Pressable>
        <Pressable style={styles.actionSecondary} onPress={onSnooze}>
          <Text style={styles.actionText}>Snooze 15m</Text>
        </Pressable>
        <Pressable style={styles.editButton} onPress={onEdit}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  name: { fontSize: 24, fontWeight: '900', color: colors.text },
  meta: { fontSize: 18, color: colors.muted, marginTop: 4, fontWeight: '600' },
  schedule: {
    marginTop: 10,
    fontSize: 15,
    color: colors.accent,
    fontWeight: '700'
  },
  notes: { fontSize: 16, color: colors.text, marginTop: 10, lineHeight: 22 },
  actions: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: spacing.lg, flexWrap: 'wrap' },
  action: {
    backgroundColor: colors.success,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 100,
    alignItems: 'center'
  },
  actionSecondary: {
    backgroundColor: colors.warning,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 120,
    alignItems: 'center'
  },
  actionText: { color: 'white', fontSize: 16, fontWeight: '800' },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  edit: { color: colors.accent, fontSize: 16, fontWeight: '800' },
  pausedPill: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999
  },
  pausedText: { color: colors.muted, fontWeight: '700' }
  ,
  stateRow: { marginTop: 10, alignItems: 'flex-start' },
  statePill: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999
  },
  statePillGood: { backgroundColor: '#dcfce7' },
  statePillWarn: { backgroundColor: '#fef3c7' },
  statePillDanger: { backgroundColor: '#fee2e2' },
  stateText: { color: colors.text, fontWeight: '800', fontSize: 13 }
});
