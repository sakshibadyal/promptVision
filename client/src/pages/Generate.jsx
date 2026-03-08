import React, { useState } from 'react';
import Footer from '../components/Footer';

const Generate = () => {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Here is where we will eventually call your backend API!
    console.log("Generating image for:", prompt);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col">
      
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 px-5">
        
        {/* Page Titles */}
        <div className="max-w-3xl w-full text-center mb-10 mt-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-300">create</span> today?
          </h1>
          <p className="text-lg text-zinc-400">
            Describe the image you want to see. The more details, the better the result.
          </p>
        </div>

        {/* Prompt Input Box */}
        <form onSubmit={handleGenerate} className="w-full max-w-3xl relative">
          <div className="relative flex flex-col bg-zinc-900/80 border border-zinc-800 rounded-2xl p-2 shadow-[0_0_30px_rgba(236,72,153,0.05)] focus-within:border-pink-500/50 focus-within:shadow-[0_0_40px_rgba(236,72,153,0.15)] transition-all duration-300">
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying cars at sunset, cyberpunk style, highly detailed 4k..."
              className="w-full bg-transparent text-zinc-200 p-4 min-h-[140px] resize-none outline-none placeholder:text-zinc-600 text-lg"
            />
            
            <div className="flex justify-between items-center p-2 border-t border-zinc-800/50 mt-2">
              <span className="text-xs text-zinc-500 ml-2">
                Press <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Enter</kbd> to generate
              </span>
              
              <button 
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold rounded-xl hover:from-pink-500 hover:to-pink-400 transition-all shadow-lg shadow-pink-600/20 active:scale-95"
              >
                Generate ✨
              </button>
            </div>
            
          </div>
        </form>

        {/* Future Image Display Area can go right here below the prompt box */}
        
      </div>

      <Footer />
    </div>
  );
};

export default Generate;