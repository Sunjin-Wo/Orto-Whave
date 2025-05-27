import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Limpiar localStorage al iniciar la aplicación para evitar problemas de autenticación
if (window.location.pathname === '/login' || window.location.pathname === '/register') {
  console.log('Limpiando localStorage para evitar problemas de autenticación');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
