import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import AboutUs from '../components/AboutUs';
import Products from '../components/Products';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero 
        title="Bienvenido a OWC Orthowave Colombia"
        subtitle="Tu centro ortopédico especializado"
        cta={
          isAuthenticated ? (
            <Link 
              to={user?.role === 'ROLE_ADMIN' ? '/dashboard' : '/profile'} 
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {user?.role === 'ROLE_ADMIN' ? 'Ir al Dashboard' : 'Mi Perfil'}
            </Link>
          ) : (
            <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Iniciar sesión
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Crear cuenta
              </Link>
            </div>
          )
        }
        image="/images/hero-image.jpg"
      />
      <Services />
      <Products />
      <AboutUs />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage; 