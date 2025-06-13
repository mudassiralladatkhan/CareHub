import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, TrendingUp, Database, Server, Lock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { useToast } from '@/components/ui/use-toast';

function SuperAdminDashboard() {
  const { appointments, staff, auditLogs } = useDataStore();
  const { toast } = useToast();

  const systemStats = [
    {
      title: 'System Uptime',
      value: '99.98%',
      icon: Server,
      color: 'bg-green-500',
      description: 'Last 30 days'
    },
    {
      title: 'Total Users',
      value: '1,247',
      icon: Users,
      color: 'bg-blue-500',
      description: 'Active accounts'
    },
    {
      title: 'Security Score',
      value: 'A+',
      icon: Shield,
      color: 'bg-purple-500',
      description: 'Excellent'
    },
    {
      title: 'Database Health',
      value: '100%',
      icon: Database,
      color: 'bg-teal-500',
      description: 'Optimal'
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
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Super Admin Control Center</h1>
            <p className="text-purple-100 text-lg">
              Complete system oversight and management
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Super admin system control center" className="w-32 h-32 rounded-xl" src="https://images.unsplash.com/photo-1688413399498-e35ed74b554f" />
          </div>
        </div>
      </motion.div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => {
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
        {/* System Security */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <span>Security Overview</span>
              </CardTitle>
              <CardDescription>System security status and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Firewall Status</p>
                      <p className="text-xs text-green-600">Active and monitoring</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">SSL Certificates</p>
                      <p className="text-xs text-green-600">Valid until Dec 2024</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Intrusion Detection</p>
                      <p className="text-xs text-blue-600">No threats detected</p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-medium">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription>Real-time system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Usage</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network I/O</span>
                    <span>12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Critical Alerts</span>
              </CardTitle>
              <CardDescription>System-wide alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">All Systems Operational</p>
                    <p className="text-xs text-green-600">No critical issues detected</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Scheduled Maintenance</p>
                    <p className="text-xs text-blue-600">Database optimization at 2:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Super Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle>Super Admin Controls</CardTitle>
              <CardDescription>System-level management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('System Backup')}
                >
                  <Database className="w-6 h-6 text-teal-600" />
                  <span className="text-xs">System Backup</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Security Audit')}
                >
                  <Shield className="w-6 h-6 text-purple-600" />
                  <span className="text-xs">Security Audit</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('User Management')}
                >
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">User Management</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('System Logs')}
                >
                  <Activity className="w-6 h-6 text-orange-600" />
                  <span className="text-xs">System Logs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;