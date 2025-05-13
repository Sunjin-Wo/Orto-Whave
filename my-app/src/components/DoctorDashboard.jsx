import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  UserIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Datos de ejemplo para las estadísticas
const salesData = [35, 55, 40, 65, 70, 55, 80, 60, 75, 65, 70, 90];
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '',
    appointmentDateTime: '',
    serviceType: 'Consulta General',
    status: 'Pendiente',
    notes: ''
  });

  useEffect(() => {
    // Simulación de carga de datos
    const loadData = async () => {
      // En una implementación real, estos datos vendrían de una API
      const mockPatients = [
        {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@ejemplo.com',
          documentType: 'CC',
          documentId: '1234567890',
          phone: '3001234567',
          address: 'Calle 123 #45-67',
          birthDate: '1990-05-15',
          medicalHistory: [
            { date: '2023-01-15', description: 'Consulta inicial', diagnosis: 'Maloclusión clase II', treatment: 'Brackets metálicos' },
            { date: '2023-02-15', description: 'Control mensual', diagnosis: 'Progreso adecuado', treatment: 'Ajuste de brackets' }
          ]
        },
        {
          id: 2,
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@ejemplo.com',
          documentType: 'CC',
          documentId: '0987654321',
          phone: '3109876543',
          address: 'Avenida 456 #78-90',
          birthDate: '1985-08-22',
          medicalHistory: [
            { date: '2023-03-10', description: 'Consulta inicial', diagnosis: 'Apiñamiento dental', treatment: 'Brackets cerámicos' },
            { date: '2023-04-10', description: 'Control mensual', diagnosis: 'Progreso adecuado', treatment: 'Ajuste de brackets' }
          ]
        },
        {
          id: 999,
          firstName: 'Paciente',
          lastName: 'Ejemplo',
          email: 'paciente@ejemplo.com',
          documentType: 'CC',
          documentId: '1234567890',
          phone: '3001234567',
          address: 'Calle 123 #45-67',
          birthDate: '1990-01-01',
          medicalHistory: [
            { date: '2023-05-01', description: 'Consulta inicial', diagnosis: 'Evaluación general', treatment: 'Pendiente definir tratamiento' }
          ]
        }
      ];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const mockAppointments = [
        {
          id: 1,
          patientId: 1,
          patientName: 'Juan Pérez',
          appointmentDateTime: tomorrow.toISOString(),
          serviceType: 'Control de Brackets',
          status: 'Confirmada',
          notes: 'Ajuste mensual'
        },
        {
          id: 2,
          patientId: 2,
          patientName: 'María González',
          appointmentDateTime: nextWeek.toISOString(),
          serviceType: 'Consulta General',
          status: 'Pendiente',
          notes: 'Primera evaluación'
        },
        {
          id: 3,
          patientId: 999,
          patientName: 'Paciente Ejemplo',
          appointmentDateTime: tomorrow.toISOString(),
          serviceType: 'Consulta Inicial',
          status: 'Confirmada',
          notes: 'Primera consulta para evaluación'
        }
      ];

      setPatients(mockPatients);
      setAppointments(mockAppointments);
      setLoading(false);
    };

    loadData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return fullName.includes(searchTermLower) || 
           patient.email.toLowerCase().includes(searchTermLower) || 
           patient.documentId.includes(searchTermLower);
  });

  const filteredAppointments = appointments.filter(appointment => {
    const patientName = appointment.patientName.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return patientName.includes(searchTermLower) || 
           appointment.serviceType.toLowerCase().includes(searchTermLower) ||
           appointment.status.toLowerCase().includes(searchTermLower);
  });

  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm({
      ...appointmentForm,
      [name]: value
    });
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    setAppointmentForm({
      ...appointmentForm,
      patientId
    });
  };

  const handleSubmitAppointment = (e) => {
    e.preventDefault();
    
    // En una implementación real, aquí se enviaría la información a una API
    const newAppointment = {
      id: appointments.length + 1,
      patientId: parseInt(appointmentForm.patientId),
      patientName: patients.find(p => p.id === parseInt(appointmentForm.patientId))?.firstName + ' ' + 
                  patients.find(p => p.id === parseInt(appointmentForm.patientId))?.lastName,
      appointmentDateTime: appointmentForm.appointmentDateTime,
      serviceType: appointmentForm.serviceType,
      status: appointmentForm.status,
      notes: appointmentForm.notes
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowNewAppointmentForm(false);
    setAppointmentForm({
      patientId: '',
      appointmentDateTime: '',
      serviceType: 'Consulta General',
      status: 'Pendiente',
      notes: ''
    });
    setSelectedPatient(null);
  };

  const handleCalendarDateChange = (newDate) => {
    setCalendarDate(newDate);
    setSelectedDate(newDate);
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => {
      const appDate = new Date(app.appointmentDateTime);
      return appDate.getDate() === date.getDate() &&
             appDate.getMonth() === date.getMonth() &&
             appDate.getFullYear() === date.getFullYear();
    });
  };

  const hasAppointments = (date) => {
    return appointments.some(app => {
      const appDate = new Date(app.appointmentDateTime);
      return appDate.getDate() === date.getDate() &&
             appDate.getMonth() === date.getMonth() &&
             appDate.getFullYear() === date.getFullYear();
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasAppointments(date)) {
      return <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>;
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && hasAppointments(date)) {
      return 'relative has-appointments';
    }
    return 'relative';
  };

  const getAppointmentColorClass = (status) => {
    const colors = {
      'Confirmada': 'bg-green-100 text-green-600 border-green-300',
      'Pendiente': 'bg-yellow-100 text-yellow-600 border-yellow-300',
      'Cancelada': 'bg-red-100 text-red-600 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-600 border-gray-300';
  };

  // Funciones para estadísticas
  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments
      .filter(app => new Date(app.appointmentDateTime) >= today)
      .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))
      .slice(0, 3);
  };

  const formatShortDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Panel de Doctor
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                {user?.firstName?.charAt(0) || 'D'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {user?.firstName || 'Doctor'} {user?.lastName || ''}
              </span>
            </div>
            <button
              onClick={() => logout(navigate)}
              className="flex items-center text-gray-500 hover:text-red-600"
              title="Cerrar sesión"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="ml-1 text-sm">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="flex border-b">
            <button
              className={`px-6 py-4 font-medium ${activeTab === 'appointments' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('appointments')}
            >
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>Citas</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 font-medium ${activeTab === 'calendar' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('calendar')}
            >
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>Calendario</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 font-medium ${activeTab === 'statistics' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('statistics')}
            >
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                <span>Estadísticas</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 font-medium ${activeTab === 'patients' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('patients')}
            >
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                <span>Pacientes</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 font-medium ${activeTab === 'medical-history' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('medical-history')}
            >
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                <span>Historial Médico</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mb-6 flex justify-between">
          {activeTab !== 'statistics' && (
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          )}
          
          {activeTab === 'appointments' && (
            <button
              onClick={() => setShowNewAppointmentForm(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              <span>Nueva Cita</span>
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'statistics' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Estadísticas y Rendimiento</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                <motion.div 
                  className="bg-white shadow rounded-lg p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Productos</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-md">
                      <ChartBarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <span className="text-green-500 text-xs font-medium">+11.2%</span>
                    <span className="text-gray-500 text-xs ml-2">Este mes</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white shadow rounded-lg p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ventas</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">182</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-md">
                      <ChartBarIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <span className="text-green-500 text-xs font-medium">+12.1%</span>
                    <span className="text-gray-500 text-xs ml-2">vs mes pasado</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white shadow rounded-lg p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Clientes</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">143</p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-md">
                      <UserGroupIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <span className="text-green-500 text-xs font-medium">+8.2%</span>
                    <span className="text-gray-500 text-xs ml-2">vs mes pasado</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white shadow rounded-lg p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ingresos</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">$45,290</p>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded-md">
                      <ChartBarIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <span className="text-red-500 text-xs font-medium">-3.5%</span>
                    <span className="text-gray-500 text-xs ml-2">vs mes pasado</span>
                  </div>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <motion.div 
                  className="bg-white shadow rounded-lg p-5 col-span-1 lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Rendimiento de ventas</h3>
                  <div className="h-64 flex items-end space-x-2">
                    {salesData.map((value, index) => (
                      <div key={index} className="h-full flex-1 flex flex-col justify-end">
                        <div 
                          className="bg-gradient-to-t from-primary to-blue-400 rounded-t"
                          style={{ height: `${value}%` }}
                        ></div>
                        <div className="text-xs text-gray-500 text-center mt-1">
                          {months[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white shadow rounded-lg p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Próximas actividades</h3>
                  <div className="space-y-4">
                    {getUpcomingAppointments().map(appointment => (
                      <div key={appointment.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-md ${appointment.status === 'Confirmada' ? 'bg-green-100' : 
                                                       appointment.status === 'Pendiente' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                          <CalendarIcon className={`h-5 w-5 ${appointment.status === 'Confirmada' ? 'text-green-600' : 
                                                           appointment.status === 'Pendiente' ? 'text-yellow-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{appointment.serviceType}</h4>
                          <p className="text-xs text-gray-500">{formatShortDate(appointment.appointmentDateTime)}, {new Date(appointment.appointmentDateTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</p>
                          <p className="text-xs text-gray-600 mt-1">{appointment.patientName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="mt-5 bg-white shadow rounded-lg p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <h3 className="text-lg font-medium text-gray-800 mb-4">Acciones rápidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <span className="block font-medium text-gray-900">Gestionar citas</span>
                    <span className="text-xs text-gray-500">Agenda del día</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('patients')}
                    className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <span className="block font-medium text-gray-900">Ver pacientes</span>
                    <span className="text-xs text-gray-500">Lista completa</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('calendar');
                    }}
                    className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <span className="block font-medium text-gray-900">Calendario</span>
                    <span className="text-xs text-gray-500">Vista mensual</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowNewAppointmentForm(true);
                      setActiveTab('appointments');
                    }}
                    className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <span className="block font-medium text-gray-900">Nueva cita</span>
                    <span className="text-xs text-gray-500">Agendar</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Calendario de Citas</h2>
              
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-1 rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:border-primary"
                      onClick={() => setCalendarDate(new Date())}
                    >
                      Hoy
                    </button>
                    <button 
                      className="p-1 rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:border-primary"
                      onClick={() => {
                        const prevMonth = new Date(calendarDate);
                        prevMonth.setMonth(prevMonth.getMonth() - 1);
                        setCalendarDate(prevMonth);
                      }}
                    >
                      &lt;
                    </button>
                    <button 
                      className="p-1 rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:border-primary"
                      onClick={() => {
                        const nextMonth = new Date(calendarDate);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        setCalendarDate(nextMonth);
                      }}
                    >
                      &gt;
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 ml-2">
                      {calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </h2>
                  </div>
                  <div>
                    <button 
                      onClick={() => setShowNewAppointmentForm(true)}
                      className="flex items-center space-x-1 text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Nueva cita</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="calendar-full-view">
                    <Calendar 
                      onChange={handleCalendarDateChange} 
                      value={calendarDate} 
                      className="w-full border-0" 
                      tileContent={tileContent}
                      tileClassName={tileClassName}
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Citas para {selectedDate ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : calendarDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    
                    <div className="space-y-3">
                      {getAppointmentsForDate(selectedDate || calendarDate).length > 0 ? (
                        getAppointmentsForDate(selectedDate || calendarDate).map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className={`p-4 rounded-lg border-l-4 shadow-sm ${getAppointmentColorClass(appointment.status)}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{appointment.serviceType}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {new Date(appointment.appointmentDateTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                                </p>
                                <p className="text-sm font-medium mt-2">Paciente: {appointment.patientName}</p>
                                {appointment.notes && (
                                  <p className="text-sm text-gray-600 mt-1">Notas: {appointment.notes}</p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button className="text-gray-400 hover:text-primary">
                                  <span className="sr-only">Editar</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-red-500">
                                  <span className="sr-only">Eliminar</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                          No hay citas programadas para este día.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Próximas Citas</h2>
              
              {showNewAppointmentForm ? (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Nueva Cita</h3>
                    <button 
                      onClick={() => setShowNewAppointmentForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmitAppointment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Paciente
                        </label>
                        <select
                          name="patientId"
                          value={appointmentForm.patientId}
                          onChange={(e) => {
                            handleAppointmentFormChange(e);
                            handlePatientSelect(parseInt(e.target.value));
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        >
                          <option value="">Seleccionar paciente</option>
                          {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>
                              {patient.firstName} {patient.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha y Hora
                        </label>
                        <input
                          type="datetime-local"
                          name="appointmentDateTime"
                          value={appointmentForm.appointmentDateTime}
                          onChange={handleAppointmentFormChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Servicio
                        </label>
                        <select
                          name="serviceType"
                          value={appointmentForm.serviceType}
                          onChange={handleAppointmentFormChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        >
                          <option value="Consulta General">Consulta General</option>
                          <option value="Control de Brackets">Control de Brackets</option>
                          <option value="Limpieza Dental">Limpieza Dental</option>
                          <option value="Extracción">Extracción</option>
                          <option value="Radiografía">Radiografía</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          name="status"
                          value={appointmentForm.status}
                          onChange={handleAppointmentFormChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Confirmada">Confirmada</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                      </label>
                      <textarea
                        name="notes"
                        value={appointmentForm.notes}
                        onChange={handleAppointmentFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        rows="3"
                      ></textarea>
                    </div>
                    
                    {selectedPatient && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <h4 className="font-medium text-gray-700 mb-2">Información del Paciente</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Documento:</strong> {selectedPatient.documentType}: {selectedPatient.documentId}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Teléfono:</strong> {selectedPatient.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Email:</strong> {selectedPatient.email}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowNewAppointmentForm(false)}
                        className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                      >
                        Guardar Cita
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{appointment.patientName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(appointment.appointmentDateTime)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.serviceType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{appointment.notes}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No se encontraron citas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pacientes Registrados</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div key={patient.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                          <UserIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</h3>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p><strong>Documento:</strong> {patient.documentType}: {patient.documentId}</p>
                        <p><strong>Teléfono:</strong> {patient.phone}</p>
                        <p><strong>Dirección:</strong> {patient.address}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {new Date(patient.birthDate).toLocaleDateString('es-ES')}</p>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <button 
                          onClick={() => {
                            setActiveTab('medical-history');
                            setSelectedPatient(patient);
                          }}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          Ver Historial Médico
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowNewAppointmentForm(true);
                            setActiveTab('appointments');
                            handlePatientSelect(patient.id);
                          }}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          Agendar Cita
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No se encontraron pacientes
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'medical-history' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Historial Médico</h2>
              
              {!selectedPatient ? (
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">Selecciona un paciente para ver su historial médico:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className="text-left border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</h3>
                            <p className="text-sm text-gray-600">{patient.documentType}: {patient.documentId}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                        <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Información Personal</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600"><strong>Documento:</strong> {selectedPatient.documentType}: {selectedPatient.documentId}</p>
                        <p className="text-sm text-gray-600"><strong>Teléfono:</strong> {selectedPatient.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600"><strong>Dirección:</strong> {selectedPatient.address}</p>
                        <p className="text-sm text-gray-600"><strong>Fecha de Nacimiento:</strong> {new Date(selectedPatient.birthDate).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-3">Historial de Consultas</h4>
                  
                  {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPatient.medicalHistory.map((record, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-900">{record.description}</h5>
                            <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString('es-ES')}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1"><strong>Diagnóstico:</strong> {record.diagnosis}</p>
                          <p className="text-sm text-gray-600"><strong>Tratamiento:</strong> {record.treatment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No hay registros médicos para este paciente.</p>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setShowNewAppointmentForm(true);
                        setActiveTab('appointments');
                        handlePatientSelect(selectedPatient.id);
                      }}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>Agendar Cita</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard; 