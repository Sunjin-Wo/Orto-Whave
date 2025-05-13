import React from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 hover:text-primary transition-colors">
                <PhoneIcon className="w-5 h-5" />
                <a href="tel:+571234567890" className="hover:underline">+57 123 456 7890</a>
              </li>
              <li className="flex items-center space-x-3 hover:text-primary transition-colors">
                <EnvelopeIcon className="w-5 h-5" />
                <strong className="text-white">Email:</strong>
                <a href="mailto:contacto@orthowave.co" className="hover:underline">contacto@orthowave.co</a>
              </li>
              <li className="flex items-center space-x-3 hover:text-primary transition-colors">
                <MapPinIcon className="w-5 h-5" />
                <span>Calle 134# 7b-83 Consultorio 122</span>
              </li>
            </ul>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#inicio" className="hover:text-primary transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Inicio</span>
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-primary transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Servicios</span>
                </a>
              </li>
              <li>
                <a href="#productos" className="hover:text-primary transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Productos</span>
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-primary transition-colors flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Nosotros</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors duration-300 group"
                aria-label="Facebook"
              >
                <ShareIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors duration-300 group"
                aria-label="Instagram"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors duration-300 group"
                aria-label="Twitter"
              >
                <GlobeAltIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} OWC Orthowave Colombia. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <a href="/privacidad" className="text-gray-400 hover:text-primary transition-colors">Política de Privacidad</a>
              <a href="/terminos" className="text-gray-400 hover:text-primary transition-colors">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 