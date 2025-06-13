import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Clock, CheckCircle, TrendingUp, AlertCircle, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function BillingDashboard() {
  const { billing } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const totalRevenue = billing.reduce((sum, bill) => sum + bill.total_amount, 0);
  const pendingBills = billing.filter(bill => bill.payment_status === 'Pending');
  const paidBills = billing.filter(bill => bill.payment_status === 'Paid');
  const partiallyPaidBills = billing.filter(bill => bill.payment_status === 'Partially Paid');

  const todayBills = billing.filter(bill => {
    const today = new Date();
    const billDate = new Date(bill.billing_date);
    return billDate.toDateString() === today.toDateString();
  });

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      description: 'All time'
    },
    {
      title: 'Pending Payments',
      value: pendingBills.length,
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Awaiting payment'
    },
    {
      title: 'Paid Today',
      value: paidBills.filter(bill => {
        const today = new Date();
        const billDate = new Date(bill.billing_date);
        return billDate.toDateString() === today.toDateString();
      }).length,
      icon: CheckCircle,
      color: 'bg-blue-500',
      description: 'Completed today'
    },
    {
      title: 'Outstanding Amount',
      value: `$${pendingBills.reduce((sum, bill) => sum + bill.total_amount, 0).toLocaleString()}`,
      icon: AlertCircle,
      color: 'bg-red-500',
      description: 'Unpaid bills'
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
            <h1 className="text-3xl font-bold mb-2">Billing Dashboard</h1>
            <p className="text-teal-100 text-lg">
              Welcome back, {user?.full_name}! You have {pendingBills.length} pending payments to process.
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Billing dashboard financial management" className="w-32 h-32 rounded-xl" src="https://images.unsplash.com/photo-1576091160550-2173dba999ef" />
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
        {/* Pending Payments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Pending Payments</span>
              </CardTitle>
              <CardDescription>Bills awaiting payment</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingBills.length > 0 ? (
                <div className="space-y-4">
                  {pendingBills.slice(0, 3).map((bill) => (
                    <div key={bill.id} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-orange-800">{bill.patient_name}</p>
                          <p className="text-sm text-orange-600">
                            Bill Date: {format(new Date(bill.billing_date), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-orange-500">
                            Amount: ${bill.total_amount.toFixed(2)}
                          </p>
                        </div>
                        <Button size="sm" className="bg-orange-600 text-white">
                          Process
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {bill.service_items.slice(0, 2).map((service, index) => (
                          <div key={index} className="text-sm text-orange-700">
                            {service.service_name} - ${service.price.toFixed(2)}
                          </div>
                        ))}
                        {bill.service_items.length > 2 && (
                          <p className="text-xs text-orange-600">
                            +{bill.service_items.length - 2} more services
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleQuickAction('View All Pending Bills')}
                  >
                    View All Pending Bills
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending payments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Recent Transactions</span>
              </CardTitle>
              <CardDescription>Recently processed payments</CardDescription>
            </CardHeader>
            <CardContent>
              {paidBills.length > 0 ? (
                <div className="space-y-4">
                  {paidBills.slice(0, 3).map((bill) => (
                    <div key={bill.id} className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-green-800">{bill.patient_name}</p>
                          <p className="text-sm text-green-600">
                            {format(new Date(bill.billing_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-800">${bill.total_amount.toFixed(2)}</p>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Paid
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleQuickAction('View All Transactions')}
                  >
                    View All Transactions
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent transactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Payment Alerts</span>
              </CardTitle>
              <CardDescription>Important billing notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <CreditCard className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Overdue Payment</p>
                    <p className="text-xs text-red-600">3 bills are 30+ days overdue</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Payment Reminder</p>
                    <p className="text-xs text-yellow-600">5 bills due within 7 days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Revenue Increase</p>
                    <p className="text-xs text-blue-600">15% increase from last month</p>
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
              <CardTitle>Billing Quick Actions</CardTitle>
              <CardDescription>Common billing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Create Invoice')}
                >
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Create Invoice</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Process Payment')}
                >
                  <CreditCard className="w-6 h-6 text-green-600" />
                  <span className="text-xs">Process Payment</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Generate Report')}
                >
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <span className="text-xs">Reports</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleQuickAction('Send Reminder')}
                >
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <span className="text-xs">Send Reminder</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default BillingDashboard;