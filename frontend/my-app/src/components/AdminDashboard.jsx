import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  StarIcon,
  TrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import UserForm from './users/UserForm';
import SettingsModal from './SettingsModal';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    appointmentsToday: 0,
    revenue: 0,
    revenueGrowth: 15, // Porcentaje de crecimiento
    patientSatisfaction: 4.5,
    totalReviews: 128
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [financialData, setFinancialData] = useState({
    monthlyRevenue: [
      { month: 'Ene', amount: 12500000 },
      { month: 'Feb', amount: 15000000 },
      { month: 'Mar', amount: 17500000 }
    ],
    serviceRevenue: [
      { service: 'Ortodoncia', amount: 25000000, percentage: 45 },
      { service: 'Implantes', amount: 15000000, percentage: 27 },
      { service: 'Limpieza', amount: 8000000, percentage: 15 },
      { service: 'Otros', amount: 7000000, percentage: 13 }
    ],
    recentTransactions: [
      { id: 1, patient: 'María González', service: 'Ortodoncia', amount: 500000, date: '2024-03-15' },
      { id: 2, patient: 'Carlos Rodríguez', service: 'Limpieza', amount: 150000, date: '2024-03-14' },
      { id: 3, patient: 'Ana Martínez', service: 'Implantes', amount: 2000000, date: '2024-03-13' }
    ]
  });
  const [satisfactionData, setSatisfactionData] = useState({
    overall: 4.5,
    totalReviews: 128,
    categories: [
      { name: 'Atención', rating: 4.8 },
      { name: 'Puntualidad', rating: 4.3 },
      { name: 'Instalaciones', rating: 4.6 },
      { name: 'Precio', rating: 4.2 }
    ],
    recentReviews: [
      { id: 1, patient: 'María González', rating: 5, comment: 'Excelente servicio y atención', date: '2024-03-15' },
      { id: 2, patient: 'Carlos Rodríguez', rating: 4, comment: 'Muy buen servicio, pero la espera fue un poco larga', date: '2024-03-14' }
    ]
  });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const helpContent = {
    overview: {
      title: 'Vista General',
      content: [
        'Visualiza métricas clave del negocio',
        'Monitorea ingresos y estadísticas',
        'Revisa el rendimiento de la clínica',
        'Accede a reportes importantes'
      ]
    },
    staff: {
      title: 'Personal',
      content: [
        'Gestiona el personal médico',
        'Revisa horarios y disponibilidad',
        'Administra permisos y accesos',
        'Evalúa el desempeño del equipo'
      ]
    },
    patients: {
      title: 'Pacientes',
      content: [
        'Administra la base de datos de pacientes',
        'Revisa historiales y tratamientos',
        'Gestiona citas y seguimientos',
        'Analiza satisfacción del paciente'
      ]
    },
    finance: {
      title: 'Finanzas',
      content: [
        'Monitorea ingresos y gastos',
        'Gestiona facturación y pagos',
        'Analiza reportes financieros',
        'Controla presupuestos'
      ]
    },
    settings: {
      title: 'Configuración',
      content: [
        'Configura parámetros del sistema',
        'Gestiona roles y permisos',
        'Personaliza la plataforma',
        'Administra integraciones'
      ]
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Simulación de carga de datos
    const mockUsers = [
      {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        role: 'ROLE_DOCTOR',
        specialty: 'Ortopedia',
        status: 'Activo',
        lastActive: '2024-03-10T10:30:00'
      },
      {
        id: 2,
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@ejemplo.com',
        role: 'ROLE_PATIENT',
        status: 'Activo',
        lastActive: '2024-03-09T15:45:00'
      }
    ];

    const mockAppointments = [
      {
        id: 1,
        patientName: 'María González',
        doctorName: 'Dr. Juan Pérez',
        date: '2024-03-15T10:00:00',
        status: 'Confirmada',
        type: 'Control'
      }
    ];

    const mockNotifications = [
      {
        id: 1,
        type: 'new_user',
        message: 'Nuevo usuario registrado: Carlos Rodríguez',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];

    setUsers(mockUsers);
    setAppointments(mockAppointments);
    setNotifications(mockNotifications);
    setStats({
      totalPatients: 150,
      totalDoctors: 8,
      appointmentsToday: 25,
      revenue: 15000000,
      revenueGrowth: 15,
      patientSatisfaction: 4.5,
      totalReviews: 128
    });
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Activo': 'bg-green-100 text-green-800',
      'Inactivo': 'bg-red-100 text-red-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role) => {
    const colors = {
      'ROLE_ADMIN': 'bg-purple-100 text-purple-800',
      'ROLE_DOCTOR': 'bg-blue-100 text-blue-800',
      'ROLE_PATIENT': 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const handleCreateUser = (userData) => {
    console.log('Crear usuario:', userData);
    setIsUserFormOpen(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleUpdateUser = (userData) => {
    console.log('Actualizar usuario:', userData);
    setIsUserFormOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Aquí iría la lógica para eliminar el usuario
      console.log('Eliminando usuario:', userId);
      // Actualizar la lista de usuarios después de eliminar
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Estadísticas principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pacientes</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalPatients}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Doctores</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ingresos Totales</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</h3>
                <div className="ml-2 flex items-center text-green-600">
                  <ArrowUpIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{stats.revenueGrowth}%</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Satisfacción</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold text-gray-900">{stats.patientSatisfaction}</h3>
                <div className="ml-2">
                  {renderStarRating(stats.patientSatisfaction)}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{stats.totalReviews} reseñas</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos y estadísticas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos por Servicio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos por Servicio</h3>
            <ChartPieIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            {financialData.serviceRevenue.map((item) => (
              <div key={item.service}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{item.service}</span>
                  <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Satisfacción del Paciente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Satisfacción del Paciente</h3>
            <StarIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            {satisfactionData.categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{category.name}</span>
                  <div className="flex items-center">
                    {renderStarRating(category.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Últimas Transacciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Últimas Transacciones</h3>
            <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.patient}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{transaction.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuario..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Actividad
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role.replace('ROLE_', '')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastActive).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-primary hover:text-primary/80 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración del Sistema</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Horario de Atención</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de apertura</label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue="08:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de cierre</label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  defaultValue="18:00"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Notificaciones</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Recordatorios de citas</p>
                  <p className="text-sm text-gray-500">Enviar recordatorios automáticos a los pacientes</p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Confirmaciones por email</p>
                  <p className="text-sm text-gray-500">Enviar confirmaciones automáticas por email</p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Respaldo de Datos</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Último respaldo: 10 de marzo, 2024 23:00</p>
                <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Realizar Respaldo Manual
                </button>
              </div>
            </div>
          </div>
        </div>
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

  const renderStaff = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Personal Médico</h3>
          <button
            onClick={() => {}}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Agregar Personal
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {users.map((doctor) => (
          <div key={doctor.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</p>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{doctor.patients} pacientes</div>
                <div className="text-sm font-medium text-primary">{doctor.rating} ★</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Pacientes</h3>
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
        {users.map((patient) => (
          <div key={patient.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                <p className="text-sm text-gray-500">{patient.treatment}</p>
                <p className="text-sm text-gray-500">
                  Próxima cita: {new Date(patient.nextAppointment).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progreso</div>
                <div className="text-sm font-medium text-primary">{patient.progress}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Resumen Financiero</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Ingresos del Mes</p>
              <p className="text-2xl font-semibold text-gray-900">$12.5M</p>
              <p className="text-xs text-green-600">+8% vs mes anterior</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Gastos del Mes</p>
              <p className="text-2xl font-semibold text-gray-900">$8.2M</p>
              <p className="text-xs text-red-600">+12% vs mes anterior</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Margen Operativo</p>
              <p className="text-2xl font-semibold text-gray-900">34.4%</p>
              <p className="text-xs text-yellow-600">-2% vs mes anterior</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Citas Facturadas</p>
              <p className="text-2xl font-semibold text-gray-900">142</p>
              <p className="text-xs text-green-600">+15% vs mes anterior</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Distribución de Ingresos</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Ortodoncia</span>
                <span className="text-sm font-medium text-gray-900">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Implantes</span>
                <span className="text-sm font-medium text-gray-900">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Otros</span>
                <span className="text-sm font-medium text-gray-900">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
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
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'staff'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Personal
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
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'finance'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              Finanzas
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'settings'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Configuración
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'staff' && renderStaff()}
            {activeTab === 'patients' && renderPatients()}
            {activeTab === 'finance' && renderFinance()}
            {activeTab === 'settings' && renderSettings()}
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

      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 