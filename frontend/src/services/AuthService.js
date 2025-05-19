import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Gestionar la contraseña temporal para el inicio de sesión automático después de verificar el correo
const setTempPassword = (email, password) => {
  localStorage.setItem(`temp_pwd_${email}`, password);
  
  // Configurar un timeout para eliminar la contraseña después de 1 hora
  setTimeout(() => {
    localStorage.removeItem(`temp_pwd_${email}`);
  }, 3600000); // 1 hora
};

const removeTempPassword = (email) => {
  localStorage.removeItem(`temp_pwd_${email}`);
};

// Registrar un nuevo usuario
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    
    // Guardar la contraseña temporalmente para el inicio de sesión automático después de verificar
    if (response.data && userData.email && userData.password) {
      setTempPassword(userData.email, userData.password);
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Error de conexión con el servidor' };
  }
};

// Verificar correo electrónico
const verifyEmail = async (email, code) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/verify-email`, { email, code });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Error de conexión con el servidor' };
  }
};

// Iniciar sesión
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Error de conexión con el servidor' };
  }
};

// Reenviar código de verificación
const resendVerificationCode = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/resend-verification`, { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Error de conexión con el servidor' };
  }
};

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener usuario actual
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Comprobar si el usuario está autenticado
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const AuthService = {
  register,
  verifyEmail,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  resendVerificationCode,
  setTempPassword,
  removeTempPassword
};

export default AuthService; 