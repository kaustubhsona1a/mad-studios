import React, { useState, useEffect } from 'react';
import { MadLogo } from './MadLogo';
import { Menu, X, Phone, Calendar } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenConsultation 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 w-full max-w-[100vw] overflow-x-clip ${
          isScrolled
            ? 'bg-[#140407]/95 backdrop-blur-md border-b border-[#DFC18D]/30 py-2.5 sm:py-3 shadow-2xl'
            : 'bg-[#18060A]/85 backdrop-blur-sm border-b border-[#DFC18D]/20 py-3 sm:py-4'
        }`}
      >
        {/* Top Gold Scroll Progress Indicator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-black/40 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#8E2838] via-[#DFC18D] to-[#F4E2BE] transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 box-border">
          
          {/* Brand Logo & Studio Disciplines */}
          <a href="#" className="flex items-center space-x-2.5 group shrink-0">
            <MadLogo size="sm" variant="gold" />
            <div className="hidden lg:flex flex-col text-left border-l border-[#DFC18D]/30 pl-2.5">
              <span className="text-[10px] font-serif-display text-[#DFC18D] font-semibold tracking-[0.16em] group-hover:text-white transition-colors uppercase leading-tight">
                Architecture & Interiors
              </span>
              <span className="text-[8px] font-sans tracking-[0.16em] text-[#D4C8BC] uppercase mt-0.5">
                Mumbai · Goa · Bengaluru
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-[11px] font-sans tracking-[0.16em] uppercase text-[#F7F3EB]/90 font-medium">
            <a
              href="#about"
              className="hover:text-[#DFC18D] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#DFC18D] hover:after:w-full after:transition-all"
            >
              ABOUT
            </a>
            <a
              href="#services"
              className="hover:text-[#DFC18D] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#DFC18D] hover:after:w-full after:transition-all"
            >
              SERVICES
            </a>
            <a
              href="#presence"
              className="hover:text-[#DFC18D] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#DFC18D] hover:after:w-full after:transition-all"
            >
              LOCATIONS
            </a>
            <a
              href="#works"
              className="hover:text-[#DFC18D] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#DFC18D] hover:after:w-full after:transition-all"
            >
              PROJECTS
            </a>
            <a
              href="#studio"
              className="hover:text-[#DFC18D] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#DFC18D] hover:after:w-full after:transition-all"
            >
              STUDIO
            </a>
            <a
              href="#contact"
              className="hover:text-[#DFC18D] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#DFC18D] hover:after:w-full after:transition-all"
            >
              CONTACT
            </a>
          </nav>

          {/* Action Zone: Phone & Consultation Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <a
              href="tel:+918822225224"
              className="hidden 2xl:inline-flex items-center space-x-1.5 text-xs font-mono-tech text-[#DFC18D] hover:text-white transition-colors px-2 py-1"
            >
              <Phone size={12} className="text-[#DFC18D]" />
              <span>+91 8822225224</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 border border-[#DFC18D] bg-[#3E1019] hover:bg-[#581624] text-[#F7F3EB] font-serif-display text-[10px] sm:text-xs tracking-[0.14em] uppercase transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <Calendar size={12} className="text-[#DFC18D] shrink-0" />
              <span><span className="hidden sm:inline">FREE </span>CONSULTATION</span>
            </button>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 border border-[#DFC18D]/30 lg:hidden text-[#DFC18D] hover:bg-[#3E1019] transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#120407]/98 backdrop-blur-xl lg:hidden flex flex-col p-6 animate-fade-in border-b border-[#DFC18D]/40 max-w-[100vw] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[#DFC18D]/30 pb-4 mb-6">
            <MadLogo size="sm" variant="gold" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#DFC18D] border border-[#DFC18D]/30 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col space-y-5 text-base font-serif-display tracking-[0.2em] uppercase text-[#F7F3EB]">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DFC18D] py-1 border-b border-[#DFC18D]/15"
            >
              About
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DFC18D] py-1 border-b border-[#DFC18D]/15"
            >
              Services
            </a>
            <a
              href="#presence"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DFC18D] py-1 border-b border-[#DFC18D]/15"
            >
              Locations
            </a>
            <a
              href="#works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DFC18D] py-1 border-b border-[#DFC18D]/15"
            >
              Projects
            </a>
            <a
              href="#studio"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DFC18D] py-1 border-b border-[#DFC18D]/15"
            >
              Studio & Team
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#DFC18D] py-1 border-b border-[#DFC18D]/15"
            >
              Contact
            </a>
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-[#DFC18D]/30">
            <a
              href="tel:+918822225224"
              className="flex items-center justify-center space-x-2 py-3 border border-[#DFC18D]/40 bg-[#250810] text-[#DFC18D] text-xs font-mono-tech"
            >
              <Phone size={14} />
              <span>+91 8822225224</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3 bg-[#8E2838] hover:bg-[#A32E42] text-white border border-[#DFC18D] font-serif-display text-xs tracking-[0.2em] uppercase font-bold cursor-pointer"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      )}
    </>
  );
};
