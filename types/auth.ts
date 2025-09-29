export interface Doctor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
  languages?: string[];
  availabilityStatus: 'available' | 'busy' | 'offline';
  licenseNumber?: string;
  yearsOfExperience?: number;
  updatedAt?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  profilePhoto?: string;
  phone?: string;
  email?: string;
  emergencyContact?: string;
}

export interface AuthState {
  doctor: Doctor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}