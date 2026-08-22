import React from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { DayPicker } from './DayPicker';
import { TimePicker } from './TimePicker';
import type { DayOfWeek } from '@/types';

export function ScheduleInputs({
  timesPerDay,
  onTimesPerDayChange,
  daysOfWeek,
  onDaysOfWeekChange,
  reminderTime,
  onReminderTimeChange
}: {
  timesPerDay: string;
  onTimesPerDayChange: (value: string) => void;
  daysOfWeek: DayOfWeek[];
  onDaysOfWeekChange: (value: DayOfWeek[]) => void;
  reminderTime: string;
  onReminderTimeChange: (value: string) => void;
}) {
  return (
    <View>
      <TimePicker value={reminderTime} onChange={onReminderTimeChange} />
      <Text style={styles.label}>Times per day</Text>
      <TextInput
        style={styles.input}
        placeholder="1"
        value={timesPerDay}
        onChangeText={onTimesPerDayChange}
        keyboardType="number-pad"
      />
      <Text style={styles.label}>Days of week</Text>
      <DayPicker value={daysOfWeek} onChange={onDaysOfWeekChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: spacing.md,
    fontSize: 18
  }
});
