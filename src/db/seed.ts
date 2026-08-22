import { createMedication } from './medications';

export function seedDemoData() {
  createMedication({ name: 'Aspirin', dosage: '1 tablet', notes: 'Morning only', paused: false });
  createMedication({ name: 'Metformin', dosage: '500 mg', notes: 'After meal', paused: false });
}
