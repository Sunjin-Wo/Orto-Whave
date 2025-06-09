import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar el token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, email: userEmail, role, redirectUrl, success, message } = response.data;
      
      if (!success) {
        toast.error(message);
        throw new Error(message);
      }

      localStorage.setItem('token', token);
      setUser({ 
        email: userEmail, 
        role,
        redirectUrl 
      });
      
      toast.success(message || '¡Inicio de sesión exitoso!');
    } catch (error) {
      console.error('Error en login:', error);
      const message = error.response?.data?.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.';
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      toast.success('¡Registro exitoso! Por favor inicia sesión.');
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      const message = error.response?.data?.message || 'Error al registrarse';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Sesión cerrada exitosamente');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      setUser(response.data);
      toast.success('Perfil actualizado exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// HOC para envolver componentes que necesitan acceso a la navegación y autenticación
export const withAuthNavigation = (Component) => {
  return function WrappedComponent(props) {
    const auth = useAuth();
    return <Component {...props} auth={auth} />;
  };
}; 