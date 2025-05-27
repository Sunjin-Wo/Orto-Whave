import React, { useState } from 'react';
import { XMarkIcon, Bars3Icon, UserGroupIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';
import Settings from './Settings';

const Dashboard = () => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [activeView, setActiveView] = useState('users');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar para móviles */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ${isOffcanvasOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>
      
      <div className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-30 transform transition-transform duration-300 ${isOffcanvasOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">OWC Orthowave Colombia</h2>
          <button onClick={() => setIsOffcanvasOpen(false)} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => {
                  setActiveView('users');
                  setIsOffcanvasOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-lg text-left ${activeView === 'users' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <UserGroupIcon className="h-5 w-5 mr-3" />
                Usuarios
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveView('settings');
                  setIsOffcanvasOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-lg text-left ${activeView === 'settings' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <CogIcon className="h-5 w-5 mr-3" />
                Configuración
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  logout(navigate);
                  setIsOffcanvasOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 rounded-lg text-left text-red-600 hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button onClick={() => setIsOffcanvasOpen(true)} className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden">
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary">OWC Orthowave Colombia</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    A
                  </div>
                  <button 
                    onClick={() => logout(navigate)}
                    className="ml-3 flex items-center text-gray-500 hover:text-red-600"
                    title="Cerrar sesión"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                    <span className="ml-1 text-sm font-medium">Salir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar para escritorio */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 pt-16">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1">
              <button 
                onClick={() => setActiveView('users')}
                className={`flex items-center w-full px-4 py-2 rounded-lg text-left ${activeView === 'users' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <UserGroupIcon className="h-5 w-5 mr-3" />
                Usuarios
              </button>
              <button 
                onClick={() => setActiveView('settings')}
                className={`flex items-center w-full px-4 py-2 rounded-lg text-left ${activeView === 'settings' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <CogIcon className="h-5 w-5 mr-3" />
                Configuración
              </button>
              <button 
                onClick={() => logout(navigate)}
                className="flex items-center w-full px-4 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 mt-4"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="md:pl-64">
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 