import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, FileText, Clock, TrendingUp, Activity, Heart, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function DoctorDashboard() {
  const { appointments, prescriptions, labReports } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Filter data for current doctor
  const doctorAppointments = appointments.filter(apt => apt.doctor_id === user?.id);
  const doctorPrescriptions = prescriptions.filter(presc => presc.doctor_id === user?.id);
  const doctorLabReports = labReports.filter(report => report.doctor_id === user?.id);

  const todayAppointments = doctorAppointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.appointment_date);
    return aptDate.toDateString() === today.toDateString();
  });

  const pendingAppointments = doctorAppointments.filter(apt => apt.appointment_status === 'Pending');
  const recentPrescriptions = doctorPrescriptions.slice(0, 5);

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-blue-500',
      description: 'Scheduled for today'
    },
    {
      title: 'Pending Approvals',
      value: pendingAppointments.length,
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Awaiting confirmation'
    },
    {
      title: 'Prescriptions Issued',
      value: doctorPrescriptions.length,
      icon: FileText,
      color: 'bg-green-500',
      description: 'Total prescribed'
    },
    {
      title: 'Lab Reports',
      value: doctorLabReports.length,
      icon: Activity,
      color: 'bg-purple-500',
      description: 'Reports reviewed'
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
            <h1 className="text-3xl font-bold mb-2">Good morning, Dr. {user?.full_name?.split(' ').pop()}!</h1>
            <p className="text-teal-100 text-lg">
              You have {todayAppointments.length} appointments scheduled for today.
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Doctor dashboard medical illustration" className="w-32 h-32 rounded-xl" src="https://images.unsplash.com/photo-1666886573301-b5d526cfd518" />
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
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Today's Schedule</span>
              </CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.slice(0, 4).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient_name}</p>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(appointment.appointment_date), 'h:mm a')}
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
                    onClick={() => handleQuickAction('View Full Schedule')}
                  >
                    View Full Schedule
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
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
              <CardDescription>Recently issued prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {recentPrescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{prescription.patient_name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(prescription.prescribed_date), 'MMM dd')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {prescription.medications.slice(0, 2).map((med, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {med.medicine_name} - {med.dosage}
                          </div>
                        ))}
                        {prescription.medications.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{prescription.medications.length - 2} more medications
                          </p>
                        )}
                      </div>
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
        {/* Patient Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Patient Alerts</span>
              </CardTitle>
              <CardDescription>Important patient notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <Heart className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Critical Lab Results</p>
                    <p className="text-xs text-red-600">John Smith - Requires immediate attention</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Follow-up Required</p>
                    <p className="text-xs text-yellow-600">3 patients need follow-up appointments</p>
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
              <CardDescription>Common medical tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('New Prescription')}
                >
                  <FileText className="w-6 h-6 text-green-600" />
                  <span className="text-xs">New Prescription</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Review Lab Results')}
                >
                  <Activity className="w-6 h-6 text-purple-600" />
                  <span className="text-xs">Lab Results</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Patient Notes')}
                >
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Patient Notes</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Schedule Appointment')}
                >
                  <Calendar className="w-6 h-6 text-teal-600" />
                  <span className="text-xs">Schedule</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default DoctorDashboard;