import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Clock, 
  Languages, 
  Settings,
  LogOut,
  Edit
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { doctor, logout } = useAuth();
  const router = useRouter();

  if (!doctor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <CardContent>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                {doctor.profilePhoto ? (
                  <Image source={{ uri: doctor.profilePhoto }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <User size={40} color={Colors.textSecondary} />
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.editImageButton}
                  onPress={() => router.push('/edit-profile')}
                >
                  <Edit size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.doctorName}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </Text>
                <Text style={styles.specialization}>{doctor.specialization}</Text>
                <View style={styles.verificationBadge}>
                  <Award size={16} color={Colors.success} />
                  <Text style={styles.verifiedText}>Verified Doctor</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card style={styles.sectionCard}>
          <CardHeader title="Contact Information" />
          <CardContent>
            <View style={styles.contactItem}>
              <Mail size={20} color={Colors.textSecondary} />
              <Text style={styles.contactText}>{doctor.email}</Text>
            </View>
            {doctor.phone && (
              <View style={styles.contactItem}>
                <Phone size={20} color={Colors.textSecondary} />
                <Text style={styles.contactText}>{doctor.phone}</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card style={styles.sectionCard}>
          <CardHeader title="Professional Information" />
          <CardContent>
            {doctor.licenseNumber && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>License Number:</Text>
                <Text style={styles.infoValue}>{doctor.licenseNumber}</Text>
              </View>
            )}
            {doctor.yearsOfExperience && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Years of Experience:</Text>
                <Text style={styles.infoValue}>{doctor.yearsOfExperience} years</Text>
              </View>
            )}
            {doctor.languages && doctor.languages.length > 0 && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Languages:</Text>
                <Text style={styles.infoValue}>{doctor.languages.join(', ')}</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Availability Status:</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: doctor.availabilityStatus === 'available' ? Colors.success : Colors.warning }
                ]} />
                <Text style={styles.infoValue}>
                  {doctor.availabilityStatus?.charAt(0).toUpperCase() + doctor.availabilityStatus?.slice(1)}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Bio */}
        {doctor.bio && (
          <Card style={styles.sectionCard}>
            <CardHeader title="About" />
            <CardContent>
              <Text style={styles.bioText}>{doctor.bio}</Text>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <Card style={styles.sectionCard}>
          <CardHeader title="Statistics" />
          <CardContent>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Total Patients</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Consultations</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>89</Text>
                <Text style={styles.statLabel}>Prescriptions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card style={styles.sectionCard}>
          <CardContent>
            <Button
              title="Edit Profile"
              onPress={() => router.push('/edit-profile')}
              style={styles.actionButton}
            />
            <Button
              title="Settings"
              variant="outline"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <Button
              title="Sign Out"
              variant="outline"
              onPress={handleLogout}
              style={styles.actionButton}
            />
          </CardContent>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Member since {new Date(doctor.createdAt).toLocaleDateString()}
          </Text>
        </View>
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
  profileCard: {
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.brand,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  specialization: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  verifiedText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  sectionCard: {
    margin: Spacing.md,
    marginTop: 0,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  contactText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
    justifyContent: 'flex-end',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bioText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.gray50,
    borderRadius: 8,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.brand,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
  },
});