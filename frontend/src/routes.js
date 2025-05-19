import React from 'react';
import { Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import PatientDashboardPage from './pages/user/PatientDashboardPage';

// Guards
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/home" /> },
      { path: 'home', element: <HomePage /> },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        )
      },
      {
        path: 'profile',
        element: (
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        )
      },
      {
        path: 'patient-dashboard',
        element: (
          <AuthGuard>
            <PatientDashboardPage />
          </AuthGuard>
        )
      }
    ]
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      )},
      { path: 'register', element: (
        <GuestGuard>
          <RegisterPage />
        </GuestGuard>
      )},
      { path: 'verify-email', element: <VerifyEmailPage /> }
    ]
  },
  { path: '*', element: <Navigate to="/home" /> }
];

export default routes; 