import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Header = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".ai-greeting", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    })
    .from(".gen-btn-container", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4");
  }, { scope: containerRef });

  return (
    <header 
      ref={containerRef} 
      className="w-full min-h-[85vh] flex flex-col justify-center items-center bg-[#0a0a0a] px-4 font-sans"
    >
      {/* Centered AI Greeting */}
      <div className="ai-greeting text-center mb-10 mt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Bring your ideas to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-300">life</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
          Unlock the power of AI to transform your text into stunning, high-quality images in seconds.
        </p>
      </div>

      {/* Hovering Generate Button */}
      <div className="gen-btn-container relative group mt-4">
        {/* Glowing background effect that intensifies on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
        
        {/* The actual button linking to the Generate page */}
        <Link 
          to="/generate" 
          className="relative flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-full text-white text-lg font-semibold hover:bg-zinc-800 transition-all duration-300"
        >
          <span>Generate Images</span>
          
          {/* Small arrow icon that slides right on hover */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-pink-500 group-hover:translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default Header;