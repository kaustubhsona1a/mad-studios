import React from 'react';
import { MadLogo } from './MadLogo';
import { ArrowUp, MessageCircle, Instagram, Lock } from 'lucide-react';

interface FooterProps {
  onOpenOperatorPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOperatorPortal }) => {
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

          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs font-mono-tech tracking-[0.16em] text-[#D8C7B5] uppercase font-medium">
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#presence" className="hover:text-white transition-colors">Locations</a>
            <a href="#works" className="hover:text-white transition-colors">Projects</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
            <a href="#studio" className="hover:text-white transition-colors">Our Team</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-3">
            <a
              href="https://wa.me/918822225224?text=Hi%20M.A.D%20Studio,%20I'd%20like%20to%20discuss%20my%20architectural%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-sans font-semibold transition-all flex items-center space-x-1.5"
              title="Chat on WhatsApp 8822225224"
            >
              <MessageCircle size={13} />
              <span>WhatsApp: 8822225224</span>
            </a>

            <a
              href="https://www.instagram.com/madstudio.arch/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full border border-white/15 hover:border-[#C5A06B] text-[#D8C7B5] hover:text-[#EBD2AC] text-xs font-sans font-medium transition-all flex items-center space-x-1.5"
              title="Instagram @madstudio.arch"
            >
              <Instagram size={13} />
              <span>@madstudio.arch</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full border border-white/15 hover:border-[#C5A06B] liquid-glass text-[#C5A06B] hover:text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              aria-label="Back to Top"
              title="Scroll to Top"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>

        {/* Center Statement */}
        <div className="text-center py-6 border-t border-b border-white/10">
          <p className="font-sans text-base sm:text-lg text-[#EBD2AC] tracking-wide font-light">
            “ We don't simply design spaces. We design the way they are experienced. ”
          </p>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#D8C7B5]/75 gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} M.A.D Studio. All rights reserved.</span>
            {onOpenOperatorPortal && (
              <button
                onClick={onOpenOperatorPortal}
                className="opacity-40 hover:opacity-100 text-[#C5A06B] hover:text-[#EBD2AC] transition-opacity cursor-pointer p-0.5 inline-flex items-center space-x-1 text-[10px] font-mono-tech"
                title="Studio Operator Terminal (Secret Access: Ctrl+Shift+P or #portal)"
              >
                <span>·</span>
                <Lock size={10} />
                <span>Operator</span>
              </button>
            )}
          </div>
          <div className="tracking-widest uppercase text-[11px] font-mono-tech font-semibold text-[#C5A06B]/90">
            Modern Architecture & Interiors · Mumbai & Goa
          </div>
        </div>
      </div>
    </footer>
  );
};
