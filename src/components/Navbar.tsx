import React, { useState, useEffect } from 'react';
import { MadLogo } from './MadLogo';
import { Menu, X, Phone, Calendar, ArrowUpRight, MessageCircle, Instagram } from 'lucide-react';

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
      {/* Full-Width Liquid Glass Header (Full Wide at Top, No Island Shape) */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 w-full overflow-hidden border-b ${
          isScrolled
            ? 'bg-[#2A0E13]/95 backdrop-blur-2xl border-[#C5A06B]/35 shadow-[0_12px_40px_rgba(0,0,0,0.65)] py-2 sm:py-3'
            : 'bg-[#36161D]/90 backdrop-blur-2xl border-white/12 shadow-[0_8px_30px_rgba(0,0,0,0.45)] py-2 sm:py-3'
        }`}
      >
        {/* Top Gold Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.06] overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#542A33] via-[#C5A06B] to-[#EBD2AC] transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Specular Edge Highlight along top and bottom */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A06B]/30 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Brand Logo Lockup */}
          <a href="#" className="flex items-center space-x-2.5 group shrink-0">
            <MadLogo size="sm" variant="gold" />
            <div className="hidden 2xl:flex flex-col text-left border-l border-white/15 pl-2.5">
              <span className="text-[10px] font-serif-display text-white/90 font-medium tracking-[0.16em] group-hover:text-[#C5A06B] transition-colors uppercase leading-tight">
                Architecture & Interiors
              </span>
              <span className="text-[8.5px] font-sans tracking-[0.16em] text-[#D8C7B5]/80 uppercase mt-0.5">
                Mumbai · Goa
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (Shown on XL+ to prevent any tablet/laptop overflow) */}
          <nav className="hidden xl:flex items-center space-x-1 2xl:space-x-2 text-[11px] 2xl:text-xs font-sans tracking-[0.12em] 2xl:tracking-[0.16em] uppercase text-white/80 font-medium">
            {[
              { label: 'ABOUT', href: '#about' },
              { label: 'SERVICES', href: '#services' },
              { label: 'LOCATIONS', href: '#presence' },
              { label: 'PROJECTS', href: '#works' },
              { label: 'REVIEWS', href: '#reviews' },
              { label: 'STUDIO', href: '#studio' },
              { label: 'CONTACT', href: '#contact' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-2.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.08] transition-all duration-200 relative group whitespace-nowrap"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-1 left-2.5 right-2.5 h-[1.5px] bg-[#C5A06B] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </a>
            ))}
          </nav>

          {/* Action Zone: Clean Consultation CTA + Mobile/Tablet Menu Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="relative overflow-hidden inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] hover:from-[#5C202C] hover:to-[#842238] text-[#F7F2EC] border border-[#C5A06B]/70 hover:border-[#C5A06B] font-serif-display text-[10px] sm:text-xs tracking-[0.12em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_25px_rgba(197,160,107,0.35)] hover:scale-[1.02] active:scale-98 shrink-0 cursor-pointer whitespace-nowrap font-semibold"
            >
              {/* Glass specular sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              <Calendar size={12} className="text-[#C5A06B] shrink-0" />
              <span><span className="hidden sm:inline">BOOK </span>CONSULTATION</span>
              <ArrowUpRight size={12} className="text-[#C5A06B] hidden sm:inline" />
            </button>

            {/* Mobile & Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-full border border-white/15 xl:hidden text-white/90 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Liquid Glass Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0E0507]/95 backdrop-blur-2xl xl:hidden flex flex-col p-6 animate-fade-in border-b border-white/15 max-w-[100vw] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <MadLogo size="sm" variant="gold" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-white/80 hover:text-white rounded-full border border-white/15 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col space-y-3 text-sm sm:text-base font-serif-display tracking-[0.18em] uppercase text-[#F7F2EC]">
            {[
              { label: 'About', href: '#about' },
              { label: 'Services', href: '#services' },
              { label: 'Locations', href: '#presence' },
              { label: 'Projects', href: '#works' },
              { label: 'Client Reviews', href: '#reviews' },
              { label: 'Studio & Team', href: '#studio' },
              { label: 'Contact', href: '#contact' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C5A06B] py-2 px-3 rounded-lg hover:bg-white/[0.05] transition-colors border-b border-white/5"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto space-y-3 pt-5 border-t border-white/10">
            {/* WhatsApp Quick Action in Drawer */}
            <a
              href="https://wa.me/918822225224?text=Hi%20M.A.D%20Studio,%20I'd%20like%20to%20discuss%20my%20architectural%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 py-3 rounded-full border border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366] text-xs font-sans font-bold shadow-md"
            >
              <MessageCircle size={15} />
              <span>Chat on WhatsApp (8822225224)</span>
            </a>

            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <a
                href="tel:+918822225224"
                className="flex items-center justify-center space-x-1.5 py-2.5 rounded-full border border-white/15 bg-white/[0.04] text-[#C5A06B] font-mono-tech"
              >
                <Phone size={12} />
                <span>Call Us</span>
              </a>

              <a
                href="https://www.instagram.com/madstudio.arch/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 py-2.5 rounded-full border border-white/15 bg-white/[0.04] text-[#EBD2AC]"
              >
                <Instagram size={12} />
                <span>Instagram</span>
              </a>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] hover:from-[#5C202C] hover:to-[#842238] text-white border border-[#C5A06B]/60 font-serif-display text-xs tracking-[0.2em] uppercase font-bold cursor-pointer shadow-lg"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      )}
    </>
  );
};
