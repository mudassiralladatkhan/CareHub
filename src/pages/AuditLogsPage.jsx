import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Filter, Calendar, User, Activity, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function AuditLogsPage() {
  const { auditLogs } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action_performed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.performer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action_performed.includes(actionFilter);
    const matchesResource = resourceFilter === 'all' || log.resource === resourceFilter;
    
    return matchesSearch && matchesAction && matchesResource;
  });

  const getActionIcon = (action) => {
    if (action.includes('Login') || action.includes('Logout')) return User;
    if (action.includes('Created') || action.includes('Added')) return FileText;
    if (action.includes('Updated') || action.includes('Modified')) return Activity;
    if (action.includes('Deleted') || action.includes('Removed')) return Shield;
    return Activity;
  };

  const getActionColor = (action) => {
    if (action.includes('Login') || action.includes('Logout')) return 'bg-blue-100 text-blue-600';
    if (action.includes('Created') || action.includes('Added')) return 'bg-green-100 text-green-600';
    if (action.includes('Updated') || action.includes('Modified')) return 'bg-yellow-100 text-yellow-600';
    if (action.includes('Deleted') || action.includes('Removed')) return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  const actionTypes = ['Login', 'Created', 'Updated', 'Deleted'];
  const resourceTypes = ['Authentication', 'Appointments', 'Prescriptions', 'Billing', 'LabReports', 'Staff'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-2">System activity and security audit trail</p>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => toast({
            title: "🚧 Feature Coming Soon!",
            description: "Audit log export will be available in the next update! 🚀"
          })}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {actionTypes.map(action => (
              <SelectItem key={action} value={action}>{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={resourceFilter} onValueChange={setResourceFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by resource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            {resourceTypes.map(resource => (
              <SelectItem key={resource} value={resource}>{resource}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="healthcare-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="healthcare-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Activity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditLogs.filter(log => {
                    const today = new Date();
                    const logDate = new Date(log.timestamp);
                    return logDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="healthcare-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(auditLogs.map(log => log.performed_by)).size}
                </p>
              </div>
              <User className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="healthcare-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resources</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(auditLogs.map(log => log.resource)).size}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Audit Logs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => {
            const Icon = getActionIcon(log.action_performed);
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="healthcare-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log.action_performed)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{log.action_performed}</h3>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {log.resource}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            Performed by: <span className="font-medium">{log.performer_name}</span>
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(log.timestamp), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Activity className="w-3 h-3" />
                              <span>{format(new Date(log.timestamp), 'h:mm:ss a')}</span>
                            </div>
                            {log.resource_id && (
                              <div>
                                Resource ID: {log.resource_id}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast({
                          title: "🚧 Feature Coming Soon!",
                          description: "Detailed log view will be available in the next update! 🚀"
                        })}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card className="healthcare-card">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
              <p className="text-gray-600">
                {searchTerm || actionFilter !== 'all' || resourceFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No audit logs are available.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="healthcare-card border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Security & Compliance</h3>
                <p className="text-sm text-blue-800">
                  All system activities are automatically logged for security and compliance purposes. 
                  Audit logs are retained for regulatory compliance and cannot be modified or deleted by users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AuditLogsPage;