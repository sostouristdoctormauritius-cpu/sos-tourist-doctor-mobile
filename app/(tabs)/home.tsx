import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { mockAppointments, mockPrescriptions } from '../../data/mockData';
import { Images } from '../../constants/assets';
import { Calendar, Clock, Users, FileText, Bell } from 'lucide-react-native';

export default function HomeScreen() {
  const { doctor } = useAuth();
  const insets = useSafeAreaInsets();

  // Calculate today's data with proper filtering
  const todayData = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const todayAppointments = mockAppointments.filter(apt => {
      const aptDate = new Date(apt.scheduledAt);
      return aptDate >= todayStart && aptDate < todayEnd;
    });
    
    const activePrescriptions = mockPrescriptions.filter(p => p.status === 'active');
    
    // Calculate upcoming appointments (next 2 hours)
    const upcomingAppointments = todayAppointments.filter(apt => {
      const aptTime = new Date(apt.scheduledAt);
      const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
      return aptTime <= twoHoursFromNow && aptTime > new Date();
    });
    
    return {
      todayAppointments,
      activePrescriptions,
      upcomingAppointments,
      totalPatients: new Set(mockAppointments.map(apt => apt.patientId)).size,
      hoursToday: todayAppointments.reduce((total, apt) => total + (apt.duration || 30), 0) / 60
    };
  }, []);

  const { todayAppointments, activePrescriptions, upcomingAppointments, totalPatients, hoursToday } = todayData;

  const stats = [
    {
      icon: Calendar,
      label: 'Today&apos;s Appointments',
      value: todayAppointments.length.toString(),
      color: Colors.brand,
      subtitle: upcomingAppointments.length > 0 ? `${upcomingAppointments.length} upcoming` : 'All completed'
    },
    {
      icon: Users,
      label: 'Total Patients',
      value: totalPatients.toString(),
      color: Colors.success,
      subtitle: 'Active patients'
    },
    {
      icon: FileText,
      label: 'Active Prescriptions',
      value: activePrescriptions.length.toString(),
      color: Colors.warning,
      subtitle: 'Currently active'
    },
    {
      icon: Clock,
      label: 'Hours Today',
      value: hoursToday.toFixed(1),
      color: Colors.info,
      subtitle: 'Consultation time'
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ImageBackground 
          source={Images.home.videoBackground} 
          style={styles.header}
          imageStyle={styles.headerBackground}
        >
          <View style={styles.headerOverlay}>
            <View style={styles.logoSection}>
              <Image source={Images.logo.main} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.doctorName}>Dr. {doctor?.firstName} {doctor?.lastName}</Text>
              <Text style={styles.specialization}>{doctor?.specialization}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color={Colors.white} />
                {upcomingAppointments.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{upcomingAppointments.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
              {doctor?.profilePhoto ? (
                <Image source={{ uri: doctor.profilePhoto }} style={styles.profileImage} />
              ) : (
                <Image source={Images.profile.profile} style={styles.profileImage} />
              )}
            </View>
          </View>
        </ImageBackground>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={`stat-${stat.label}`} style={[styles.statCard, { borderLeftColor: stat.color, borderLeftWidth: 4 }]}>
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                {stat.subtitle && (
                  <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
                )}
              </View>
            </Card>
          ))}
        </View>

        {/* Today's Overview */}
        <Card style={styles.sectionCard}>
          <CardHeader 
            title="Today&apos;s Overview" 
            subtitle={`${todayAppointments.length} appointments • ${hoursToday.toFixed(1)} hours`} 
          />
          <CardContent>
            {todayAppointments.length > 0 ? (
              <>
                {upcomingAppointments.length > 0 && (
                  <View style={styles.upcomingSection}>
                    <Text style={styles.sectionTitle}>Upcoming (Next 2 Hours)</Text>
                    {upcomingAppointments.map((appointment) => (
                      <View key={appointment.id} style={[styles.appointmentItem, styles.upcomingAppointment]}>
                        <View style={styles.appointmentInfo}>
                          <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                          <Text style={styles.appointmentPatient}>
                            {appointment.patient.firstName} {appointment.patient.lastName}
                          </Text>
                          <Text style={styles.appointmentTime}>
                            {new Date(appointment.scheduledAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Text>
                        </View>
                        <View style={styles.appointmentStatus}>
                          <StatusBadge status={appointment.status} />
                          <StatusBadge status={appointment.priority} />
                        </View>
                      </View>
                    ))}
                  </View>
                )}
                
                <Text style={styles.sectionTitle}>All Today&apos;s Appointments</Text>
                {todayAppointments.slice(0, 3).map((appointment) => (
                  <View key={appointment.id} style={styles.appointmentItem}>
                    <View style={styles.appointmentInfo}>
                      <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                      <Text style={styles.appointmentPatient}>
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </Text>
                      <Text style={styles.appointmentTime}>
                        {new Date(appointment.scheduledAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                    <View style={styles.appointmentStatus}>
                      <StatusBadge status={appointment.status} />
                      <StatusBadge status={appointment.priority} />
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Calendar size={48} color={Colors.gray400} />
                <Text style={styles.emptyText}>No appointments scheduled for today</Text>
                <Text style={styles.emptySubtext}>Enjoy your free day!</Text>
              </View>
            )}
            <Button
              title="View All Appointments"
              variant="outline"
              onPress={() => {}}
              style={styles.viewAllButton}
            />
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card style={styles.sectionCard}>
          <CardHeader title="Recent Prescriptions" subtitle={`${activePrescriptions.length} active`} />
          <CardContent>
            {activePrescriptions.length > 0 ? (
              activePrescriptions.slice(0, 3).map((prescription) => (
                <View key={prescription.id} style={styles.prescriptionItem}>
                  <View style={styles.prescriptionInfo}>
                    <Text style={styles.prescriptionPatient}>{prescription.patientName}</Text>
                    <Text style={styles.prescriptionDiagnosis}>{prescription.diagnosis}</Text>
                    <Text style={styles.prescriptionDate}>
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <StatusBadge status={prescription.status} variant="prescription" />
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No active prescriptions</Text>
            )}
            <Button
              title="View All Prescriptions"
              variant="outline"
              onPress={() => {}}
              style={styles.viewAllButton}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.sectionCard}>
          <CardHeader title="Quick Actions" />
          <CardContent>
            <View style={styles.quickActions}>
              <Button
                title="New Appointment"
                onPress={() => {}}
                style={styles.quickActionButton}
              />
              <Button
                title="New Prescription"
                variant="secondary"
                onPress={() => {}}
                style={styles.quickActionButton}
              />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
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
  header: {
    minHeight: 120,
    backgroundColor: Colors.brand,
  },
  headerBackground: {
    opacity: 0.3,
  },
  headerOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: 'rgba(229, 62, 62, 0.8)',
  },
  logoSection: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.lg,
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notificationButton: {
    padding: Spacing.xs,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.warning,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
  },
  welcomeSection: {
    flex: 1,
    marginTop: Spacing.xl,
  },
  welcomeText: {
    fontSize: Typography.fontSize.base,
    color: Colors.white,
    opacity: 0.9,
  },
  doctorName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginTop: 2,
  },
  specialization: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.sm,
  },
  statContent: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 2,
  },
  sectionCard: {
    margin: Spacing.md,
    marginTop: 0,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  appointmentPatient: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  appointmentTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.brand,
    marginTop: 2,
  },
  appointmentStatus: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  prescriptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  prescriptionInfo: {
    flex: 1,
  },
  prescriptionPatient: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  prescriptionDiagnosis: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  prescriptionDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.brand,
    marginTop: 2,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  viewAllButton: {
    marginTop: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickActionButton: {
    flex: 1,
  },
  upcomingSection: {
    marginBottom: Spacing.lg,
    padding: Spacing.sm,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
  },
  upcomingAppointment: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.xs,
    padding: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});