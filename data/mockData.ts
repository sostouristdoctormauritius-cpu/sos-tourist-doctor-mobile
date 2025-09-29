import { Doctor, Patient } from '../types/auth';
import { Appointment } from '../types/appointment';
import { Prescription } from '../types/prescription';

// Mock doctors
export const mockDoctors: Doctor[] = [
  {
    id: '1',
    email: 'dr.smith@example.com',
    firstName: 'John',
    lastName: 'Smith',
    specialization: 'General Medicine',
    profilePhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    phone: '+1234567890',
    bio: 'Experienced general practitioner with 15 years of experience.',
    verified: true,
    createdAt: '2024-01-01T00:00:00Z',
    languages: ['English', 'Spanish'],
    availabilityStatus: 'available',
    licenseNumber: 'MD123456',
    yearsOfExperience: 15,
  },
  {
    id: '2',
    email: 'dr.johnson@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialization: 'Emergency Medicine',
    profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    phone: '+1234567891',
    bio: 'Emergency medicine specialist available 24/7.',
    verified: true,
    createdAt: '2024-01-01T00:00:00Z',
    languages: ['English', 'French'],
    availabilityStatus: 'available',
    licenseNumber: 'MD789012',
    yearsOfExperience: 12,
  },
];

// Mock patients for doctor's appointments

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Wilson',
    age: 28,
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    phone: '+1234567892',
    email: 'alice.wilson@example.com',
    emergencyContact: '+1234567893',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Brown',
    age: 35,
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    phone: '+1234567894',
    email: 'bob.brown@example.com',
    emergencyContact: '+1234567895',
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Davis',
    age: 42,
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    phone: '+1234567896',
    email: 'carol.davis@example.com',
    emergencyContact: '+1234567897',
  },
];

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patient: mockPatients[0],
    doctorId: '1',
    title: 'General Checkup',
    description: 'Routine health checkup and consultation',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration: 30,
    status: 'scheduled',
    type: 'video',
    priority: 'normal',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    patientId: '2',
    patient: mockPatients[1],
    doctorId: '1',
    title: 'Follow-up Consultation',
    description: 'Follow-up for previous treatment',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration: 20,
    status: 'confirmed',
    type: 'chat',
    priority: 'normal',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    patientId: '3',
    patient: mockPatients[2],
    doctorId: '2',
    title: 'Emergency Consultation',
    description: 'Urgent medical consultation needed',
    scheduledAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    duration: 45,
    status: 'confirmed',
    type: 'video',
    priority: 'emergency',
    createdAt: new Date().toISOString(),
  },
];

// Mock prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Alice Wilson',
    doctorId: '1',
    doctorName: 'Dr. John Smith',
    diagnosis: 'Common Cold',
    medications: [
      {
        id: '1',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        duration: '5 days',
        instructions: 'Take with food',
      },
      {
        id: '2',
        name: 'Cough Syrup',
        dosage: '10ml',
        frequency: 'Every 8 hours',
        duration: '7 days',
        instructions: 'Take before meals',
      },
    ],
    notes: 'Rest and drink plenty of fluids',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    patient: mockPatients[0],
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Bob Brown',
    doctorId: '1',
    doctorName: 'Dr. John Smith',
    diagnosis: 'Hypertension',
    medications: [
      {
        id: '3',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning',
      },
    ],
    notes: 'Monitor blood pressure regularly',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    patient: mockPatients[1],
  },
];

// Mock consultations (simplified for MVP)
export const mockConsultations = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    patientName: 'Alice Wilson',
    doctorName: 'Dr. John Smith',
    type: 'video' as const,
    status: 'scheduled' as const,
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    duration: 30,
    symptoms: ['Headache', 'Fever'],
    notes: 'Initial consultation for headaches',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '1',
    patientName: 'Bob Brown',
    doctorName: 'Dr. John Smith',
    type: 'chat' as const,
    status: 'active' as const,
    scheduledAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    duration: 20,
    symptoms: ['Back pain'],
    notes: 'Follow-up consultation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Export default doctor for auth context
export const mockDoctor = mockDoctors[0];