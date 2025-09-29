import { Patient } from './auth';

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled' | 'no_show';
  type: 'in_person' | 'video' | 'phone' | 'chat';
  priority: 'normal' | 'urgent' | 'emergency';
  createdAt: string;
  notes?: string;
}