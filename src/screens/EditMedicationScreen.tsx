import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { deleteMedication, getMedicationById, togglePaused, updateMedication } from '@/db/medications';
import { colors, spacing } from '@/theme';
import { getScheduleByMedicationId, upsertSchedule } from '@/db/schedules';
import { scheduleReminderPair } from '@/services/reminderScheduler';
import { ScheduleInputs } from '@/components/ScheduleInputs';
import type { DayOfWeek } from '@/types';

export function EditMedicationScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const medication = getMedicationById(route.params.id);
  const existingSchedule = getScheduleByMedicationId(route.params.id);
  const [name, setName] = React.useState(medication?.name ?? '');
  const [dosage, setDosage] = React.useState(medication?.dosage ?? '');
  const [notes, setNotes] = React.useState(medication?.notes ?? '');
  const [timesPerDay, setTimesPerDay] = React.useState(existingSchedule?.timesPerDay ?? '1');
  const [reminderTime, setReminderTime] = React.useState(existingSchedule?.reminderTime ?? '8:00 AM');
  const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfWeek[]>(
    (existingSchedule?.daysOfWeek?.split(',') as DayOfWeek[] | undefined) ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  );

  if (!medication) return <View style={styles.container}><Text>Medication not found.</Text></View>;

  const onSave = async () => {
    const parsedTimes = Number(timesPerDay);
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Missing info', 'Please add a name and dosage.');
      return;
    }
    if (!Number.isInteger(parsedTimes) || parsedTimes < 1 || parsedTimes > 12) {
      Alert.alert('Invalid schedule', 'Times per day must be a whole number between 1 and 12.');
      return;
    }
    if (daysOfWeek.length === 0) {
      Alert.alert('Invalid schedule', 'Please choose at least one day.');
      return;
    }
    updateMedication(medication.id, { name: name.trim(), dosage: dosage.trim(), notes: notes.trim(), paused: medication.paused });
    const reminders = await scheduleReminderPair(
      name.trim(),
      dosage.trim(),
      reminderTime,
      daysOfWeek.join(','),
      15
    );
    upsertSchedule({
      id: existingSchedule?.id,
      medicationId: medication.id,
      timesPerDay: String(parsedTimes),
      daysOfWeek: daysOfWeek.join(','),
      reminderTime,
      notificationId: reminders.notificationId,
      followUpNotificationId: reminders.followUpNotificationId,
      missedDoseNotificationId: reminders.missedDoseNotificationId,
      reminderMinutes: 15
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Edit Medication</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <TextInput style={styles.input} value={dosage} onChangeText={setDosage} />
      <ScheduleInputs
        timesPerDay={timesPerDay}
        onTimesPerDayChange={setTimesPerDay}
        daysOfWeek={daysOfWeek}
        onDaysOfWeekChange={setDaysOfWeek}
        reminderTime={reminderTime}
        onReminderTimeChange={setReminderTime}
      />
      <TextInput style={[styles.input, styles.multiline]} value={notes} onChangeText={setNotes} multiline />
      <Pressable style={styles.saveButton} onPress={onSave}><Text style={styles.saveText}>Update</Text></Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => { togglePaused(medication.id, !medication.paused); navigation.goBack(); }}>
        <Text style={styles.secondaryText}>{medication.paused ? 'Resume' : 'Pause'}</Text>
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={() => { deleteMedication(medication.id); navigation.goBack(); }}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  content: { paddingBottom: spacing.xl },
  title: { fontSize: 28, fontWeight: '900', marginBottom: spacing.lg },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: spacing.md, fontSize: 18 },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  saveButton: { backgroundColor: colors.accent, padding: 16, borderRadius: 14, alignItems: 'center' },
  saveText: { color: 'white', fontSize: 18, fontWeight: '700' },
  secondaryButton: { marginTop: spacing.md, padding: 16, borderRadius: 14, alignItems: 'center', backgroundColor: colors.warning },
  secondaryText: { color: 'white', fontSize: 18, fontWeight: '700' },
  deleteButton: { marginTop: spacing.md, padding: 16, borderRadius: 14, alignItems: 'center', backgroundColor: colors.danger },
  deleteText: { color: 'white', fontSize: 18, fontWeight: '700' }
});
