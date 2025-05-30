import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

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
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      if (error.message && error.message.includes('needsVerification')) {
        setNeedsVerification(true);
        toast.error('Por favor verifica tu correo electrónico antes de iniciar sesión');
      } else {
        setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        toast.error('Error al iniciar sesión');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-email', {
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
        setNeedsVerification(false);
        // Intentar iniciar sesión de nuevo
        await login(formData.email, formData.password, navigate);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Código de verificación inválido');
        toast.error(errorData.message || 'Código de verificación inválido');
      }
    } catch (error) {
      setError('Error en la conexión');
      toast.error('Error en la conexión');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendCode = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/resend-verification', {
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
      setError('Error en la conexión');
      toast.error('Error en la conexión');
    } finally {
      setIsSubmitting(false);
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
            Iniciar sesión
          </h2>
          <p className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/register" 
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
              Regístrate
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
            {error && (
              <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            {needsVerification ? (
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
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                  >
                    {(isSubmitting || loading) ? 'Verificando...' : 'Verificar correo'}
                  </button>
                </div>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isSubmitting || loading}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    ¿No recibiste el código? Reenviar
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Recordarme
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link 
                      to="/forgot-password" 
                      className="font-medium text-primary hover:text-primary-dark transition duration-150 ease-in-out"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out ${
                      (isSubmitting || loading) ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {(isSubmitting || loading) ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Iniciar sesión'
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

export default LoginPage; 