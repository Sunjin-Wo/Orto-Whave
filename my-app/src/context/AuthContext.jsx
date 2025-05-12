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

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);
  
  const login = (userData, token, navigate) => {
    console.log('Login en AuthContext:', userData);
    
    // Asegurarse de que userData tenga un rol
    if (!userData.role && userData.email === 'admin@ortowhite.com') {
      userData.role = 'ROLE_ADMIN';
    } else if (!userData.role && userData.email === 'paciente@ejemplo.com') {
      userData.role = 'ROLE_USER';
    } else if (!userData.role && userData.email === 'doctor@ortowhite.com') {
      userData.role = 'ROLE_DOCTOR';
    } else if (!userData.role) {
      userData.role = 'ROLE_USER';
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    
    if (navigate) {
      console.log('Navegando según rol:', userData.role);
      // Caso especial para paciente@ejemplo.com
      if (userData.email === 'paciente@ejemplo.com') {
        console.log('Redirigiendo paciente de ejemplo a /profile');
        navigate('/profile');
      } else if (userData.email === 'doctor@ortowhite.com') {
        console.log('Redirigiendo doctor a /doctor-dashboard');
        navigate('/doctor-dashboard');
      } else if (userData.role === 'ROLE_ADMIN') {
        navigate('/dashboard');
      } else if (userData.role === 'ROLE_USER') {
        navigate('/profile');
      } else if (userData.role === 'ROLE_DOCTOR') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/profile');
      }
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
        if (!userData.role && userData.email === 'admin@ortowhite.com') {
          userData.role = 'ROLE_ADMIN';
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (!userData.role && userData.email === 'paciente@ejemplo.com') {
          userData.role = 'ROLE_USER';
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (!userData.role && userData.email === 'doctor@ortowhite.com') {
          userData.role = 'ROLE_DOCTOR';
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (!userData.role) {
          userData.role = 'ROLE_USER';
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
    logout
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
      login: (userData, token) => auth.login(userData, token, navigate),
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