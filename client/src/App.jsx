import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Generate from './pages/Generate';
import LoginModal from './components/LoginModal';
import History from './pages/History';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" theme="dark" />

      <Navbar setShowLogin={setShowLogin} user={user} setUser={setUser} />
      
      {showLogin && <LoginModal setShowLogin={setShowLogin} setUser={setUser} />}

      <Routes>
        <Route path="/" element={<Home setShowLogin={setShowLogin} />} />
        <Route path="/generate" element={<Generate user={user} setUser={setUser} />} />
        <Route path="/payment" element={<Payment user={user} setUser={setUser} />} />
        <Route path="/history" element={<History user={user} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;