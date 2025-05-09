import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Services = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      id: 1,
      name: 'Evaluación Biomecánica',
      description: 'Análisis completo de tu estructura y movimiento para un diagnóstico preciso y tratamiento personalizado.',
      features: [
        'Análisis de la marcha',
        'Evaluación postural',
        'Medición de presión plantar',
        'Recomendaciones personalizadas'
      ],
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      icon: '🦿'
    },
    {
      id: 2,
      name: 'Prótesis Personalizadas',
      description: 'Diseño y fabricación de prótesis adaptadas a tus necesidades específicas utilizando tecnología de vanguardia.',
      features: [
        'Diseño 3D personalizado',
        'Materiales de alta calidad',
        'Ajustes y adaptaciones',
        'Seguimiento continuo'
      ],
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      icon: '🦾'
    },
    {
      id: 3,
      name: 'Terapia Postoperatoria',
      description: 'Programa de rehabilitación integral para una recuperación óptima después de intervenciones quirúrgicas.',
      features: [
        'Plan personalizado de ejercicios',
        'Terapia manual especializada',
        'Monitoreo del progreso',
        'Educación del paciente'
      ],
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      icon: '🏥'
    }
  ];

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeIn} className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos una gama completa de servicios ortopédicos especializados, 
            respaldados por tecnología de vanguardia y profesionales expertos.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              {...fadeIn}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-xl -z-10"></div>
                <img
                  src={service.image}
                  alt={service.name}
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
              <div className="space-y-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h2 className="text-3xl font-serif font-bold text-primary">
                  {service.name}
                </h2>
                <p className="text-gray-600 text-lg">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg
                        className="h-5 w-5 text-primary mr-3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link
                    to="/contacto"
                    className="btn-primary inline-block"
                  >
                    Agendar Consulta
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          {...fadeIn}
          className="mt-20 bg-primary rounded-2xl text-white p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-bold mb-6">
            ¿Necesitas más información?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está listo para responder todas tus preguntas y ayudarte 
            a encontrar la mejor solución para tus necesidades.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contacto"
              className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Contactar Ahora
            </Link>
            <a
              href="tel:+1234567890"
              className="inline-block px-8 py-4 border-2 border-white text-white rounded-xl font-medium hover:bg-white hover:text-primary transition-colors"
            >
              Llamar
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services; 