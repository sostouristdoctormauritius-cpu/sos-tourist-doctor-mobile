import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { RescheduleModal } from '../../components/ui/RescheduleModal';
import { RefuseModal } from '../../components/ui/RefuseModal';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { useAppointments } from '../../contexts/AppointmentContext';
import { Calendar, Clock, Video, MessageCircle, Phone, User, Plus, Check, CalendarX, X } from 'lucide-react-native';

export default function AppointmentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [rescheduleModal, setRescheduleModal] = useState<{ visible: boolean; appointmentId: string | null }>({ visible: false, appointmentId: null });
  const [refuseModal, setRefuseModal] = useState<{ visible: boolean; appointmentId: string | null }>({ visible: false, appointmentId: null });
  const router = useRouter();
  const { appointments, acceptAppointment, rescheduleAppointment, refuseAppointment } = useAppointments();

  const handleAcceptAppointment = async (appointmentId: string) => {
    try {
      await acceptAppointment(appointmentId);
      Alert.alert('Success', 'Appointment accepted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept appointment. Please try again.');
    }
  };

  const handleRescheduleAppointment = async (newDateTime: string, reason?: string) => {
    if (!rescheduleModal.appointmentId) return;
    
    try {
      await rescheduleAppointment(rescheduleModal.appointmentId, newDateTime, reason);
      setRescheduleModal({ visible: false, appointmentId: null });
      Alert.alert('Success', 'Appointment rescheduled successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to reschedule appointment. Please try again.');
    }
  };

  const handleRefuseAppointment = async (reason: string) => {
    if (!refuseModal.appointmentId) return;
    
    try {
      await refuseAppointment(refuseModal.appointmentId, reason);
      setRefuseModal({ visible: false, appointmentId: null });
      Alert.alert('Success', 'Appointment refused successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to refuse appointment. Please try again.');
    }
  };

  const getAppointmentActions = (appointment: any) => {
    const actions = [];
    
    switch (appointment.status) {
      case 'scheduled':
        actions.push(
          <Button
            key="accept"
            title="Accept"
            onPress={() => handleAcceptAppointment(appointment.id)}
            style={[styles.actionButton, styles.acceptButton]}
            size="small"

          />,
          <Button
            key="reschedule"
            title="Reschedule"
            variant="outline"
            onPress={() => setRescheduleModal({ visible: true, appointmentId: appointment.id })}
            style={styles.actionButton}
            size="small"
          />,
          <Button
            key="refuse"
            title="Refuse"
            onPress={() => setRefuseModal({ visible: true, appointmentId: appointment.id })}
            style={[styles.actionButton, styles.refuseButton]}
            size="small"
          />
        );
        break;
        
      case 'confirmed':
        actions.push(
          <Button
            key="start"
            title="Start Consultation"
            onPress={() => router.push(`/consultation/${appointment.id}`)}
            style={styles.actionButton}
            size="small"
          />,
          <Button
            key="reschedule"
            title="Reschedule"
            variant="outline"
            onPress={() => setRescheduleModal({ visible: true, appointmentId: appointment.id })}
            style={styles.actionButton}
            size="small"
          />
        );
        break;
        
      default:
        actions.push(
          <Button
            key="edit"
            title="Edit"
            variant="outline"
            onPress={() => router.push(`/edit-appointment/${appointment.id}`)}
            style={styles.actionButton}
            size="small"
          />
        );
    }
    
    return actions;
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
  ] as const;

  const getFilteredAppointments = () => {
    const now = new Date();
    const today = now.toDateString();

    switch (selectedFilter) {
      case 'today':
        return appointments.filter(apt => 
          new Date(apt.scheduledAt).toDateString() === today
        );
      case 'upcoming':
        return appointments.filter(apt => 
          new Date(apt.scheduledAt) > now && apt.status !== 'completed'
        );
      case 'completed':
        return appointments.filter(apt => apt.status === 'completed');
      default:
        return appointments;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'chat':
        return MessageCircle;
      case 'phone':
        return Phone;
      default:
        return User;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-appointment')}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === filter.key && styles.filterTabTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const TypeIcon = getTypeIcon(appointment.type);
            const appointmentDate = new Date(appointment.scheduledAt);
            
            return (
              <Card key={appointment.id} style={styles.appointmentCard}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentInfo}>
                      <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                      <View style={styles.patientInfo}>
                        <Text style={styles.patientName}>
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </Text>
                        <Text style={styles.patientAge}>Age: {appointment.patient.age}</Text>
                      </View>
                    </View>
                    <View style={styles.appointmentMeta}>
                      <StatusBadge status={appointment.status} />
                      {appointment.priority === 'emergency' && (
                        <StatusBadge status={appointment.priority} />
                      )}
                    </View>
                  </View>

                  <View style={styles.appointmentDetails}>
                    <View style={styles.detailItem}>
                      <Calendar size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {appointmentDate.toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Clock size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {appointmentDate.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <TypeIcon size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {appointment.description && (
                    <Text style={styles.description}>{appointment.description}</Text>
                  )}

                  <View style={styles.appointmentActions}>
                    {getAppointmentActions(appointment)}
                  </View>
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No appointments found for the selected filter.
            </Text>
            <Button
              title="Create New Appointment"
              onPress={() => router.push('/create-appointment')}
              style={styles.createButton}
            />
          </Card>
        )}
      </ScrollView>
      
      {rescheduleModal.appointmentId && (
        <RescheduleModal
          visible={rescheduleModal.visible}
          onClose={() => setRescheduleModal({ visible: false, appointmentId: null })}
          onReschedule={handleRescheduleAppointment}
          appointmentTitle={appointments.find(apt => apt.id === rescheduleModal.appointmentId)?.title || ''}
          patientName={`${appointments.find(apt => apt.id === rescheduleModal.appointmentId)?.patient.firstName} ${appointments.find(apt => apt.id === rescheduleModal.appointmentId)?.patient.lastName}` || ''}
        />
      )}
      
      {refuseModal.appointmentId && (
        <RefuseModal
          visible={refuseModal.visible}
          onClose={() => setRefuseModal({ visible: false, appointmentId: null })}
          onRefuse={handleRefuseAppointment}
          appointmentTitle={appointments.find(apt => apt.id === refuseModal.appointmentId)?.title || ''}
          patientName={`${appointments.find(apt => apt.id === refuseModal.appointmentId)?.patient.firstName} ${appointments.find(apt => apt.id === refuseModal.appointmentId)?.patient.lastName}` || ''}

        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.brand,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
  },
  filterTabActive: {
    backgroundColor: Colors.brand,
  },
  filterTabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.md,
  },
  appointmentCard: {
    marginBottom: Spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  patientName: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  patientAge: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
  },
  appointmentMeta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  appointmentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  acceptButton: {
    backgroundColor: Colors.success,
  },
  refuseButton: {
    backgroundColor: Colors.error,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  createButton: {
    minWidth: 200,
  },
});