import { getDb } from './index';
import type { Schedule } from '@/types';

export function getSchedulesByMedicationId(medicationId: number): Schedule[] {
  return getDb().getAllSync<Schedule>('SELECT * FROM schedules WHERE medicationId = ?', [medicationId]);
}

export function upsertSchedule(input: Omit<Schedule, 'id'> & { id?: number }) {
  if (input.id) {
    getDb().runSync(
      'UPDATE schedules SET timesPerDay = ?, daysOfWeek = ?, reminderTime = ?, notificationId = ?, followUpNotificationId = ?, missedDoseNotificationId = ?, reminderMinutes = ? WHERE id = ?',
      [
        input.timesPerDay,
        input.daysOfWeek,
        input.reminderTime,
        input.notificationId,
        input.followUpNotificationId,
        input.missedDoseNotificationId,
        input.reminderMinutes,
        input.id
      ]
    );
    return input.id;
  }

  const result = getDb().runSync(
    'INSERT INTO schedules (medicationId, timesPerDay, daysOfWeek, reminderTime, notificationId, followUpNotificationId, missedDoseNotificationId, reminderMinutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      input.medicationId,
      input.timesPerDay,
      input.daysOfWeek,
      input.reminderTime,
      input.notificationId,
      input.followUpNotificationId,
      input.missedDoseNotificationId,
      input.reminderMinutes
    ]
  );
  return result.lastInsertRowId;
}

export function deleteSchedulesByMedicationId(medicationId: number) {
  getDb().runSync('DELETE FROM schedules WHERE medicationId = ?', [medicationId]);
}

export function getScheduleByMedicationId(medicationId: number): Schedule | null {
  return (
    getDb().getFirstSync<Schedule>('SELECT * FROM schedules WHERE medicationId = ?', [medicationId]) ??
    null
  );
}

export function updateScheduleNotifications(
  medicationId: number,
  notificationId: string | null,
  followUpNotificationId: string | null,
  missedDoseNotificationId: string | null
) {
  getDb().runSync(
    'UPDATE schedules SET notificationId = ?, followUpNotificationId = ?, missedDoseNotificationId = ? WHERE medicationId = ?',
    [notificationId, followUpNotificationId, missedDoseNotificationId, medicationId]
  );
}
