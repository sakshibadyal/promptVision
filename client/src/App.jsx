import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the alerts!

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Generate from './pages/Generate';
import LoginModal from './components/LoginModal';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  
  // Read from localStorage on initial load so they stay logged in upon refresh!
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  return (
    <BrowserRouter>
      {/* Add the ToastContainer here so it sits on top of everything. Dark theme looks great! */}
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Pass the user state and setUser function down */}
      <Navbar setShowLogin={setShowLogin} user={user} setUser={setUser} />
      
      {showLogin && <LoginModal setShowLogin={setShowLogin} setUser={setUser} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/generate" element={<Generate />} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;