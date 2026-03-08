import React from 'react';
import Footer from '../components/Footer';

const Payment = () => {
  return (
    // min-h-screen and flex-col ensure the footer always stays at the bottom
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col">
      
      {/* Added pt-40 (padding-top) so it doesn't hide behind the floating navbar */}
      <div className="flex-grow flex flex-col items-center pt-40 pb-24 px-5">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight text-center">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-300">Plan</span>
        </h1>
        <p className="text-lg text-zinc-400 mb-16 text-center max-w-2xl">
          Unlock premium features, faster generation times, and commercial rights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          
          {/* === Basic Plan === */}
          <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 flex flex-col hover:border-zinc-700 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-4">Creator</h2>
            <div className="text-4xl font-extrabold text-white mb-6">$9<span className="text-lg text-zinc-500 font-medium">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-zinc-400">
              <li className="flex items-center gap-2">✓ <span className="text-zinc-300">500 Image Generations</span></li>
              <li className="flex items-center gap-2">✓ <span className="text-zinc-300">Standard Resolution</span></li>
              <li className="flex items-center gap-2">✓ <span className="text-zinc-300">Community Support</span></li>
            </ul>
            <button className="w-full py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-colors">
              Subscribe Now
            </button>
          </div>

          {/* === Pro Plan (Pink Highlight) === */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-pink-500/50 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
            <div className="absolute top-0 right-6 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-b-lg uppercase tracking-wider shadow-lg">
              Most Popular
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Pro Vision</h2>
            <div className="text-4xl font-extrabold text-white mb-6">$29<span className="text-lg text-pink-400/70 font-medium">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-zinc-300">
              <li className="flex items-center gap-2 text-pink-500">✓ <span className="text-zinc-200">Unlimited Image Generations</span></li>
              <li className="flex items-center gap-2 text-pink-500">✓ <span className="text-zinc-200">4K Resolution Exports</span></li>
              <li className="flex items-center gap-2 text-pink-500">✓ <span className="text-zinc-200">Priority Generation Speed</span></li>
              <li className="flex items-center gap-2 text-pink-500">✓ <span className="text-zinc-200">Commercial Usage Rights</span></li>
            </ul>
            <button className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold rounded-lg hover:from-pink-500 hover:to-pink-400 transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">
              Subscribe Now
            </button>
          </div>

        </div>
      </div>

      {/* Footer attached at the bottom */}
      <Footer />
    </div>
  );
};

export default Payment;