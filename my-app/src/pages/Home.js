import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      title: 'Evaluación Biomecánica',
      description: 'Análisis completo de tu estructura y movimiento para un tratamiento personalizado.',
      icon: '🦿'
    },
    {
      title: 'Prótesis Personalizadas',
      description: 'Soluciones ortopédicas adaptadas a tus necesidades específicas.',
      icon: '🦾'
    },
    {
      title: 'Terapia Postoperatoria',
      description: 'Recuperación guiada y seguimiento profesional después de intervenciones.',
      icon: '🏥'
    }
  ];

  const testimonials = [
    {
      name: 'Ana García',
      text: 'El equipo de OrtoWhite cambió mi vida. Su atención personalizada y profesionalismo son excepcionales.',
      image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Carlos Rodríguez',
      text: 'Gracias a sus servicios ortopédicos, he recuperado mi movilidad y calidad de vida.',
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'María López',
      text: 'La mejor decisión que tomé fue confiar en OrtoWhite para mi tratamiento ortopédico.',
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=2091&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[5px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6">
              La evolución de la ortopedia comienza aquí.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Innovación, calidad y cuidado personalizado
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/productos" className="btn-primary">
                Ver productos
              </Link>
              <Link to="/contacto" className="btn-secondary">
                Agendar consulta
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            {...fadeIn}
            className="text-3xl font-serif font-bold text-center text-primary mb-12"
          >
            Productos Destacados
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                {...fadeIn}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={`https://source.unsplash.com/featured/600x400?orthopedic-${item}`}
                    alt="Product"
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-xl mb-2">Producto Ortopédico {item}</h3>
                  <p className="text-gray-600 mb-4">Descripción breve del producto y sus beneficios principales.</p>
                  <p className="text-sm text-gray-500 mb-4">Desde $XXX.XX</p>
                  <Link to={`/productos/${item}`} className="text-primary font-medium hover:text-accent transition-colors">
                    Ver detalles →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            {...fadeIn}
            className="text-3xl font-serif font-bold text-center text-primary mb-12"
          >
            Nuestros Servicios
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                className="bg-gray-50 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-serif font-bold text-xl mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeIn}>
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=928&q=80"
                alt="Medical Team"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
            <motion.div {...fadeIn}>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Sobre Nosotros</h2>
              <p className="text-gray-600 mb-6">
                En OrtoWhite, combinamos experiencia médica con tecnología de vanguardia para ofrecer soluciones ortopédicas personalizadas. Nuestro equipo de profesionales está comprometido con tu bienestar y recuperación.
              </p>
              <Link to="/nosotros" className="btn-secondary inline-block">
                Conoce más sobre nosotros
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            {...fadeIn}
            className="text-3xl font-serif font-bold text-center text-primary mb-12"
          >
            Lo que dicen nuestros pacientes
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <h3 className="font-medium">{testimonial.name}</h3>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-serif font-bold mb-6">
              ¿Listo para mejorar tu calidad de vida?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Agenda una consulta con nuestros especialistas hoy mismo
            </p>
            <Link
              to="/contacto"
              className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Agendar Cita
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 