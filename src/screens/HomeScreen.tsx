import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getMedications } from '@/db/medications';
import { logAdherenceEvent, getLatestEventForMedication } from '@/db/events';
import { colors, spacing } from '@/theme';
import { MedicationRow } from '@/components/MedicationRow';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getScheduleByMedicationId, updateScheduleNotifications } from '@/db/schedules';
import { cancelReminderPair, scheduleSnoozeReminder, cancelScheduledReminder } from '@/services/reminderScheduler';

type RootStackParamList = {
  Home: undefined;
  AddMedication: undefined;
  EditMedication: { id: number };
};

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [medications, setMedications] = React.useState(getMedications());

  useFocusEffect(React.useCallback(() => {
    setMedications(getMedications());
  }, []));

  const handleTaken = async (medicationId: number) => {
    logAdherenceEvent(medicationId, 'taken');
    const schedule = getScheduleByMedicationId(medicationId);
    await cancelReminderPair(null, schedule?.followUpNotificationId ?? null);
    await cancelScheduledReminder(schedule?.missedDoseNotificationId ?? null);
    updateScheduleNotifications(
      medicationId,
      schedule?.notificationId ?? null,
      null,
      null
    );
    setMedications(getMedications());
    Alert.alert('Marked taken', 'The reminder for this dose has been cleared.');
  };

  const handleSnooze = async (medicationId: number) => {
    logAdherenceEvent(medicationId, 'snoozed');
    const schedule = getScheduleByMedicationId(medicationId);
    await cancelReminderPair(null, schedule?.followUpNotificationId ?? null);
    await cancelScheduledReminder(schedule?.missedDoseNotificationId ?? null);
    const medication = medications.find((item) => item.id === medicationId);
    if (medication) {
      const snoozeId = await scheduleSnoozeReminder(
        medication.name,
        medication.dosage,
        schedule?.reminderMinutes ?? 15
      );
      updateScheduleNotifications(
        medicationId,
        schedule?.notificationId ?? null,
        snoozeId,
        snoozeId
      );
    }
    setMedications(getMedications());
    Alert.alert('Snoozed', 'We will remind you again later.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Medication Reminder</Text>
        <Text style={styles.title}>Today&apos;s Medications</Text>
        <Text style={styles.subtitle}>Tap Taken when the dose is done. Snooze if you need a little more time.</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryValue}>{medications.filter((item) => !item.paused).length}</Text>
            <Text style={styles.summaryLabel}>Active meds</Text>
          </View>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryValue}>{medications.filter((item) => item.paused).length}</Text>
            <Text style={styles.summaryLabel}>Paused</Text>
          </View>
        </View>
      </View>
      <Pressable style={styles.addButton} onPress={() => navigation.navigate('AddMedication')}>
        <Text style={styles.addText}>+ Add Medication</Text>
      </Pressable>
      <FlatList
        data={medications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MedicationRow
            medication={item}
            scheduleSummary={formatScheduleSummary(item.id)}
            intakeState={formatIntakeState(item.id)}
            onTaken={() => void handleTaken(item.id)}
            onSnooze={() => void handleSnooze(item.id)}
            onEdit={() => navigation.navigate('EditMedication', { id: item.id })}
          />
        )}
        contentContainerStyle={medications.length === 0 ? styles.emptyWrap : undefined}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No medications yet</Text>
            <Text style={styles.empty}>Add your first medication and we&apos;ll show it here with reminders.</Text>
          </View>
        }
      />
    </View>
  );

  function formatScheduleSummary(medicationId: number) {
    const schedule = getScheduleByMedicationId(medicationId);
    if (!schedule) return undefined;
    const days = schedule.daysOfWeek.split(',').join(' • ');
    return `${schedule.timesPerDay} time(s) per day on ${days}`;
  }

  function formatIntakeState(medicationId: number) {
    const latest = getLatestEventForMedication(medicationId);
    if (!latest) return 'Pending';
    if (latest.status === 'taken') return 'Taken';
    if (latest.status === 'snoozed') return 'Snoozed';
    if (latest.status === 'missed') return 'Missed';
    return 'Pending';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  kicker: { fontSize: 15, color: colors.accent, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 4 },
  subtitle: { fontSize: 17, color: colors.muted, marginTop: 8, lineHeight: 24 },
  summaryRow: { flexDirection: 'row', gap: 12, marginTop: spacing.lg },
  summaryChip: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  summaryValue: { fontSize: 24, fontWeight: '900', color: colors.primary },
  summaryLabel: { fontSize: 14, fontWeight: '700', color: colors.muted, marginTop: 2 },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: spacing.lg,
    alignItems: 'center'
  },
  addText: { color: 'white', fontSize: 17, fontWeight: '800' },
  emptyWrap: { flexGrow: 1, justifyContent: 'center' },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center'
  },
  emptyTitle: { fontSize: 22, fontWeight: '900', color: colors.text, textAlign: 'center' },
  empty: { fontSize: 18, color: colors.muted, marginTop: 10, textAlign: 'center', lineHeight: 24 }
});
