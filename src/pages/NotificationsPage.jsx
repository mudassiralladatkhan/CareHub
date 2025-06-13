import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Filter, Calendar, FileText, TestTube, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function NotificationsPage() {
  const { notifications, markNotificationRead, addNotification } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter notifications based on user and filters
  const filteredNotifications = notifications.filter(notification => {
    const belongsToUser = notification.user_id === user?.id;
    const matchesType = typeFilter === 'all' || notification.notification_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.is_read) ||
      (statusFilter === 'unread' && !notification.is_read);
    
    return belongsToUser && matchesType && matchesStatus;
  });

  const handleMarkAsRead = (id) => {
    markNotificationRead(id);
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = filteredNotifications.filter(n => !n.is_read);
    unreadNotifications.forEach(notification => {
      markNotificationRead(notification.id);
    });
    toast({
      title: "All notifications marked as read",
      description: `${unreadNotifications.length} notifications marked as read.`,
    });
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'Appointment': Calendar,
      'Billing': CreditCard,
      'LabReport': TestTube,
      'Prescription': FileText,
      'AI Alert': AlertCircle,
      'System': Bell
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      'Appointment': 'bg-blue-100 text-blue-600',
      'Billing': 'bg-green-100 text-green-600',
      'LabReport': 'bg-purple-100 text-purple-600',
      'Prescription': 'bg-orange-100 text-orange-600',
      'AI Alert': 'bg-red-100 text-red-600',
      'System': 'bg-gray-100 text-gray-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const notificationTypes = ['Appointment', 'Billing', 'LabReport', 'Prescription', 'AI Alert', 'System'];
  const unreadCount = filteredNotifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your healthcare notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllAsRead}
            variant="outline"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {notificationTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.notification_type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`healthcare-card hover-lift transition-all duration-200 ${
                  !notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.notification_type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.notification_type)}`}>
                              {notification.notification_type}
                            </span>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          
                          <p className={`text-gray-900 mb-2 ${!notification.is_read ? 'font-medium' : ''}`}>
                            {notification.notification_message}
                          </p>
                          
                          <p className="text-sm text-gray-500">
                            {format(new Date(notification.created_at), 'MMM dd, yyyy - h:mm a')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {!notification.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast({
                            title: "🚧 Feature Coming Soon!",
                            description: "Notification deletion will be available in the next update! 🚀"
                          })}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card className="healthcare-card">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {typeFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Try adjusting your filter criteria.'
                  : 'You\'re all caught up! No new notifications.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => toast({
                  title: "🚧 Feature Coming Soon!",
                  description: "Notification preferences will be available in the next update! 🚀"
                })}
              >
                <Bell className="w-6 h-6 text-blue-600" />
                <span className="text-xs">Notification Preferences</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => toast({
                  title: "🚧 Feature Coming Soon!",
                  description: "Email notifications will be available in the next update! 🚀"
                })}
              >
                <FileText className="w-6 h-6 text-green-600" />
                <span className="text-xs">Email Notifications</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default NotificationsPage;