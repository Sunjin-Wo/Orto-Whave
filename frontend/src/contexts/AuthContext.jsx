import React, { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Definir estado inicial
const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  loading: false,
  error: null,
};

// Crear contexto
const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// Definir reducer para manejar estados de autenticación
const reducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_INIT': {
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    }
    case 'LOGIN_REQUEST': {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case 'LOGIN_SUCCESS': {
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
      };
    }
    case 'LOGIN_FAILURE': {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }
    case 'REGISTER_REQUEST': {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case 'REGISTER_SUCCESS': {
      return {
        ...state,
        loading: false,
      };
    }
    case 'REGISTER_FAILURE': {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    case 'CLEAR_ERROR': {
      return {
        ...state,
        error: null,
      };
    }
    default: {
      return state;
    }
  }
};

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/check`);
          
          dispatch({
            type: 'AUTH_INIT',
            payload: {
              isAuthenticated: true,
              user: response.data,
            },
          });
        } else {
          dispatch({
            type: 'AUTH_INIT',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common.Authorization;
        
        dispatch({
          type: 'AUTH_INIT',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user },
      });
      
      return { success: true, user };
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { 
          error: error.response?.data?.message || 'Error al iniciar sesión'
        },
      });
      
      // Verificar si el error es porque el usuario no ha verificado su email
      if (error.response?.data?.needsVerification) {
        return { 
          success: false, 
          needsVerification: true,
          email
        };
      }
      
      return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, userData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
      });
      
      // Redirigir a la página de verificación
      navigate('/auth/verify-email', { 
        state: { 
          email: userData.email,
          registered: true
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: { 
          error: error.response?.data?.message || 'Error al registrar usuario'
        },
      });
      
      return { success: false, error: error.response?.data?.message || 'Error al registrar usuario' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
    
    dispatch({ type: 'LOGOUT' });
    navigate('/auth/login');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 