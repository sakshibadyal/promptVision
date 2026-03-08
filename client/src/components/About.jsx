import React from 'react';
import { FaBrain, FaBolt, FaImage } from 'react-icons/fa';

const About = () => {
  return (
    <section className="py-24 bg-[#050505] px-6 border-b border-zinc-900 flex justify-center">
      <div className="max-w-6xl w-full flex flex-col items-center text-center">
        
        {/* === Text Content === */}
        <div className="mb-20 w-full max-w-4xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            Introducing the <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Text to Image Generator
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl font-medium text-zinc-300 mb-6">
            Easily bring your ideas to life with our free AI image generator.
          </p>
          
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto">
            Simply type in a text prompt and our cutting-edge AI will generate high-quality images in seconds. From product visuals to character designs and portraits, even concepts that don't yet exist can be visualized effortlessly. Powered by advanced AI technology, the creative possibilities are limitless!
          </p>
        </div>

        {/* === Feature Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Card 1 */}
          <div className="p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl hover:border-pink-500/50 hover:bg-zinc-900 transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
              <FaBrain className="text-3xl text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Smart Generation</h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Our advanced AI understands context better than ever, bringing your prompts to life accurately.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl hover:border-pink-500/50 hover:bg-zinc-900 transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
              <FaBolt className="text-3xl text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Get high-quality results in seconds. No more waiting around for heavy renders.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl hover:border-pink-500/50 hover:bg-zinc-900 transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
              <FaImage className="text-3xl text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">High Resolution</h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Export your creations in stunning 4K quality, ready for any professional project.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;