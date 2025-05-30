import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    window.scrollTo(0, 0);
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

    try {
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });
      
      toast.success('¡Registro exitoso! Por favor inicia sesión.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex items-center text-primary hover:text-primary-dark mb-6 ml-4">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Volver al inicio
          </Link>
          
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isVerifying ? 'Verificar correo electrónico' : 'Crear una cuenta'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isVerifying ? 
              'Te hemos enviado un código de verificación a tu correo' : 
              <>¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                  Inicia sesión
                </Link>
              </>
            }
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Apellido"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Correo Electrónico"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Número de Teléfono"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Confirmar Contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Registrarse
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