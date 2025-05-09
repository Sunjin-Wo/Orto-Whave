import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const team = [
    {
      name: 'Dr. Carlos Martínez',
      role: 'Director Médico',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      description: 'Especialista en ortopedia con más de 15 años de experiencia.'
    },
    {
      name: 'Dra. Ana Rodríguez',
      role: 'Especialista en Biomecánica',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      description: 'Experta en análisis de movimiento y rehabilitación.'
    },
    {
      name: 'Dr. Miguel Torres',
      role: 'Especialista en Prótesis',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      description: 'Pionero en el desarrollo de prótesis personalizadas.'
    },
    {
      name: 'Dra. Laura Sánchez',
      role: 'Terapeuta Senior',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      description: 'Especializada en rehabilitación postoperatoria.'
    }
  ];

  const values = [
    {
      title: 'Innovación',
      description: 'Utilizamos la última tecnología en tratamientos ortopédicos.',
      icon: '🔬'
    },
    {
      title: 'Excelencia',
      description: 'Nos comprometemos con los más altos estándares de calidad.',
      icon: '⭐'
    },
    {
      title: 'Empatía',
      description: 'Entendemos y nos preocupamos por cada paciente.',
      icon: '💝'
    },
    {
      title: 'Profesionalismo',
      description: 'Nuestro equipo está altamente capacitado y actualizado.',
      icon: '🎓'
    }
  ];

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div {...fadeIn} className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Sobre OrtoWhite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos un centro ortopédico líder comprometido con la innovación y el cuidado 
            personalizado de nuestros pacientes.
          </p>
        </motion.div>

        {/* Mission and Vision */}
        <motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              Nuestra Misión
            </h2>
            <p className="text-gray-600">
              Proporcionar soluciones ortopédicas innovadoras y personalizadas que mejoren 
              significativamente la calidad de vida de nuestros pacientes, combinando tecnología 
              de vanguardia con un cuidado humano y profesional.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              Nuestra Visión
            </h2>
            <p className="text-gray-600">
              Ser reconocidos como el centro ortopédico líder en innovación y excelencia, 
              estableciendo nuevos estándares en el cuidado ortopédico y la rehabilitación 
              personalizada.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.section {...fadeIn} className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section {...fadeIn} className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-1">{member.name}</h3>
                  <p className="text-accent mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          {...fadeIn}
          className="bg-primary rounded-2xl text-white p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-bold mb-6">
            ¿Listo para comenzar tu tratamiento?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de especialistas está preparado para ayudarte a recuperar 
            tu movilidad y calidad de vida.
          </p>
          <Link
            to="/contacto"
            className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Agenda tu Consulta
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default About; 