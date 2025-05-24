import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import Home from './pages/Home';
import BookAppointment from './pages/appointments/BookAppointment';
import UserProfile from './pages/patient/UserProfile';
import MyAppointments from './pages/patient/MyAppointments';
import AvailableAppointments from './components/patient/AvailableAppointments';

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="container mx-auto py-8 px-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/my-appointments" element={<MyAppointments />} />
                        <Route path="/appointments/new" element={<AvailableAppointments />} />
                        <Route path="/appointments" element={<Navigate to="/appointments/new" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App; 