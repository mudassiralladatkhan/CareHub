import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Search, Filter, DollarSign, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const BillingForm = ({ initialData, onSubmit, onCancel, isSubmitting, editingBill }) => {
  const [formData, setFormData] = useState(initialData);

  const getTotalAmount = (items) => items.reduce((sum, item) => sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1), 0);

  const addServiceItem = () => setFormData(prev => ({ ...prev, service_items: [...prev.service_items, { service_name: '', price: '', quantity: 1 }] }));
  const removeServiceItem = (index) => setFormData(prev => ({ ...prev, service_items: prev.service_items.filter((_, i) => i !== index) }));
  const updateServiceItem = (index, field, value) => setFormData(prev => ({ ...prev, service_items: prev.service_items.map((item, i) => i === index ? { ...item, [field]: value } : item) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="patient_name">Patient Name</Label>
        <Input id="patient_name" value={formData.patient_name} onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))} placeholder="Patient name" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Service Items</Label>
          <Button type="button" onClick={addServiceItem} size="sm" variant="outline" className="text-xs px-2 py-1 h-7"><Plus className="w-3 h-3 mr-1" /> Add</Button>
        </div>
        <div className="max-h-48 sm:max-h-60 overflow-y-auto space-y-2 pr-1">
          {formData.service_items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 p-2 border rounded-lg items-end">
              <div className="space-y-0.5"><Label className="text-xs">Service</Label><Input value={item.service_name} onChange={(e) => updateServiceItem(index, 'service_name', e.target.value)} placeholder="Name" required className="h-8 text-sm" /></div>
              <div className="space-y-0.5 w-20 sm:w-24"><Label className="text-xs">Price ($)</Label><Input type="number" step="0.01" value={item.price} onChange={(e) => updateServiceItem(index, 'price', e.target.value)} placeholder="0.00" required className="h-8 text-sm" /></div>
              <div className="space-y-0.5 w-16 sm:w-20"><Label className="text-xs">Qty</Label><Input type="number" step="1" min="1" value={item.quantity} onChange={(e) => updateServiceItem(index, 'quantity', e.target.value)} placeholder="1" required className="h-8 text-sm" /></div>
              {formData.service_items.length > 1 && <Button type="button" onClick={() => removeServiceItem(index)} size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 h-8 w-8 sm:self-end"><Trash2 className="w-3.5 h-3.5" /></Button>}
            </div>
          ))}
        </div>
        <div className="p-2 bg-gray-50 rounded-lg mt-1"><div className="flex justify-between items-center"><span className="font-medium text-sm">Total:</span><span className="text-base sm:text-lg font-bold text-green-600">${getTotalAmount(formData.service_items).toFixed(2)}</span></div></div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="payment_status">Payment Status</Label>
        <Select value={formData.payment_status} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Partially Paid">Partially Paid</SelectItem></SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="flex-1 healthcare-gradient text-white" disabled={isSubmitting}>
          {isSubmitting && <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
          {isSubmitting ? 'Saving...' : (editingBill ? 'Update Bill' : 'Create Bill')}
        </Button>
      </DialogFooter>
    </form>
  );
};


function BillingPage() {
  const { billing, addBilling, updateBilling } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  const initialFormState = { patient_name: '', service_items: [{ service_name: '', price: '', quantity: 1 }], payment_status: 'Pending' };

  const filteredBilling = billing.filter(bill => {
    const matchesSearch = bill.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || bill.service_items.some(item => item.service_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || bill.payment_status === statusFilter;
    if (user?.role_name === 'Patient') return bill.patient_id === user.id && matchesSearch && matchesStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);
    const total_amount = formData.service_items.reduce((sum, item) => sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1), 0);
    const billingData = { ...formData, billing_date: new Date().toISOString(), patient_id: user?.role_name === 'Patient' ? user.id : '8', total_amount, service_items: formData.service_items.map(item => ({ ...item, price: parseFloat(item.price), quantity: parseInt(item.quantity) })) };

    try {
      if (editingBill) {
        updateBilling(editingBill.id, billingData);
        toast({ title: "Bill Updated", action: <CheckCircle className="text-green-500" /> });
      } else {
        addBilling(billingData);
        toast({ title: "Bill Created", action: <CheckCircle className="text-green-500" /> });
      }
      setIsDialogOpen(false);
      setEditingBill(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save bill.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, editingBill, addBilling, updateBilling, toast]);

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status) => ({ 'Paid': 'bg-green-100 text-green-800', 'Pending': 'bg-yellow-100 text-yellow-800', 'Partially Paid': 'bg-blue-100 text-blue-800' }[status] || 'bg-gray-100 text-gray-800');

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage patient billing and payments</p>
        </div>
        {(user?.role_name === 'Billing Staff' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingBill(null); }}>
            <DialogTrigger asChild>
              <Button className="healthcare-gradient text-white w-full sm:w-auto text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Create Bill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBill ? 'Edit Bill' : 'Create New Bill'}</DialogTitle>
                <DialogDescription>{editingBill ? 'Update billing details' : 'Fill in billing details'}</DialogDescription>
              </DialogHeader>
              <BillingForm initialData={editingBill || initialFormState} onSubmit={handleFormSubmit} onCancel={() => { setIsDialogOpen(false); setEditingBill(null); }} isSubmitting={isSubmitting} editingBill={!!editingBill} />
            </DialogContent>
          </Dialog>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <Input placeholder="Search bills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 text-xs sm:text-sm h-9 sm:h-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm h-9 sm:h-10"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Partially Paid">Partially Paid</SelectItem></SelectContent>
        </Select>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid gap-3 sm:gap-4">
        {filteredBilling.length > 0 ? (
          filteredBilling.map((bill, index) => (
            <motion.div key={bill.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="healthcare-card hover-lift">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shrink-0"><CreditCard className="w-5 h-5 text-white" /></div>
                        <div><h3 className="text-base sm:text-lg font-semibold text-gray-900">{bill.patient_name}</h3><p className="text-xs sm:text-sm text-gray-600">Bill Date: {format(new Date(bill.billing_date), 'MMM dd, yyyy')}</p></div>
                      </div>
                      <div className="space-y-2 mb-3">
                        <h4 className="font-medium text-gray-800 text-xs sm:text-sm">Services:</h4>
                        {bill.service_items.map((service, i) => <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-xs sm:text-sm"><span className="text-gray-700">{service.service_name} (x{service.quantity})</span><span className="font-medium text-gray-800">${(service.price * service.quantity).toFixed(2)}</span></div>)}
                      </div>
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg mb-3">
                        <span className="font-medium text-green-800 text-xs sm:text-sm">Total Amount:</span>
                        <span className="text-base sm:text-xl font-bold text-green-600">${bill.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-2"><span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(bill.payment_status)}`}>{bill.payment_status}</span></div>
                    </div>
                    {(user?.role_name === 'Billing Staff' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && (
                      <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 mt-3 sm:mt-0 sm:ml-4 w-full sm:w-auto">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(bill)} className="flex-1 sm:flex-none text-xs px-2 py-1 sm:text-sm">Edit</Button>
                        <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 flex-1 sm:flex-none text-xs px-2 py-1 sm:text-sm" onClick={() => toast({ title: "🚧 Feature Coming Soon!", description: "Payment processing soon! 🚀" })}>Process Payment</Button>
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs px-2 py-1 sm:text-sm" onClick={() => toast({ title: "🚧 Feature Coming Soon!", description: "Invoice download soon! 🚀" })}>Download Invoice</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="healthcare-card"><CardContent className="p-8 sm:p-12 text-center"><CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" /><h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No bills found</h3><p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{searchTerm || statusFilter !== 'all' ? 'Try adjusting search/filter.' : 'No bills created yet.'}</p>{!searchTerm && statusFilter === 'all' && (user?.role_name === 'Billing Staff' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && <Button className="healthcare-gradient text-white text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4" onClick={() => setIsDialogOpen(true)}><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Create Bill</Button>}</CardContent></Card>
        )}
      </motion.div>
    </div>
  );
}

export default BillingPage;