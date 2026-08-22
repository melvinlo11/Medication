import { getDb } from './index';
import type { AdherenceEvent, AdherenceStatus } from '@/types';

export function logAdherenceEvent(medicationId: number, status: AdherenceStatus) {
  getDb().runSync(
    'INSERT INTO adherence_events (medicationId, timestamp, status) VALUES (?, ?, ?)',
    [medicationId, new Date().toISOString(), status]
  );
}

export function getAdherenceEvents(): AdherenceEvent[] {
  return getDb().getAllSync<AdherenceEvent>('SELECT * FROM adherence_events ORDER BY timestamp DESC');
}

export function getLatestEventForMedication(medicationId: number): AdherenceEvent | null {
  return (
    getDb().getFirstSync<AdherenceEvent>(
      'SELECT * FROM adherence_events WHERE medicationId = ? ORDER BY timestamp DESC LIMIT 1',
      [medicationId]
    ) ?? null
  );
}
