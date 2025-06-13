import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDataStore = create(
  persist(
    (set, get) => ({
      // Appointments
      appointments: [
        {
          id: '1',
          patient_id: '8',
          patient_name: 'John Smith',
          doctor_id: '3',
          doctor_name: 'Dr. Sarah Johnson',
          appointment_date: '2024-06-15T10:00:00Z',
          appointment_status: 'Confirmed',
          reason: 'Regular checkup',
          doctor_notes: ''
        },
        {
          id: '2',
          patient_id: '8',
          patient_name: 'John Smith',
          doctor_id: '3',
          doctor_name: 'Dr. Sarah Johnson',
          appointment_date: '2024-06-20T14:30:00Z',
          appointment_status: 'Pending',
          reason: 'Follow-up consultation',
          doctor_notes: ''
        }
      ],

      // Prescriptions
      prescriptions: [
        {
          id: '1',
          appointment_id: '1',
          prescribed_date: '2024-06-15T10:30:00Z',
          doctor_id: '3',
          doctor_name: 'Dr. Sarah Johnson',
          patient_id: '8',
          patient_name: 'John Smith',
          medications: [
            { medicine_name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily' },
            { medicine_name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed' }
          ],
          followup_required: true,
          notes: 'Take with food. Complete full course.'
        }
      ],

      // Billing
      billing: [
        {
          id: '1',
          patient_id: '8',
          patient_name: 'John Smith',
          appointment_id: '1',
          billing_date: '2024-06-15T11:00:00Z',
          service_items: [
            { service_name: 'Consultation', price: 150.00 },
            { service_name: 'Blood Test', price: 75.00 }
          ],
          total_amount: 225.00,
          payment_status: 'Paid'
        }
      ],

      // Lab Reports
      labReports: [
        {
          id: '1',
          patient_id: '8',
          patient_name: 'John Smith',
          doctor_id: '3',
          doctor_name: 'Dr. Sarah Johnson',
          lab_technician_id: '5',
          technician_name: 'Michael Chen',
          report_date: '2024-06-15T12:00:00Z',
          report_type: 'Blood Test',
          report_result: {
            hemoglobin: '14.2 g/dL',
            white_blood_cells: '7,500/μL',
            platelets: '250,000/μL'
          },
          file_upload: null,
          notes: 'All values within normal range'
        }
      ],

      // Staff
      staff: [
        {
          id: '1',
          user_id: '3',
          full_name: 'Dr. Sarah Johnson',
          email: 'doctor@carehub.com',
          role_name: 'Doctor',
          department: 'Internal Medicine',
          designation: 'Senior Physician',
          shift_timing: '9:00 AM - 5:00 PM',
          salary: 120000.00,
          joining_date: '2020-01-15'
        },
        {
          id: '2',
          user_id: '4',
          full_name: 'Emily Davis',
          email: 'nurse@carehub.com',
          role_name: 'Nurse',
          department: 'Emergency',
          designation: 'Head Nurse',
          shift_timing: '7:00 AM - 7:00 PM',
          salary: 65000.00,
          joining_date: '2019-03-20'
        }
      ],

      // Notifications
      notifications: [
        {
          id: '1',
          user_id: '8',
          notification_message: 'Your appointment with Dr. Sarah Johnson is confirmed for June 15th at 10:00 AM',
          notification_type: 'Appointment',
          is_read: false,
          created_at: '2024-06-13T09:00:00Z'
        },
        {
          id: '2',
          user_id: '8',
          notification_message: 'Your lab results are ready for review',
          notification_type: 'LabReport',
          is_read: false,
          created_at: '2024-06-13T14:30:00Z'
        }
      ],

      // Audit Logs
      auditLogs: [
        {
          id: '1',
          action_performed: 'User Login',
          performed_by: '8',
          performer_name: 'John Smith',
          resource: 'Authentication',
          resource_id: '8',
          timestamp: '2024-06-13T08:00:00Z'
        },
        {
          id: '2',
          action_performed: 'Appointment Created',
          performed_by: '3',
          performer_name: 'Dr. Sarah Johnson',
          resource: 'Appointments',
          resource_id: '1',
          timestamp: '2024-06-13T09:15:00Z'
        }
      ],

      // Patient Profiles
      patientProfiles: [
        {
          id: '1',
          user_id: '8',
          full_name: 'John Smith',
          email: 'patient@carehub.com',
          gender: 'Male',
          date_of_birth: '1985-03-15',
          address: '123 Main St, City, State 12345',
          blood_group: 'O+',
          medical_history: {
            conditions: ['Hypertension', 'Diabetes Type 2'],
            surgeries: ['Appendectomy (2010)'],
            medications: ['Metformin', 'Lisinopril']
          },
          allergies: 'Penicillin, Shellfish',
          emergency_contact: 'Jane Smith - 555-0123'
        }
      ],

      // CRUD Operations
      addAppointment: (appointment) => {
        set(state => ({
          appointments: [...state.appointments, { ...appointment, id: Date.now().toString() }]
        }));
      },

      updateAppointment: (id, updates) => {
        set(state => ({
          appointments: state.appointments.map(apt => 
            apt.id === id ? { ...apt, ...updates } : apt
          )
        }));
      },

      deleteAppointment: (id) => {
        set(state => ({
          appointments: state.appointments.filter(apt => apt.id !== id)
        }));
      },

      addPrescription: (prescription) => {
        set(state => ({
          prescriptions: [...state.prescriptions, { ...prescription, id: Date.now().toString() }]
        }));
      },

      updatePrescription: (id, updates) => {
        set(state => ({
          prescriptions: state.prescriptions.map(presc => 
            presc.id === id ? { ...presc, ...updates } : presc
          )
        }));
      },

      addBilling: (billing) => {
        set(state => ({
          billing: [...state.billing, { ...billing, id: Date.now().toString() }]
        }));
      },

      updateBilling: (id, updates) => {
        set(state => ({
          billing: state.billing.map(bill => 
            bill.id === id ? { ...bill, ...updates } : bill
          )
        }));
      },

      addLabReport: (report) => {
        set(state => ({
          labReports: [...state.labReports, { ...report, id: Date.now().toString() }]
        }));
      },

      updateLabReport: (id, updates) => {
        set(state => ({
          labReports: state.labReports.map(report => 
            report.id === id ? { ...report, ...updates } : report
          )
        }));
      },

      addStaff: (staff) => {
        set(state => ({
          staff: [...state.staff, { ...staff, id: Date.now().toString() }]
        }));
      },

      updateStaff: (id, updates) => {
        set(state => ({
          staff: state.staff.map(member => 
            member.id === id ? { ...member, ...updates } : member
          )
        }));
      },

      deleteStaff: (id) => {
        set(state => ({
          staff: state.staff.filter(member => member.id !== id)
        }));
      },

      addNotification: (notification) => {
        set(state => ({
          notifications: [...state.notifications, { ...notification, id: Date.now().toString() }]
        }));
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(notif => 
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        }));
      },

      addAuditLog: (log) => {
        set(state => ({
          auditLogs: [...state.auditLogs, { ...log, id: Date.now().toString() }]
        }));
      }
    }),
    {
      name: 'carehub-data'
    }
  )
);