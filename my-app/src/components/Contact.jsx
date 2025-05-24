import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(false);

  // Añadir hook para manejar el scroll cuando se carga la página con hash #contacto
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#contacto') {
        setTimeout(() => {
          const element = document.getElementById('contacto');
          if (element) {
            const headerOffset = 80; // Altura aproximada del navbar
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    // Ejecutar una vez al cargar si ya hay un hash
    handleHashChange();

    // Añadir event listener para cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    
    // Limpiar event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario a un backend
    try {
      // Simulación de envío exitoso
      console.log('Formulario enviado:', formData);
      setEnviado(true);
      setError(false);
      // Resetear formulario después de envío exitoso
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
      });
      setTimeout(() => setEnviado(false), 5000); // Ocultar mensaje después de 5 segundos
    } catch (err) {
      console.error('Error al enviar formulario:', err);
      setError(true);
      setTimeout(() => setError(false), 5000);
    }
  };

  // Animaciones para componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div id="contacto" className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="text-center mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-800 mb-4">
          Contáctanos
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Estamos aquí para resolver todas tus dudas. Completa el formulario y nos pondremos en contacto contigo lo antes posible.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Columna del formulario */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          {enviado && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ¡Gracias por contactarnos! Te responderemos a la brevedad.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Hubo un error al enviar el formulario. Por favor, intenta nuevamente.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo*
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Tu nombre"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="tucorreo@ejemplo.com"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="+57 300 123 4567"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje*
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="4"
                value={formData.mensaje}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="¿En qué podemos ayudarte?"
              ></textarea>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Enviar mensaje
              </button>
            </motion.div>
          </form>
        </motion.div>

        {/* Columna del mapa */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="rounded-xl overflow-hidden shadow-xl h-full min-h-[400px]"
        >
          <div className="h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.4892783039814!2d-74.03347962498959!3d4.7047199957569935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a9e6b33e5ed%3A0x4883a2cd10d7ead1!2sCl.%20134%20%237b-83%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1706036287729!5m2!1ses!2sco"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "100%", height: "100%" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Orto-White"
              className="w-full h-full min-h-[400px]"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact; 