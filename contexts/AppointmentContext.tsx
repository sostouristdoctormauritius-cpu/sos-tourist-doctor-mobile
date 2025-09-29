import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { mockAppointments } from '../data/mockData';
import { Appointment } from '../types/appointment';

export const [AppointmentProvider, useAppointments] = createContextHook(() => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const acceptAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed' as const }
          : apt
      )
    );
  }, []);

  const rescheduleAppointment = useCallback((appointmentId: string, newDate: string, newTime: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { 
              ...apt, 
              scheduledAt: new Date(`${newDate}T${newTime}`).toISOString(),
              status: 'scheduled' as const
            }
          : apt
      )
    );
  }, []);

  const refuseAppointment = useCallback((appointmentId: string, reason: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { 
              ...apt, 
              status: 'cancelled' as const,
              notes: reason
            }
          : apt
      )
    );
  }, []);

  const getAppointmentsByStatus = useCallback((status: string) => {
    return appointments.filter(apt => apt.status === status);
  }, [appointments]);

  const getTodayAppointments = useCallback(() => {
    const today = new Date().toDateString();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledAt).toDateString();
      return today === aptDate;
    });
  }, [appointments]);

  return useMemo(() => ({
    appointments,
    acceptAppointment,
    rescheduleAppointment,
    refuseAppointment,
    getAppointmentsByStatus,
    getTodayAppointments,
  }), [
    appointments,
    acceptAppointment,
    rescheduleAppointment,
    refuseAppointment,
    getAppointmentsByStatus,
    getTodayAppointments,
  ]);
});