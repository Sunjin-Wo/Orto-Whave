import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarIcon, 
  UserIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Panel del Doctor</h1>
          <div className="flex items-center">
            <span className="mr-4 text-gray-600">Dr. {user?.firstName || 'Doctor'} {user?.lastName || 'Ejemplo'}</span>
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
              <UserIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
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

        {/* Search bar */}
        <div className="mb-6 flex justify-between">
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

        {/* Tab content */}
        <div className="bg-white shadow rounded-lg p-6">
          {/* Appointments Tab */}
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

          {/* Patients Tab */}
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

          {/* Medical History Tab */}
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