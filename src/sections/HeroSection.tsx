import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArchitecturalVisual } from '../components/ArchitecturalVisual';
import { ArrowDown, Calendar } from 'lucide-react';

interface HeroSectionProps {
  onOpenConsultation?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="relative w-full pt-28 sm:pt-32 pb-16 sm:pb-20 bg-[#120407] text-[#F7F3EB] overflow-hidden border-b border-[#DFC18D]/20"
    >
      {/* Subtle Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(223, 193, 141, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(223, 193, 141, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <motion.div 
        style={{ opacity: opacityHero }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Pure, Clean Brand Statement */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Minimal Subtitle */}
            <span className="text-xs font-mono-tech tracking-[0.25em] text-[#DFC18D] uppercase font-semibold block">
              ARCHITECTURE & INTERIORS · MUMBAI & GOA
            </span>

            {/* Bold Hero Headline */}
            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#DFC18D] tracking-tight uppercase font-medium leading-[1.05]">
              CRAFTING SPACES.
              <span className="block text-white">BUILDING EXPERIENCES.</span>
            </h1>

            {/* Short, Punchy 1-Sentence Brand Ethos */}
            <p className="font-sans text-base sm:text-lg text-[#D4C8BC] leading-relaxed max-w-lg font-light">
              Bespoke private residences, tropical vacation villas, and contemporary workspaces rooted in context and built for everyday life.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#works"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#541422] hover:bg-[#6E1C2E] text-[#F7F3EB] border border-[#DFC18D] font-serif-display text-xs tracking-[0.18em] uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-98 font-semibold"
              >
                <span>EXPLORE WORK</span>
                <ArrowDown size={14} className="text-[#DFC18D]" />
              </a>

              {onOpenConsultation && (
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="inline-flex items-center space-x-2 px-5 py-3 bg-transparent hover:bg-[#20050B] text-[#DFC18D] border border-[#DFC18D]/40 hover:border-[#DFC18D] font-serif-display text-xs tracking-[0.18em] uppercase transition-all shadow-sm font-semibold cursor-pointer"
                >
                  <Calendar size={14} className="text-[#DFC18D]" />
                  <span>BOOK CONSULTATION</span>
                </button>
              )}
            </div>

            {/* Micro-inline credibility note */}
            <div className="pt-3 flex items-center space-x-4 text-xs font-mono-tech text-[#DFC18D]/70 tracking-wider">
              <span>25+ PROJECTS</span>
              <span>·</span>
              <span>10+ CITIES</span>
              <span>·</span>
              <span>TURNKEY EXECUTION</span>
            </div>
          </div>

          {/* Right Column: Pristine Architectural Photograph */}
          <div className="lg:col-span-6">
            <motion.div 
              style={{ y: yBackground }}
              className="relative border border-[#DFC18D]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#180509] aspect-[4/3] sm:aspect-[16/11] group"
            >
              <ArchitecturalVisual
                type="hero-casa-sylva"
                aspectRatio="aspect-auto"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Minimalist Image Caption */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono-tech text-[#DFC18D]/90 bg-[#120407]/85 backdrop-blur-xs px-3 py-1.5 border border-[#DFC18D]/30 pointer-events-none">
                <span className="uppercase tracking-wider">TROPICAL PRIVATE RESIDENCE</span>
                <span className="text-[#D4C8BC] uppercase tracking-wider">SIOLIM, GOA</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
