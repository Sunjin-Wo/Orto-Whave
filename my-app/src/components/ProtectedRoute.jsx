import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, withAuthNavigation } from '../context/AuthContext';

// Componente para rutas que requieren autenticación y un rol específico
const ProtectedRouteBase = ({ element, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    console.log("ProtectedRoute - user:", user);
    console.log("ProtectedRoute - requiredRole:", requiredRole);
  }, [isAuthenticated, user, requiredRole]);
  
  if (!isAuthenticated) {
    console.log("No autenticado, redirigiendo a login");
    return <Navigate to="/login" />;
  }
  
  // Si se especifica un rol requerido y el usuario no lo tiene, redirigir
  if (requiredRole && user?.role !== requiredRole) {
    console.log(`Rol requerido ${requiredRole} no coincide con ${user?.role}, redirigiendo`);
    
    // Caso especial para administrador
    if (user?.role === 'ROLE_ADMIN') {
      console.log("Usuario es admin, permitiendo acceso");
      return element;
    }
    
    // Caso especial para paciente
    if (requiredRole === 'ROLE_USER' && user?.email === 'paciente@ejemplo.com') {
      console.log("Usuario es paciente de ejemplo, permitiendo acceso");
      return element;
    }
    
    // Caso especial para doctor
    if (requiredRole === 'ROLE_DOCTOR' && user?.email === 'doctor@ortowhite.com') {
      console.log("Usuario es doctor, permitiendo acceso");
      return element;
    }
    
    // Redirigir según el rol
    if (user?.role === 'ROLE_ADMIN') {
      return <Navigate to="/dashboard" />;
    } else if (user?.role === 'ROLE_DOCTOR') {
      return <Navigate to="/doctor-dashboard" />;
    } else {
      return <Navigate to="/profile" />;
    }
  }
  
  console.log("Acceso permitido a ruta protegida");
  return element;
};

// Componente para rutas que solo pueden acceder usuarios no autenticados
const PublicRouteBase = ({ element }) => {
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    console.log("PublicRoute - isAuthenticated:", isAuthenticated);
    console.log("PublicRoute - user:", user);
  }, [isAuthenticated, user]);
  
  if (isAuthenticated) {
    console.log("Usuario autenticado, redirigiendo según rol");
    
    if (user?.role === 'ROLE_ADMIN') {
      return <Navigate to="/dashboard" />;
    } else if (user?.role === 'ROLE_DOCTOR') {
      return <Navigate to="/doctor-dashboard" />;
    } else {
      return <Navigate to="/profile" />;
    }
  }
  
  console.log("Acceso permitido a ruta pública");
  return element;
};

// Exportamos los componentes con el HOC aplicado
export const ProtectedRoute = withAuthNavigation(ProtectedRouteBase);
export const PublicRoute = withAuthNavigation(PublicRouteBase); 