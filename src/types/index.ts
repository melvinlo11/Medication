export type Medication = {
  id: number;
  name: string;
  dosage: string;
  notes?: string | null;
  paused: boolean;
};

export type Schedule = {
  id: number;
  medicationId: number;
  timesPerDay: string;
  daysOfWeek: string;
  reminderTime: string;
  notificationId: string | null;
  followUpNotificationId: string | null;
  missedDoseNotificationId: string | null;
  reminderMinutes: number;
};

export type AdherenceStatus = 'taken' | 'snoozed' | 'missed';

export type AdherenceEvent = {
  id: number;
  medicationId: number;
  timestamp: string;
  status: AdherenceStatus;
};

export type DayOfWeek =
  | 'Mon'
  | 'Tue'
  | 'Wed'
  | 'Thu'
  | 'Fri'
  | 'Sat'
  | 'Sun';
