import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const Generate = ({ user, setUser }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEnhanceBox, setShowEnhanceBox] = useState(false);
  const [enhancement, setEnhancement] = useState('');

  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Use Chrome.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Speak now");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setPrompt((prev) => prev ? prev + " " + spokenText : spokenText);
      toast.success("Voice added to prompt!");
    };

    recognition.onerror = () => {
      toast.error("Mic error. Please allow microphone permission.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleDownload = async () => {
    if (!image) return;

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `promptVision-${prompt.substring(0, 15).replace(/\s+/g, '-')}.jpg`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Downloading image...");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleShare = () => {
    if (!image) return;

    navigator.clipboard.writeText(image);
    toast.success("Link copied to clipboard!");
  };

  const handleGenerate = async (e, customPrompt = prompt) => {
    e.preventDefault();

    if (!customPrompt.trim()) return;

    if (!user) {
      toast.error("Please log in to generate images!");
      return;
    }

    setIsGenerating(true);
    setImage(null);

    try {
      const token = localStorage.getItem('token');

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/image/generate`,
        { prompt: customPrompt },
        { headers: { token } }
      );

      if (data.success) {
        setImage(data.imageUrl);
        setUser({ ...user, credits: data.credits });

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          storedUser.credits = data.credits;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }

        toast.success("Image generated successfully!");
      } else {
        toast.error(data.message);

        if (data.message === "No credits remaining") {
          navigate('/payment');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating the image.");
    }

    setIsGenerating(false);
  };

  const handleEnhance = async () => {
    if (!enhancement.trim()) {
      toast.error("Please write what you want to enhance.");
      return;
    }

    const enhancedPrompt = `${prompt}. Enhance this image with ${enhancement}.`;
    setPrompt(enhancedPrompt);

    await handleGenerate(
      { preventDefault: () => {} },
      enhancedPrompt
    );

    setEnhancement('');
    setShowEnhanceBox(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col">
      <div className="flex-grow flex flex-col items-center pt-32 pb-20 px-5">

        <div className="max-w-3xl w-full text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            What will you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-300">
              create
            </span>{" "}
            today?
          </h1>

          <p className="text-lg text-zinc-400">
            Describe the image you want to see. You can type or use your voice.
          </p>
        </div>

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

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleMicClick}
                  disabled={isGenerating}
                  className={`px-4 py-2.5 rounded-xl border font-semibold transition-all active:scale-95 ${
                    isListening
                      ? "bg-pink-600 text-white border-pink-500 animate-pulse"
                      : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {isListening ? "Listening..." : "🎤 Speak"}
                </button>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold rounded-xl hover:from-pink-500 hover:to-pink-400 transition-all shadow-lg shadow-pink-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? "Generating..." : "Generate ✨"}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="w-full max-w-3xl flex justify-center">
          {isGenerating && (
            <div className="w-full aspect-square md:aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center animate-pulse">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-400 font-medium animate-pulse">AI is dreaming...</p>
            </div>
          )}

          {image && !isGenerating && (
            <div className="relative group w-full flex flex-col items-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

              <img
                src={image}
                alt={prompt}
                className="relative w-full rounded-2xl border border-zinc-800 shadow-2xl object-cover mb-4"
              />

              <div className="flex flex-wrap gap-4 relative z-10 w-full justify-end">
                <button
                  onClick={() => setShowEnhanceBox(!showEnhanceBox)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-pink-500/50 text-pink-400 rounded-xl hover:bg-zinc-800 hover:text-pink-300 transition-all shadow-lg"
                >
                  Enhance Image ✨
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 hover:text-white transition-all shadow-lg"
                >
                  Share Link
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold rounded-xl hover:from-pink-500 hover:to-pink-400 transition-all shadow-lg shadow-pink-600/20 active:scale-95"
                >
                  Download
                </button>
              </div>

              {showEnhanceBox && (
                <div className="relative z-10 w-full mt-5 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm mb-3">
                    What do you want to enhance in this image?
                  </p>

                  <input
                    type="text"
                    value={enhancement}
                    onChange={(e) => setEnhancement(e.target.value)}
                    placeholder="Example: more realistic lighting, better face details, cyberpunk background..."
                    className="w-full bg-[#111111] text-zinc-200 p-3 rounded-lg border border-zinc-700 outline-none focus:border-pink-500 mb-4"
                  />

                  <button
                    onClick={handleEnhance}
                    disabled={isGenerating}
                    className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold rounded-xl hover:from-pink-500 hover:to-pink-400 transition-all disabled:opacity-50"
                  >
                    Generate Enhanced Image ✨
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Generate;