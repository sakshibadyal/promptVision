import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const Generate = ({ user, setUser }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // 1. Check if user is logged in before they try to generate
    if (!user) {
      toast.error("Please log in to generate images!");
      return;
    }

    setIsGenerating(true);
    setImage(null); // Clear previous image

    try {
      // 2. Get the JWT token from local storage
      const token = localStorage.getItem('token');

      // 3. Make the API call to your backend
      const { data } = await axios.post(
        'http://localhost:5000/api/image/generate',
        { prompt },
        { headers: { token } } // Pass token for auth middleware
      );

      if (data.success) {
        // 4. Show the image and update credits!
        setImage(data.imageUrl);
        setUser({ ...user, credits: data.credits }); // Updates Navbar live
        toast.success("Image generated successfully!");
      } else {
        // Handle no credits or other errors
        toast.error(data.message);
        if (data.message === "No credits remaining") {
          navigate('/payment'); // Redirect to buy more credits
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating the image.");
    }

    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col">
      <div className="flex-grow flex flex-col items-center pt-32 pb-20 px-5">
        
        {/* Page Titles */}
        <div className="max-w-3xl w-full text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-300">create</span> today?
          </h1>
          <p className="text-lg text-zinc-400">
            Describe the image you want to see. The more details, the better the result.
          </p>
        </div>

        {/* Prompt Input Box */}
        <form onSubmit={handleGenerate} className="w-full max-w-3xl relative mb-12">
          <div className="relative flex flex-col bg-zinc-900/80 border border-zinc-800 rounded-2xl p-2 shadow-[0_0_30px_rgba(236,72,153,0.05)] focus-within:border-pink-500/50 focus-within:shadow-[0_0_40px_rgba(236,72,153,0.15)] transition-all duration-300">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying cars at sunset, cyberpunk style, highly detailed 4k..."
              className="w-full bg-transparent text-zinc-200 p-4 min-h-[140px] resize-none outline-none placeholder:text-zinc-600 text-lg"
              disabled={isGenerating}
            />
            <div className="flex justify-between items-center p-2 border-t border-zinc-800/50 mt-2">
              <span className="text-xs text-zinc-500 ml-2">
                {user ? `Credits remaining: ${user.credits}` : 'Log in to generate'}
              </span>
              <button 
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold rounded-xl hover:from-pink-500 hover:to-pink-400 transition-all shadow-lg shadow-pink-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? "Generating..." : "Generate ✨"}
              </button>
            </div>
          </div>
        </form>

        {/* === Image Display Area === */}
        <div className="w-full max-w-3xl flex justify-center">
          {isGenerating && (
            <div className="w-full aspect-square md:aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center animate-pulse">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-400 font-medium animate-pulse">AI is dreaming...</p>
            </div>
          )}

          {image && !isGenerating && (
            <div className="relative group w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <img 
                src={image} 
                alt={prompt} 
                className="relative w-full rounded-2xl border border-zinc-800 shadow-2xl object-cover"
              />
            </div>
          )}
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default Generate;