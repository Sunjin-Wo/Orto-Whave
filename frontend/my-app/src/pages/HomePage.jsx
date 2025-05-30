import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Products from '../components/Products';
import AboutUs from '../components/AboutUs';
import Alliances from '../components/Alliances';
import Contact from '../components/Contact';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <Hero />
        <Services />
        <Products />
        <AboutUs />
        <Alliances />
        <Contact />
      </main>
    </div>
  );
};

export default HomePage; 