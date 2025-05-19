import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import AuthService from '../../services/AuthService';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Verificar si el correo viene como parámetro en la URL
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      setError('Por favor ingresa tu correo electrónico y el código de verificación');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Verificar el correo electrónico
      await AuthService.verifyEmail(email, code);
      
      setMessage('Correo verificado correctamente. Iniciando sesión automáticamente...');
      
      // Obtener la contraseña temporal guardada durante el registro
      const tempPassword = localStorage.getItem(`temp_pwd_${email}`);
      
      if (tempPassword) {
        try {
          // Intentar iniciar sesión automáticamente
          await AuthService.login(email, tempPassword);
          
          // Eliminar la contraseña temporal
          AuthService.removeTempPassword(email);
          
          // Redirigir al dashboard de pacientes
          setTimeout(() => {
            navigate('/patient-dashboard');
          }, 2000);
        } catch (loginError) {
          // Si falla el login automático, redirigir a la página de login
          setTimeout(() => {
            navigate('/auth/login', { 
              state: { 
                verificationSuccess: true,
                email
              }
            });
          }, 3000);
        }
      } else {
        // Si no hay contraseña temporal, redirigir a la página de login
        setTimeout(() => {
          navigate('/auth/login', { 
            state: { 
              verificationSuccess: true,
              email
            }
          });
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Error al verificar correo electrónico');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    try {
      setResendLoading(true);
      setError('');
      
      const response = await AuthService.resendVerificationCode(email);
      
      setResendSuccess(true);
      setMessage(response.message || 'Código de verificación reenviado exitosamente');
      
      // Ocultar el mensaje de éxito después de unos segundos
      setTimeout(() => {
        setResendSuccess(false);
        setMessage('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Error al reenviar el código de verificación');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Verificación de Correo
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Hemos enviado un código de verificación a tu correo electrónico. 
            Por favor ingresa el código para verificar tu cuenta.
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          
          <form onSubmit={handleVerify}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              type="email"
              required
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Código de Verificación"
              variant="outlined"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Verificar'}
            </Button>
          </form>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ¿No recibiste el código?
            </Typography>
            
            <Button
              onClick={handleResendCode}
              variant="text"
              disabled={resendLoading || !email}
              sx={{ textTransform: 'none' }}
            >
              {resendLoading ? <CircularProgress size={24} /> : 'Reenviar código'}
            </Button>
            
            <Button
              onClick={() => navigate('/auth/login')}
              variant="text"
              sx={{ ml: 2, textTransform: 'none' }}
            >
              Volver al inicio de sesión
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailPage; 