import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

const slides = [
  {
      image: '/images/slider1.webp',
      title: 'Bienvenidos a OWC Colombia',
      subtitle: 'Expertos en Ortopedia y Traumatología',
      description: 'Brindamos atención especializada con los más altos estándares de calidad'
  },
  {
      image: '/images/slider2.webp',
      title: 'Tecnología de Vanguardia',
      subtitle: 'Equipos de última generación',
      description: 'Contamos con la más avanzada tecnología para tu tratamiento'
  },
  {
      image: '/images/slider3.webp',
      title: 'Atención Personalizada',
      subtitle: 'Equipo médico especializado',
      description: 'Nuestro equipo está comprometido con tu bienestar'
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-screen pt-16" id="inicio">
      <div className="absolute inset-0 top-16 overflow-hidden">
        <AnimatePresence initial={false}>
        <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
      <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      >
              <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
          </motion.div>
        </AnimatePresence>

        {/* Contenido del slide */}
        <div className="relative h-full flex items-center justify-center text-white px-4">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
            >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {slides[currentSlide].title}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary">
              {slides[currentSlide].subtitle}
              </h2>
            <p className="text-lg md:text-xl mb-8">
              {slides[currentSlide].description}
            </p>
            <a
              href="#contacto"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Agenda tu Cita
            </a>
          </motion.div>
        </div>

        {/* Controles del carrusel */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
        {slides.map((_, index) => (
          <button
              key={index}
              onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-primary scale-125' : 'bg-white opacity-50 hover:opacity-75'
            }`}
          />
        ))}
      </div>

        {/* Botones de navegación */}
      <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300"
      >
          <ChevronLeftIcon className="h-8 w-8 text-white" />
      </button>
      <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300"
      >
          <ChevronRightIcon className="h-8 w-8 text-white" />
      </button>
      </div>
    </div>
  );
};

export default Hero; 