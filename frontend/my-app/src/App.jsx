import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Alliances from './components/Alliances';
import Products from './components/Products';

// Envolvemos los componentes que necesitan acceso a la navegación
const LoginPageWithNavigation = withAuthNavigation(LoginPage);
const RegisterPageWithNavigation = withAuthNavigation(RegisterPage);

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
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
            <Navbar />
            <main className="flex-grow">
            <Routes>
              {/* Rutas públicas */}
                <Route path="/" element={
                  <>
                    <Hero />
                    <Services />
                    <Products />
                    <AboutUs />
                    <Alliances />
                    <Contact />
                  </>
                } />
              <Route path="/login" element={<LoginPageWithNavigation />} />
              <Route path="/register" element={<RegisterPageWithNavigation />} />
              <Route path="/test" element={<TestPage />} />
              
              {/* Rutas para administradores */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute 
                    element={<Dashboard />} 
                    requiredRole="ROLE_ADMIN" 
                  />
                } 
              />
              
              {/* Rutas para personal administrativo - comparten el Dashboard con permisos limitados */}
              <Route 
                path="/staff" 
                element={
                  <ProtectedRoute 
                    element={<Dashboard />} 
                    requiredRole="ROLE_STAFF" 
                  />
                }
              />
              
              {/* Rutas para pacientes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute 
                    element={<UserProfile />} 
                    requiredRole="ROLE_USER" 
                  />
                } 
              />
              
              {/* Rutas para doctores */}
              <Route 
                path="/doctor-dashboard" 
                element={
                  <ProtectedRoute 
                    element={<DoctorDashboard />} 
                    requiredRole="ROLE_DOCTOR" 
                  />
                } 
              />
              
                {/* Ruta por defecto */}
              <Route path="*" element={<HomePage />} />
            </Routes>
            </main>
            <Footer />
            <RouteDebugger />
          </div>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App; 