import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import DoctorDashboard from './components/DoctorDashboard';
import HomePage from './pages/HomePage'; // Tu página principal
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TestPage from './pages/TestPage'; // Página de prueba
import RouteDebugger from './components/RouteDebugger'; // Componente de depuración
import { AuthProvider, withAuthNavigation } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Envolvemos los componentes que necesitan acceso a la navegación
const LoginPageWithNavigation = withAuthNavigation(LoginPage);
const RegisterPageWithNavigation = withAuthNavigation(RegisterPage);

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPageWithNavigation />} />
              <Route path="/register" element={<RegisterPageWithNavigation />} />
              <Route path="/test" element={<TestPage />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute 
                    element={<Dashboard />} 
                    requiredRole="ROLE_ADMIN" 
                  />
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute 
                    element={<UserProfile />} 
                    requiredRole="ROLE_USER" 
                  />
                } 
              />
              
              <Route 
                path="/doctor-dashboard" 
                element={
                  <ProtectedRoute 
                    element={<DoctorDashboard />} 
                    requiredRole="ROLE_DOCTOR" 
                  />
                } 
              />
              
              {/* Ruta para cualquier otra dirección no definida */}
              <Route path="*" element={<HomePage />} />
            </Routes>
            
            {/* Componente de depuración */}
            <RouteDebugger />
          </div>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App; 