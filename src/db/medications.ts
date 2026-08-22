import { getDb } from './index';
import type { Medication } from '@/types';
import { deleteSchedulesByMedicationId } from './schedules';

export function getMedications(): Medication[] {
  return getDb().getAllSync<Medication>('SELECT * FROM medications ORDER BY id DESC');
}

export function getMedicationById(id: number): Medication | null {
  return getDb().getFirstSync<Medication>('SELECT * FROM medications WHERE id = ?', [id]) ?? null;
}

export function createMedication(input: Omit<Medication, 'id'>) {
  const result = getDb().runSync(
    'INSERT INTO medications (name, dosage, notes, paused) VALUES (?, ?, ?, ?)',
    [input.name, input.dosage, input.notes ?? null, input.paused ? 1 : 0]
  );
  return result.lastInsertRowId;
}

export function updateMedication(id: number, input: Omit<Medication, 'id'>) {
  getDb().runSync(
    'UPDATE medications SET name = ?, dosage = ?, notes = ?, paused = ? WHERE id = ?',
    [input.name, input.dosage, input.notes ?? null, input.paused ? 1 : 0, id]
  );
}

export function deleteMedication(id: number) {
  getDb().runSync('DELETE FROM medications WHERE id = ?', [id]);
  deleteSchedulesByMedicationId(id);
}

export function togglePaused(id: number, paused: boolean) {
  getDb().runSync('UPDATE medications SET paused = ? WHERE id = ?', [paused ? 1 : 0, id]);
}
