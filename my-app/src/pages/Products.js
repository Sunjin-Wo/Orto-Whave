import { motion } from 'framer-motion';

const Products = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const products = [
    {
      id: 1,
      name: 'Prótesis de Rodilla Personalizada',
      description: 'Prótesis de rodilla adaptada a tu anatomía específica para máximo confort y movilidad.',
      price: '4,999.99',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Soporte Ortopédico Lumbar',
      description: 'Soporte ergonómico para la zona lumbar con tecnología de compresión gradual.',
      price: '299.99',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Plantillas Ortopédicas 3D',
      description: 'Plantillas personalizadas impresas en 3D para una distribución óptima del peso.',
      price: '199.99',
      image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Collar Cervical Ajustable',
      description: 'Collar cervical con ajuste personalizado y material transpirable.',
      price: '149.99',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      name: 'Muletas Ergonómicas',
      description: 'Muletas ligeras con empuñaduras ergonómicas y ajuste de altura.',
      price: '179.99',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      name: 'Férula de Muñeca',
      description: 'Férula estabilizadora de muñeca con sistema de compresión ajustable.',
      price: '89.99',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Nuestros Productos
          </h1>
          <p className="text-xl text-gray-600">
            Soluciones ortopédicas de alta calidad para mejorar tu calidad de vida
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          {...fadeIn}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Categoría</option>
              <option value="protesis">Prótesis</option>
              <option value="soportes">Soportes</option>
              <option value="plantillas">Plantillas</option>
              <option value="otros">Otros</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Precio</option>
              <option value="asc">Menor a Mayor</option>
              <option value="desc">Mayor a Menor</option>
            </select>
            <button className="btn-primary">
              Aplicar Filtros
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              {...fadeIn}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif font-bold text-xl mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  <button className="btn-secondary">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Siguiente
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Products; 