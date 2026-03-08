import React from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Steps from '../components/Steps';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <About />
      <Steps />
      <Footer />
    </div>
  );
};

export default Home;