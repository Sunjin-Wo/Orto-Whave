import React from 'react';
import { useLocation } from 'react-router-dom';

const RouteDebugger = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs z-50">
      <div>Ruta actual: {location.pathname}</div>
      <div>Hash: {location.hash || 'ninguno'}</div>
      <div>Search: {location.search || 'ninguno'}</div>
    </div>
  );
};

export default RouteDebugger; 