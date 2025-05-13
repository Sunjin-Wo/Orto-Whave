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
      
      // Intentar iniciar sesión con la API
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
          // La API respondió correctamente, procesar la respuesta
          const data = await response.json();
          console.log('Respuesta de API de inicio de sesión:', data);
          
          if (data.token) {
            // Crear objeto de usuario con los datos de la respuesta
            const userData = {
              id: data.userId || data.id,
              email: email,
              role: data.role,
              firstName: data.firstName || '',
              lastName: data.lastName || '',
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
            redirectBasedOnRole(userData.role, navigate);
            
            return;
          }
        } else {
          console.log('Error en la respuesta de la API, usando fallback local');
        }
      } catch (error) {
        console.log('Error al conectar con la API, usando fallback local:', error);
      }
      
      // Fallback para desarrollo/demo cuando el backend no está disponible
      
      // Admin login simulation
      if (email === 'admin@ortowhave.co' && password === 'admin123') {
        console.log('Login como administrador (fallback)');
        
        // Crear objeto de usuario
        const userData = { 
          email, 
          role: 'ROLE_ADMIN',
          firstName: 'Admin',
          lastName: 'OWC',
          id: 1
        };
        
        // Guardar el token y usuario en localStorage
        localStorage.setItem('token', 'admin_token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Establecer el usuario y la autenticación
        setUser(userData);
        setIsAuthenticated(true);
        
        // Cerrar el modal de autenticación si está abierto
        setShowAuthModal(false);
        
        // Redireccionar según el rol
        redirectBasedOnRole('ROLE_ADMIN', navigate);
      } 
      // Doctor login simulation
      else if (email === 'doctor@ortowhave.co' && password === 'doctor123') {
        console.log('Login como doctor (fallback)');
        
        // Crear objeto de usuario
        const userData = { 
          email, 
          role: 'ROLE_DOCTOR',
          firstName: 'Doctor',
          lastName: 'Ejemplo',
          id: 2
        };
        
        // Guardar el token y usuario en localStorage
        localStorage.setItem('token', 'doctor_token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Establecer el usuario y la autenticación
        setUser(userData);
        setIsAuthenticated(true);
        
        // Cerrar el modal de autenticación si está abierto
        setShowAuthModal(false);
        
        // Redireccionar según el rol
        redirectBasedOnRole('ROLE_DOCTOR', navigate);
      } 
      // Staff login simulation
      else if (email === 'staff@ortowhave.co' && password === 'staff123') {
        console.log('Login como personal administrativo (fallback)');
        
        // Crear objeto de usuario
        const userData = { 
          email, 
          role: 'ROLE_STAFF',
          firstName: 'Staff',
          lastName: 'Ejemplo',
          id: 3
        };
        
        // Guardar el token y usuario en localStorage
        localStorage.setItem('token', 'staff_token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Establecer el usuario y la autenticación
        setUser(userData);
        setIsAuthenticated(true);
        
        // Cerrar el modal de autenticación si está abierto
        setShowAuthModal(false);
        
        // Redireccionar según el rol
        redirectBasedOnRole('ROLE_STAFF', navigate);
      }
      // User login simulation
      else if (email === 'paciente@ortowhave.co' && password === 'paciente123') {
        console.log('Login como paciente (fallback)');
        
        // Crear objeto de usuario
        const userData = { 
          email, 
          role: 'ROLE_USER',
          firstName: 'Paciente',
          lastName: 'Ejemplo',
          id: 4
        };
        
        // Guardar el token y usuario en localStorage
        localStorage.setItem('token', 'user_token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Establecer el usuario y la autenticación
        setUser(userData);
        setIsAuthenticated(true);
        
        // Cerrar el modal de autenticación si está abierto
        setShowAuthModal(false);
        
        // Redireccionar según el rol
        redirectBasedOnRole('ROLE_USER', navigate);
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
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

  // Función para redireccionar según el rol
  const redirectBasedOnRole = (role, navigate) => {
    if (!navigate) return;
    
    console.log('Redireccionando según rol:', role);
    
    switch (role) {
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Usuario recuperado del localStorage:', userData);
        
        // Asegurarse de que userData tenga un rol
        if (!userData.role) {
          if (userData.email === 'admin@ortowhave.co') {
            userData.role = 'ROLE_ADMIN';
          } else if (userData.email === 'doctor@ortowhave.co') {
            userData.role = 'ROLE_DOCTOR';
          } else if (userData.email === 'staff@ortowhave.co') {
            userData.role = 'ROLE_STAFF';
          } else {
            userData.role = 'ROLE_USER';
          }
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al parsear usuario del localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const value = {
    isAuthenticated,
    user,
    showAuthModal,
    openAuthModal,
    closeAuthModal,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const withAuthNavigation = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    
    const enhancedAuth = {
      ...auth,
      login: (email, password) => auth.login(email, password, navigate),
      logout: () => auth.logout(navigate)
    };
    
    return (
      <AuthContext.Provider value={enhancedAuth}>
        <Component {...props} />
      </AuthContext.Provider>
    );
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 