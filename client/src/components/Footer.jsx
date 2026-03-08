import React from 'react';
import { FaTwitter, FaGithub, FaDiscord, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  return (
    // Changed to pure black and reduced top/bottom padding
    <footer className="relative bg-black pt-16 pb-6 px-6 border-t border-zinc-900 overflow-hidden font-sans">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-900/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top Section: Brand + Newsletter - Reduced the gaps here */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 border-b border-zinc-900 pb-8">
          
          <div className="max-w-sm">
            {/* Gradient Logo */}
            <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.2)]">
              promptVision
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              The next generation of AI image synthesis. We are building the tools to help creators render their imagination at the speed of thought.
            </p>
            
            {/* Live System Status Indicator */}
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-400 bg-zinc-900/40 w-max px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              All Systems Operational
            </div>
          </div>

          {/* Newsletter / Waitlist Input */}
          <div className="w-full md:w-auto pt-2">
            <h4 className="text-zinc-300 font-medium mb-3 tracking-wide text-sm uppercase">Stay in the loop</h4>
            <div className="flex items-center bg-[#0a0a0a] border border-zinc-800 rounded-xl p-1.5 focus-within:border-pink-500/60 transition-colors shadow-inner">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent text-sm text-zinc-200 px-4 py-2 outline-none w-full md:w-64 placeholder-zinc-600"
              />
              <button className="bg-pink-600 hover:bg-pink-500 text-white p-2.5 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:-translate-y-0.5">
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
          
        </div>

        {/* Bottom Section: Links & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p>&copy; {new Date().getFullYear()} promptVision.</p>
            <div className="flex gap-6">
              <span className="hover:text-pink-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-pink-400 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-pink-400 cursor-pointer transition-colors">API Docs</span>
            </div>
          </div>
          
          {/* Socials */}
          <div className="flex gap-6 text-xl">
            <FaTwitter className="hover:text-pink-400 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.6)] cursor-pointer transition-all duration-300" />
            <FaGithub className="hover:text-pink-400 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.6)] cursor-pointer transition-all duration-300" />
            <FaDiscord className="hover:text-pink-400 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.6)] cursor-pointer transition-all duration-300" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;