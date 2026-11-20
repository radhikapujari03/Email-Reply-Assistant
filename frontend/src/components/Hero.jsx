import React from 'react';
import { Sparkles, Shield, HeartHandshake, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative text-center pt-8 pb-6 px-4 max-w-4xl mx-auto">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-44 bg-[#16BFD0]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#152238] border border-[#263B58] mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-[#16BFD0] animate-pulse" />
        <span className="text-xs font-medium text-[#A9B8CC]">
          Intelligent Tone-Adaptive Draft Generation
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F1F7FF] mb-3 leading-tight">
        Write Better Emails with{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16BFD0] via-[#6FA8FF] to-[#A78BFA]">
          AI
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-[#A9B8CC] max-w-2xl mx-auto mb-6 leading-relaxed">
        Turn any email into the perfect reply with the power of Generative AI.
        Get 3 tailored replies in <span className="text-[#16BFD0] font-medium">Formal</span>,{' '}
        <span className="text-[#6FA8FF] font-medium">Friendly</span>, and{' '}
        <span className="text-[#A78BFA] font-medium">Short</span> styles with one click.
      </p>

      {/* Three Feature Highlights Pill Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-[#A9B8CC]">
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#152238]/80 border border-[#263B58]">
          <Shield className="w-3.5 h-3.5 text-[#16BFD0]" />
          <span>Formal for Official Comms</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#152238]/80 border border-[#263B58]">
          <HeartHandshake className="w-3.5 h-3.5 text-[#6FA8FF]" />
          <span>Friendly for Coworkers</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#152238]/80 border border-[#263B58]">
          <Zap className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Short for Quick Updates</span>
        </div>
      </div>
    </section>
  );
}
