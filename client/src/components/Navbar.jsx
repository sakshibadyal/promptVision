import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiZap, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = ({ setShowLogin, user, setUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // NEW STATE: Tracks if the logout confirmation modal is open
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  // Fetch fresh credits from DB on page load
  useEffect(() => {
    const fetchFreshCredits = async () => {
      const token = localStorage.getItem('token');
      if (user && token) {
        try {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/credits`, {
    headers: { token }
  });
          
          if (data.success) {
            setUser(prev => ({ ...prev, credits: data.credits }));
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
              storedUser.credits = data.credits;
              localStorage.setItem('user', JSON.stringify(storedUser));
            }
          }
        } catch (error) {
          console.error("Failed to fetch fresh credits", error);
        }
      }
    };

    fetchFreshCredits();
  }, []);

  // Handle the ACTUAL logout process
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowLogoutConfirm(false); // Close the modal
    setIsMobileMenuOpen(false); // Close mobile menu if open
    toast.info("Logged out successfully");
    navigate('/'); 
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[95%] md:w-[85%] lg:w-full lg:max-w-5xl flex justify-between items-center px-5 py-3 lg:px-8 lg:py-4 bg-zinc-950/70 backdrop-blur-xl border border-zinc-800 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all">
        
        {/* Brand Logo & Text */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:rotate-12 transition-transform duration-300">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(236,72,153,0.4)] font-bold text-xl lg:text-3xl tracking-tight">
            promptVision
          </span>
        </Link>
        
        {/* === Desktop Navigation === */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/history" className="text-base lg:text-lg font-medium text-zinc-300 hover:text-pink-400 transition-colors duration-200">
            History
          </Link>
          <Link to="/payment" className="text-base lg:text-lg font-medium text-zinc-300 hover:text-pink-400 transition-colors duration-200">
            Pricing
          </Link>
          
          <div className="flex items-center border-l border-zinc-700 pl-8">
            {user ? (
              <div className="flex items-center gap-6">
                
                {/* Desktop Credits Display */}
                <div className="flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/30 px-3 py-1 rounded-full text-pink-400 text-sm font-bold shadow-[0_0_10px_rgba(236,72,153,0.15)]">
                  <FiZap className="text-pink-500 drop-shadow-md" />
                  <span>{user.credits}</span>
                </div>

                <span className="text-zinc-200 font-medium">
                  Hi, <span className="text-pink-400">{user.name.split(' ')[0]}</span>
                </span>
                
                {/* UPDATED: Triggers the Modal instead of logging out instantly */}
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-full hover:bg-zinc-800 hover:text-white transition-all duration-300"
                >
                  Log out <FiLogOut />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="px-6 py-2 lg:px-8 lg:py-2.5 text-sm lg:text-base font-bold bg-transparent border border-pink-500 text-pink-400 rounded-full hover:bg-pink-600 hover:text-white hover:border-pink-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300"
              >
                Log in
              </button>
            )}
          </div>
        </div>

        {/* === Mobile Navigation Hamburger === */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/50 text-pink-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all duration-300 active:scale-95"
          >
            {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>

        {/* === Mobile Dropdown Menu === */}
        {isMobileMenuOpen && (
          <div className="absolute top-[120%] right-0 w-56 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl flex flex-col p-5 gap-4 md:hidden">
            
            {user && (
              <div className="flex flex-col items-center gap-2 pb-3 border-b border-zinc-800">
                <div className="text-zinc-200 font-medium">
                  Hi, <span className="text-pink-400">{user.name}</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/30 px-4 py-1.5 rounded-full text-pink-400 text-sm font-bold">
                  <FiZap className="text-pink-500" />
                  <span>{user.credits} Credits</span>
                </div>
              </div>
            )}

            <Link 
              to="/history" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-zinc-300 hover:text-pink-400 transition-colors duration-200 text-center py-2"
            >
              History
            </Link>
            <Link 
              to="/payment" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-zinc-300 hover:text-pink-400 transition-colors duration-200 text-center py-2"
            >
              Pricing
            </Link>
            
            <div className="w-full h-px bg-zinc-800"></div>

            {user ? (
              // UPDATED: Triggers Modal from Mobile Menu
              <button 
                onClick={() => { setShowLogoutConfirm(true); setIsMobileMenuOpen(false); }}
                className="w-full flex justify-center items-center gap-2 px-6 py-2.5 text-sm font-bold bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-full hover:bg-zinc-800 hover:text-white transition-all duration-300"
              >
                Log out <FiLogOut />
              </button>
            ) : (
              <button 
                onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }}
                className="w-full px-6 py-2.5 text-sm font-bold bg-transparent border border-pink-500 text-pink-400 rounded-full hover:bg-pink-600 hover:text-white hover:border-pink-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300"
              >
                Log in
              </button>
            )}
          </div>
        )}
      </nav>

      {/* === THE NEW LOGOUT CONFIRMATION MODAL === */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          {/* Modal Container */}
          <div className="bg-[#050505] border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all">
            
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiLogOut size={28} className="ml-1" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Ready to leave?</h3>
            <p className="text-zinc-400 text-sm mb-8 px-2">
              Are you sure you want to log out of your account? You will need to log back in to generate more images.
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-zinc-300 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;