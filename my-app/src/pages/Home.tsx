import React from 'react';
import CTASection from '../components/home/CTASection';

const Home: React.FC = () => {
    return (
        <div>
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8">
                        Bienvenido a Orto-White
                    </h1>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto">
                        Tu clínica dental de confianza. Agenda tus citas de manera fácil y rápida.
                    </p>
                </div>
            </div>
            <CTASection />
        </div>
    );
};

export default Home; 