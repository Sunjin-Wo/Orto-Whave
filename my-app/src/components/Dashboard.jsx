import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { XMarkIcon, Bars3Icon, ChartBarIcon, CalendarIcon, BellIcon, UserGroupIcon, CogIcon, PlusIcon } from '@heroicons/react/24/outline';
import UserManagement from './UserManagement';
import Settings from './Settings';

// Datos de ejemplo para las citas
const appointmentsData = [
  { id: 1, title: 'Consulta ortopédica', patient: 'Ana Martínez', time: '9:00 - 10:00', date: new Date(2025, 4, 9), type: 'consultation', color: 'blue' },
  { id: 2, title: 'Evaluación protésica', patient: 'Carlos Rodríguez', time: '11:30 - 12:30', date: new Date(2025, 4, 10), type: 'evaluation', color: 'green' },
  { id: 3, title: 'Terapia física', patient: 'María López', time: '14:00 - 15:00', date: new Date(2025, 4, 17), type: 'therapy', color: 'purple' },
  { id: 4, title: 'Control postoperatorio', patient: 'Juan Pérez', time: '16:30 - 17:15', date: new Date(2025, 4, 24), type: 'followup', color: 'red' },
  { id: 5, title: 'Entrega producto', patient: 'Laura Gómez', time: '10:00 - 10:30', date: new Date(2025, 4, 31), type: 'delivery', color: 'yellow' },
];

const Dashboard = () => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [appointments, setAppointments] = useState(appointmentsData);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
  };

  const toggleCalendarView = () => {
    setActiveView(activeView === 'calendar' ? 'dashboard' : 'calendar');
    if (activeView !== 'calendar') {
      setIsOffcanvasOpen(false);
    }
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => 
      app.date.getDate() === date.getDate() &&
      app.date.getMonth() === date.getMonth() &&
      app.date.getFullYear() === date.getFullYear()
    );
  };

  const getAppointmentColor = (type) => {
    const colors = {
      consultation: 'bg-blue-100 text-blue-600 border-blue-300',
      evaluation: 'bg-green-100 text-green-600 border-green-300',
      therapy: 'bg-purple-100 text-purple-600 border-purple-300',
      followup: 'bg-red-100 text-red-600 border-red-300',
      delivery: 'bg-yellow-100 text-yellow-600 border-yellow-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-600 border-gray-300';
  };

  const hasAppointments = (date) => {
    return appointments.some(app => 
      app.date.getDate() === date.getDate() &&
      app.date.getMonth() === date.getMonth() &&
      app.date.getFullYear() === date.getFullYear()
    );
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

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments
      .filter(app => app.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 3);
  };

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('es-ES', options);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'calendar':
        return (
          <div className="w-[95%] mx-auto py-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1 rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:border-primary"
                    onClick={() => setDate(new Date())}
                  >
                    Hoy
                  </button>
                  <button 
                    className="p-1 rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:border-primary"
                    onClick={() => {
                      const prevMonth = new Date(date);
                      prevMonth.setMonth(prevMonth.getMonth() - 1);
                      setDate(prevMonth);
                    }}
                  >
                    &lt;
                  </button>
                  <button 
                    className="p-1 rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:border-primary"
                    onClick={() => {
                      const nextMonth = new Date(date);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setDate(nextMonth);
                    }}
                  >
                    &gt;
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900 ml-2">
                    {date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </h2>
                </div>
                <div>
                  <button className="flex items-center space-x-1 text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full text-sm font-medium">
                    <PlusIcon className="h-4 w-4" />
                    <span>Nueva cita</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                {/* Calendario completo con mayor tamaño */}
                <div className="calendar-full-view">
                  <Calendar 
                    onChange={handleDateChange} 
                    value={date} 
                    className="w-full border-0" 
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                  />
                </div>
                
                {/* Detalles de las citas del día seleccionado */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Citas para {selectedDate ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  
                  <div className="space-y-3">
                    {getAppointmentsForDate(selectedDate || date).length > 0 ? (
                      getAppointmentsForDate(selectedDate || date).map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className={`p-4 rounded-lg border-l-4 shadow-sm ${getAppointmentColor(appointment.type)}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{appointment.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{appointment.time}</p>
                              <p className="text-sm font-medium mt-2">Paciente: {appointment.patient}</p>
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
        );
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">
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
                    {[35, 55, 40, 65, 70, 55, 80, 60, 75, 65, 70, 90].map((value, index) => (
                      <div key={index} className="h-full flex-1 flex flex-col justify-end">
                        <div 
                          className="bg-gradient-to-t from-primary to-blue-400 rounded-t"
                          style={{ height: `${value}%` }}
                        ></div>
                        <div className="text-xs text-gray-500 text-center mt-1">
                          {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][index]}
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
                        <div className={`p-2 rounded-md ${appointment.type === 'consultation' ? 'bg-blue-100' : 
                                                        appointment.type === 'evaluation' ? 'bg-green-100' : 
                                                        appointment.type === 'therapy' ? 'bg-purple-100' : 
                                                        appointment.type === 'followup' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                          <CalendarIcon className={`h-5 w-5 ${appointment.type === 'consultation' ? 'text-blue-600' : 
                                                             appointment.type === 'evaluation' ? 'text-green-600' : 
                                                             appointment.type === 'therapy' ? 'text-purple-600' : 
                                                             appointment.type === 'followup' ? 'text-red-600' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{appointment.title}</h4>
                          <p className="text-xs text-gray-500">{formatDate(appointment.date)}, {appointment.time}</p>
                          <p className="text-xs text-gray-600 mt-1">{appointment.patient}</p>
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
                  <button className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                    <span className="block font-medium text-gray-900">Agregar producto</span>
                    <span className="text-xs text-gray-500">Nuevo inventario</span>
                  </button>
                  <button className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
                    <span className="block font-medium text-gray-900">Crear factura</span>
                    <span className="text-xs text-gray-500">Nueva venta</span>
                  </button>
                  <button 
                    className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                    onClick={toggleCalendarView}
                  >
                    <span className="block font-medium text-gray-900">Gestionar citas</span>
                    <span className="text-xs text-gray-500">Calendario</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActiveView('settings');
                      setIsOffcanvasOpen(false);
                    }}
                    className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <span className="block font-medium text-gray-900">Configuración</span>
                    <span className="text-xs text-gray-500">Preferencias</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setIsOffcanvasOpen(true)}
              className="p-2 mr-3 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeView === 'calendar' ? 'Calendario' : 
               activeView === 'users' ? 'Usuarios' :
               activeView === 'settings' ? 'Configuración' : 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-primary relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <button className="flex items-center text-gray-700 hover:text-primary">
                <span className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  R
                </span>
              </button>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-dark transition-colors text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      
      {/* Offcanvas sidebar */}
      <div className={`fixed inset-0 z-40 ${isOffcanvasOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOffcanvasOpen(false)}></div>
        <motion.div 
          className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg"
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-primary">OrtoWhite</span>
              <button onClick={() => setIsOffcanvasOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col space-y-6">
              <button 
                className={`flex items-center space-x-3 text-left ${activeView === 'dashboard' ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
                onClick={() => {
                  setActiveView('dashboard');
                  setIsOffcanvasOpen(false);
                }}
              >
                <ChartBarIcon className="h-6 w-6" />
                <span className="text-base">Estadísticas</span>
              </button>
              <button 
                className={`flex items-center space-x-3 text-left ${activeView === 'calendar' ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
                onClick={() => {
                  setActiveView('calendar');
                  setIsOffcanvasOpen(false);
                }}
              >
                <CalendarIcon className="h-6 w-6" />
                <span className="text-base">Calendario</span>
              </button>
              <button 
                className={`flex items-center space-x-3 text-left ${activeView === 'users' ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
                onClick={() => {
                  setActiveView('users');
                  setIsOffcanvasOpen(false);
                }}
              >
                <UserGroupIcon className="h-6 w-6" />
                <span className="text-base">Usuarios</span>
              </button>
              <button 
                className={`flex items-center space-x-3 text-left ${activeView === 'settings' ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
                onClick={() => {
                  setActiveView('settings');
                  setIsOffcanvasOpen(false);
                }}
              >
                <CogIcon className="h-6 w-6" />
                <span className="text-base">Configuración</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard; 