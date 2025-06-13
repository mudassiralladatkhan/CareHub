import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store/authStore';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SuperAdminDashboard from '@/pages/dashboards/SuperAdminDashboard';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import DoctorDashboard from '@/pages/dashboards/DoctorDashboard';
import NurseDashboard from '@/pages/dashboards/NurseDashboard';
import LabDashboard from '@/pages/dashboards/LabDashboard';
import PharmacyDashboard from '@/pages/dashboards/PharmacyDashboard';
import BillingDashboard from '@/pages/dashboards/BillingDashboard';
import PatientDashboard from '@/pages/dashboards/PatientDashboard';
import AppointmentsPage from '@/pages/AppointmentsPage';
import PrescriptionsPage from '@/pages/PrescriptionsPage';
import BillingPage from '@/pages/BillingPage';
import LabReportsPage from '@/pages/LabReportsPage';
import StaffManagementPage from '@/pages/StaffManagementPage';
import NotificationsPage from '@/pages/NotificationsPage';
import AuditLogsPage from '@/pages/AuditLogsPage';
import PatientRecordsPage from '@/pages/PatientRecordsPage';
import ProfilePage from '@/pages/ProfilePage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role_name)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <PageTransition>{children}</PageTransition>;
  };

  const getDashboardRoute = (roleName) => {
    const routes = {
      'SuperAdmin': '/superadmin/dashboard',
      'Admin': '/admin/dashboard',
      'Doctor': '/doctor/dashboard',
      'Nurse': '/nurse/dashboard',
      'Lab Technician': '/lab/dashboard',
      'Pharmacist': '/pharmacy/dashboard',
      'Billing Staff': '/billing/dashboard',
      'Patient': '/patient/dashboard'
    };
    return routes[roleName] || '/patient/dashboard';
  };

  return (
    
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to={getDashboardRoute(user?.role_name)} replace /> : 
                <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
                <Navigate to={getDashboardRoute(user?.role_name)} replace /> : 
                <RegisterPage />
            } 
          />

          <Route path="/superadmin/dashboard" element={<ProtectedRoute allowedRoles={['SuperAdmin']}><DashboardLayout><SuperAdminDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['Doctor']}><DashboardLayout><DoctorDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/nurse/dashboard" element={<ProtectedRoute allowedRoles={['Nurse']}><DashboardLayout><NurseDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/lab/dashboard" element={<ProtectedRoute allowedRoles={['Lab Technician']}><DashboardLayout><LabDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/pharmacy/dashboard" element={<ProtectedRoute allowedRoles={['Pharmacist']}><DashboardLayout><PharmacyDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/billing/dashboard" element={<ProtectedRoute allowedRoles={['Billing Staff']}><DashboardLayout><BillingDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['Patient']}><DashboardLayout><PatientDashboard /></DashboardLayout></ProtectedRoute>} />
          
          <Route path="/appointments" element={<ProtectedRoute><DashboardLayout><AppointmentsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute><DashboardLayout><PrescriptionsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><DashboardLayout><BillingPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/lab-reports" element={<ProtectedRoute><DashboardLayout><LabReportsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}><DashboardLayout><StaffManagementPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}><DashboardLayout><AuditLogsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/patient-records" element={<ProtectedRoute><DashboardLayout><PatientRecordsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin', 'Doctor']}><DashboardLayout><AnalyticsPage /></DashboardLayout></ProtectedRoute>} />
          

          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to={getDashboardRoute(user?.role_name)} replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
              <div className="text-center p-8">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type: "spring", stiffness:200}}>
                  <ShieldCheck className="w-20 h-20 text-red-500 mx-auto mb-6"/>
                </motion.div>
                <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
                <Button 
                  onClick={() => navigate(isAuthenticated ? getDashboardRoute(user?.role_name) : '/login')}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          } />
           <Route path="*" element={<Navigate to={isAuthenticated ? getDashboardRoute(user?.role_name) : '/login'} replace />} />
        </Routes>
        </AnimatePresence>
        <Toaster />
      </div>
    
  );
}


const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;