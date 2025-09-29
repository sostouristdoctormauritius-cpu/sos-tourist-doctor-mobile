import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'prescription';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'scheduled':
        return Colors.primary;
      case 'confirmed':
        return Colors.success;
      case 'active':
      case 'inProgress':
        return Colors.warning;
      case 'completed':
        return Colors.gray500;
      case 'cancelled':
        return Colors.error;
      case 'emergency':
        return Colors.error;
      case 'normal':
        return Colors.primary;
      default:
        return Colors.gray500;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'confirmed':
        return 'Confirmed';
      case 'active':
        return 'Active';
      case 'inProgress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'emergency':
        return 'Emergency';
      case 'normal':
        return 'Normal';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const backgroundColor = getStatusColor();
  const textColor = Colors.white;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
});

export default StatusBadge;