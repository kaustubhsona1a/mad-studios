import React from 'react';
import { MadLogo } from './MadLogo';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#33151A] text-[#F7F2EC] py-14 px-4 sm:px-6 lg:px-8 border-t border-[#C5A06B]/25 relative z-10 overflow-hidden">
      {/* Top Liquid Specular Line */}
      <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col space-y-10">
        
        {/* Top Row: Brand & Minimal Nav */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <MadLogo size="sm" variant="gold" />

          <nav className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs font-mono-tech tracking-[0.2em] text-[#D8C7B5] uppercase font-medium">
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#presence" className="hover:text-white transition-colors">Locations</a>
            <a href="#works" className="hover:text-white transition-colors">Projects</a>
            <a href="#studio" className="hover:text-white transition-colors">Our Team</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full border border-white/15 hover:border-[#C5A06B] liquid-glass text-[#C5A06B] hover:text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Back to Top"
            title="Scroll to Top"
          >
            <ArrowUp size={15} />
          </button>
        </div>

        {/* Center Statement */}
        <div className="text-center py-6 border-t border-b border-white/10">
          <p className="font-sans text-base sm:text-lg text-[#EBD2AC] tracking-wide font-light">
            “ We don't simply design spaces. We design the way they are experienced. ”
          </p>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#D8C7B5]/75 gap-3">
          <div>
            © {new Date().getFullYear()} M.A.D Studio. All rights reserved.
          </div>
          <div className="tracking-widest uppercase text-[11px] font-mono-tech font-semibold text-[#C5A06B]/90">
            Contemporary Architecture & Interiors · Mumbai & Goa
          </div>
        </div>
      </div>
    </footer>
  );
};
