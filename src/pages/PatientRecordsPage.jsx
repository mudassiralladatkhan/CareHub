import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Search, User, Calendar, Heart, AlertTriangle, FileText, Briefcase as BriefcaseMedical, Receipt, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';

const RecordDetailItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-start space-x-2">
    {Icon && <Icon className="w-4 h-4 text-teal-600 mt-1" />}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

const PatientRecordsPage = () => {
  const { patientProfiles, appointments, prescriptions, labReports, billing } = useDataStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patientProfiles.filter(patient => {
    const matchesSearch = patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (user?.role_name === 'Patient') {
      return patient.user_id === user.id && matchesSearch;
    }
    return matchesSearch;
  });

  const getPatientData = (patientId, dataType) => {
    const dataMap = {
      appointments: appointments.filter(apt => apt.patient_id === patientId),
      prescriptions: prescriptions.filter(presc => presc.patient_id === patientId),
      labReports: labReports.filter(report => report.patient_id === patientId),
      billing: billing.filter(bill => bill.patient_id === patientId),
    };
    return dataMap[dataType] || [];
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800', 'A-': 'bg-red-100 text-red-800',
      'B+': 'bg-blue-100 text-blue-800', 'B-': 'bg-blue-100 text-blue-800',
      'AB+': 'bg-purple-100 text-purple-800', 'AB-': 'bg-purple-100 text-purple-800',
      'O+': 'bg-green-100 text-green-800', 'O-': 'bg-green-100 text-green-800'
    };
    return colors[bloodGroup] || 'bg-gray-100 text-gray-800';
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    return age > 0 ? age : '<1';
  };

  const renderMedicalHistoryList = (items, title) => (
    <div>
      <strong className="text-xs text-gray-600">{title}:</strong>
      {items && items.length > 0 ? (
        <ul className="list-disc list-inside ml-2 text-xs text-gray-700">
          {items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      ) : <p className="text-xs text-gray-500 italic">None recorded</p>}
    </div>
  );

  const TabContentRenderer = ({ patientId, type }) => {
    const data = getPatientData(patientId, type);
    if (data.length === 0) return <p className="text-gray-500 text-center py-8 text-sm">No {type} found.</p>;

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto p-1">
        {data.map(item => {
          if (type === 'appointments') return (
            <div key={item.id} className="p-3 border rounded-lg text-xs">
              <p className="font-medium text-sm">{item.doctor_name} - {format(new Date(item.appointment_date), 'MMM dd, yyyy - h:mm a')}</p>
              <p className="text-gray-600">Reason: {item.reason}</p>
              <p className={`capitalize text-xs px-2 py-0.5 inline-block rounded-full mt-1 ${
                item.appointment_status === 'Completed' ? 'bg-green-100 text-green-800' :
                item.appointment_status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>{item.appointment_status}</p>
            </div>
          );
          if (type === 'prescriptions') return (
            <div key={item.id} className="p-3 border rounded-lg text-xs">
              <p className="font-medium text-sm">{item.doctor_name} - {format(new Date(item.prescribed_date), 'MMM dd, yyyy')}</p>
              {item.medications.map((med, idx) => <p key={idx} className="text-gray-600">{med.medicine_name} ({med.dosage} - {med.frequency})</p>)}
            </div>
          );
          if (type === 'labReports') return (
             <div key={item.id} className="p-3 border rounded-lg text-xs">
              <p className="font-medium text-sm">{item.report_type} - {format(new Date(item.report_date), 'MMM dd, yyyy')}</p>
              <p className="text-gray-600">Dr. {item.doctor_name}</p>
            </div>
          );
           if (type === 'billing') return (
             <div key={item.id} className="p-3 border rounded-lg text-xs">
              <p className="font-medium text-sm">Bill #{item.id.slice(0,5)}... - ${item.total_amount.toFixed(2)}</p>
              <p className="text-gray-600">Date: {format(new Date(item.billing_date), 'MMM dd, yyyy')}</p>
               <p className={`capitalize text-xs px-2 py-0.5 inline-block rounded-full mt-1 ${
                item.payment_status === 'Paid' ? 'bg-green-100 text-green-800' :
                item.payment_status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>{item.payment_status}</p>
            </div>
          );
          return null;
        })}
      </div>
    );
  };


  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
          <p className="text-gray-600 mt-2">Comprehensive patient health records and history</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input placeholder="Search patient records by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid gap-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <motion.div key={patient.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="healthcare-card hover-lift">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{patient.full_name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{patient.email}</p>
                          <div className="flex items-center flex-wrap space-x-2 mt-1">
                            <span className="text-xs text-gray-500">Age: {calculateAge(patient.date_of_birth)}</span>
                            <span className="text-gray-300 hidden sm:inline">•</span>
                            <span className="text-xs text-gray-500">{patient.gender}</span>
                            <span className="text-gray-300 hidden sm:inline">•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBloodGroupColor(patient.blood_group)}`}>{patient.blood_group}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                        {[
                          { label: 'Appointments', count: getPatientData(patient.user_id, 'appointments').length, color: 'blue' },
                          { label: 'Prescriptions', count: getPatientData(patient.user_id, 'prescriptions').length, color: 'green' },
                          { label: 'Lab Reports', count: getPatientData(patient.user_id, 'labReports').length, color: 'purple' },
                          { label: 'Bills', count: getPatientData(patient.user_id, 'billing').length, color: 'orange' },
                        ].map(item => (
                          <div key={item.label} className={`text-center p-2 bg-${item.color}-50 rounded-lg`}>
                            <p className={`text-lg font-bold text-${item.color}-600`}>{item.count}</p>
                            <p className={`text-xs text-${item.color}-600`}>{item.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setSelectedPatient(patient)}>View Full Record</Button>
                        </DialogTrigger>
                        {selectedPatient && (
                        <DialogContent className="max-w-3xl w-[95%] sm:max-w-2xl max-h-[90vh] p-4 sm:p-6">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Patient Record: {selectedPatient.full_name}</DialogTitle>
                            <DialogDescription>Complete medical history and records.</DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="overview" className="w-full mt-2">
                            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 text-xs h-auto py-1">
                              <TabsTrigger value="overview" className="py-1.5 px-2">Overview</TabsTrigger>
                              <TabsTrigger value="appointments" className="py-1.5 px-2">Appointments</TabsTrigger>
                              <TabsTrigger value="prescriptions" className="py-1.5 px-2">Prescriptions</TabsTrigger>
                              <TabsTrigger value="lab-reports" className="py-1.5 px-2">Lab Reports</TabsTrigger>
                              <TabsTrigger value="billing" className="py-1.5 px-2">Billing</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-3 space-y-3 max-h-96 overflow-y-auto p-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Card className="p-3"><RecordDetailItem label="Date of Birth" value={format(new Date(selectedPatient.date_of_birth), 'MMM dd, yyyy')} icon={Calendar} /></Card>
                                <Card className="p-3"><RecordDetailItem label="Gender" value={selectedPatient.gender} icon={User} /></Card>
                                <Card className="p-3"><RecordDetailItem label="Blood Group" value={selectedPatient.blood_group} icon={Heart} /></Card>
                                <Card className="p-3"><RecordDetailItem label="Address" value={selectedPatient.address} icon={User} /></Card>
                              </div>
                              <Card className="p-3">
                                <h4 className="text-sm font-medium mb-1">Medical History</h4>
                                <div className="space-y-1">
                                  {renderMedicalHistoryList(selectedPatient.medical_history.conditions, "Conditions")}
                                  {renderMedicalHistoryList(selectedPatient.medical_history.surgeries, "Surgeries")}
                                  {renderMedicalHistoryList(selectedPatient.medical_history.medications, "Current Medications")}
                                </div>
                              </Card>
                              {selectedPatient.allergies && <Card className="p-3 bg-red-50 border-red-200"><RecordDetailItem label="Allergies" value={selectedPatient.allergies} icon={AlertTriangle} /></Card>}
                              <Card className="p-3"><RecordDetailItem label="Emergency Contact" value={selectedPatient.emergency_contact} icon={User} /></Card>
                            </TabsContent>
                            <TabsContent value="appointments"><TabContentRenderer patientId={selectedPatient.user_id} type="appointments" /></TabsContent>
                            <TabsContent value="prescriptions"><TabContentRenderer patientId={selectedPatient.user_id} type="prescriptions" /></TabsContent>
                            <TabsContent value="lab-reports"><TabContentRenderer patientId={selectedPatient.user_id} type="labReports" /></TabsContent>
                            <TabsContent value="billing"><TabContentRenderer patientId={selectedPatient.user_id} type="billing" /></TabsContent>
                          </Tabs>
                        </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="healthcare-card">
            <CardContent className="p-12 text-center">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patient records found</h3>
              <p className="text-gray-600">{searchTerm ? 'Try adjusting your search criteria.' : 'No patient records are available.'}</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default PatientRecordsPage;