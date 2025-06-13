import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Package, AlertTriangle, TrendingUp, Clock, CheckCircle, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function PharmacyDashboard() {
  const { prescriptions } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const pendingPrescriptions = prescriptions.filter(presc => !presc.dispensed);
  const todayPrescriptions = prescriptions.filter(presc => {
    const today = new Date();
    const prescDate = new Date(presc.prescribed_date);
    return prescDate.toDateString() === today.toDateString();
  });

  const stats = [
    {
      title: 'Pending Prescriptions',
      value: pendingPrescriptions.length,
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Awaiting dispensing'
    },
    {
      title: 'Dispensed Today',
      value: todayPrescriptions.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Completed today'
    },
    {
      title: 'Low Stock Items',
      value: '8',
      icon: AlertTriangle,
      color: 'bg-red-500',
      description: 'Need reordering'
    },
    {
      title: 'Total Inventory',
      value: '1,247',
      icon: Package,
      color: 'bg-blue-500',
      description: 'Items in stock'
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
            <h1 className="text-3xl font-bold mb-2">Pharmacy Dashboard</h1>
            <p className="text-teal-100 text-lg">
              Welcome back, {user?.full_name}! You have {pendingPrescriptions.length} prescriptions to process.
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Pharmacy dashboard medication management" className="w-32 h-32 rounded-xl" src="https://images.unsplash.com/photo-1559574326-b28980940fae" />
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
        {/* Pending Prescriptions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Pending Prescriptions</span>
              </CardTitle>
              <CardDescription>Prescriptions awaiting dispensing</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {pendingPrescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-orange-800">{prescription.patient_name}</p>
                          <p className="text-sm text-orange-600">Dr. {prescription.doctor_name}</p>
                          <p className="text-xs text-orange-500">
                            {format(new Date(prescription.prescribed_date), 'MMM dd, h:mm a')}
                          </p>
                        </div>
                        <Button size="sm" className="bg-orange-600 text-white">
                          Dispense
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {prescription.medications.slice(0, 2).map((med, index) => (
                          <div key={index} className="text-sm text-orange-700">
                            {med.medicine_name} - {med.dosage}
                          </div>
                        ))}
                        {prescription.medications.length > 2 && (
                          <p className="text-xs text-orange-600">
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
                  <Pill className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending prescriptions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Inventory Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Inventory Alerts</span>
              </CardTitle>
              <CardDescription>Low stock and expiring medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-800">Amoxicillin 500mg</p>
                      <p className="text-sm text-red-600">Stock: 12 units remaining</p>
                      <p className="text-xs text-red-500">Critical level reached</p>
                    </div>
                    <Button size="sm" className="bg-red-600 text-white">
                      Reorder
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-yellow-800">Ibuprofen 200mg</p>
                      <p className="text-sm text-yellow-600">Expires: June 30, 2024</p>
                      <p className="text-xs text-yellow-500">Expiring soon</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-orange-800">Metformin 850mg</p>
                      <p className="text-sm text-orange-600">Stock: 25 units remaining</p>
                      <p className="text-xs text-orange-500">Low stock warning</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Order
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Dispensing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Recent Dispensing</span>
              </CardTitle>
              <CardDescription>Recently dispensed medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">John Smith</p>
                    <p className="text-xs text-green-600">Amoxicillin 500mg - Dispensed</p>
                  </div>
                  <p className="text-xs text-green-500">2:30 PM</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">Mary Johnson</p>
                    <p className="text-xs text-green-600">Ibuprofen 200mg - Dispensed</p>
                  </div>
                  <p className="text-xs text-green-500">1:45 PM</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">Robert Davis</p>
                    <p className="text-xs text-green-600">Metformin 850mg - Dispensed</p>
                  </div>
                  <p className="text-xs text-green-500">12:15 PM</p>
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
              <CardTitle>Pharmacy Quick Actions</CardTitle>
              <CardDescription>Common pharmacy tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Dispense Medication')}
                >
                  <Pill className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Dispense</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Check Inventory')}
                >
                  <Package className="w-6 h-6 text-green-600" />
                  <span className="text-xs">Inventory</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Drug Interaction Check')}
                >
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <span className="text-xs">Interactions</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Generate Reports')}
                >
                  <FileText className="w-6 h-6 text-purple-600" />
                  <span className="text-xs">Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default PharmacyDashboard;