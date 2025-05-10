import React from 'react';
import Image from './Image';
import { images } from '../assets';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Fisioterapia',
    description: 'Tratamientos personalizados para recuperación y rehabilitación física.',
    image: images.sesionFisioterapia,
  },
  {
    title: 'Rehabilitación Física',
    description: 'Programas especializados para recuperar la movilidad y funcionalidad.',
    image: images.rehabilitacionFisica,
  },
  {
    title: 'Prótesis y Ortesis',
    description: 'Soluciones avanzadas en prótesis y dispositivos ortopédicos.',
    image: images.protesisPierna,
  },
  {
    title: 'Diagnóstico Especializado',
    description: 'Evaluación experta de condiciones ortopédicas.',
    image: images.fracturaOsea,
  },
];

const Services = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Ofrecemos una amplia gama de servicios ortopédicos y de rehabilitación
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-500">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 