import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${result.user.full_name}`,
        });
        
        // Redirect based on role
        const roleRoutes = {
          'SuperAdmin': '/superadmin/dashboard',
          'Admin': '/admin/dashboard',
          'Doctor': '/doctor/dashboard',
          'Nurse': '/nurse/dashboard',
          'Lab Technician': '/lab/dashboard',
          'Pharmacist': '/pharmacy/dashboard',
          'Billing Staff': '/billing/dashboard',
          'Patient': '/patient/dashboard'
        };
        
        navigate(roleRoutes[result.user.role_name] || '/patient/dashboard');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'SuperAdmin', email: 'superadmin@carehub.com', password: 'admin123' },
    { role: 'Admin', email: 'admin@carehub.com', password: 'admin123' },
    { role: 'Doctor', email: 'doctor@carehub.com', password: 'doctor123' },
    { role: 'Nurse', email: 'nurse@carehub.com', password: 'nurse123' },
    { role: 'Lab Tech', email: 'lab@carehub.com', password: 'lab123' },
    { role: 'Pharmacist', email: 'pharmacy@carehub.com', password: 'pharmacy123' },
    { role: 'Billing', email: 'billing@carehub.com', password: 'billing123' },
    { role: 'Patient', email: 'patient@carehub.com', password: 'patient123' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-8 bg-white"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CareHub360</h1>
            <p className="text-gray-600">Enterprise Medical Management System</p>
          </div>

          <Card className="healthcare-card medical-shadow">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full healthcare-gradient text-white hover:opacity-90 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner mr-2" />
                  ) : null}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                    Register here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {demoCredentials.map((cred, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                    className="p-2 bg-white rounded border hover:bg-teal-50 hover:border-teal-200 transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium text-gray-700">{cred.role}</div>
                    <div className="text-gray-500 truncate">{cred.email}</div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Right Side - Hero Section */}
      <motion.div 
        className="flex-1 healthcare-gradient flex items-center justify-center p-8 text-white"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-lg text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <img  alt="Healthcare professionals collaborating" className="w-64 h-64 mx-auto rounded-2xl shadow-2xl" src="https://images.unsplash.com/photo-1579684288452-b334934f845f" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Advanced Healthcare Management
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 text-teal-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Streamline your medical practice with our comprehensive SaaS platform
          </motion.p>

          <motion.div 
            className="grid grid-cols-1 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-teal-200" />
              <div className="text-left">
                <h3 className="font-semibold">Secure & Compliant</h3>
                <p className="text-teal-100 text-sm">HIPAA compliant with enterprise-grade security</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-teal-200" />
              <div className="text-left">
                <h3 className="font-semibold">Multi-Role Access</h3>
                <p className="text-teal-100 text-sm">Role-based dashboards for all healthcare professionals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Heart className="w-8 h-8 text-teal-200" />
              <div className="text-left">
                <h3 className="font-semibold">Patient-Centered</h3>
                <p className="text-teal-100 text-sm">Comprehensive patient management and care coordination</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;