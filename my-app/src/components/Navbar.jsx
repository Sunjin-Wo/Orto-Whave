import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon, 
  UserIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth, withAuthNavigation } from '../context/AuthContext';
import Checkout from './Checkout';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Servicios', href: '/#servicios' },
  { name: 'Productos', href: '/#productos' },
  { name: 'Nosotros', href: '/#nosotros' },
  { name: 'Contacto', href: '/#contacto' },
  { name: 'Prueba', href: '/test' },
];

const NavbarBase = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    isCheckoutOpen,
    proceedToCheckout,
    closeCheckout
  } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Cerrar el carrito al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsCartOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    
    // Si estamos en una página diferente a la principal, primero navegamos a la página principal
    if (location.pathname !== '/') {
      navigate('/');
      // Esperar un poco para que la página se cargue antes de intentar desplazarse
      setTimeout(() => {
        const element = document.querySelector(href.replace('/', ''));
        if (element) {
          const offset = 80; // Altura del navbar
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.querySelector(href.replace('/', ''));
      if (element) {
        const offset = 80; // Altura del navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }

    setIsOpen(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center">
          <Link
            to={user?.role === 'ROLE_ADMIN' ? '/dashboard' : '/profile'}
            className="flex items-center text-gray-700 hover:text-primary transition-colors"
          >
            <UserIcon className="h-6 w-6 mr-1" />
            <span className="hidden md:block">{user?.firstName || 'Mi cuenta'}</span>
          </Link>
          <button
            onClick={() => logout(navigate)}
            className="ml-4 text-gray-700 hover:text-primary transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              scrolled 
                ? 'border border-primary text-primary hover:bg-primary hover:text-white' 
                : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              scrolled 
                ? 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg' 
                : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Crear cuenta
          </Link>
        </div>
      );
    }
  };

  return (
    <>
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-12 w-auto"
                src="/images/ortowhite-logo.png"
                alt="OrtoWhite"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              item.href.includes('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 mx-1 group overflow-hidden ${
                    scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 ${scrolled ? 'bg-primary' : 'bg-white'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 mx-1 group overflow-hidden ${
                    scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 ${scrolled ? 'bg-primary' : 'bg-white'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                </Link>
              )
            ))}
          </div>

          {/* User and Cart Icons */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-center space-x-4 mr-6">
              {renderAuthButtons()}
              
              <div className="relative">
                <button 
                  className={`p-2 rounded-full ${
                    scrolled ? 'text-gray-800' : 'text-white'
                  } hover:bg-white/10 transition-colors relative`}
                  aria-label="Carrito de compras"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                <AnimatePresence>
                  {isCartOpen && (
                    <motion.div
                      ref={cartRef}
                      className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900">Tu carrito</h3>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {cartItems.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            Tu carrito está vacío
                          </div>
                        ) : (
                          <div className="p-4 space-y-4">
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover object-center"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      <MinusIcon className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm text-gray-900">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      <PlusIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {cartItems.length > 0 && (
                        <div className="p-4 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-base font-medium text-gray-900">Total</span>
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(getCartTotal())}
                            </span>
                          </div>
                          <button
                              onClick={proceedToCheckout}
                            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                          >
                            Proceder al pago
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Call-to-action button */}
            <a
              href="#contacto"
              onClick={(e) => scrollToSection(e, '#contacto')}
              className={`ml-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                scrolled 
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg' 
                  : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30'
              }`}
            >
              Agenda tu Cita
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gray-100' 
                  : 'text-white hover:text-white hover:bg-white/10'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary`}
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm shadow-lg">
              {navigation.map((item) => (
                item.href.includes('#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="text-gray-800 hover:text-primary hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-800 hover:text-primary hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              <div className="py-4 px-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to={user?.role === 'ROLE_ADMIN' ? '/dashboard' : '/profile'}
                      className="flex items-center text-gray-700 hover:text-primary px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 mr-2" />
                      Mi cuenta
                    </Link>
                    <button
                      onClick={() => {
                        logout(navigate);
                        setIsOpen(false);
                      }}
                      className="flex items-center text-gray-700 hover:text-primary px-3 py-2"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/login"
                      className="bg-white text-primary border border-primary hover:bg-primary hover:text-white block w-full text-center px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary text-white hover:bg-primary-dark block w-full text-center px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Crear cuenta
                    </Link>
                  </div>
                )}
              </div>
              
              <a
                href="#contacto"
                onClick={(e) => scrollToSection(e, '#contacto')}
                className="bg-primary text-white hover:bg-primary-dark block w-full text-center mt-2 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                Agenda tu Cita
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
      
      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && <Checkout onClose={closeCheckout} />}
      </AnimatePresence>
    </>
  );
};

// Exportamos el componente con el HOC aplicado
const Navbar = withAuthNavigation(NavbarBase);
export default Navbar; 