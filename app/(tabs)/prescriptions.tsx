import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { mockPrescriptions } from '@/data/mockData';
import { Plus, Calendar, User, Pill } from 'lucide-react-native';

export default function PrescriptionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const router = useRouter();

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ] as const;

  const getFilteredPrescriptions = () => {
    switch (selectedFilter) {
      case 'active':
        return mockPrescriptions.filter(p => p.status === 'active');
      case 'completed':
        return mockPrescriptions.filter(p => p.status === 'completed');
      case 'cancelled':
        return mockPrescriptions.filter(p => p.status === 'cancelled');
      default:
        return mockPrescriptions;
    }
  };

  const filteredPrescriptions = getFilteredPrescriptions();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prescriptions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-prescription')}
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
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => {
            const prescriptionDate = new Date(prescription.createdAt);
            const validUntil = prescription.validUntil ? new Date(prescription.validUntil) : null;
            
            return (
              <Card key={prescription.id} style={styles.prescriptionCard}>
                <CardContent>
                  <View style={styles.prescriptionHeader}>
                    <View style={styles.prescriptionInfo}>
                      <Text style={styles.patientName}>{prescription.patientName}</Text>
                      <Text style={styles.diagnosis}>{prescription.diagnosis}</Text>
                    </View>
                    <StatusBadge status={prescription.status} variant="prescription" />
                  </View>

                  <View style={styles.prescriptionDetails}>
                    <View style={styles.detailItem}>
                      <Calendar size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        Issued: {prescriptionDate.toLocaleDateString()}
                      </Text>
                    </View>
                    {validUntil && (
                      <View style={styles.detailItem}>
                        <Calendar size={16} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>
                          Valid until: {validUntil.toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.detailItem}>
                      <Pill size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {prescription.medications.length} medication(s)
                      </Text>
                    </View>
                  </View>

                  {/* Medications List */}
                  <View style={styles.medicationsSection}>
                    <Text style={styles.medicationsTitle}>Medications:</Text>
                    {prescription.medications.slice(0, 2).map((medication) => (
                      <View key={medication.id} style={styles.medicationItem}>
                        <Text style={styles.medicationName}>{medication.name}</Text>
                        <Text style={styles.medicationDetails}>
                          {medication.dosage} - {medication.frequency}
                        </Text>
                      </View>
                    ))}
                    {prescription.medications.length > 2 && (
                      <Text style={styles.moreText}>
                        +{prescription.medications.length - 2} more medication(s)
                      </Text>
                    )}
                  </View>

                  {prescription.notes && (
                    <View style={styles.notesSection}>
                      <Text style={styles.notesTitle}>Notes:</Text>
                      <Text style={styles.notesText}>{prescription.notes}</Text>
                    </View>
                  )}

                  <View style={styles.prescriptionActions}>
                    <Button
                      title="View Details"
                      onPress={() => router.push(`/prescription/${prescription.id}`)}
                      style={styles.actionButton}
                      size="small"
                    />
                    <Button
                      title="Edit"
                      variant="outline"
                      onPress={() => router.push(`/edit-prescription/${prescription.id}`)}
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
                No prescriptions found for the selected filter.
              </Text>
              <Button
                title="Create New Prescription"
                onPress={() => router.push('/create-prescription')}
                style={styles.createButton}
              />
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
  prescriptionCard: {
    marginBottom: Spacing.md,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  prescriptionInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  diagnosis: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  prescriptionDetails: {
    flexDirection: 'column',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
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
  medicationsSection: {
    marginBottom: Spacing.md,
  },
  medicationsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  medicationItem: {
    backgroundColor: Colors.gray50,
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  medicationName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  medicationDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  moreText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.brand,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  notesSection: {
    marginBottom: Spacing.md,
  },
  notesTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  notesText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  prescriptionActions: {
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
    marginBottom: Spacing.lg,
  },
  createButton: {
    minWidth: 200,
  },
});