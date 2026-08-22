import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('medication-reminder.db');

export async function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      notes TEXT,
      paused INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicationId INTEGER NOT NULL,
      timesPerDay TEXT NOT NULL,
      daysOfWeek TEXT NOT NULL,
      reminderTime TEXT NOT NULL DEFAULT '08:00',
      notificationId TEXT,
      followUpNotificationId TEXT,
      missedDoseNotificationId TEXT,
      reminderMinutes INTEGER NOT NULL DEFAULT 15,
      FOREIGN KEY (medicationId) REFERENCES medications(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS adherence_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicationId INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (medicationId) REFERENCES medications(id) ON DELETE CASCADE
    );
  `);

  const scheduleColumns = db.getAllSync<{ name: string }>('PRAGMA table_info(schedules)');
  const hasReminderTime = scheduleColumns.some((column) => column.name === 'reminderTime');
  if (!hasReminderTime) {
    db.execSync("ALTER TABLE schedules ADD COLUMN reminderTime TEXT NOT NULL DEFAULT '08:00';");
  }
  const hasMissedDoseNotificationId = scheduleColumns.some((column) => column.name === 'missedDoseNotificationId');
  if (!hasMissedDoseNotificationId) {
    db.execSync('ALTER TABLE schedules ADD COLUMN missedDoseNotificationId TEXT;');
  }
}

export function getDb() {
  return db;
}
