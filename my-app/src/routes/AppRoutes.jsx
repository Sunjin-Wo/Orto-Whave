import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Products from '../components/Products';
import AboutUs from '../components/AboutUs';
import Contact from '../components/Contact';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <section id="inicio">
          <Hero />
        </section>
        
        <section id="servicios">
          <Services />
        </section>

        <section id="productos" className="py-16 bg-gray-50">
          <Products />
        </section>

        <section id="nosotros" className="py-16">
          <AboutUs />
        </section>

        <section id="contacto" className="py-16">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  const { showAuthModal, closeAuthModal } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} />
    </>
  );
};

export default AppRoutes; 