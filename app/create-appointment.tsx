import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing } from '@/constants/theme';
import { mockPatients } from '@/data/mockData';

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

export default function CreateAppointmentScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [appointmentType, setAppointmentType] = useState<'video' | 'chat' | 'phone'>('video');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateAppointment = async () => {
    if (!title || !selectedPatient) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Appointment created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <CardHeader title="New Appointment" subtitle="Schedule a new patient appointment" />
          <CardContent>
            <Input
              label="Appointment Title *"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., General Checkup"
            />

            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of the appointment"
              multiline
              numberOfLines={3}
            />

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

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Appointment Type</Text>
              <View style={styles.typeButtons}>
                {(['video', 'chat', 'phone'] as const).map((type) => (
                  <Button
                    key={type}
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                    variant={appointmentType === type ? 'primary' : 'outline'}
                    onPress={() => setAppointmentType(type)}
                    style={styles.typeButton}
                    size="small"
                  />
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Priority</Text>
              <View style={styles.typeButtons}>
                {(['normal', 'urgent', 'emergency'] as const).map((p) => (
                  <Button
                    key={p}
                    title={p.charAt(0).toUpperCase() + p.slice(1)}
                    variant={priority === p ? 'primary' : 'outline'}
                    onPress={() => setPriority(p)}
                    style={styles.typeButton}
                    size="small"
                  />
                ))}
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => router.back()}
                style={styles.actionButton}
              />
              <Button
                title={isLoading ? "Creating..." : "Create Appointment"}
                onPress={handleCreateAppointment}
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
  typeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  typeButton: {
    flex: 1,
    minWidth: 80,
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