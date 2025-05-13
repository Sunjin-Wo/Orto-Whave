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

  // Si el usuario es administrador, permitir acceso a todas las rutas
  if (user?.role === 'ROLE_ADMIN') {
    console.log("Usuario es admin, permitiendo acceso a todas las rutas");
    return element;
  }
  
  // Si se especifica un rol requerido y el usuario no lo tiene, redirigir
  if (requiredRole && user?.role !== requiredRole) {
    console.log(`Rol requerido ${requiredRole} no coincide con ${user?.role}, redirigiendo`);
    
    // Redireccionar según el rol actual del usuario
    switch (user?.role) {
      case 'ROLE_DOCTOR':
        return <Navigate to="/doctor-dashboard" />;
      case 'ROLE_STAFF':
        return <Navigate to="/dashboard" />;
      case 'ROLE_USER':
      default:
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
    
    // Redireccionar según el rol del usuario
    switch (user?.role) {
      case 'ROLE_ADMIN':
        return <Navigate to="/dashboard" />;
      case 'ROLE_DOCTOR':
        return <Navigate to="/doctor-dashboard" />;
      case 'ROLE_STAFF':
        return <Navigate to="/dashboard" />;
      case 'ROLE_USER':
      default:
        return <Navigate to="/profile" />;
    }
  }
  
  console.log("Acceso permitido a ruta pública");
  return element;
};

// Exportamos los componentes con el HOC aplicado
export const ProtectedRoute = withAuthNavigation(ProtectedRouteBase);
export const PublicRoute = withAuthNavigation(PublicRouteBase); 