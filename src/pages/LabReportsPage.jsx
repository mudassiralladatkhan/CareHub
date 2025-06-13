import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TestTube, Plus, Search, Filter, Download, CheckCircle } from 'lucide-react';
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
import { format } from 'date-fns';

const LabReportForm = ({ initialData, onSubmit, onCancel, isSubmitting, editingReport }) => {
  const [formData, setFormData] = useState(initialData);
  const reportTypes = ['Blood Test', 'Urine Analysis', 'X-Ray', 'MRI', 'CT Scan', 'ECG', 'Ultrasound'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label htmlFor="patient_name">Patient Name</Label><Input id="patient_name" value={formData.patient_name} onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))} placeholder="Patient name" required /></div>
        <div className="space-y-1"><Label htmlFor="doctor_name">Doctor Name</Label><Input id="doctor_name" value={formData.doctor_name} onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))} placeholder="Doctor name" required /></div>
      </div>
      <div className="space-y-1"><Label htmlFor="report_type">Report Type</Label>
        <Select value={formData.report_type} onValueChange={(value) => setFormData(prev => ({ ...prev, report_type: value }))}>
          <SelectTrigger><SelectValue placeholder="Select report type" /></SelectTrigger>
          <SelectContent>{reportTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="report_result">Test Results</Label>
        <Textarea id="report_result" value={formData.report_result} onChange={(e) => setFormData(prev => ({ ...prev, report_result: e.target.value }))} placeholder='JSON format: {"parameter": "value"}' rows={4} required />
        <p className="text-xs text-gray-500">Use JSON for structured data, e.g., {"{\"hemoglobin\": \"14 g/dL\", \"wbc_count\": \"7500 /mcL\"}"}</p>
      </div>
      <div className="space-y-1"><Label htmlFor="notes">Notes & Observations</Label><Textarea id="notes" value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Additional notes" rows={2}/></div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="healthcare-gradient text-white" disabled={isSubmitting}>
          {isSubmitting && <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
          {isSubmitting ? 'Saving...' : (editingReport ? 'Update Report' : 'Create Report')}
        </Button>
      </DialogFooter>
    </form>
  );
};

function LabReportsPage() {
  const { labReports, addLabReport, updateLabReport } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const initialFormState = { patient_name: '', doctor_name: '', report_type: '', report_result: '', notes: '' };
  const reportTypes = ['Blood Test', 'Urine Analysis', 'X-Ray', 'MRI', 'CT Scan', 'ECG', 'Ultrasound'];

  const filteredReports = labReports.filter(report => {
    const matchesSearch = report.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || report.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) || report.report_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    if (user?.role_name === 'Patient') return report.patient_id === user.id && matchesSearch && matchesType;
    if (user?.role_name === 'Doctor') return report.doctor_id === user.id && matchesSearch && matchesType;
    if (user?.role_name === 'Lab Technician') return report.lab_technician_id === user.id && matchesSearch && matchesType;
    return matchesSearch && matchesType;
  });

  const handleFormSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);
    let parsedResult;
    try { parsedResult = JSON.parse(formData.report_result); } catch { parsedResult = { result: formData.report_result }; }
    
    const reportData = { ...formData, report_date: new Date().toISOString(), patient_id: user?.role_name === 'Patient' ? user.id : '8', doctor_id: user?.role_name === 'Doctor' ? user.id : '3', lab_technician_id: user?.role_name === 'Lab Technician' ? user.id : '5', technician_name: user?.role_name === 'Lab Technician' ? user.full_name : 'Michael Chen', report_result: parsedResult, file_upload: null };

    try {
      if (editingReport) {
        updateLabReport(editingReport.id, reportData);
        toast({ title: "Lab Report Updated", action: <CheckCircle className="text-green-500" /> });
      } else {
        addLabReport(reportData);
        toast({ title: "Lab Report Created", action: <CheckCircle className="text-green-500" /> });
      }
      setIsDialogOpen(false); setEditingReport(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save report.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, editingReport, addLabReport, updateLabReport, toast]);

  const handleEdit = (report) => { 
    setEditingReport({
        ...report,
        report_result: typeof report.report_result === 'object' ? JSON.stringify(report.report_result, null, 2) : report.report_result
    }); 
    setIsDialogOpen(true); 
  };

  const renderReportResult = (result) => {
    if (typeof result === 'object' && result !== null) {
      return (<div className="space-y-1">{Object.entries(result).map(([key, value]) => (<div key={key} className="flex justify-between text-xs sm:text-sm"><span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span><span className="font-medium">{String(value)}</span></div>))}</div>);
    }
    return <span className="text-xs sm:text-sm">{String(result)}</span>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lab Reports</h1><p className="text-xs sm:text-sm text-gray-600 mt-1">Manage lab test results</p></div>
        {(user?.role_name === 'Lab Technician' || user?.role_name === 'Doctor' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingReport(null); }}>
            <DialogTrigger asChild><Button className="healthcare-gradient text-white w-full sm:w-auto text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4"><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> New Lab Report</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>{editingReport ? 'Edit Report' : 'New Report'}</DialogTitle><DialogDescription>{editingReport ? 'Update details' : 'Fill in details'}</DialogDescription></DialogHeader><LabReportForm initialData={editingReport || initialFormState} onSubmit={handleFormSubmit} onCancel={() => { setIsDialogOpen(false); setEditingReport(null); }} isSubmitting={isSubmitting} editingReport={!!editingReport} /></DialogContent>
          </Dialog>
        )}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1"><Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" /><Input placeholder="Search lab reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 text-xs sm:text-sm h-9 sm:h-10" /></div>
        <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm h-9 sm:h-10"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue placeholder="Filter by type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{reportTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid gap-3 sm:gap-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <motion.div key={report.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="healthcare-card hover-lift"><CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between">
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex items-center space-x-3 mb-3"><div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shrink-0"><TestTube className="w-5 h-5 text-white" /></div><div><h3 className="text-base sm:text-lg font-semibold text-gray-900">{report.patient_name}</h3><p className="text-xs sm:text-sm text-gray-600">Dr. {report.doctor_name} • Tech: {report.technician_name}</p><p className="text-[10px] sm:text-xs text-gray-500">{format(new Date(report.report_date), 'MMM dd, yyyy - h:mm a')}</p></div></div>
                    <div className="mb-3"><div className="flex items-center space-x-2 mb-2"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-medium rounded-full">{report.report_type}</span></div><div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-2"><h4 className="font-medium text-gray-800 text-xs sm:text-sm mb-1">Results:</h4>{renderReportResult(report.report_result)}</div>{report.notes && <div className="bg-blue-50 p-2 sm:p-3 rounded-lg"><h4 className="font-medium text-blue-800 text-xs sm:text-sm mb-1">Notes:</h4><p className="text-xs sm:text-sm text-blue-700">{report.notes}</p></div>}</div>
                  </div>
                  <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 mt-3 sm:mt-0 sm:ml-4 w-full sm:w-auto">
                    {(user?.role_name === 'Lab Technician' || user?.role_name === 'Doctor' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && <Button size="sm" variant="outline" onClick={() => handleEdit(report)} className="flex-1 sm:flex-none text-xs px-2 py-1 sm:text-sm">Edit</Button>}
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs px-2 py-1 sm:text-sm" onClick={() => toast({ title: "🚧 Feature Coming Soon!", description: "Report download soon! 🚀" })}><Download className="w-3 h-3 mr-1" />Download</Button>
                  </div>
                </div>
              </CardContent></Card>
            </motion.div>
          ))
        ) : (
          <Card className="healthcare-card"><CardContent className="p-8 sm:p-12 text-center"><TestTube className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" /><h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No lab reports</h3><p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{searchTerm || typeFilter !== 'all' ? 'Try adjusting search/filter.' : 'No reports created yet.'}</p>{!searchTerm && typeFilter === 'all' && (user?.role_name === 'Lab Technician' || user?.role_name === 'Doctor' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && <Button className="healthcare-gradient text-white text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4" onClick={() => setIsDialogOpen(true)}><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />Create Report</Button>}</CardContent></Card>
        )}
      </motion.div>
    </div>
  );
}

export default LabReportsPage;