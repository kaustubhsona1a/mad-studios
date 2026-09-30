import React from 'react';
import { MadLogo } from './MadLogo';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#33151A] text-[#F7F2EC] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#C5A06B]/25">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        
        {/* Top Row: Brand & Minimal Nav */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <MadLogo size="sm" variant="gold" />

          <nav className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs font-mono-tech tracking-[0.2em] text-[#D8C7B5] uppercase font-medium">
            <a href="#about" className="hover:text-[#C5A06B] transition-colors">About Us</a>
            <a href="#services" className="hover:text-[#C5A06B] transition-colors">Services</a>
            <a href="#presence" className="hover:text-[#C5A06B] transition-colors">Locations</a>
            <a href="#works" className="hover:text-[#C5A06B] transition-colors">Projects</a>
            <a href="#studio" className="hover:text-[#C5A06B] transition-colors">Our Team</a>
            <a href="#contact" className="hover:text-[#C5A06B] transition-colors">Contact</a>
          </nav>

          <button
            onClick={scrollToTop}
            className="p-2.5 border border-[#C5A06B]/40 hover:border-[#C5A06B] bg-[#3E1D23] text-[#C5A06B] hover:text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Back to Top"
            title="Scroll to Top"
          >
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Center Philosophy Statement (From PDF Closing Page) */}
        <div className="text-center py-6 border-t border-b border-[#C5A06B]/20">
          <p className="font-serif-display text-sm sm:text-base text-[#C5A06B] tracking-[0.2em] uppercase font-medium">
            “ We don't design spaces. We design the way they are experienced. ”
          </p>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#D8C7B5]/80 gap-3">
          <div>
            © {new Date().getFullYear()} M.A.D Studio. All rights reserved.
          </div>
          <div className="tracking-widest uppercase text-[11px] font-mono-tech font-semibold text-[#C5A06B]">
            Contemporary Architecture · 2025 - 2026 Edition
          </div>
        </div>
      </div>
    </footer>
  );
};
