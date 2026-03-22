import React, { useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaGoogle } from 'react-icons/fa';
import { SiApple } from 'react-icons/si';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginModal = ({ setShowLogin, setUser }) => {
  const modalRef = useRef(null);
  const [currentState, setCurrentState] = useState('Login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // GSAP Entrance Animation
  useGSAP(() => {
    gsap.from(modalRef.current, { y: 20, opacity: 0, scale: 0.98, duration: 0.4, ease: "power2.out" });
  }, []);

  // Handle Input Changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Form Submission (Login or Register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Determine which backend route to hit based on the current state
      const endpoint = currentState === 'Login' ? '/api/user/login' : '/api/user/register';
      
      // Make the POST request to the Express server
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, formData);

      if (data.success) {
        // Save auth data to localStorage so they stay logged in on refresh
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        
        // Update the React state in App.jsx so the Navbar updates instantly
        setUser(data.user); 
        
        // Show success toast
        toast.success(`Successfully ${currentState === 'Login' ? 'Logged in' : 'Registered'}!`);
        
        // Close the modal
        setShowLogin(false); 
      } else {
        // Show error toast (e.g., "Invalid credentials" or "User already exists")
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong connecting to the server.");
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 font-sans overflow-y-auto">
      <div ref={modalRef} className="relative w-full max-w-3xl bg-[#050505] rounded-2xl border border-zinc-800 shadow-[0_0_40px_rgba(236,72,153,0.15)] flex flex-col md:flex-row overflow-hidden">
        
        {/* Close Button */}
        <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-xl text-zinc-500 hover:text-pink-500 transition-colors z-20">
          <IoClose />
        </button>

        {/* === Left Side Branding Panel === */}
        <div className="hidden md:flex flex-col justify-between w-2/5 p-8 relative overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentState === 'Login' ? <>Welcome<br/>Back</> : <>Join<br/>Us</>}
            </h2>
            <p className="text-zinc-400 text-xs">
              {currentState === 'Login' 
                ? 'Log in to continue your creative journey.' 
                : 'Create an account to start your creative journey.'}
            </p>
          </div>
          <div className="relative z-10 text-pink-500 font-bold text-lg">promptVision</div>
        </div>

        {/* === Right Side Form Panel === */}
        <div className="w-full md:w-3/5 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-white mb-6">
            {currentState === 'Login' ? 'Log In' : 'Sign Up'}
          </h2>
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Conditional Name Field for Sign Up */}
            {currentState === 'Sign Up' && (
              <input 
                type="text" 
                name="name" 
                onChange={handleChange} 
                placeholder="Full Name" 
                required
                className="w-full bg-[#111111] text-zinc-200 text-sm p-3 rounded-lg border border-zinc-800 focus:border-pink-500 outline-none transition-all" 
              />
            )}
            
            <input 
              type="email" 
              name="email" 
              onChange={handleChange} 
              placeholder="Email Address" 
              required 
              className="w-full bg-[#111111] text-zinc-200 text-sm p-3 rounded-lg border border-zinc-800 focus:border-pink-500 outline-none transition-all" 
            />
            
            <input 
              type="password" 
              name="password" 
              onChange={handleChange} 
              placeholder="Password" 
              required 
              className="w-full bg-[#111111] text-zinc-200 text-sm p-3 rounded-lg border border-zinc-800 focus:border-pink-500 outline-none transition-all" 
            />
            
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-pink-600 text-white p-3 rounded-lg mt-2 hover:bg-pink-500 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? "Processing..." 
                : currentState === 'Login' ? "Continue \u2192" : "Create Account \u2192"}
            </button>
          </form>

          {/* Social Logins Divider */}
          <div className="flex items-center gap-2 my-5">
            <div className="flex-1 h-px bg-zinc-800"></div>
            <span className="text-[10px] text-zinc-500 uppercase">Or</span>
            <div className="flex-1 h-px bg-zinc-800"></div>
          </div>

          <div className="flex gap-3">
            <button type="button" className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-[#111111] border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-300 text-xs font-medium"><FaGoogle size={14}/> Google</button>
            <button type="button" className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-[#111111] border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-300 text-xs font-medium"><SiApple size={14}/> Apple</button>
          </div>

          {/* Toggle Button */}
          <p className="text-center text-zinc-500 text-sm mt-8">
            {currentState === 'Login' ? "New here? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')} 
              className="text-pink-500 hover:text-pink-400 font-medium transition-colors"
            >
              {currentState === 'Login' ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;