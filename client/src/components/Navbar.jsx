import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Receive user and setUser props
const Navbar = ({ setShowLogin, user, setUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle the logout process
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsMobileMenuOpen(false);
    toast.info("Logged out successfully");
    navigate('/'); // Send them back to home page if they log out
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[85%] lg:w-full lg:max-w-5xl flex justify-between items-center px-5 py-3 lg:px-8 lg:py-4 bg-zinc-950/70 backdrop-blur-xl border border-zinc-800 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all">
      
      {/* Brand Logo & Text (Unchanged) */}
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
        <Link to="/payment" className="text-base lg:text-lg font-medium text-zinc-300 hover:text-pink-400 transition-colors duration-200">
          Pricing
        </Link>
        
        <div className="flex items-center border-l border-zinc-700 pl-8">
          {/* CONDITIONAL RENDERING FOR DESKTOP */}
          {user ? (
            <div className="flex items-center gap-6">
              <span className="text-zinc-200 font-medium">
                Hi, <span className="text-pink-400">{user.name.split(' ')[0]}</span>
              </span>
              <button 
                onClick={handleLogout}
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
          
          {/* Display Name in Mobile if logged in */}
          {user && (
            <>
              <div className="text-center text-zinc-200 font-medium pb-2 border-b border-zinc-800">
                Hi, <span className="text-pink-400">{user.name}</span>
              </div>
            </>
          )}

          <Link 
            to="/payment" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-zinc-300 hover:text-pink-400 transition-colors duration-200 text-center py-2"
          >
            Pricing
          </Link>
          
          <div className="w-full h-px bg-zinc-800"></div>

          {/* CONDITIONAL RENDERING FOR MOBILE BUTTON */}
          {user ? (
            <button 
              onClick={handleLogout}
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
  );
};

export default Navbar;