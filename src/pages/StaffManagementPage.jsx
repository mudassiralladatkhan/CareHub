import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Filter, Mail, Edit, Trash2, ShieldCheck, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const StaffForm = ({ initialData, onSubmit, onCancel, isSubmitting, editingStaff }) => {
  const [formData, setFormData] = useState(initialData);
  const roles = ['Doctor', 'Nurse', 'Lab Technician', 'Pharmacist', 'Billing Staff', 'Admin', 'SuperAdmin'];
  const departments = ['Internal Medicine', 'Emergency', 'Laboratory', 'Pharmacy', 'Billing', 'Administration', 'IT'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="full_name">Full Name</Label><Input id="full_name" value={formData.full_name} onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))} placeholder="Full name" required className="h-9"/></div>
        <div className="space-y-1"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="Email address" required className="h-9"/></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="role_name">Role</Label><Select value={formData.role_name} onValueChange={(value) => setFormData(prev => ({ ...prev, role_name: value }))} ><SelectTrigger className="h-9"><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent>{roles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select></div>
        <div className="space-y-1"><Label htmlFor="department">Department</Label><Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}><SelectTrigger className="h-9"><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{departments.map(dept => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent></Select></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="designation">Designation</Label><Input id="designation" value={formData.designation} onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))} placeholder="Designation" required className="h-9"/></div>
        <div className="space-y-1"><Label htmlFor="shift_timing">Shift Timing</Label><Input id="shift_timing" value={formData.shift_timing} onChange={(e) => setFormData(prev => ({ ...prev, shift_timing: e.target.value }))} placeholder="e.g., 9 AM - 5 PM" required className="h-9"/></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="salary">Salary ($)</Label><Input id="salary" type="number" value={formData.salary} onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))} placeholder="Annual salary" required className="h-9"/></div>
        <div className="space-y-1"><Label htmlFor="joining_date">Joining Date</Label><Input id="joining_date" type="date" value={formData.joining_date} onChange={(e) => setFormData(prev => ({ ...prev, joining_date: e.target.value }))} required className="h-9"/></div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="healthcare-gradient text-white" disabled={isSubmitting}>
          {isSubmitting && <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
          {isSubmitting ? 'Saving...' : (editingStaff ? 'Update Staff' : 'Add Staff')}
        </Button>
      </DialogFooter>
    </form>
  );
};

function StaffManagementPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const initialFormState = { full_name: '', email: '', role_name: '', department: '', designation: '', shift_timing: '', salary: '', joining_date: '' };
  const roles = ['Doctor', 'Nurse', 'Lab Technician', 'Pharmacist', 'Billing Staff', 'Admin', 'SuperAdmin'];
  const departments = ['Internal Medicine', 'Emergency', 'Laboratory', 'Pharmacy', 'Billing', 'Administration', 'IT'];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase()) || member.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role_name === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleFormSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);
    const staffData = { ...formData, user_id: editingStaff ? editingStaff.user_id : Date.now().toString(), salary: parseFloat(formData.salary) };
    try {
      if (editingStaff) {
        updateStaff(editingStaff.id, staffData);
        toast({ title: "Staff Updated", action: <CheckCircle className="text-green-500" /> });
      } else {
        addStaff(staffData);
        toast({ title: "Staff Added", action: <CheckCircle className="text-green-500" /> });
      }
      setIsDialogOpen(false); setEditingStaff(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save staff details.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [editingStaff, addStaff, updateStaff, toast]);

  const handleEdit = (staffMember) => { 
    setEditingStaff({
        ...staffMember,
        joining_date: format(new Date(staffMember.joining_date), 'yyyy-MM-dd')
    }); 
    setIsDialogOpen(true); 
  };

  const handleDeleteConfirm = () => {
    if (staffToDelete) {
      deleteStaff(staffToDelete.id);
      toast({ title: "Staff Removed", description: `${staffToDelete.full_name} removed.` });
      setStaffToDelete(null);
    }
  };

  const getRoleColor = (role) => ({'Doctor': 'bg-blue-100 text-blue-800','Nurse': 'bg-green-100 text-green-800','Lab Technician': 'bg-purple-100 text-purple-800','Pharmacist': 'bg-orange-100 text-orange-800','Billing Staff': 'bg-yellow-100 text-yellow-800','Admin': 'bg-red-100 text-red-800','SuperAdmin': 'bg-indigo-100 text-indigo-800'}[role] || 'bg-gray-100 text-gray-800');

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Staff Management</h1><p className="text-xs sm:text-sm text-gray-600 mt-1">Manage hospital staff</p></div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingStaff(null); }}>
          <DialogTrigger asChild><Button className="healthcare-gradient text-white w-full sm:w-auto text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4"><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Add Staff</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>{editingStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle><DialogDescription>{editingStaff ? 'Update details' : 'Fill in details'}</DialogDescription></DialogHeader><StaffForm initialData={editingStaff || initialFormState} onSubmit={handleFormSubmit} onCancel={() => { setIsDialogOpen(false); setEditingStaff(null); }} isSubmitting={isSubmitting} editingStaff={!!editingStaff} /></DialogContent>
        </Dialog>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1"><Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" /><Input placeholder="Search name, email, designation..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 text-xs sm:text-sm h-9 sm:h-10"/></div>
        <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm h-9 sm:h-10"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue placeholder="Filter by role" /></SelectTrigger><SelectContent><SelectItem value="all">All Roles</SelectItem>{roles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}><SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm h-9 sm:h-10"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue placeholder="Filter by department" /></SelectTrigger><SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map(dept => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent></Select>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid gap-3 sm:gap-4">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((staffMember, index) => (
            <motion.div key={staffMember.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="healthcare-card hover-lift"><CardContent className="p-3 sm:p-4 md:p-6"><div className="flex flex-col sm:flex-row items-start justify-between">
                <div className="flex-1 mb-3 sm:mb-0">
                  <div className="flex items-center space-x-3 mb-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-white" /></div><div><h3 className="text-base sm:text-lg font-semibold text-gray-900">{staffMember.full_name}</h3><p className="text-xs sm:text-sm text-gray-600">{staffMember.designation} • {staffMember.department}</p><span className={`px-1.5 py-0.5 mt-0.5 inline-block rounded-full text-[10px] sm:text-xs font-medium ${getRoleColor(staffMember.role_name)}`}>{staffMember.role_name}</span></div></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:text-sm">
                    <div className="flex items-center space-x-1.5"><Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="text-gray-600 truncate">{staffMember.email}</span></div>
                    <div className="flex items-center space-x-1.5"><span className="text-gray-600">Shift: {staffMember.shift_timing}</span></div>
                    <div className="flex items-center space-x-1.5"><span className="text-gray-600">Salary: ${staffMember.salary.toLocaleString()}</span></div>
                    <div className="flex items-center space-x-1.5"><span className="text-gray-500">Joined: {format(new Date(staffMember.joining_date), 'MMM dd, yyyy')}</span></div>
                  </div>
                </div>
                <div className="flex space-x-2 sm:ml-4 w-full sm:w-auto sm:flex-col sm:space-x-0 sm:space-y-2 mt-3 sm:mt-0">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(staffMember)} className="text-xs px-2 py-1 sm:text-sm flex-1 sm:flex-none"><Edit className="w-3 h-3 mr-1" />Edit</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1 sm:text-sm flex-1 sm:flex-none" onClick={() => setStaffToDelete(staffMember)}><Trash2 className="w-3 h-3 mr-1" />Remove</Button></AlertDialogTrigger>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently remove {staffToDelete?.full_name} from staff records.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel onClick={() => setStaffToDelete(null)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">Remove</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                  </AlertDialog>
                </div>
              </div></CardContent></Card>
            </motion.div>
          ))
        ) : (
          <Card className="healthcare-card"><CardContent className="p-8 sm:p-12 text-center"><Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" /><h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No staff found</h3><p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{searchTerm || roleFilter !== 'all' || departmentFilter !== 'all' ? 'Try adjusting search/filter.' : 'No staff added yet.'}</p>{(!searchTerm && roleFilter === 'all' && departmentFilter === 'all') && <Button className="healthcare-gradient text-white text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4" onClick={() => setIsDialogOpen(true)}><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />Add Staff</Button>}</CardContent></Card>
        )}
      </motion.div>
    </div>
  );
}

export default StaffManagementPage;