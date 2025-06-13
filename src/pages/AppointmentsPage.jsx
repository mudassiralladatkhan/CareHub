import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, Search, Filter, User, CheckCircle } from 'lucide-react';
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
import { format, addDays, subDays, differenceInSeconds } from 'date-fns';

const AppointmentCalendar = ({ selectedDate, onDateChange, bookedSlots }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subDays(currentMonth, 30))}>&lt;</Button>
      <span className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
      <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addDays(currentMonth, 30))}>&gt;</Button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {daysOfWeek.map(day => <div key={day} className="font-medium text-gray-500">{day}</div>)}
    </div>
  );

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const rows = [];
    let day = startDate;

    for (let i = 0; i < 6; i++) {
      const cells = [];
      for (let j = 0; j < 7; j++) {
        const cloneDay = new Date(day);
        const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
        const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        const isBooked = bookedSlots.some(slot => format(new Date(slot.split('T')[0]), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
        
        cells.push(
          <motion.div
            key={day.toString()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-1.5 sm:p-2 rounded-full cursor-pointer text-xs sm:text-sm text-center
              ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
              ${isSelected ? 'bg-teal-500 text-white' : ''}
              ${isToday && !isSelected ? 'bg-teal-100 text-teal-700' : ''}
              ${isBooked && !isSelected ? 'bg-red-200 text-red-700 line-through' : ''}
              ${!isBooked && isCurrentMonth ? 'hover:bg-gray-100' : ''}
            `}
            onClick={() => isCurrentMonth && !isBooked && onDateChange(cloneDay)}
          >
            {day.getDate()}
          </motion.div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(<div key={i} className="grid grid-cols-7 gap-0.5 sm:gap-1">{cells}</div>);
    }
    return <div className="space-y-0.5 sm:space-y-1">{rows}</div>;
  };

  return (
    <div className="p-2 border rounded-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

const TimeSlotSlider = ({ selectedTime, onTimeChange, bookedSlots, selectedDate }) => {
  const availableTimes = [];
  for (let i = 9; i <= 17; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = i.toString().padStart(2, '0');
      const minute = j.toString().padStart(2, '0');
      availableTimes.push(`${hour}:${minute}`);
    }
  }

  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex space-x-2">
        {availableTimes.map(time => {
          const dateTimeStr = `${format(selectedDate, 'yyyy-MM-dd')}T${time}:00Z`;
          const isBooked = bookedSlots.includes(dateTimeStr);
          const isSelected = time === selectedTime;

          return (
            <motion.button
              key={time}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap
                ${isSelected ? 'bg-teal-500 text-white' : ''}
                ${isBooked ? 'bg-red-200 text-red-700 line-through cursor-not-allowed' : ''}
                ${!isBooked && !isSelected ? 'bg-gray-100 hover:bg-gray-200' : ''}
              `}
              onClick={() => !isBooked && onTimeChange(time)}
              disabled={isBooked}
            >
              {time}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const AppointmentCountdown = ({ appointmentDate }) => {
  const [timeLeft, setTimeLeft] = useState(differenceInSeconds(new Date(appointmentDate), new Date()));

  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (timeLeft <= 0) return <span className="text-green-600 text-xs">Appointment has started/passed.</span>;

  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="font-mono text-teal-600 text-xs">
      {days > 0 && `${days}d `}{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

const AppointmentForm = ({ initialData, onSubmit, onCancel, bookedSlots, isSubmitting, editingAppointment }) => {
  const [formData, setFormData] = useState(initialData);
  const { user } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="patient_name">Patient Name</Label>
        <Input id="patient_name" value={formData.patient_name} onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))} placeholder="Enter patient name" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="doctor_name">Doctor Name</Label>
        <Input id="doctor_name" value={formData.doctor_name} onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))} placeholder="Enter doctor name" required />
      </div>
      <div className="space-y-1">
        <Label>Date</Label>
        <AppointmentCalendar selectedDate={new Date(formData.appointment_date)} onDateChange={(date) => setFormData(prev => ({...prev, appointment_date: format(date, 'yyyy-MM-dd')}))} bookedSlots={bookedSlots} />
      </div>
      <div className="space-y-1">
        <Label>Time</Label>
        <TimeSlotSlider selectedTime={formData.appointment_time} onTimeChange={(time) => setFormData(prev => ({...prev, appointment_time: time}))} bookedSlots={bookedSlots.filter(slot => slot.startsWith(formData.appointment_date))} selectedDate={new Date(formData.appointment_date)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="reason">Reason for Visit</Label>
        <Textarea id="reason" value={formData.reason} onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))} placeholder="Describe the reason" required rows={2} />
      </div>
      {(user?.role_name === 'Doctor' || user?.role_name === 'Admin' || user?.role_name === 'SuperAdmin') && (
        <div className="space-y-1">
          <Label htmlFor="appointment_status">Status</Label>
          <Select value={formData.appointment_status} onValueChange={(value) => setFormData(prev => ({ ...prev, appointment_status: value }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="healthcare-gradient text-white" disabled={isSubmitting}>
          {isSubmitting && <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
          {isSubmitting ? 'Saving...' : (editingAppointment ? 'Update Appointment' : 'Schedule Appointment')}
        </Button>
      </DialogFooter>
    </form>
  );
};


function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useDataStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const initialFormState = {
    patient_name: '',
    doctor_name: '',
    appointment_date: format(new Date(), 'yyyy-MM-dd'),
    appointment_time: '09:00',
    reason: '',
    appointment_status: 'Pending'
  };

  const bookedSlots = appointments.map(apt => apt.appointment_date);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.appointment_status === statusFilter;
    if (user?.role_name === 'Patient') return apt.patient_id === user.id && matchesSearch && matchesStatus;
    if (user?.role_name === 'Doctor') return apt.doctor_id === user.id && matchesSearch && matchesStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);
    const appointmentData = {
      ...formData,
      appointment_date: `${formData.appointment_date}T${formData.appointment_time}:00Z`,
      patient_id: user?.role_name === 'Patient' ? user.id : '8', 
      doctor_id: user?.role_name === 'Doctor' ? user.id : '3' 
    };

    try {
      if (editingAppointment) {
        updateAppointment(editingAppointment.id, appointmentData);
        toast({ title: "Appointment Updated", description: "Successfully updated.", action: <CheckCircle className="text-green-500" /> });
      } else {
        addAppointment(appointmentData);
        toast({ title: "Appointment Scheduled", description: "Successfully scheduled.", action: <CheckCircle className="text-green-500" /> });
      }
      setIsDialogOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save appointment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, editingAppointment, addAppointment, updateAppointment, toast]);
  
  const handleEdit = (appointment) => {
    const appointmentDateObj = new Date(appointment.appointment_date);
    setEditingAppointment({
      ...appointment,
      appointment_date: format(appointmentDateObj, 'yyyy-MM-dd'),
      appointment_time: format(appointmentDateObj, 'HH:mm'),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    deleteAppointment(id);
    toast({ title: "Appointment Cancelled", description: "Successfully cancelled." });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-green-100 text-green-800', 'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-blue-100 text-blue-800', 'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your medical appointments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingAppointment(null); }}>
          <DialogTrigger asChild>
            <Button className="healthcare-gradient text-white w-full sm:w-auto text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}</DialogTitle>
              <DialogDescription>{editingAppointment ? 'Update details' : 'Fill in details'}</DialogDescription>
            </DialogHeader>
            <AppointmentForm 
              initialData={editingAppointment || initialFormState}
              onSubmit={handleFormSubmit}
              onCancel={() => { setIsDialogOpen(false); setEditingAppointment(null); }}
              bookedSlots={bookedSlots}
              isSubmitting={isSubmitting}
              editingAppointment={!!editingAppointment}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <Input placeholder="Search appointments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 text-xs sm:text-sm h-9 sm:h-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm h-9 sm:h-10">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid gap-3 sm:gap-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
            <motion.div key={appointment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="healthcare-card hover-lift">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{appointment.patient_name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Dr. {appointment.doctor_name}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                        <div className="flex items-center space-x-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /><span className="text-gray-600">{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</span></div>
                        <div className="flex items-center space-x-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /><span className="text-gray-600">{format(new Date(appointment.appointment_date), 'h:mm a')}</span></div>
                        <div className="flex items-center space-x-1.5"><span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(appointment.appointment_status)}`}>{appointment.appointment_status}</span></div>
                        {user?.role_name === 'Patient' && appointment.appointment_status === 'Confirmed' && new Date(appointment.appointment_date) > new Date() && (
                          <div className="flex items-center space-x-1.5"><Clock className="w-3.5 h-3.5 text-teal-500" /><AppointmentCountdown appointmentDate={appointment.appointment_date} /></div>
                        )}
                      </div>
                      <div className="mb-3"><p className="text-xs sm:text-sm text-gray-600"><strong>Reason:</strong> {appointment.reason}</p></div>
                    </div>
                    <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 w-full sm:w-auto">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(appointment)} className="flex-1 sm:flex-none text-xs px-2 py-1 sm:text-sm">Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(appointment.id)} className="text-red-600 hover:text-red-700 flex-1 sm:flex-none text-xs px-2 py-1 sm:text-sm">Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="healthcare-card">
            <CardContent className="p-8 sm:p-12 text-center">
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No appointments found</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{searchTerm || statusFilter !== 'all' ? 'Try adjusting search/filter.' : 'Schedule your first appointment.'}</p>
              {!searchTerm && statusFilter === 'all' && <Button className="healthcare-gradient text-white text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4" onClick={() => setIsDialogOpen(true)}><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />Schedule Appointment</Button>}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

export default AppointmentsPage;