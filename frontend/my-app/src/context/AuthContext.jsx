import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultAuthContext = {
  isAuthenticated: false,
  user: null,
  showAuthModal: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: () => {},
  logout: () => {}
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);
  
  const login = async (email, password, navigate) => {
    try {
      setLoading(true);
      console.log('Intento de inicio de sesión:', { email, password });
      
      // Realizar solicitud de inicio de sesión al backend
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // La API respondió correctamente, procesar la respuesta
          console.log('Respuesta de API de inicio de sesión:', data);
          
          if (data.token) {
            // Crear objeto de usuario con los datos de la respuesta
            const userData = {
              id: data.id,
              email: email,
              role: data.role,
              name: data.name,
              token: data.token
            };
            
            // Guardar el token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Establecer el usuario y la autenticación
            setUser(userData);
            setIsAuthenticated(true);
            
            // Cerrar el modal de autenticación si está abierto
            setShowAuthModal(false);
            
            // Redireccionar según el rol
            if (navigate) {
              switch (userData.role) {
                case 'ROLE_ADMIN':
                  navigate('/dashboard');
                  break;
                case 'ROLE_DOCTOR':
                  navigate('/doctor-dashboard');
                  break;
                case 'ROLE_STAFF':
                  navigate('/dashboard');
                  break;
                case 'ROLE_USER':
                default:
                  navigate('/profile');
                  break;
              }
            }
            
            return;
          }
        } else {
          console.log('Error en la respuesta de la API:', response.status, data);
          
          // Verificar si el error es por correo no verificado
          if (data.needsVerification) {
            throw new Error('needsVerification: Por favor verifica tu correo electrónico');
          }
            
          if (process.env.NODE_ENV === 'development') {
            console.log('Usando credenciales de prueba en desarrollo');
            // En modo desarrollo, permitir credenciales de prueba
            handleDevelopmentCredentials(email, password, navigate);
          } else {
            throw new Error('Credenciales inválidas');
          }
        }
      } catch (error) {
        // Verificar si el error es por correo no verificado (ya formateado)
        if (error.message && error.message.includes('needsVerification')) {
          throw error;
        }
        
        console.log('Error al conectar con la API:', error);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Usando credenciales de prueba en desarrollo');
          // En modo desarrollo, permitir credenciales de prueba
          handleDevelopmentCredentials(email, password, navigate);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      
      // Verificar si el error es por correo no verificado
      if (error.message && error.message.includes('needsVerification')) {
        throw error;
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setShowAuthModal(false);
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para usar credenciales de desarrollo (solo en modo desarrollo)
  const handleDevelopmentCredentials = (email, password, navigate) => {
    // Admin login simulation
    if (email === 'admin@ortowhave.co' && password === 'admin123') {
      console.log('Login como administrador (fallback de desarrollo)');
      
      // Crear objeto de usuario
      const userData = { 
        email, 
        role: 'ROLE_ADMIN',
        name: 'Admin OWH',
        id: 1
      };
      
      // Guardar el token y usuario en localStorage
      localStorage.setItem('token', 'admin_token_dev');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Establecer el usuario y la autenticación
      setUser(userData);
      setIsAuthenticated(true);
      
      // Cerrar el modal de autenticación si está abierto
      setShowAuthModal(false);
      
      // Redireccionar al dashboard de admin
      if (navigate) {
        navigate('/dashboard');
      }
    } 
    // Doctor login simulation
    else if (email === 'doctor@ortowhave.co' && password === 'doctor123') {
      console.log('Login como doctor (fallback de desarrollo)');
      
      // Crear objeto de usuario
      const userData = { 
        email, 
        role: 'ROLE_DOCTOR',
        name: 'Doctor Ejemplo',
        id: 2
      };
      
      // Guardar el token y usuario en localStorage
      localStorage.setItem('token', 'doctor_token_dev');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Establecer el usuario y la autenticación
      setUser(userData);
      setIsAuthenticated(true);
      
      // Cerrar el modal de autenticación si está abierto
      setShowAuthModal(false);
      
      // Redireccionar al dashboard de doctor
      if (navigate) {
        navigate('/doctor-dashboard');
      }
    } 
    // Staff login simulation
    else if (email === 'staff@ortowhave.co' && password === 'staff123') {
      console.log('Login como personal administrativo (fallback de desarrollo)');
      
      // Crear objeto de usuario
      const userData = { 
        email, 
        role: 'ROLE_STAFF',
        name: 'Staff Ejemplo',
        id: 3
      };
      
      // Guardar el token y usuario en localStorage
      localStorage.setItem('token', 'staff_token_dev');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Establecer el usuario y la autenticación
      setUser(userData);
      setIsAuthenticated(true);
      
      // Cerrar el modal de autenticación si está abierto
      setShowAuthModal(false);
      
      // Redireccionar al dashboard de staff
      if (navigate) {
        navigate('/dashboard');
      }
    }
    // User login simulation
    else if (email === 'paciente@ortowhave.co' && password === 'paciente123') {
      console.log('Login como paciente (fallback de desarrollo)');
      
      // Crear objeto de usuario
      const userData = { 
        email, 
        role: 'ROLE_USER',
        name: 'Paciente Ejemplo',
        id: 4
      };
      
      // Guardar el token y usuario en localStorage
      localStorage.setItem('token', 'user_token_dev');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Establecer el usuario y la autenticación
      setUser(userData);
      setIsAuthenticated(true);
      
      // Cerrar el modal de autenticación si está abierto
      setShowAuthModal(false);
      
      // Redireccionar al perfil de usuario
      if (navigate) {
        navigate('/profile');
      }
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = (navigate) => {
    console.log('Logout en AuthContext');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    if (navigate) {
      navigate('/');
    }
  };

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Usuario recuperado del localStorage:', userData);
          
          // Intentar verificar token con el servidor
          try {
            const response = await fetch('http://localhost:8080/api/auth/check', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            });
            
            if (response.ok) {
              // Token válido, actualizar info de usuario
              const data = await response.json();
              
              // Actualizar el userData con la información más reciente
              userData.role = data.role;
              userData.name = data.name;
              
              // Actualizar localStorage
              localStorage.setItem('user', JSON.stringify(userData));
              
              // Establecer autenticación
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              // Token inválido en producción
              if (process.env.NODE_ENV !== 'development') {
                // En producción, eliminar datos
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setIsAuthenticated(false);
              } else {
                // En desarrollo, mantener sesión para pruebas
                console.log('En desarrollo: manteniendo sesión a pesar de token inválido');
                setUser(userData);
                setIsAuthenticated(true);
              }
            }
          } catch (error) {
            console.log('Error al verificar token con el servidor:', error);
            // En desarrollo, mantener sesión para pruebas
            if (process.env.NODE_ENV === 'development') {
              console.log('En desarrollo: manteniendo sesión a pesar de error');
              setUser(userData);
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error('Error al procesar datos guardados:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        showAuthModal,
        openAuthModal,
        closeAuthModal,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// HOC para añadir navegación a componentes que necesitan auth
export const withAuthNavigation = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    
    return <Component {...props} auth={{...auth, navigate}} />;
  };
};

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 