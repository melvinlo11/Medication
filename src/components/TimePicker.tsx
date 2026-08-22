import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export function TimePicker({
  value,
  onChange
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [hourPart, minutePart, meridiemPart] = value.match(/^(\d{1,2}):(\d{2})\s([AP]M)$/)?.slice(1) ?? ['8', '00', 'AM'];
  const hour = Number(hourPart);

  const setHour = (nextHour: number) => onChange(`${nextHour}:${minutePart} ${meridiemPart}`);
  const setMinute = (nextMinute: string) => onChange(`${hour}:${nextMinute} ${meridiemPart}`);
  const setMeridiem = (nextMeridiem: 'AM' | 'PM') => onChange(`${hour}:${minutePart} ${nextMeridiem}`);

  return (
    <View>
      <Text style={styles.label}>Reminder time</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.helper}>Hour</Text>
          <View style={styles.wrap}>
            {HOURS.map((item) => {
              const selected = item === hour;
              return (
                <Pressable key={item} onPress={() => setHour(item)} style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.helper}>Minute</Text>
          <View style={styles.wrap}>
            {MINUTES.map((item) => {
              const selected = item === minutePart;
              return (
                <Pressable key={item} onPress={() => setMinute(item)} style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.meridiemRow}>
        {(['AM', 'PM'] as const).map((item) => {
          const selected = item === meridiemPart;
          return (
            <Pressable key={item} onPress={() => setMeridiem(item)} style={[styles.meridiemChip, selected && styles.chipSelected]}>
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  helper: { fontSize: 15, color: colors.muted, fontWeight: '700', marginBottom: 8 },
  row: { gap: 12 },
  column: { marginBottom: spacing.md },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    minWidth: 48,
    alignItems: 'center'
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 15, color: colors.text, fontWeight: '700' },
  chipTextSelected: { color: 'white' },
  meridiemRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.md },
  meridiemChip: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.surface
  }
});
