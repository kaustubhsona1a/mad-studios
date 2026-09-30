import React from 'react';
import { motion } from 'motion/react';
import { ArchitecturalVisual } from '../components/ArchitecturalVisual';

export const ServicesSection: React.FC = () => {
  const servicesList = [
    {
      id: 'architecture',
      title: 'ARCHITECTURE',
      desc: 'transforming ideas into timeless architecture that balances beauty, purpose, and the way you live.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0 text-[#C5A06B]" fill="none">
          {/* Concentric Arched Portal */}
          <path d="M12 40V22C12 15.3726 17.3726 10 24 10C30.6274 10 36 15.3726 36 22V40" stroke="#C5A06B" strokeWidth="1.5" />
          <path d="M16 40V23C16 18.5817 19.5817 15 24 15C28.4183 15 32 18.5817 32 23V40" stroke="#C5A06B" strokeWidth="1" strokeOpacity="0.7" />
          {/* Stepped Architectural Plinth / Staircase in Sand */}
          <path d="M10 40H38V34H32V28H26V22H20V40H10Z" fill="#D4BC9B" fillOpacity="0.9" />
        </svg>
      )
    },
    {
      id: 'interior',
      title: 'INTERIOR DESIGN',
      desc: 'we craft interiors that reflect individuals personality and elevate everyday experience.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0" fill="none">
          {/* Curved Pill & Overlapping Modernist Furniture */}
          <rect x="8" y="16" width="16" height="24" rx="8" stroke="#C5A06B" strokeWidth="1.5" />
          <rect x="14" y="10" width="16" height="26" rx="8" fill="#D4BC9B" fillOpacity="0.9" />
          <path d="M22 20C22 17.7909 23.7909 16 26 16H34C36.2091 16 38 17.7909 38 20V36H22V20Z" stroke="#C5A06B" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 'landscape',
      title: 'LANDSCAPE DESIGN',
      desc: 'designing outdoor spaces that blends nature, function and beauty.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0" fill="none">
          {/* Sand Pill Background */}
          <rect x="12" y="10" width="16" height="28" rx="8" fill="#D4BC9B" fillOpacity="0.9" />
          {/* Sun Circle */}
          <circle cx="20" cy="18" r="4.5" fill="#C5A06B" />
          {/* Delicate Botanical Stems */}
          <path d="M22 36C22 27 28 24 36 21" stroke="#C5A06B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M28 26C31 24 34 25 35 27" stroke="#C5A06B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M25 30C28 29 31 31 32 33" stroke="#C5A06B" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'master-planning',
      title: 'MASTER PLANNING',
      desc: 'creating holistic, sustainable, enviorments for communities to thrive.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0" fill="none">
          {/* Stepped Isometric Architectural Topography */}
          <path d="M12 38L24 44L36 38V30L24 36L12 30V38Z" fill="#D4BC9B" fillOpacity="0.9" stroke="#C5A06B" strokeWidth="1" />
          <path d="M16 30L24 34L32 30V22L24 26L16 22V30Z" fill="#C5A06B" fillOpacity="0.8" stroke="#D4BC9B" strokeWidth="1" />
          <path d="M20 22L24 24L28 22V14L24 16L20 14V22Z" fill="#D4BC9B" stroke="#C5A06B" strokeWidth="1" />
          <line x1="24" y1="16" x2="24" y2="44" stroke="#3E1D23" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 'turnkey',
      title: 'TURNKEY SOLUTIONS',
      desc: 'from concepts to completion, we create buildings that are functional, aesthetic and enduring.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0" fill="none">
          {/* Concentric Ribbed Arches */}
          <path d="M10 38V22C10 14.268 16.268 8 24 8C31.732 8 38 14.268 38 22V38" stroke="#C5A06B" strokeWidth="1.5" />
          <path d="M14 38V22C14 16.4772 18.4772 12 24 12C29.5228 12 34 16.4772 34 22V38" stroke="#C5A06B" strokeWidth="1" strokeDasharray="2 2" />
          {/* Central Key Silhouette */}
          <circle cx="24" cy="20" r="5" fill="#D4BC9B" />
          <rect x="22" y="24" width="4" height="14" fill="#D4BC9B" />
          <rect x="26" y="29" width="3" height="2" fill="#D4BC9B" />
          <rect x="26" y="34" width="4" height="2" fill="#D4BC9B" />
        </svg>
      )
    },
    {
      id: 'consultancy',
      title: 'CONSULTANCY',
      desc: 'expert advisory and solutions tailored to bring your dream designs into the reality.',
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0" fill="none">
          {/* Two stylized figures in dialogue across a table */}
          <circle cx="16" cy="18" r="4.5" fill="#D4BC9B" />
          <path d="M10 36V30C10 27.5 12.5 25 15 25H18C20 25 21 26.5 21 28V36H10Z" fill="#D4BC9B" fillOpacity="0.8" />
          <circle cx="32" cy="18" r="4.5" fill="#D4BC9B" />
          <path d="M38 36V30C38 27.5 35.5 25 33 25H30C28 25 27 26.5 27 28V36H38Z" fill="#D4BC9B" fillOpacity="0.8" />
          {/* Table / Discussion Plinth */}
          <rect x="18" y="30" width="12" height="6" fill="#C5A06B" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-16 sm:py-24 border-b border-[#C5A06B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Editorial Layout Matching PDF Page */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Exact PDF Services List */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Lockup from PDF */}
            <div>
              <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#F7F2EC] tracking-wide uppercase font-light">
                SERVICES
              </h2>
              {/* Gold Underline Bar from PDF */}
              <div className="w-full h-[1.5px] bg-[#C5A06B]/80 mt-3 mb-6" />
            </div>

            {/* Service Items Exactly like PDF */}
            <div className="space-y-6">
              {servicesList.map((service, index) => (
                <div key={service.id} className="space-y-4">
                  <div className="flex items-start space-x-5">
                    {/* Bespoke Architectural Emblem */}
                    <div className="pt-0.5">
                      {service.icon}
                    </div>

                    {/* Content Lockup */}
                    <div className="flex-1 space-y-1">
                      <span className="font-sans text-sm sm:text-base text-[#D4B07B] font-semibold tracking-wider uppercase underline decoration-[#C5A06B] decoration-1 underline-offset-4 block">
                        {service.title}
                      </span>
                      <p className="font-sans text-xs sm:text-sm text-[#F7F2EC]/85 leading-relaxed font-light lowercase">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  {/* Thin Gold Dividing Line from PDF */}
                  {index < servicesList.length - 1 && (
                    <div className="w-full h-[1px] bg-[#C5A06B]/30" />
                  )}
                </div>
              ))}
            </div>

            {/* Bottom PDF Tagline */}
            <div className="pt-4 border-t border-[#C5A06B]/30">
              <p className="font-serif-editorial italic text-xs sm:text-sm text-[#D8C7B5]">
                We offer end-to-end architectural solutions tailored to every scale and site.
              </p>
            </div>

          </div>

          {/* RIGHT: Curated Photographic Spread from PDF */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
            
            {/* Primary Property Photo: Siolim Villa Pool & Woodwork */}
            <div className="border border-[#C5A06B]/40 shadow-xl overflow-hidden bg-[#35151B] aspect-[4/3] group">
              <ArchitecturalVisual
                type="hero-casa-sylva"
                aspectRatio="aspect-auto"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="p-3 bg-[#33151A] border-t border-[#C5A06B]/25 flex items-center justify-between text-[11px] font-mono-tech text-[#C5A06B]">
                <span>TROPICAL RETREAT</span>
                <span className="text-[#D8C7B5]">SIOLIM, GOA</span>
              </div>
            </div>

            {/* Secondary Photo: Courtyard & Reflection Pool */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#C5A06B]/30 overflow-hidden aspect-[4/3] group bg-[#35151B]">
                <ArchitecturalVisual
                  type="services-courtyard"
                  aspectRatio="aspect-auto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="border border-[#C5A06B]/30 overflow-hidden aspect-[4/3] group bg-[#35151B]">
                <ArchitecturalVisual
                  type="experience-living"
                  aspectRatio="aspect-auto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
