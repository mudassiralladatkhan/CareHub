import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, FileText, CreditCard, TrendingUp, Activity, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { useToast } from '@/components/ui/use-toast';

function AdminDashboard() {
  const { appointments, prescriptions, billing, staff, auditLogs } = useDataStore();
  const { toast } = useToast();

  const totalRevenue = billing.reduce((sum, bill) => sum + bill.total_amount, 0);
  const pendingAppointments = appointments.filter(apt => apt.appointment_status === 'Pending').length;
  const activeStaff = staff.length;
  const recentAudits = auditLogs.slice(0, 5);

  const stats = [
    {
      title: 'Total Staff',
      value: activeStaff,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Active employees'
    },
    {
      title: 'Pending Appointments',
      value: pendingAppointments,
      icon: Calendar,
      color: 'bg-orange-500',
      description: 'Awaiting approval'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-green-500',
      description: 'This month'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: Activity,
      color: 'bg-purple-500',
      description: 'Uptime'
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
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-teal-100 text-lg">
              System overview and management controls
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Admin dashboard system overview" className="w-32 h-32 rounded-xl" src="https://images.unsplash.com/photo-1680489880375-243dc8c15eeb" />
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
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <span>Recent System Activity</span>
              </CardTitle>
              <CardDescription>Latest audit log entries</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAudits.length > 0 ? (
                <div className="space-y-4">
                  {recentAudits.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.action_performed}</p>
                        <p className="text-xs text-gray-600">by {log.performer_name}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleQuickAction('View Full Audit Log')}
                  >
                    View Full Audit Log
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Staff Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Staff Overview</span>
              </CardTitle>
              <CardDescription>Current staff members</CardDescription>
            </CardHeader>
            <CardContent>
              {staff.length > 0 ? (
                <div className="space-y-4">
                  {staff.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.full_name}</p>
                        <p className="text-xs text-gray-600">{member.role_name} - {member.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{member.designation}</p>
                        <p className="text-xs text-gray-400">{member.shift_timing}</p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleQuickAction('Manage All Staff')}
                  >
                    Manage All Staff
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No staff members found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>System Alerts</span>
              </CardTitle>
              <CardDescription>Important system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">System Backup Complete</p>
                    <p className="text-xs text-green-600">Daily backup completed successfully</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Performance Optimal</p>
                    <p className="text-xs text-blue-600">All systems running smoothly</p>
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
              <CardTitle>Admin Quick Actions</CardTitle>
              <CardDescription>Administrative management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Add New Staff')}
                >
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Add Staff</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('System Settings')}
                >
                  <Shield className="w-6 h-6 text-purple-600" />
                  <span className="text-xs">Settings</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Generate Reports')}
                >
                  <FileText className="w-6 h-6 text-green-600" />
                  <span className="text-xs">Reports</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Backup System')}
                >
                  <Activity className="w-6 h-6 text-orange-600" />
                  <span className="text-xs">Backup</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;