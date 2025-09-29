import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { X, Calendar, Clock } from 'lucide-react-native';

interface RescheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onReschedule: (newDate: string, newTime: string) => void;
  appointmentTitle: string;
  patientName: string;
}

export function RescheduleModal({
  visible,
  onClose,
  onReschedule,
  appointmentTitle,
  patientName,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }

    setIsLoading(true);
    try {
      await onReschedule(newDate, newTime);
      setNewDate('');
      setNewTime('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to reschedule appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Reschedule Appointment</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.appointmentInfo}>
              {appointmentTitle} with {patientName}
            </Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.brand} />
                <Input
                  placeholder="Select new date (YYYY-MM-DD)"
                  value={newDate}
                  onChangeText={setNewDate}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Clock size={20} color={Colors.brand} />
                <Input
                  placeholder="Select new time (HH:MM)"
                  value={newTime}
                  onChangeText={setNewTime}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={onClose}
                style={styles.cancelButton}
              />
              <Button
                title="Reschedule"
                onPress={handleReschedule}
                loading={isLoading}
                style={styles.rescheduleButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 400,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
  },
  appointmentInfo: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  rescheduleButton: {
    flex: 1,
  },
});