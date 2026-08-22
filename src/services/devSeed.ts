import { createMedication } from '@/db/medications';

export function seedDemoData() {
  createMedication({
    name: 'Vitamin D',
    dosage: '1 tablet',
    notes: 'Take after breakfast.',
    paused: false
  });
  createMedication({
    name: 'Blood Pressure Med',
    dosage: '1 pill',
    notes: 'Take at 8:00 AM.',
    paused: false
  });
}
