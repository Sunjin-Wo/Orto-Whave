import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Datos para la sección de valores
  const values = [
    { id: 1, title: "Excelencia médica", description: "Buscamos constantemente superar las expectativas de nuestros pacientes a través de un servicio de máxima calidad y precisión." },
    { id: 2, title: "Ética profesional", description: "Actuamos con integridad y honestidad en cada decisión, priorizando siempre el bienestar del paciente." },
    { id: 3, title: "Empatía", description: "Comprendemos y conectamos con las necesidades emocionales y físicas de cada persona." },
    { id: 4, title: "Responsabilidad", description: "Asumimos el compromiso de brindar el mejor cuidado posible, siendo conscientes del impacto de nuestro trabajo." },
    { id: 5, title: "Trabajo en equipo", description: "Colaboramos estrechamente para ofrecer soluciones integrales que beneficien a nuestros pacientes." }
  ];

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sobre Nosotros
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        </motion.div>

        {/* Sobre Nosotros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="aspect-video rounded-lg overflow-hidden shadow-xl"
          >
            <img 
              src="/images/DoctorAtendiendoPaciente.webp" 
              alt="Profesional médico atendiendo a un paciente" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              En Ortopedia Integral
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Nos especializamos en el cuidado y tratamiento de los huesos, músculos y articulaciones, ofreciendo soluciones médicas y quirúrgicas a personas de todas las edades. Nuestro enfoque está centrado en el paciente: combinamos la experiencia clínica con tecnología avanzada para ayudarte a recuperar tu movilidad y bienestar.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Contamos con un equipo de especialistas en ortopedia y traumatología altamente calificados, comprometidos con brindar una atención cálida, personalizada y basada en evidencia científica. Nos esforzamos por ofrecer un entorno seguro, confiable y enfocado en resultados reales.
            </p>
          </motion.div>
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div 
            className="bg-gray-50 p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Misión</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Brindar servicios ortopédicos de alta calidad que mejoren la salud musculoesquelética de nuestros pacientes, promoviendo una recuperación efectiva y una vida sin dolor.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gray-50 p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Visión</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Ser un centro de referencia en ortopedia a nivel nacional, reconocidos por la excelencia médica, la innovación constante y el trato humano hacia cada paciente.
            </p>
          </motion.div>
        </div>

        {/* Valores */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h3>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <motion.div
                key={value.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs; 