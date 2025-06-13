import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Filter, Pill, Calendar, Trash2, RefreshCw, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { format, addDays, subDays } from 'date-fns';

const PrescriptionForm = ({ initialData, onSubmit, onCancel, isSubmitting, editingPrescription }) => {
  const [formData, setFormData] = useState(initialData);

  const addMedication = () => setFormData(prev => ({ ...prev, medications: [...prev.medications, { medicine_name: '', dosage: '', frequency: '' }] }));
  const removeMedication = (index) => setFormData(prev => ({ ...prev, medications: prev.medications.filter((_, i) => i !== index) }));
  const updateMedicationField = (index, field, value) => setFormData(prev => ({ ...prev, medications: prev.medications.map((med, i) => i === index ? { ...med, [field]: value } : med) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="patient_name">Patient Name</Label><Input id="patient_name" value={formData.patient_name} onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))} placeholder="Patient name" required className="h-9" /></div>
        <div className="space-y-1"><Label htmlFor="doctor_name">Doctor Name</Label><Input id="doctor_name" value={formData.doctor_name} onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))} placeholder="Doctor name" required className="h-9" /></div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Medications</Label>
          <Button type="button" onClick={addMedication} size="sm" variant="outline" className="text-xs px-2 py-1 h-7"><Plus className="w-3 h-3 mr-1" /> Add Med</Button>
        </div>
        <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-2 pr-1">
          {formData.medications.map((med, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 p-2 border rounded-lg items-end">
              <div className="space-y-0.5"><Label className="text-xs">Medicine</Label><Input value={med.medicine_name} onChange={(e) => updateMedicationField(index, 'medicine_name', e.target.value)} placeholder="Name" required className="h-8 text-sm" /></div>
              <div className="space-y-0.5 w-24 sm:w-28"><Label className="text-xs">Dosage</Label><Input value={med.dosage} onChange={(e) => updateMedicationField(index, 'dosage', e.target.value)} placeholder="e.g., 500mg" required className="h-8 text-sm" /></div>
              <div className="space-y-0.5 w-24 sm:w-28"><Label className="text-xs">Frequency</Label><Input value={med.frequency} onChange={(e) => updateMedicationField(index, 'frequency', e.target.value)} placeholder="e.g., Twice daily" required className="h-8 text-sm" /></div>
              {formData.medications.length > 1 && <Button type="button" onClick={() => removeMedication(index)} size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 h-8 w-8 sm:self-end"><Trash2 className="w-3.5 h-3.5" /></Button>}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1"><Label htmlFor="notes">Notes & Instructions</Label><Textarea id="notes" value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Additional instructions" rows={2} className="text-sm" /></div>
      <div className="flex items-center space-x-2"><input type="checkbox" id="followup_required" checked={formData.followup_required} onChange={(e) => setFormData(prev => ({ ...prev, followup_required: e.target.checked }))} className="rounded" /><Label htmlFor="followup_required" className="text-sm font-normal">Follow-up required</Label></div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="healthcare-gradient text-white" disabled={isSubmitting}>
          {isSubmitting && <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
          {isSubmitting ? 'Saving...' : (editingPrescription ? 'Update Prescription' : 'Create Prescription')}
        </Button>
      </DialogFooter>
    </form>
  );
};

function PrescriptionsPage() {
  const { prescriptions, addPrescription, updatePrescription } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [expandedPrescription, setExpandedPrescription] = useState(null);

  const initialFormState = { patient_name: '', doctor_name: '', medications: [{ medicine_name: '', dosage: '', frequency: '' }], notes: '', followup_required: false };

  const filteredPrescriptions = prescriptions.filter(presc => {
    const matchesSearch = presc.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || presc.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) || presc.medications.some(med => med.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()));
    let matchesDate = true;
    if (dateFilter !== 'all') { const today = new Date(); const prescDate = new Date(presc.prescribed_date); if (dateFilter === 'today') matchesDate = format(prescDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'); if (dateFilter === 'last7days') matchesDate = prescDate >= subDays(today, 7); if (dateFilter === 'last30days') matchesDate = prescDate >= subDays(today, 30); }
    if (user?.role_name === 'Patient') return presc.patient_id === user.id && matchesSearch && matchesDate;
    if (user?.role_name === 'Doctor') return presc.doctor_id === user.id && matchesSearch && matchesDate;
    return matchesSearch && matchesDate;
  });

  const handleFormSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);
    const prescriptionData = { ...formData, prescribed_date: new Date().toISOString(), patient_id: user?.role_name === 'Patient' ? user.id : '8', doctor_id: user?.role_name === 'Doctor' ? user.id : '3' };
    try {
      if (editingPrescription) {
        updatePrescription(editingPrescription.id, prescriptionData);
        toast({ title: "Prescription Updated", action: <CheckCircle className="text-green-500" /> });
      } else {
        addPrescription(prescriptionData);
        toast({ title: "Prescription Created", action: <CheckCircle className="text-green-500" /> });
      }
      setIsDialogOpen(false); setEditingPrescription(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save prescription.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, editingPrescription, addPrescription, updatePrescription, toast]);

  const handleEdit = (prescription) => { setEditingPrescription(prescription); setIsDialogOpen(true); };
  const handleRenew = (prescription) => { updatePrescription(prescription.id, { ...prescription, prescribed_date: new Date().toISOString() }); toast({ title: "Prescription Renewed", description: `For ${prescription.patient_name}.` }); };
  const toggleExpand = (id) => setExpandedPrescription(expandedPrescription === id ? null : id);

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Prescriptions</h1><p className="text-xs sm:text-sm text-gray-600 mt-1">Manage medical prescriptions</p></div>
        {(user?.role_name === 'Doctor' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingPrescription(null); }}>
            <DialogTrigger asChild><Button className="healthcare-gradient text-white w-full sm:w-auto text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4"><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> New Prescription</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>{editingPrescription ? 'Edit Prescription' : 'New Prescription'}</DialogTitle><DialogDescription>{editingPrescription ? 'Update details' : 'Fill in details'}</DialogDescription></DialogHeader><PrescriptionForm initialData={editingPrescription || initialFormState} onSubmit={handleFormSubmit} onCancel={() => { setIsDialogOpen(false); setEditingPrescription(null); }} isSubmitting={isSubmitting} editingPrescription={!!editingPrescription} /></DialogContent>
          </Dialog>
        )}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1"><Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" /><Input placeholder="Search by patient, doctor, medicine..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 text-xs sm:text-sm h-9 sm:h-10" /></div>
        <Select value={dateFilter} onValueChange={setDateFilter}><SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm h-9 sm:h-10"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue placeholder="Filter by date" /></SelectTrigger><SelectContent><SelectItem value="all">All Dates</SelectItem><SelectItem value="today">Today</SelectItem><SelectItem value="last7days">Last 7 Days</SelectItem><SelectItem value="last30days">Last 30 Days</SelectItem></SelectContent></Select>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3 sm:space-y-4">
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((presc, index) => (
            <motion.div key={presc.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="healthcare-card hover-lift overflow-hidden"><CardHeader className="p-3 sm:p-4 cursor-pointer" onClick={() => toggleExpand(presc.id)}>
                  <div className="flex items-center justify-between"><div className="flex items-center space-x-2 sm:space-x-3"><div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shrink-0"><Pill className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></div><div><h3 className="text-sm sm:text-base font-semibold text-gray-900">{presc.patient_name}</h3><p className="text-[10px] sm:text-xs text-gray-500">Dr. {presc.doctor_name} • {format(new Date(presc.prescribed_date), 'MMM dd, yyyy')}</p></div></div><div className="flex items-center space-x-1 sm:space-x-2">{user?.role_name === 'Doctor' && <Button size="sm" variant="outline" className="h-6 sm:h-7 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs" onClick={(e) => { e.stopPropagation(); handleRenew(presc); }}><RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Renew</Button>}{expandedPrescription === presc.id ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}</div></div>
              </CardHeader><AnimatePresence>{expandedPrescription === presc.id && <motion.section key="content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}><CardContent className="p-3 sm:p-4 pt-0">
                  <div className="space-y-1.5 mb-2 sm:mb-3"><h4 className="text-xs sm:text-sm font-medium text-gray-700">Medications:</h4>{presc.medications.map((med, i) => <div key={i} className="flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 rounded-md text-xs sm:text-sm"><div><p className="font-medium text-gray-800">{med.medicine_name}</p><p className="text-[10px] sm:text-xs text-gray-500">{med.dosage} - {med.frequency}</p></div></div>)}</div>
                  {presc.notes && <div className="mb-2 sm:mb-3"><h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-0.5">Instructions:</h4><p className="text-[10px] sm:text-xs text-gray-600 bg-blue-50 p-1.5 sm:p-2 rounded-md">{presc.notes}</p></div>}
                  {presc.followup_required && <div className="flex items-center space-x-1 text-orange-600 text-[10px] sm:text-xs"><Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" /><span>Follow-up required</span></div>}
                  {(user?.role_name === 'Doctor' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t"><Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleEdit(presc); }} className="h-6 sm:h-7 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs">Edit Prescription</Button></div>}
              </CardContent></motion.section>}</AnimatePresence></Card>
            </motion.div>
          ))
        ) : (
          <Card className="healthcare-card"><CardContent className="p-8 sm:p-12 text-center"><FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" /><h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No prescriptions</h3><p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{searchTerm || dateFilter !== 'all' ? 'Try adjusting search/filter.' : 'No prescriptions created yet.'}</p>{!searchTerm && dateFilter === 'all' && (user?.role_name === 'Doctor' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && <Button className="healthcare-gradient text-white text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4" onClick={() => setIsDialogOpen(true)}><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />Create Prescription</Button>}</CardContent></Card>
        )}
      </motion.div>
    </div>
  );
}

export default PrescriptionsPage;