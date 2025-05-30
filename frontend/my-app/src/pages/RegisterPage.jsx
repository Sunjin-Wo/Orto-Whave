import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../services/api';

// URL base de la API (usa la variable de entorno o la URL por defecto)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userId, setUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [debugVerificationCode, setDebugVerificationCode] = useState('');

  useEffect(() => {
    // Asegurarnos de que el scroll se ejecute después de que el componente se monte
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Usamos 'instant' en lugar de 'smooth' para un scroll inmediato
      });
    }, 100);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });
      
      toast.success('¡Registro exitoso! Por favor revisa tu correo para verificar tu cuenta.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        })
      });
      
      if (response.ok) {
        toast.success('Correo verificado exitosamente');
        
        // Intentar iniciar sesión automáticamente
        try {
          const tempPassword = localStorage.getItem(`temp_pwd_${formData.email}`);
          if (tempPassword) {
            const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: formData.email,
                password: tempPassword
              })
            });
            
            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              // Almacenar token y datos del usuario
              localStorage.setItem('token', loginData.token);
              localStorage.setItem('user', JSON.stringify({
                id: loginData.id,
                name: loginData.name,
                email: loginData.email,
                role: loginData.role
              }));
              
              // Eliminar contraseña temporal
              localStorage.removeItem(`temp_pwd_${formData.email}`);
              
              // Redirigir según el rol
              if (loginData.role === 'ROLE_USER') {
                navigate('/profile');
              } else {
                navigate('/login');
              }
            } else {
              navigate('/login');
            }
          } else {
            navigate('/login');
          }
        } catch (loginError) {
          console.error("Error al intentar login automático:", loginError);
          navigate('/login');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Código de verificación inválido');
        toast.error(errorData.message || 'Código de verificación inválido');
      }
    } catch (error) {
      console.error("Error completo:", error);
      setError('Error en la conexión con el servidor');
      toast.error('Error en la conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email
        })
      });
      
      if (response.ok) {
        toast.success('Código reenviado. Revisa tu correo electrónico');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al reenviar el código');
        toast.error(errorData.message || 'Error al reenviar el código');
      }
    } catch (error) {
      console.error("Error completo:", error);
      setError('Error en la conexión con el servidor');
      toast.error('Error en la conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link 
            to="/" 
            className="flex items-center text-primary hover:text-primary-dark mb-6 ml-4 transition duration-150 ease-in-out"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Volver al inicio
          </Link>
          
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
            Crear una cuenta
          </h2>
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/login" 
              className="font-medium text-primary hover:text-primary-dark transition duration-150 ease-in-out"
              onClick={() => {
                setTimeout(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'instant'
                  });
                }, 100);
              }}
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
            {error && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            {isVerifying ? (
              <form className="space-y-6" onSubmit={handleVerifyCode}>
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                    Código de verificación
                  </label>
                  <div className="mt-1">
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Ingresa el código de 6 dígitos"
                    />
                  </div>
                  
                  {/* Mostrar el código de verificación en modo desarrollo para facilitar pruebas */}
                  {debugVerificationCode && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                      <p>Código de desarrollo: <strong>{debugVerificationCode}</strong> (solo visible en entorno de desarrollo)</p>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Verificando...' : 'Verificar correo'}
                  </button>
                </div>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    ¿No recibiste el código? Reenviar
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Apellido
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <div className="mt-1">
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Registrarse'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage; 