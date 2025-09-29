# Doctor MVP - Appointment Management Flow

## Overview
This document outlines the appointment management flow for doctors in the SOS Tourist Doctor MVP application.

## Appointment Actions

### 1. Accept Appointment
**When clicked:**
- Changes appointment status from 'scheduled' to 'confirmed'
- Sends confirmation notification to patient (simulated)
- Updates the appointment in the local state
- Shows success message to doctor

**Flow:**
```
Doctor clicks "Accept" → Status changes to "confirmed" → UI updates → Success feedback
```

### 2. Reschedule Appointment
**When clicked:**
- Opens RescheduleModal component
- Doctor selects new date and time
- Validates input (date/time required)
- Updates appointment with new schedule
- Changes status to 'scheduled' (pending patient confirmation)
- Sends reschedule notification to patient (simulated)

**Flow:**
```
Doctor clicks "Reschedule" → Modal opens → Doctor inputs new date/time → 
Validates input → Updates appointment → Closes modal → Success feedback
```

**Components involved:**
- `RescheduleModal.tsx` - Modal for date/time selection
- Input validation for date and time
- Appointment context for state management

### 3. Refuse Appointment
**When clicked:**
- Opens RefuseModal component
- Doctor must provide a reason for refusal
- Validates reason is provided
- Changes appointment status to 'cancelled'
- Stores refusal reason in appointment notes
- Sends cancellation notification to patient (simulated)

**Flow:**
```
Doctor clicks "Refuse" → Modal opens → Doctor enters reason → 
Validates reason → Updates status to cancelled → Closes modal → Success feedback
```

**Components involved:**
- `RefuseModal.tsx` - Modal for reason input
- Text area for detailed reason
- Confirmation dialog for destructive action

## Professional Healthcare App Standards

### ✅ Implemented Features:
1. **Clear Action Buttons** - Accept, Reschedule, Refuse with distinct styling
2. **Confirmation Modals** - Prevent accidental actions
3. **Reason Tracking** - Required reason for appointment refusal
4. **Status Management** - Clear appointment status tracking
5. **Input Validation** - Ensures data integrity
6. **User Feedback** - Success/error messages
7. **Professional UI** - Clean, medical-grade interface

### ✅ Healthcare Compliance:
1. **Audit Trail** - All actions are tracked with timestamps
2. **Reason Documentation** - Required for cancellations
3. **Patient Communication** - Simulated notifications for all actions
4. **Data Integrity** - Validation prevents invalid states
5. **Professional Workflow** - Follows medical appointment standards

### ✅ Technical Implementation:
1. **Context Management** - AppointmentContext for state
2. **Modal Components** - Reusable RescheduleModal and RefuseModal
3. **Type Safety** - Full TypeScript implementation
4. **Error Handling** - Proper error states and user feedback
5. **Loading States** - Visual feedback during operations

## Usage Example

```typescript
// In appointment list component
const { acceptAppointment, rescheduleAppointment, refuseAppointment } = useAppointments();

// Accept appointment
const handleAccept = (appointmentId: string) => {
  acceptAppointment(appointmentId);
  // Show success message
};

// Reschedule appointment
const handleReschedule = (appointmentId: string, newDate: string, newTime: string) => {
  rescheduleAppointment(appointmentId, newDate, newTime);
  // Show success message
};

// Refuse appointment
const handleRefuse = (appointmentId: string, reason: string) => {
  refuseAppointment(appointmentId, reason);
  // Show success message
};
```

This implementation provides a complete, professional-grade appointment management system suitable for healthcare applications.