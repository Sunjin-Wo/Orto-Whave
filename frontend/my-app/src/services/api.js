import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL base del backend
  timeout: 5000, // timeout de 5 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  createUser: (userData) => api.post('/auth/users', userData),
  verifyEmail: (code) => api.get(`/auth/verify?code=${code}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const userService = {
  getUsers: () => api.get('/usuarios'),
  getUser: (id) => api.get(`/usuarios/${id}`),
  updateUser: (id, userData) => api.put(`/usuarios/${id}`, userData),
  deleteUser: (id) => api.delete(`/usuarios/${id}`),
  activateUser: (id) => api.put(`/usuarios/${id}/activar`),
  deactivateUser: (id) => api.put(`/usuarios/${id}/desactivar`),
};

export default api; 