import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing } from '@/constants/theme';
import { mockPatients } from '@/data/mockData';
import { Plus, X } from 'lucide-react-native';

const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function CreatePrescriptionScreen() {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleCreatePrescription = async () => {
    if (!selectedPatient || !diagnosis || medications.some(med => !med.name)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Prescription created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create prescription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <CardHeader title="New Prescription" subtitle="Create a new prescription for patient" />
          <CardContent>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Patient *</Text>
              <View style={styles.patientList}>
                {mockPatients.map((patient) => (
                  <Button
                    key={patient.id}
                    title={`${patient.firstName} ${patient.lastName} (${patient.age})`}
                    variant={selectedPatient === patient.id ? 'primary' : 'outline'}
                    onPress={() => setSelectedPatient(patient.id)}
                    style={styles.patientButton}
                  />
                ))}
              </View>
            </View>

            <Input
              label="Diagnosis *"
              value={diagnosis}
              onChangeText={setDiagnosis}
              placeholder="e.g., Common Cold, Hypertension"
            />

            <View style={styles.medicationsSection}>
              <View style={styles.medicationsHeader}>
                <Text style={styles.fieldLabel}>Medications *</Text>
                <TouchableOpacity onPress={addMedication} style={styles.addButton}>
                  <Plus size={20} color={Colors.brand} />
                  <Text style={styles.addButtonText}>Add Medication</Text>
                </TouchableOpacity>
              </View>

              {medications.map((medication, index) => (
                <Card key={medication.id} style={styles.medicationCard}>
                  <CardContent>
                    <View style={styles.medicationHeader}>
                      <Text style={styles.medicationTitle}>Medication {index + 1}</Text>
                      {medications.length > 1 && (
                        <TouchableOpacity 
                          onPress={() => removeMedication(medication.id)}
                          style={styles.removeButton}
                        >
                          <X size={20} color={Colors.error} />
                        </TouchableOpacity>
                      )}
                    </View>

                    <Input
                      label="Medication Name *"
                      value={medication.name}
                      onChangeText={(value) => updateMedication(medication.id, 'name', value)}
                      placeholder="e.g., Paracetamol"
                    />

                    <View style={styles.medicationRow}>
                      <Input
                        label="Dosage"
                        value={medication.dosage}
                        onChangeText={(value) => updateMedication(medication.id, 'dosage', value)}
                        placeholder="e.g., 500mg"
                        style={styles.halfInput}
                      />
                      <Input
                        label="Frequency"
                        value={medication.frequency}
                        onChangeText={(value) => updateMedication(medication.id, 'frequency', value)}
                        placeholder="e.g., Every 6 hours"
                        style={styles.halfInput}
                      />
                    </View>

                    <Input
                      label="Duration"
                      value={medication.duration}
                      onChangeText={(value) => updateMedication(medication.id, 'duration', value)}
                      placeholder="e.g., 5 days"
                    />

                    <Input
                      label="Instructions"
                      value={medication.instructions}
                      onChangeText={(value) => updateMedication(medication.id, 'instructions', value)}
                      placeholder="e.g., Take with food"
                      multiline
                      numberOfLines={2}
                    />
                  </CardContent>
                </Card>
              ))}
            </View>

            <Input
              label="Additional Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional instructions or notes"
              multiline
              numberOfLines={3}
            />

            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => router.back()}
                style={styles.actionButton}
              />
              <Button
                title={isLoading ? "Creating..." : "Create Prescription"}
                onPress={handleCreatePrescription}
                disabled={isLoading}
                style={styles.actionButton}
              />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    margin: Spacing.md,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  patientList: {
    gap: Spacing.sm,
  },
  patientButton: {
    marginBottom: Spacing.xs,
  },
  medicationsSection: {
    marginBottom: Spacing.md,
  },
  medicationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  addButtonText: {
    color: Colors.brand,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  medicationCard: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.gray50,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  medicationTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  medicationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});