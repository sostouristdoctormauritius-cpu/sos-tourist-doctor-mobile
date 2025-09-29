export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  type: 'video' | 'chat' | 'voice';
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  scheduledAt: string;
  duration: number;
  symptoms: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}