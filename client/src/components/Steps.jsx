import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Steps = () => {
  const stepsRef = useRef(null);

  useGSAP(() => {
    // Reveal the timeline line
    gsap.to(".timeline-line", {
      height: "100%",
      scrollTrigger: {
        trigger: stepsRef.current,
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1,
      }
    });

    // Fade in steps
    gsap.from(".step-item", {
      opacity: 0,
      y: 30,
      stagger: 0.3,
      scrollTrigger: {
        trigger: stepsRef.current,
        start: "top 70%",
      }
    });
  }, { scope: stepsRef });

  return (
    <section ref={stepsRef} className="py-24 bg-[#050505] text-white px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 tracking-tight">
          How <span className="text-pink-500">promptVision</span> Works
        </h2>
        
        <div className="relative">
          {/* Glowing Timeline Line */}
          <div className="absolute left-[29px] top-0 w-px h-0 bg-gradient-to-b from-pink-500 to-transparent timeline-line z-0"></div>

          <div className="flex flex-col gap-16 relative z-10">
            {/* Step 1 */}
            <div className="step-item flex items-start gap-8">
              <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-[#111111] border border-pink-500/50 rounded-full text-pink-500 font-bold text-xl shadow-[0_0_15px_rgba(236,72,153,0.3)]">01</div>
              <div className="pt-3">
                <h3 className="text-2xl font-semibold mb-2 text-zinc-100">Enter Your Prompt</h3>
                <p className="text-zinc-400 leading-relaxed max-w-md">Type in a detailed description of what you want to see. The more descriptive you are, the more magical the results.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step-item flex items-start gap-8">
              <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-[#111111] border border-pink-500/50 rounded-full text-pink-500 font-bold text-xl shadow-[0_0_15px_rgba(236,72,153,0.3)]">02</div>
              <div className="pt-3">
                <h3 className="text-2xl font-semibold mb-2 text-zinc-100">AI Processing</h3>
                <p className="text-zinc-400 leading-relaxed max-w-md">Our neural engine analyzes your text, weaving patterns and light to generate your visual data in real-time.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="step-item flex items-start gap-8">
              <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-[#111111] border border-pink-500/50 rounded-full text-pink-500 font-bold text-xl shadow-[0_0_15px_rgba(236,72,153,0.3)]">03</div>
              <div className="pt-3">
                <h3 className="text-2xl font-semibold mb-2 text-zinc-100">Download Your Masterpiece</h3>
                <p className="text-zinc-400 leading-relaxed max-w-md">Review your final result and download it instantly in high resolution for your professional projects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;