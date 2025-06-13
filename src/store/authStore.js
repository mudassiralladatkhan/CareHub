import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      
      login: async (email, password) => {
        try {
          // Mock authentication - replace with actual API call
          const mockUsers = [
            { id: '1', email: 'superadmin@carehub.com', password: 'admin123', full_name: 'Super Administrator', role_id: '1', role_name: 'SuperAdmin' },
            { id: '2', email: 'admin@carehub.com', password: 'admin123', full_name: 'System Administrator', role_id: '2', role_name: 'Admin' },
            { id: '3', email: 'doctor@carehub.com', password: 'doctor123', full_name: 'Dr. Sarah Johnson', role_id: '3', role_name: 'Doctor' },
            { id: '4', email: 'nurse@carehub.com', password: 'nurse123', full_name: 'Emily Davis', role_id: '4', role_name: 'Nurse' },
            { id: '5', email: 'lab@carehub.com', password: 'lab123', full_name: 'Michael Chen', role_id: '5', role_name: 'Lab Technician' },
            { id: '6', email: 'pharmacy@carehub.com', password: 'pharmacy123', full_name: 'Lisa Rodriguez', role_id: '6', role_name: 'Pharmacist' },
            { id: '7', email: 'billing@carehub.com', password: 'billing123', full_name: 'James Wilson', role_id: '7', role_name: 'Billing Staff' },
            { id: '8', email: 'patient@carehub.com', password: 'patient123', full_name: 'John Smith', role_id: '8', role_name: 'Patient' }
          ];

          const user = mockUsers.find(u => u.email === email && u.password === password);
          
          if (!user) {
            throw new Error('Invalid credentials');
          }

          // Mock JWT token
          const token = `mock-jwt-token-${user.id}-${Date.now()}`;
          
          set({
            user: {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              role_id: user.role_id,
              role_name: user.role_name
            },
            isAuthenticated: true,
            token
          });

          return { success: true, user };
        } catch (error) {
          throw new Error(error.message || 'Login failed');
        }
      },

      register: async (userData) => {
        try {
          // Mock registration - replace with actual API call
          const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            full_name: userData.full_name,
            role_id: '8', // Default to Patient role
            role_name: 'Patient'
          };

          const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

          set({
            user: newUser,
            isAuthenticated: true,
            token
          });

          return { success: true, user: newUser };
        } catch (error) {
          throw new Error(error.message || 'Registration failed');
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null
        });
      },

      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData }
        }));
      }
    }),
    {
      name: 'carehub-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      })
    }
  )
);