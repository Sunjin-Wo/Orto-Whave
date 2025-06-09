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
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  DocumentTextIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  ChartPieIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import AppointmentForm from './appointments/AppointmentForm';
import MedicalHistoryView from './medical/MedicalHistoryView';
import PatientDetailsModal from './PatientDetailsModal';
import AppointmentNoteModal from './AppointmentNoteModal';

// Datos de ejemplo para las estadísticas
const salesData = [35, 55, 40, 65, 70, 55, 80, 60, 75, 65, 70, 90];
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', 'day'
  const [patientNotes, setPatientNotes] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ patientId: null, note: '' });
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    completedToday: 0,
    cancelledToday: 0,
    upcomingAppointments: []
  });
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '',
    date: '',
    time: '',
    duration: 30,
    type: 'checkup',
    notes: ''
  });
  const [documents, setDocuments] = useState([]);

  const helpContent = {
    overview: {
      title: 'Vista General',
      content: [
        'Visualiza tus próximas citas del día',
        'Accede rápidamente a los expedientes de pacientes',
        'Revisa notificaciones importantes',
        'Gestiona tu agenda diaria'
      ]
    },
    patients: {
      title: 'Pacientes',
      content: [
        'Administra los expedientes de tus pacientes',
        'Revisa historiales médicos completos',
        'Actualiza tratamientos y diagnósticos',
        'Gestiona documentos y radiografías'
      ]
    },
    calendar: {
      title: 'Calendario',
      content: [
        'Gestiona tu agenda de citas',
        'Visualiza disponibilidad por día/semana/mes',
        'Programa nuevas citas',
        'Configura recordatorios automáticos'
      ]
    },
    documents: {
      title: 'Documentos',
      content: [
        'Accede a expedientes médicos',
        'Gestiona recetas y órdenes médicas',
        'Archiva documentos importantes',
        'Comparte documentos con pacientes'
      ]
    },
    education: {
      title: 'Recursos Educativos',
      content: [
        'Accede a material educativo para pacientes',
        'Comparte guías de cuidado dental',
        'Visualiza casos clínicos de estudio',
        'Actualiza tus conocimientos profesionales'
      ]
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Simulación de carga de datos
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
        lastVisit: '2024-02-15',
        nextAppointment: '2024-03-15',
        medicalHistory: [
          { date: '2024-02-15', description: 'Control mensual', diagnosis: 'Progreso adecuado', treatment: 'Ajuste de brackets' },
          { date: '2024-01-15', description: 'Consulta inicial', diagnosis: 'Maloclusión clase II', treatment: 'Brackets metálicos' }
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

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const mockAppointments = [
      {
        id: 1,
        patientId: 1,
        patientName: 'Juan Pérez',
        appointmentDateTime: today.toISOString(),
        serviceType: 'Control de Brackets',
        status: 'Confirmada',
        notes: 'Ajuste mensual'
      },
      {
        id: 2,
        patientId: 2,
        patientName: 'María González',
        appointmentDateTime: tomorrow.toISOString(),
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

    const mockNotifications = [
      {
        id: 1,
        type: 'appointment_request',
        message: 'Nueva solicitud de cita de María González',
        timestamp: new Date().toISOString(),
        read: false
      },
    ];

    setPatients(mockPatients);
    setAppointments(mockAppointments);
    setNotifications(mockNotifications);
    setStats({
      totalPatients: mockPatients.length,
      appointmentsToday: 5,
      completedToday: 3,
      cancelledToday: 1,
      upcomingAppointments: mockAppointments.slice(0, 3)
    });
    setLoading(false);
  };

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

  const handleViewMedicalHistory = (patient) => {
    setSelectedPatient(patient);
    setIsMedicalHistoryOpen(true);
  };

  const handleAddNote = (patientId) => {
    setCurrentNote({ patientId, note: '' });
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (currentNote.note.trim()) {
      const newNote = {
        id: Date.now(),
        date: new Date().toISOString(),
        note: currentNote.note
      };

      setPatientNotes(prev => ({
        ...prev,
        [currentNote.patientId]: [
          newNote,
          ...(prev[currentNote.patientId] || [])
        ]
      }));

      setShowNoteModal(false);
      setCurrentNote({ patientId: null, note: '' });
    }
  };

  const renderCalendarHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCalendarView('month')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            calendarView === 'month' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Mes
        </button>
        <button
          onClick={() => setCalendarView('week')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            calendarView === 'week' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => setCalendarView('day')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            calendarView === 'day' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Día
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            const newDate = new Date(calendarDate);
            newDate.setMonth(newDate.getMonth() - 1);
            setCalendarDate(newDate);
          }}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={() => setCalendarDate(new Date())}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Hoy
        </button>
        <button
          onClick={() => {
            const newDate = new Date(calendarDate);
            newDate.setMonth(newDate.getMonth() + 1);
            setCalendarDate(newDate);
          }}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  const renderDayView = () => {
    const dayAppointments = appointments.filter(
      app => new Date(app.appointmentDateTime).toDateString() === calendarDate.toDateString()
    );

    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {calendarDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
        <div className="space-y-4">
          {dayAppointments.length > 0 ? (
            dayAppointments.map(app => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{app.patientName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(app.appointmentDateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {app.serviceType}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddNote(app.patientId)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentColorClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No hay citas programadas para este día</p>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(calendarDate);
    startOfWeek.setDate(calendarDate.getDate() - calendarDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="bg-white p-4"
            >
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </p>
                <p className="text-lg font-semibold text-gray-600">
                  {day.getDate()}
                </p>
              </div>
              <div className="mt-2 space-y-1">
                {appointments
                  .filter(app => new Date(app.appointmentDateTime).toDateString() === day.toDateString())
                  .map(app => (
                    <div
                      key={app.id}
                      className={`px-2 py-1 rounded text-xs ${getAppointmentColorClass(app.status)}`}
                    >
                      <p className="font-medium truncate">{app.patientName}</p>
                      <p className="text-xs">
                        {new Date(app.appointmentDateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendar = () => (
    <div className="space-y-6">
      {renderCalendarHeader()}
      {calendarView === 'month' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            className="w-full"
            tileContent={tileContent}
            tileClassName={tileClassName}
          />
        </div>
      )}
      {calendarView === 'week' && renderWeekView()}
      {calendarView === 'day' && renderDayView()}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Próximas Citas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Próximas Citas</h3>
          <CalendarIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          {appointments.slice(0, 3).map(appointment => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{appointment.patientName}</p>
                <p className="text-sm text-gray-500">{appointment.serviceType}</p>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAppointmentColorClass(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Estadísticas Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
          <ChartBarIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Citas de hoy</p>
            <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pacientes activos</p>
            <p className="text-2xl font-semibold text-gray-900">{patients.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Pacientes Recientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pacientes Recientes</h3>
          <UserGroupIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          {patients.slice(0, 3).map(patient => (
            <div key={patient.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                <p className="text-sm text-gray-500">{patient.treatment}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progreso</div>
                <div className="text-sm font-medium text-primary">{patient.progress}%</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recursos Educativos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recursos Educativos</h3>
          <AcademicCapIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Materiales para Pacientes</h4>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Guía de cuidado dental
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <VideoCameraIcon className="h-4 w-4 mr-2" />
                Videos instructivos
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Consejos post-tratamiento
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderPatients = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Mis Pacientes</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {patients.map((patient) => (
          <div key={patient.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-500">{patient.treatment}</p>
                <p className="text-sm text-gray-500">
                  Próxima cita: {new Date(patient.nextAppointment).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPatientModal(true);
                  }}
                  className="text-primary hover:text-primary-dark"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Progreso del tratamiento</span>
                <span className="text-sm font-medium text-primary">{patient.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${patient.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHelpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {helpContent[activeTab]?.title || 'Ayuda'}
          </h3>
          <button
            onClick={() => setShowHelpModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {helpContent[activeTab]?.content.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {index + 1}
                </div>
              </div>
              <p className="ml-3 text-gray-600">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">
            ¿Necesitas más ayuda? Contacta a soporte:
            <a href="mailto:soporte@orthowhite.com" className="text-primary hover:text-primary-dark ml-1">
              soporte@orthowhite.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recursos Educativos</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Buscar recursos..."
                className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Materiales para Pacientes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Materiales para Pacientes</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Guías de higiene dental</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Cuidados post-tratamiento</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Dietas recomendadas</a>
              </li>
            </ul>
          </div>
          {/* Recursos Profesionales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Recursos Profesionales</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Casos clínicos</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Actualizaciones técnicas</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Webinars</a>
              </li>
            </ul>
          </div>
          {/* Herramientas de Comunicación */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Comunicación</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Plantillas de comunicación</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Material visual explicativo</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Presentaciones educativas</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Videos educativos */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Videos Educativos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded-lg"></div>
            <h4 className="font-medium text-gray-900">Técnicas de higiene dental</h4>
            <p className="text-sm text-gray-500 mt-1">Para compartir con pacientes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded-lg"></div>
            <h4 className="font-medium text-gray-900">Actualización en ortodoncia</h4>
            <p className="text-sm text-gray-500 mt-1">Webinar profesional</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Documentos</h3>
          <button
            onClick={() => {}}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Nuevo Documento
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.type} - {doc.size}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="Orto White"
                />
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'overview'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChartPieIcon className="h-5 w-5 mr-2" />
              Vista General
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'patients'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UserCircleIcon className="h-5 w-5 mr-2" />
              Pacientes
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'calendar'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Calendario
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'documents'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Documentos
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'patients' && renderPatients()}
            {activeTab === 'calendar' && renderCalendar()}
            {activeTab === 'documents' && renderDocuments()}
          </div>
        </div>
      </div>

      {showHelpModal && renderHelpModal()}
      {showPatientModal && selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          isOpen={showPatientModal}
          onClose={() => setShowPatientModal(false)}
        />
      )}
      {showNoteModal && selectedAppointment && (
        <AppointmentNoteModal
          appointment={selectedAppointment}
          isOpen={showNoteModal}
          onClose={() => setShowNoteModal(false)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard; 