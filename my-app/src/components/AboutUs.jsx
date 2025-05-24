import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AboutUs = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: "[Nombre del Doctor]",
      specialty: "[Especialidad]",
      image: "/images/doctors/doctor-placeholder.jpg",
      education: [
        "• [Título Universitario]",
        "• [Especialización]",
        "• [Subespecialización]"
      ],
      experience: [
        "• [Experiencia 1]",
        "• [Experiencia 2]",
        "• [Experiencia 3]"
      ],
      memberships: [
        "• [Membresía 1]",
        "• [Membresía 2]"
      ]
    },
    {
      id: 2,
      name: "[Nombre del Doctor]",
      specialty: "[Especialidad]",
      image: "/images/doctors/doctor-placeholder.jpg",
      education: [
        "• [Título Universitario]",
        "• [Especialización]",
        "• [Subespecialización]"
      ],
      experience: [
        "• [Experiencia 1]",
        "• [Experiencia 2]",
        "• [Experiencia 3]"
      ],
      memberships: [
        "• [Membresía 1]",
        "• [Membresía 2]"
      ]
    },
    {
      id: 3,
      name: "[Nombre del Doctor]",
      specialty: "[Especialidad]",
      image: "/images/doctors/doctor-placeholder.jpg",
      education: [
        "• [Título Universitario]",
        "• [Especialización]",
        "• [Subespecialización]"
      ],
      experience: [
        "• [Experiencia 1]",
        "• [Experiencia 2]",
        "• [Experiencia 3]"
      ],
      memberships: [
        "• [Membresía 1]",
        "• [Membresía 2]"
      ]
    }
  ];

  return (
    <div className="bg-white py-16" id="nosotros">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado con animación */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            OWC Colombia SAS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos una IPS especializada en servicios de salud con énfasis en Ortopedia y Traumatología,
            comprometidos con la excelencia y el bienestar de nuestros pacientes.
          </p>
        </motion.div>

        {/* Grid de información institucional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Misión</h3>
              <p className="text-gray-600">
                Somos una IPS de Ortopedia y Traumatología de alta calidad que busca satisfacer y mejorar 
                la calidad de vida de nuestros pacientes física y emocionalmente. Ofrecemos atención 
                personalizada enfocada en la calidez y el trato humano.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Visión</h3>
              <p className="text-gray-600">
                En el 2030 seremos un centro de vanguardia líder en Bogotá, con reconocimiento nacional 
                e internacional, superando las expectativas de nuestros pacientes en las áreas de Ortopedia, 
                Neurocirugía y Medicina General.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-primary mb-6">Valores Corporativos</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compromiso</h4>
                  <p className="text-gray-600 text-sm">
                    Soluciones médicas efectivas y atención de máxima calidad.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Seguridad</h4>
                  <p className="text-gray-600 text-sm">
                    Rigurosas medidas en todos los ámbitos de nuestra actividad.
            </p>
        </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compasión</h4>
                  <p className="text-gray-600 text-sm">
                    Atención médica cercana y relación basada en la confianza.
                  </p>
              </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Innovación</h4>
                  <p className="text-gray-600 text-sm">
                    Tecnología y conocimientos médicos de vanguardia.
                  </p>
            </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sección de doctores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Nuestro Equipo Médico
            </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="aspect-w-3 aspect-h-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h4>
                  <p className="text-primary font-medium">{doctor.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modal del doctor */}
        <AnimatePresence>
          {selectedDoctor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDoctor(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      <div className="mt-4">
                        <h4 className="text-xl font-bold text-primary mb-2">{selectedDoctor.specialty}</h4>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Educación</h4>
                        <ul className="space-y-2 text-gray-600">
                          {selectedDoctor.education.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Experiencia</h4>
                        <ul className="space-y-2 text-gray-600">
                          {selectedDoctor.experience.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Membresías</h4>
                        <ul className="space-y-2 text-gray-600">
                          {selectedDoctor.memberships.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AboutUs; 