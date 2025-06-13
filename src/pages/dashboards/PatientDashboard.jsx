import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, TestTube, CreditCard, Clock, Heart, Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function PatientDashboard() {
  const { appointments, prescriptions, labReports, billing } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Filter data for current patient
  const patientAppointments = appointments.filter(apt => apt.patient_id === user?.id);
  const patientPrescriptions = prescriptions.filter(presc => presc.patient_id === user?.id);
  const patientLabReports = labReports.filter(report => report.patient_id === user?.id);
  const patientBilling = billing.filter(bill => bill.patient_id === user?.id);

  const upcomingAppointments = patientAppointments.filter(apt => 
    new Date(apt.appointment_date) > new Date() && apt.appointment_status !== 'Cancelled'
  );

  const recentPrescriptions = patientPrescriptions.slice(0, 3);
  const pendingBills = patientBilling.filter(bill => bill.payment_status === 'Pending');

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: Calendar,
      color: 'bg-blue-500',
      description: 'Scheduled visits'
    },
    {
      title: 'Active Prescriptions',
      value: recentPrescriptions.length,
      icon: FileText,
      color: 'bg-green-500',
      description: 'Current medications'
    },
    {
      title: 'Lab Reports',
      value: patientLabReports.length,
      icon: TestTube,
      color: 'bg-purple-500',
      description: 'Available results'
    },
    {
      title: 'Pending Bills',
      value: pendingBills.length,
      icon: CreditCard,
      color: 'bg-orange-500',
      description: 'Awaiting payment'
    }
  ];

  const handleQuickAction = (action) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${action} functionality will be available in the next update! 🚀`
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="healthcare-gradient rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name}!</h1>
            <p className="text-teal-100 text-lg">
              Your health dashboard is ready. Stay on top of your care.
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Patient dashboard welcome illustration" className="w-32 h-32 rounded-xl" src="https://images.unsplash.com/photo-1666886573301-b5d526cfd518" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="healthcare-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Upcoming Appointments</span>
              </CardTitle>
              <CardDescription>Your scheduled medical visits</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctor_name}</p>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(appointment.appointment_date), 'MMM dd, yyyy - h:mm a')}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.appointment_status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.appointment_status}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleQuickAction('View All Appointments')}
                  >
                    View All Appointments
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <Button 
                    className="mt-4 healthcare-gradient text-white"
                    onClick={() => handleQuickAction('Schedule Appointment')}
                  >
                    Schedule Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Prescriptions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span>Recent Prescriptions</span>
              </CardTitle>
              <CardDescription>Your current medications</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {recentPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">Dr. {prescription.doctor_name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(prescription.prescribed_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {prescription.medications.map((med, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{med.medicine_name}</span>
                            <span className="text-gray-500">{med.dosage} - {med.frequency}</span>
                          </div>
                        ))}
                      </div>
                      {prescription.notes && (
                        <p className="text-xs text-gray-600 mt-2 italic">{prescription.notes}</p>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleQuickAction('View All Prescriptions')}
                  >
                    View All Prescriptions
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent prescriptions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Health Alerts</span>
              </CardTitle>
              <CardDescription>Important health reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <Heart className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Annual Checkup Due</p>
                    <p className="text-xs text-yellow-600">Schedule your yearly health assessment</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Medication Reminder</p>
                    <p className="text-xs text-blue-600">Take your evening medication</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Book Appointment')}
                >
                  <Calendar className="w-6 h-6 text-teal-600" />
                  <span className="text-xs">Book Appointment</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('View Lab Results')}
                >
                  <TestTube className="w-6 h-6 text-purple-600" />
                  <span className="text-xs">Lab Results</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Pay Bills')}
                >
                  <CreditCard className="w-6 h-6 text-orange-600" />
                  <span className="text-xs">Pay Bills</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Contact Doctor')}
                >
                  <Heart className="w-6 h-6 text-red-600" />
                  <span className="text-xs">Contact Doctor</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default PatientDashboard;