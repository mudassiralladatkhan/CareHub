import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, Activity, Heart, Clock, AlertCircle, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function NurseDashboard() {
  const { appointments, prescriptions } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.appointment_date);
    return aptDate.toDateString() === today.toDateString();
  });

  const stats = [
    {
      title: 'Patients Today',
      value: todayAppointments.length,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Scheduled visits'
    },
    {
      title: 'Vital Signs Pending',
      value: '8',
      icon: Activity,
      color: 'bg-orange-500',
      description: 'Awaiting recording'
    },
    {
      title: 'Medications Due',
      value: '12',
      icon: Heart,
      color: 'bg-red-500',
      description: 'Next 2 hours'
    },
    {
      title: 'Tasks Completed',
      value: '24',
      icon: UserCheck,
      color: 'bg-green-500',
      description: 'Today'
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
            <h1 className="text-3xl font-bold mb-2">Good morning, Nurse {user?.full_name?.split(' ').pop()}!</h1>
            <p className="text-teal-100 text-lg">
              You have {todayAppointments.length} patients scheduled for today.
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Nurse dashboard patient care illustration" className="w-32 h-32 rounded-xl" src="https://images.unsplash.com/photo-1630531210962-69e7d5a95255" />
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
        {/* Patient Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Today's Patient Schedule</span>
              </CardTitle>
              <CardDescription>Patients requiring nursing care</CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.slice(0, 4).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient_name}</p>
                        <p className="text-sm text-gray-600">Dr. {appointment.doctor_name}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(appointment.appointment_date), 'h:mm a')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickAction('Record Vitals')}
                        >
                          Record Vitals
                        </Button>
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
                  <p className="text-gray-500">No patients scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Medication Schedule */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span>Medication Schedule</span>
              </CardTitle>
              <CardDescription>Upcoming medication administration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-800">John Smith - Room 204</p>
                      <p className="text-sm text-red-600">Insulin injection</p>
                      <p className="text-xs text-red-500">Due: 2:00 PM</p>
                    </div>
                    <Button size="sm" className="bg-red-600 text-white">
                      Administer
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-yellow-800">Mary Johnson - Room 301</p>
                      <p className="text-sm text-yellow-600">Pain medication</p>
                      <p className="text-xs text-yellow-500">Due: 3:30 PM</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-800">Robert Davis - Room 105</p>
                      <p className="text-sm text-blue-600">Antibiotics</p>
                      <p className="text-xs text-blue-500">Due: 4:00 PM</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Prepare
                    </Button>
                  </div>
                </div>
              </div>
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
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Patient Alerts</span>
              </CardTitle>
              <CardDescription>Critical patient notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <Activity className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">High Blood Pressure Alert</p>
                    <p className="text-xs text-red-600">Patient in Room 204 - BP: 180/110</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <Heart className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Medication Allergy</p>
                    <p className="text-xs text-yellow-600">Check patient allergies before administration</p>
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
              <CardTitle>Nursing Quick Actions</CardTitle>
              <CardDescription>Common nursing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Record Vitals')}
                >
                  <Activity className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Record Vitals</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Administer Medication')}
                >
                  <Heart className="w-6 h-6 text-red-600" />
                  <span className="text-xs">Medications</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Patient Notes')}
                >
                  <FileText className="w-6 h-6 text-green-600" />
                  <span className="text-xs">Patient Notes</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Emergency Alert')}
                >
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <span className="text-xs">Emergency</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default NurseDashboard;