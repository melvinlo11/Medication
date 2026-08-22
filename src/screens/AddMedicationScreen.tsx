import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { createMedication } from '@/db/medications';
import { colors, spacing } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { upsertSchedule } from '@/db/schedules';
import { scheduleReminderPair } from '@/services/reminderScheduler';
import { ScheduleInputs } from '@/components/ScheduleInputs';
import type { DayOfWeek } from '@/types';

export function AddMedicationScreen() {
  const navigation = useNavigation();
  const [name, setName] = React.useState('');
  const [dosage, setDosage] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [timesPerDay, setTimesPerDay] = React.useState('1');
  const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfWeek[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [reminderTime, setReminderTime] = React.useState('8:00 AM');

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
    const medicationId = createMedication({
      name: name.trim(),
      dosage: dosage.trim(),
      notes: notes.trim(),
      paused: false
    });
    const reminders = await scheduleReminderPair(
      name.trim(),
      dosage.trim(),
      reminderTime,
      daysOfWeek.join(','),
      15
    );
    upsertSchedule({
      medicationId,
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
      <Text style={styles.title}>Add Medication</Text>
      <TextInput style={styles.input} placeholder="Medication name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Dosage" value={dosage} onChangeText={setDosage} />
      <ScheduleInputs
        timesPerDay={timesPerDay}
        onTimesPerDayChange={setTimesPerDay}
        daysOfWeek={daysOfWeek}
        onDaysOfWeekChange={setDaysOfWeek}
        reminderTime={reminderTime}
        onReminderTimeChange={setReminderTime}
      />
      <TextInput style={[styles.input, styles.multiline]} placeholder="Notes" value={notes} onChangeText={setNotes} multiline />
      <Pressable style={styles.saveButton} onPress={onSave}><Text style={styles.saveText}>Save</Text></Pressable>
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
  saveText: { color: 'white', fontSize: 18, fontWeight: '700' }
});
