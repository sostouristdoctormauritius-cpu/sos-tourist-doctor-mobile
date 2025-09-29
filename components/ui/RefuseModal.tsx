import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { X, AlertTriangle } from 'lucide-react-native';

interface RefuseModalProps {
  visible: boolean;
  onClose: () => void;
  onRefuse: (reason: string) => void;
  appointmentTitle: string;
  patientName: string;
}

export function RefuseModal({
  visible,
  onClose,
  onRefuse,
  appointmentTitle,
  patientName,
}: RefuseModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefuse = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for refusing the appointment');
      return;
    }

    setIsLoading(true);
    try {
      await onRefuse(reason.trim());
      setReason('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to refuse appointment');
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
            <View style={styles.titleContainer}>
              <AlertTriangle size={24} color={Colors.error} />
              <Text style={styles.title}>Refuse Appointment</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.appointmentInfo}>
              {appointmentTitle} with {patientName}
            </Text>

            <Text style={styles.warningText}>
              Are you sure you want to refuse this appointment? This action cannot be undone.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reason for refusal *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Please provide a reason for refusing this appointment..."
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={onClose}
                style={styles.cancelButton}
              />
              <Button
                title="Refuse Appointment"
                onPress={handleRefuse}
                loading={isLoading}
                style={[styles.refuseButton, { backgroundColor: Colors.error }]}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: Colors.error,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 100,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  refuseButton: {
    flex: 1,
  },
});