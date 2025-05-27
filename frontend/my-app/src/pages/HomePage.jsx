import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import AboutUs from '../components/AboutUs';
import Contact from '../components/Contact';
import Alliances from '../components/Alliances';
import Products from '../components/Products';

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Services />
      <Products />
      <AboutUs />
      <Alliances />
      <Contact />
    </div>
  );
};

export default HomePage; 