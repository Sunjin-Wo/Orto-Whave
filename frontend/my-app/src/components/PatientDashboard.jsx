import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  DocumentTextIcon,
  UserCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  DocumentIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import AppointmentForm from './appointments/AppointmentForm';
import MedicalHistoryView from './medical/MedicalHistoryView';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [treatmentProgress, setTreatmentProgress] = useState({
    totalSteps: 10,
    completedSteps: 4,
    nextAppointment: '2024-03-20',
    currentPhase: 'Alineación inicial',
    estimatedCompletion: '2024-12-15'
  });
  const [savedArticles, setSavedArticles] = useState([
    {
      id: 1,
      title: 'Cuidados post tratamiento ortodóntico',
      category: 'Ortodoncia',
      date: '2024-03-15'
    },
    {
      id: 2,
      title: 'Guía de higiene dental',
      category: 'Cuidado Dental',
      date: '2024-03-10'
    }
  ]);

  const helpContent = {
    overview: {
      title: 'Vista General',
      content: [
        'Aquí encontrarás un resumen de tu tratamiento actual',
        'Puedes ver tu progreso y próximas citas',
        'Accede rápidamente a tus documentos recientes',
        'Revisa tu historial médico actualizado'
      ]
    },
    appointments: {
      title: 'Mis Citas',
      content: [
        'Agenda nuevas citas médicas',
        'Visualiza tus citas programadas',
        'Recibe recordatorios de próximas citas',
        'Cancela o reprograma citas existentes'
      ]
    },
    history: {
      title: 'Historial Médico',
      content: [
        'Consulta tu historial de tratamientos',
        'Revisa diagnósticos anteriores',
        'Accede a notas médicas importantes',
        'Visualiza tu progreso a lo largo del tiempo'
      ]
    },
    documents: {
      title: 'Documentos',
      content: [
        'Accede a tus radiografías y exámenes',
        'Descarga recetas médicas',
        'Guarda documentos importantes',
        'Comparte documentos con tu doctor'
      ]
    },
    education: {
      title: 'Educación y Recursos',
      content: [
        'Accede a artículos educativos',
        'Guarda recursos para consulta posterior',
        'Aprende sobre cuidados dentales',
        'Consulta guías de tratamiento'
      ]
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Simulación de carga de datos
    const mockAppointments = [
      {
        id: 1,
        date: '2024-03-15T10:00:00',
        doctorName: 'Dr. Juan Pérez',
        specialty: 'Ortopedia',
        status: 'Programada',
        type: 'Control'
      },
      {
        id: 2,
        date: '2024-02-15T15:30:00',
        doctorName: 'Dr. Juan Pérez',
        specialty: 'Ortopedia',
        status: 'Completada',
        type: 'Control',
        notes: 'Progreso adecuado en el tratamiento'
      }
    ];

    const mockMedicalHistory = [
      {
        id: 1,
        date: '2024-02-15',
        doctorName: 'Dr. Juan Pérez',
        diagnosis: 'Progreso adecuado',
        treatment: 'Ajuste de brackets',
        notes: 'Continuar con el mismo tratamiento'
      },
      {
        id: 2,
        date: '2024-01-15',
        doctorName: 'Dr. Juan Pérez',
        diagnosis: 'Maloclusión clase II',
        treatment: 'Inicio de tratamiento con brackets metálicos',
        notes: 'Se inicia tratamiento de ortodoncia'
      }
    ];

    const mockDocuments = [
      {
        id: 1,
        name: 'Radiografía Panorámica',
        date: '2024-02-15',
        type: 'Imagen',
        url: '/documents/radiografia.pdf'
      },
      {
        id: 2,
        name: 'Receta Médica',
        date: '2024-02-15',
        type: 'Receta',
        url: '/documents/receta.pdf'
      }
    ];

    setAppointments(mockAppointments);
    setMedicalHistory(mockMedicalHistory);
    setDocuments(mockDocuments);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Programada': 'bg-blue-100 text-blue-800',
      'Completada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const renderHelpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
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
            ¿Necesitas más ayuda? Contacta a nuestro equipo de soporte:
            <a href="mailto:soporte@orthowhite.com" className="text-primary hover:text-primary-dark ml-1">
              soporte@orthowhite.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Progreso del tratamiento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progreso del Tratamiento</h3>
          <ChartPieIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso General</span>
              <span className="text-sm font-medium text-primary">
                {Math.round((treatmentProgress.completedSteps / treatmentProgress.totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${(treatmentProgress.completedSteps / treatmentProgress.totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fase Actual</p>
              <p className="font-medium text-gray-900">{treatmentProgress.currentPhase}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Próxima Cita</p>
              <p className="font-medium text-gray-900">
                {new Date(treatmentProgress.nextAppointment).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resumen Médico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resumen Médico</h3>
          <DocumentTextIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Última consulta</p>
            <p className="font-medium text-gray-900">
              {medicalHistory.length > 0 ? new Date(medicalHistory[0].date).toLocaleDateString() : 'Sin consultas previas'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Diagnóstico actual</p>
            <p className="font-medium text-gray-900">
              {medicalHistory.length > 0 ? medicalHistory[0].diagnosis : 'Sin diagnóstico'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Documentos Recientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Documentos Recientes</h3>
          <DocumentIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          {documents.slice(0, 3).map(doc => (
            <div key={doc.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{doc.name}</p>
                <p className="text-sm text-gray-500">{new Date(doc.date).toLocaleDateString()}</p>
              </div>
              <a
                href={doc.url}
                className="text-primary hover:text-primary-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver
              </a>
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
          <h3 className="text-lg font-semibold text-gray-900">Recursos Guardados</h3>
          <BookmarkIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          {savedArticles.map(article => (
            <div key={article.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{article.title}</p>
                <p className="text-sm text-gray-500">{article.category}</p>
              </div>
              <button className="text-primary hover:text-primary-dark">
                Leer
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAppointments = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Mis Citas</h3>
          <button
            onClick={() => setIsAppointmentFormOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Agendar Cita
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                <p className="text-sm text-gray-500">{appointment.specialty}</p>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            {appointment.notes && (
              <p className="mt-2 text-sm text-gray-600">{appointment.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Historial Médico</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {medicalHistory.map((record) => (
          <div key={record.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">{record.doctorName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(record.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Diagnóstico</p>
                <p className="text-gray-900">{record.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tratamiento</p>
                <p className="text-gray-900">{record.treatment}</p>
              </div>
              {record.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notas</p>
                  <p className="text-gray-900">{record.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
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
            Agregar Documento
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {documents.map((doc) => (
          <div key={doc.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{doc.name}</p>
                <p className="text-sm text-gray-500">{new Date(doc.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => window.open(doc.url, '_blank')}
                className="text-primary hover:text-primary-dark"
              >
                Ver
              </button>
            </div>
          </div>
        ))}
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
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Categorías de recursos */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Cuidado Dental</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Higiene dental diaria</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Técnicas de cepillado</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Uso del hilo dental</a>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Tratamientos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Guía de ortodoncia</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Cuidados post-tratamiento</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">FAQs sobre brackets</a>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Nutrición</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Alimentos recomendados</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Qué evitar durante el tratamiento</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Dieta saludable</a>
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
            <h4 className="font-medium text-gray-900">Guía de higiene con brackets</h4>
            <p className="text-sm text-gray-500 mt-1">Aprende las técnicas correctas de limpieza</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded-lg"></div>
            <h4 className="font-medium text-gray-900">Proceso de alineación dental</h4>
            <p className="text-sm text-gray-500 mt-1">Conoce las etapas del tratamiento</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                onClick={handleLogout}
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
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'appointments'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Citas
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'history'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              Historial
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
            <button
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'education'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Educación
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'appointments' && renderAppointments()}
            {activeTab === 'history' && renderHistory()}
            {activeTab === 'documents' && renderDocuments()}
            {activeTab === 'education' && renderEducation()}
          </div>
        </div>
      </div>

      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Centro de Ayuda
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
            <div className="prose prose-sm max-w-none">
              {helpContent[activeTab]}
            </div>
          </div>
        </div>
      )}

      {isAppointmentFormOpen && (
        <AppointmentForm
          isOpen={isAppointmentFormOpen}
          onClose={() => setIsAppointmentFormOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientDashboard; 