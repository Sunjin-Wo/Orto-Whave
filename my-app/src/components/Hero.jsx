import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { images } from '../assets';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    image: images.medicoClinica,
    title: "Excelencia en OWC Orthowave Colombia",
    description: "Tecnología de vanguardia y atención personalizada para tu bienestar"
  },
  {
    image: images.rehabilitacionFisica,
    title: "Rehabilitación Integral",
    description: "Recupera tu movilidad con nuestro equipo especializado"
  },
  {
    image: images.protesisPierna,
    title: "Soluciones Ortopédicas",
    description: "Prótesis y órtesis de última generación adaptadas a tus necesidades"
  },
  {
    image: images.sesionFisioterapia,
    title: "Fisioterapia Avanzada",
    description: "Tratamientos personalizados para una recuperación efectiva"
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const paginate = useCallback((newDirection) => {
    setIsAutoPlaying(false);
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === ' ') {
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div 
      className="relative h-screen overflow-hidden bg-black"
      role="region"
      aria-label="Image carousel"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
      <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-1000"
        style={{
              backgroundImage: `url(${slides[currentIndex].image})`,
              backgroundPosition: 'center 20%'
        }}
      >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl"
            >
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                {slides[currentIndex].title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto font-light drop-shadow-md">
                {slides[currentIndex].description}
              </p>
          </motion.div>
        </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: isAutoPlaying ? "100%" : "0%" }}
          transition={{ duration: 6, ease: "linear", repeat: isAutoPlaying ? Infinity : 0 }}
          key={`progress-${currentIndex}`}
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/70 hover:bg-white'
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-300 z-20 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => paginate(-1)}
        aria-label="Diapositiva anterior"
        type="button"
      >
        <ChevronLeftIcon className="w-8 h-8 text-white" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-300 z-20 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => paginate(1)}
        aria-label="Siguiente diapositiva"
        type="button"
      >
        <ChevronRightIcon className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};

export default Hero; 