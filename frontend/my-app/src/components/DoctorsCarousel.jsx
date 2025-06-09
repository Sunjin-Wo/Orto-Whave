import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import DoctorModal from './DoctorModal';

const DoctorsCarousel = ({ doctors }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= totalPages ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? totalPages - 1 : nextIndex;
    });
  };

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };

  const visibleDoctors = doctors.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="relative px-12">
      {/* Botones de navegación */}
      <div className="absolute inset-y-0 left-0 flex items-center z-10">
        <button
          onClick={prevSlide}
          className="group bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Carrusel */}
      <div className="overflow-hidden">
        <div className="flex gap-8 justify-center">
          {visibleDoctors.map((doctor, index) => (
            <motion.div
              key={`${currentIndex}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-72 flex-shrink-0"
            >
              <div
                onClick={() => openModal(doctor)}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={doctor.imagen}
                    alt={doctor.nombre}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-10 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <span className="inline-block bg-primary text-white text-sm px-4 py-2 rounded-full shadow-lg">
                      Ver Perfil
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.nombre}</h3>
                  <p className="text-primary font-medium line-clamp-2">{doctor.especialidad}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Botón siguiente */}
      <div className="absolute inset-y-0 right-0 flex items-center z-10">
        <button
          onClick={nextSlide}
          className="group bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Indicadores de página */}
      <div className="flex justify-center gap-3 mt-8">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Modal */}
      <DoctorModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default DoctorsCarousel; 