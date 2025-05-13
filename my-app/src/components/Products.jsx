import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

// Datos de ejemplo de productos
const productsData = [
  {
    id: 1,
    name: 'Muletas aluminio ajustables',
    price: 120000,
    // Actualizado a formato webp
    image: '/images/products/Muletas de Aluminio.webp',
    status: 'Disponible',
    category: 'movilidad'
  },
  {
    id: 2,
    name: 'Andador plegable con asiento',
    price: 180000,
    image: '/images/products/Andador plegable con asiento.webp',
    status: 'Disponible',
    category: 'movilidad'
  },
  {
    id: 3,
    name: 'Órtesis de rodilla articulada',
    price: 250000,
    image: '/images/products/Órtesis de rodilla articulada.webp',
    status: 'Disponible',
    category: 'órtesis'
  },
  {
    id: 4,
    name: 'Collarín cervical',
    price: 85000,
    image: '/images/products/Collarín cervical.webp',
    status: 'Agotado',
    category: 'órtesis'
  },
  {
    id: 5,
    name: 'Silla de ruedas plegable',
    price: 450000,
    image: '/images/products/Silla de ruedas plegable.webp',
    status: 'Alquiler',
    category: 'movilidad'
  },
  {
    id: 6,
    name: 'Cabestrillo para brazo',
    price: 65000,
    image: '/images/products/Cabestrillo para brazo.webp',
    status: 'Disponible',
    category: 'órtesis'
  },
  {
    id: 7,
    name: 'Cojín antiescaras',
    price: 110000,
    image: '/images/products/Cojín antiescaras.webp',
    status: 'Disponible',
    category: 'confort'
  },
  {
    id: 8,
    name: 'Férula inmovilizadora de muñeca',
    price: 75000,
    image: '/images/products/Férula inmovilizadora de muñeca.webp',
    status: 'Disponible',
    category: 'órtesis'
  }
];

// Categorías para filtrar
const categories = [
  { id: 'todos', name: 'Todos' },
  { id: 'movilidad', name: 'Movilidad' },
  { id: 'órtesis', name: 'Órtesis' },
  { id: 'confort', name: 'Confort' }
];

const formatPrice = (price) => {
  return `$ ${new Intl.NumberFormat('es-CO').format(price)} COP`;
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const { addToCart } = useCart();

  const handleImageError = useCallback((productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  }, []);

  const handleAddToCart = useCallback((product) => {
    if (product.status === 'Agotado') return;
    
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`);
  }, [addToCart]);

  // Filtra productos por categoría y término de búsqueda
  const filteredProducts = productsData.filter(product => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="productos" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Productos
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ofrecemos una amplia gama de productos ortopédicos de alta calidad para mejorar tu bienestar y calidad de vida
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchTerm && (
                <button 
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Limpiar búsqueda"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cuadrícula de productos */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map(product => (
              <motion.div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-[420px]"
                variants={itemVariants}
              >
                {/* Contenedor de imagen con altura fija */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    {imageErrors[product.id] ? (
                      <div className="text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2">Imagen no disponible</p>
                      </div>
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        onError={() => handleImageError(product.id)}
                        loading="lazy"
                      />
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'Disponible' ? 'bg-green-100 text-green-800' :
                      product.status === 'Agotado' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                
                {/* Información del producto con altura y espaciado consistentes */}
                <div className="p-4 flex-grow flex flex-col">
                  {/* Título con altura fija */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2 h-14 overflow-hidden">
                    {product.name}
                  </h3>
                  
                  {/* Precio */}
                  <p className="text-xl font-bold text-primary mb-4">
                    {formatPrice(product.price)}
                  </p>
                  
                  {/* Botones en la parte inferior */}
                  <div className="flex space-x-2 mt-auto">
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition-colors ${
                        product.status === 'Agotado' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        if (product.status !== 'Agotado') {
                          try {
                            handleAddToCart(product);
                          } catch (error) {
                            toast.error('Error al agregar al carrito');
                            console.error('Error:', error);
                          }
                        }
                      }}
                      disabled={product.status === 'Agotado'}
                    >
                      <ShoppingCartIcon className="w-5 h-5 mr-2" />
                      {product.status === 'Alquiler' ? 'Consultar' : 'Agregar'}
                    </button>
                    
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                      onClick={() => {
                        // Aquí iría la lógica para ver detalles
                        toast.info('Próximamente: Detalles del producto');
                      }}
                    >
                      <span className="mr-2">Detalles</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}

        {/* Botón de ver todos los productos */}
        {selectedCategory !== 'todos' && filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={() => setSelectedCategory('todos')}
              className="px-6 py-3 bg-white border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products; 