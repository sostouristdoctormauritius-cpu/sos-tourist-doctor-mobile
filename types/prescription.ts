import { Patient } from './auth';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  medications: Medication[];
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  validUntil?: string;
  patient?: Patient | null;
  appointment?: {
    id: string;
    title: string;
    scheduledAt: string;
  } | null;
}