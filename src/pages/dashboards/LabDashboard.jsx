import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, Clock, CheckCircle, AlertTriangle, FileText, Activity, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function LabDashboard() {
  const { labReports } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const pendingReports = labReports.filter(report => !report.report_result);
  const completedReports = labReports.filter(report => report.report_result);
  const todayReports = labReports.filter(report => {
    const today = new Date();
    const reportDate = new Date(report.report_date);
    return reportDate.toDateString() === today.toDateString();
  });

  const stats = [
    {
      title: 'Pending Tests',
      value: pendingReports.length,
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Awaiting processing'
    },
    {
      title: 'Completed Today',
      value: todayReports.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Tests completed'
    },
    {
      title: 'Total Reports',
      value: labReports.length,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'All time'
    },
    {
      title: 'Critical Results',
      value: '2',
      icon: AlertTriangle,
      color: 'bg-red-500',
      description: 'Require attention'
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
            <h1 className="text-3xl font-bold mb-2">Lab Technician Dashboard</h1>
            <p className="text-teal-100 text-lg">
              Welcome back, {user?.full_name}! You have {pendingReports.length} tests pending.
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Laboratory technician dashboard" className="w-32 h-32 rounded-xl" src="https://images.unsplash.com/photo-1578496479914-7ef3b0193be3" />
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
        {/* Pending Tests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Pending Tests</span>
              </CardTitle>
              <CardDescription>Tests awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-orange-800">Blood Chemistry Panel</p>
                      <p className="text-sm text-orange-600">Patient: John Smith</p>
                      <p className="text-xs text-orange-500">Ordered: 2 hours ago</p>
                    </div>
                    <Button size="sm" className="bg-orange-600 text-white">
                      Process
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-yellow-800">Urine Analysis</p>
                      <p className="text-sm text-yellow-600">Patient: Mary Johnson</p>
                      <p className="text-xs text-yellow-500">Ordered: 4 hours ago</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Start Test
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-800">Lipid Profile</p>
                      <p className="text-sm text-blue-600">Patient: Robert Davis</p>
                      <p className="text-xs text-blue-500">Ordered: 6 hours ago</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Queue
                    </Button>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleQuickAction('View All Pending Tests')}
                >
                  View All Pending Tests
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Recent Results</span>
              </CardTitle>
              <CardDescription>Recently completed lab tests</CardDescription>
            </CardHeader>
            <CardContent>
              {completedReports.length > 0 ? (
                <div className="space-y-4">
                  {completedReports.slice(0, 3).map((report) => (
                    <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{report.patient_name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(report.report_date), 'MMM dd, h:mm a')}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.report_type}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Completed
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickAction('View Report')}
                        >
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleQuickAction('View All Results')}
                  >
                    View All Results
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TestTube className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent results</p>
                </div>
              )}
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
                <span>Critical Results</span>
              </CardTitle>
              <CardDescription>Results requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <Activity className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Abnormal Glucose Level</p>
                    <p className="text-xs text-red-600">Patient: John Smith - 450 mg/dL</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <TestTube className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">High Cholesterol</p>
                    <p className="text-xs text-orange-600">Patient: Mary Johnson - 280 mg/dL</p>
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
              <CardTitle>Lab Quick Actions</CardTitle>
              <CardDescription>Common laboratory tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('New Test')}
                >
                  <TestTube className="w-6 h-6 text-purple-600" />
                  <span className="text-xs">New Test</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Quality Control')}
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-xs">Quality Control</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Equipment Check')}
                >
                  <Activity className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Equipment</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Generate Report')}
                >
                  <FileText className="w-6 h-6 text-orange-600" />
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

export default LabDashboard;