import * as Notifications from 'expo-notifications';

import type { DayOfWeek } from '@/types';

const WEEKDAY_TO_NUMBER: Record<DayOfWeek, number> = {
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
  Sat: 7
};

function parseReminderTime(reminderTime: string) {
  const match = reminderTime.match(/^(\d{1,2}):(\d{2})\s([AP]M)$/);
  if (!match) return { hour: 8, minute: 0 };

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3];

  if (meridiem === 'AM') {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return { hour, minute };
}

export function deserializeNotificationIds(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [value];
  } catch {
    return [value];
  }
}

export function serializeNotificationIds(ids: string[] | null) {
  if (!ids || ids.length === 0) return null;
  return JSON.stringify(ids);
}

function getDateComponents(reminderTime: string, day: DayOfWeek) {
  const { hour, minute } = parseReminderTime(reminderTime);
  return {
    hour,
    minute,
    weekday: WEEKDAY_TO_NUMBER[day]
  };
}

export async function scheduleMissedDoseEscalation(
  title: string,
  body: string,
  reminderTime: string,
  daysOfWeek: string,
  reminderMinutes = 15
) {
  const days = daysOfWeek.split(',').filter(Boolean) as DayOfWeek[];
  const ids: string[] = [];

  for (const day of days) {
    const reminderComponents = getDateComponents(reminderTime, day);
    const missedMinute = reminderComponents.minute + reminderMinutes;
    const missedHour = reminderComponents.hour + Math.floor(missedMinute / 60);
    const normalizedMinute = missedMinute % 60;
    const normalizedHour = missedHour % 24;
    const weekday = missedHour >= 24 ? (reminderComponents.weekday % 7) + 1 : reminderComponents.weekday;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${title} missed dose`,
        body: `${body} was not marked taken.`
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        repeats: true,
        weekday,
        hour: normalizedHour,
        minute: normalizedMinute
      }
    });
    ids.push(id);
  }

  return ids;
}

async function scheduleRecurringBaseNotifications(
  title: string,
  body: string,
  reminderTime: string,
  daysOfWeek: string
) {
  const days = daysOfWeek.split(',').filter(Boolean) as DayOfWeek[];
  const ids: string[] = [];

  for (const day of days) {
    const components = getDateComponents(reminderTime, day);
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        repeats: true,
        weekday: components.weekday,
        hour: components.hour,
        minute: components.minute
      }
    });
    ids.push(id);
  }

  return ids;
}

export async function scheduleReminderPair(
  title: string,
  body: string,
  reminderTime: string,
  daysOfWeek: string,
  reminderMinutes = 15
) {
  const baseNotificationIds = await scheduleRecurringBaseNotifications(title, body, reminderTime, daysOfWeek);
  const missedDoseNotificationIds = await scheduleMissedDoseEscalation(
    title,
    body,
    reminderTime,
    daysOfWeek,
    reminderMinutes
  );
  return {
    notificationId: serializeNotificationIds(baseNotificationIds),
    followUpNotificationId: null,
    missedDoseNotificationId: serializeNotificationIds(missedDoseNotificationIds)
  };
}

export async function scheduleSnoozeReminder(
  title: string,
  body: string,
  reminderMinutes = 15
) {
  const date = new Date(Date.now() + reminderMinutes * 60 * 1000);
  return Notifications.scheduleNotificationAsync({
    content: {
      title: `${title} - follow up`,
      body
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date
    }
  });
}

export async function cancelScheduledReminder(notificationId: string | null) {
  if (!notificationId) return;
  const ids = deserializeNotificationIds(notificationId);
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

export async function cancelReminderPair(
  notificationId: string | null,
  followUpNotificationId: string | null
) {
  await cancelScheduledReminder(followUpNotificationId);
}
