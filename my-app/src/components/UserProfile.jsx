import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, UserIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      // Caso especial para el usuario de ejemplo paciente@ejemplo.com
      if (user.email === 'paciente@ejemplo.com') {
        // Crear datos de ejemplo para el paciente
        setUserInfo({
          id: 999,
          firstName: 'Paciente',
          lastName: 'Ejemplo',
          email: 'paciente@ejemplo.com',
          documentType: 'CC',
          documentId: '1234567890',
          phone: '3001234567',
          address: 'Calle 123 #45-67',
          birthDate: '1990-01-01'
        });
        
        // Crear citas de ejemplo
        setAppointments([
          {
            id: 1,
            serviceType: 'Consulta Inicial',
            appointmentDateTime: new Date(Date.now() + 86400000).toISOString(), // mañana
            status: 'Confirmada',
            notes: 'Primera consulta para evaluación',
            doctorName: 'Dr. Juan Pérez'
          },
          {
            id: 2,
            serviceType: 'Control de Brackets',
            appointmentDateTime: new Date(Date.now() + 604800000).toISOString(), // en una semana
            status: 'Pendiente',
            notes: 'Ajuste mensual de brackets',
            doctorName: 'Dra. María Rodríguez'
          }
        ]);
        
        setLoading(false);
        return;
      }
      
      try {
        // Obtener información del usuario
        const userResponse = await fetch(`http://localhost:8080/api/patients/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserInfo(userData);
          
          // Obtener citas del usuario
          const appointmentsResponse = await fetch(`http://localhost:8080/api/appointments/patient/${userData.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (appointmentsResponse.ok) {
            const appointmentsData = await appointmentsResponse.json();
            setAppointments(appointmentsData);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('profile')}
          >
            Información Personal
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'appointments' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('appointments')}
          >
            Mis Citas
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {userInfo ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{userInfo.firstName} {userInfo.lastName}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-400 mr-2">#</span>
                        <span>{userInfo.documentType}: {userInfo.documentId}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-400 mr-2">@</span>
                        <span>{userInfo.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-400 mr-2">📱</span>
                        <span>{userInfo.phone}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-400 mr-2">🏠</span>
                        <span>{userInfo.address || 'No registrada'}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{userInfo.birthDate ? new Date(userInfo.birthDate).toLocaleDateString('es-ES') : 'No registrada'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No se encontró información del perfil.</p>
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Completar mi perfil
                  </button>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'appointments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {appointments.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Próximas citas</h3>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{appointment.serviceType}</h4>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>{formatDate(appointment.appointmentDateTime)}</span>
                            </div>
                            {appointment.doctorName && (
                              <div className="flex items-center mt-2 text-sm text-gray-600">
                                <UserIcon className="h-4 w-4 mr-1" />
                                <span>{appointment.doctorName}</span>
                              </div>
                            )}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            appointment.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-3 text-sm text-gray-600">
                            <p className="font-medium">Notas:</p>
                            <p>{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes citas programadas.</p>
                  <a href="#contacto" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Agendar una cita
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 