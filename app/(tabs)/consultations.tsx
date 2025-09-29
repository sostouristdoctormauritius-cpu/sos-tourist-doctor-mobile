import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { mockAppointments } from '@/data/mockData';
import { Video, MessageCircle, Phone, User, Play, Clock } from 'lucide-react-native';

export default function ConsultationsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'waiting' | 'completed'>('all');
  const router = useRouter();

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'completed', label: 'Completed' },
  ] as const;

  // Convert appointments to consultations for demo
  const consultations = mockAppointments.map(apt => ({
    id: apt.id,
    appointmentId: apt.id,
    patientId: apt.patientId,
    doctorId: apt.doctorId,
    type: apt.type,
    status: apt.status === 'in_progress' ? 'active' : 
            apt.status === 'scheduled' || apt.status === 'confirmed' ? 'waiting' :
            apt.status === 'completed' ? 'completed' : 'waiting',
    patient: apt.patient,
    title: apt.title,
    scheduledAt: apt.scheduledAt,
    duration: apt.duration,
    createdAt: apt.createdAt,
  }));

  const getFilteredConsultations = () => {
    switch (selectedFilter) {
      case 'active':
        return consultations.filter(c => c.status === 'active');
      case 'waiting':
        return consultations.filter(c => c.status === 'waiting');
      case 'completed':
        return consultations.filter(c => c.status === 'completed');
      default:
        return consultations;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'waiting':
        return Colors.warning;
      case 'completed':
        return Colors.gray500;
      default:
        return Colors.gray400;
    }
  };

  const filteredConsultations = getFilteredConsultations();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consultations</Text>
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
        {filteredConsultations.length > 0 ? (
          filteredConsultations.map((consultation) => {
            const TypeIcon = getTypeIcon(consultation.type);
            const consultationDate = new Date(consultation.scheduledAt);
            const statusColor = getStatusColor(consultation.status);
            
            return (
              <Card key={consultation.id} style={styles.consultationCard}>
                <CardContent>
                  <View style={styles.consultationHeader}>
                    <View style={styles.consultationInfo}>
                      <Text style={styles.consultationTitle}>{consultation.title}</Text>
                      <View style={styles.patientInfo}>
                        <Text style={styles.patientName}>
                          {consultation.patient.firstName} {consultation.patient.lastName}
                        </Text>
                        <Text style={styles.patientAge}>Age: {consultation.patient.age}</Text>
                      </View>
                    </View>
                    <View style={styles.consultationMeta}>
                      <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
                      <StatusBadge status={consultation.status} variant="consultation" />
                    </View>
                  </View>

                  <View style={styles.consultationDetails}>
                    <View style={styles.detailItem}>
                      <TypeIcon size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {consultation.type.charAt(0).toUpperCase() + consultation.type.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Clock size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {consultationDate.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.durationText}>
                        Duration: {consultation.duration} min
                      </Text>
                    </View>
                  </View>

                  <View style={styles.consultationActions}>
                    {consultation.status === 'waiting' && (
                      <Button
                        title="Start Consultation"
                        onPress={() => router.push(`/consultation/${consultation.id}`)}
                        style={styles.actionButton}
                        size="small"
                      />
                    )}
                    {consultation.status === 'active' && (
                      <Button
                        title="Join Consultation"
                        onPress={() => router.push(`/consultation/${consultation.id}`)}
                        style={styles.actionButton}
                        size="small"
                      />
                    )}
                    {consultation.status === 'completed' && (
                      <Button
                        title="View Notes"
                        variant="outline"
                        onPress={() => {}}
                        style={styles.actionButton}
                        size="small"
                      />
                    )}
                    <Button
                      title="Patient Profile"
                      variant="outline"
                      onPress={() => {}}
                      style={styles.actionButton}
                      size="small"
                    />
                  </View>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <CardContent>
              <Text style={styles.emptyText}>
                No consultations found for the selected filter.
              </Text>
            </CardContent>
          </Card>
        )}
      </ScrollView>
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
  consultationCard: {
    marginBottom: Spacing.md,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  consultationInfo: {
    flex: 1,
  },
  consultationTitle: {
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
  consultationMeta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignSelf: 'center',
  },
  consultationDetails: {
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
  durationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  consultationActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});