import React from 'react';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Página de Prueba</h1>
      <div className="flex flex-col space-y-4">
        <Link to="/" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Ir a Inicio
        </Link>
        <Link to="/login" className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">
          Ir a Login
        </Link>
        <Link to="/register" className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600">
          Ir a Registro
        </Link>
      </div>
    </div>
  );
};

export default TestPage; 