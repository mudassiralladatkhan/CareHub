import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, Calendar, FileText, CreditCard, TestTube, Users, Bell, Settings, LogOut,
  Heart, Shield, Activity, Pill, UserCheck, ClipboardList, BarChart2, UserCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { useToast } from '@/components/ui/use-toast';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const { user, logout } = useAuthStore();
  const { notifications } = useDataStore();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotificationsCount = notifications.filter(n => n.user_id === user?.id && !n.is_read).length;
  const [animateBell, setAnimateBell] = useState(false);

  useEffect(() => {
    if (unreadNotificationsCount > 0) {
      setAnimateBell(true);
      setTimeout(() => setAnimateBell(false), 1000); // Shake for 1 second
    }
  }, [unreadNotificationsCount]);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully", description: "You have been securely logged out." });
    navigate('/login');
  };

  const getDashboardPath = () => {
    const routes = {
      'SuperAdmin': '/superadmin/dashboard', 'Admin': '/admin/dashboard',
      'Doctor': '/doctor/dashboard', 'Nurse': '/nurse/dashboard',
      'Lab Technician': '/lab/dashboard', 'Pharmacist': '/pharmacy/dashboard',
      'Billing Staff': '/billing/dashboard', 'Patient': '/patient/dashboard'
    };
    return routes[user?.role_name] || '/patient/dashboard';
  };

  const getMenuItems = () => {
    let items = [
      { icon: Home, label: 'Dashboard', path: getDashboardPath() },
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: FileText, label: 'Prescriptions', path: '/prescriptions' },
      { icon: TestTube, label: 'Lab Reports', path: '/lab-reports' },
      { icon: CreditCard, label: 'Billing', path: '/billing' },
      { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadNotificationsCount },
      { icon: ClipboardList, label: 'Patient Records', path: '/patient-records' },
      { icon: UserCircle, label: 'Profile', path: '/profile' }
    ];

    if (['Admin', 'SuperAdmin', 'Doctor'].includes(user?.role_name)) {
       items.splice(1, 0, { icon: BarChart2, label: 'Analytics', path: '/analytics' });
    }
    
    if (['Admin', 'SuperAdmin'].includes(user?.role_name)) {
      items = [
        ...items,
        { icon: Users, label: 'Staff Management', path: '/staff' },
        { icon: Shield, label: 'Audit Logs', path: '/audit-logs' },
      ];
    }
    return items;
  };

  const getRoleIcon = () => ({
    'SuperAdmin': Shield, 'Admin': Settings, 'Doctor': Heart, 'Nurse': UserCheck,
    'Lab Technician': TestTube, 'Pharmacist': Pill, 'Billing Staff': CreditCard, 'Patient': Activity
  })[user?.role_name] || Activity;

  const menuItems = getMenuItems();
  const RoleIcon = getRoleIcon();

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col fixed sm:relative h-full z-40"
          >
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <div className="w-10 h-10 healthcare-gradient rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CareHub360</h1>
                <p className="text-xs text-gray-500">Medical SaaS</p>
              </div>
            </div>
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <RoleIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.role_name}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      isActive ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500 font-semibold'
                               : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : ''}`} />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-gray-200">
              <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-sm">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen && window.innerWidth < 640 ? 'ml-64 sm:ml-0' : ''}`}>
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h2 className="text-md sm:text-lg font-semibold text-gray-900">{menuItems.find(item => item.path === location.pathname)?.label || `${user?.role_name} Dashboard`}</h2>
                <p className="text-xs sm:text-sm text-gray-500">Welcome back, {user?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/notifications">
                <motion.div animate={animateBell ? { rotate: [0, -15, 15, -15, 15, 0], transition: { duration: 0.5 } } : {}}>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 relative">
                    <Bell className="w-5 h-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 text-[8px] flex items-center justify-center bg-red-500 text-white rounded-full">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                  <UserCircle className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;