import React, { createContext, useState, useContext } from 'react';

const defaultAuthContext = {
  isAuthenticated: false,
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

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);
  
  const login = () => {
    setIsAuthenticated(true);
    closeAuthModal();
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 