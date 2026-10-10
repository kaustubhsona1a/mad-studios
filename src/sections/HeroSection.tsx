import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Calendar, ArrowUpRight, Compass, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOpenConsultation?: () => void;
  onExploreWork?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onExploreWork
}) => {
  return (
    <section 
      id="hero"
      className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#3E1D23] text-[#F7F2EC] flex flex-col lg:flex-row items-stretch overflow-hidden pt-16 sm:pt-18 lg:pt-20 border-b border-[#C5A06B]/30"
    >
      {/* Background Architectural Drafting Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.18) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Burgundy Glow Bloom */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#542A33]/25 rounded-full blur-[140px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* PART 1 (TOP ON MOBILE / LEFT ON DESKTOP): Text written directly on Burgundy */}
      {/* Restored to original balanced options, sizing, and comfortable spacing */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[54%] xl:w-[52%] flex flex-col justify-center px-4 sm:px-10 lg:px-14 xl:px-18 pt-5 sm:pt-8 pb-6 sm:pb-10 lg:py-20 relative z-10 bg-[#3E1D23]">
        <div className="max-w-xl xl:max-w-2xl space-y-3.5 sm:space-y-5 lg:space-y-7">
          
          {/* Studio Kicker: Topmost line changed as requested, responsive on iPad and iPhone */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full liquid-glass-pill text-[10px] sm:text-xs font-sans tracking-[0.12em] sm:tracking-[0.18em] text-[#EBD2AC] uppercase shadow-xs border border-white/15 max-w-full overflow-hidden"
          >
            <Compass size={12} className="text-[#C5A06B] shrink-0" />
            <span className="truncate sm:whitespace-normal">architecture , inetriors and landscapes</span>
          </motion.div>

          {/* Grand Headline written directly on burgundy - Responsive for iPhone and iPad */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] xl:text-[4.4rem] text-white tracking-tight uppercase font-medium leading-[1.1] break-words"
          >
            Designing Homes <br className="hidden sm:inline" />
            <span className="text-[#EBD2AC]">With Character.</span>
          </motion.h1>

          {/* Subtitle - tailored to your space */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-sans text-xs sm:text-sm lg:text-base text-[#D8C7B5] leading-relaxed max-w-xl font-light"
          >
            We design private villas, modern homes, and warm interiors tailored to your space.
          </motion.p>

          {/* Action Buttons: Responsive sizing for iPhone & iPad */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-1 sm:pt-2 flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-4 w-full xs:w-auto"
          >
            <a
              href="#works"
              onClick={onExploreWork}
              className="relative overflow-hidden group inline-flex items-center justify-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] hover:from-[#5C202C] hover:to-[#842238] text-[#F7F2EC] border border-[#C5A06B]/70 hover:border-[#C5A06B] font-serif-display text-[11px] sm:text-xs tracking-[0.14em] uppercase transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-98 font-semibold cursor-pointer shrink-0 text-center"
            >
              <span>EXPLORE PROJECTS</span>
              <ArrowDown size={13} className="text-[#C5A06B] group-hover:translate-y-0.5 transition-transform" />
            </a>

            {onOpenConsultation && (
              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full liquid-glass-translucent hover:bg-white/[0.16] text-white hover:text-[#EBD2AC] border border-white/20 hover:border-[#C5A06B]/60 font-serif-display text-[11px] sm:text-xs tracking-[0.14em] uppercase transition-all duration-300 shadow-xs font-medium cursor-pointer shrink-0 text-center"
              >
                <Calendar size={13} className="text-[#C5A06B]" />
                <span>BOOK A CONSULTATION</span>
                <ArrowUpRight size={13} className="text-white/70" />
              </button>
            )}
          </motion.div>

          {/* Credibility Stats: Clean wrapping on mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="pt-3 sm:pt-5 border-t border-[#C5A06B]/20 flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] sm:text-xs font-sans text-[#D8C7B5]"
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-white">45+</span>
              <span className="text-[#C5A06B]">HOMES & VILLAS</span>
            </div>
            <span className="text-[#C5A06B]/40 hidden xs:inline">·</span>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-white">10+</span>
              <span>CITIES</span>
            </div>
            <span className="text-[#C5A06B]/40 hidden xs:inline">·</span>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-[#EBD2AC]">250K+</span>
              <span>SQ.FT BUILT</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 2 (BOTTOM ON MOBILE / RIGHT ON DESKTOP): Architectural Site Photo */}
      {/* Full height to the end of section with tilted dividing line */}
      {/* ========================================================================= */}
      <div className="w-full min-h-[380px] sm:min-h-[460px] lg:min-h-full lg:w-[46%] xl:w-[48%] relative overflow-hidden flex flex-col justify-end">
        
        {/* Container with Tilted Cutout on Desktop and Mobile */}
        {/* On Mobile: Tilted top line (0 24px, 100% 0) so the division is clear and sharp */}
        {/* On Desktop: Diagonal slant from top to bottom (14% 0, 100% 0, 100% 100%, 0 100%) */}
        <div className="absolute inset-0 [clip-path:polygon(0_24px,_100%_0,_100%_100%,_0%_100%)] lg:[clip-path:polygon(14%_0,_100%_0,_100%_100%,_0%_100%)] overflow-hidden bg-black/40">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=90"
            alt="Casa Sylva Luxury Architecture Siolim Goa"
            referrerPolicy="no-referrer"
            loading="eager"
            className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.05]"
          />

          {/* Subtle Warm Amber / Burgundy Vignette overlay on photo edge */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A0E13]/60 via-transparent to-transparent pointer-events-none" />
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#2A0E13]/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* TILTED GOLD DIVIDER LINE (DESKTOP: Diagonal slant from top-left to bottom-left) */}
        {/* ========================================================================= */}
        <svg 
          className="hidden lg:block absolute inset-y-0 left-0 w-full h-full z-20 pointer-events-none overflow-visible"
          preserveAspectRatio="none" 
          viewBox="0 0 100 100"
        >
          {/* Shadow behind desktop diagonal line */}
          <line 
            x1="13.7" 
            y1="0" 
            x2="-0.3" 
            y2="100" 
            stroke="#000000" 
            strokeWidth="4" 
            strokeOpacity="0.45"
            vectorEffect="non-scaling-stroke"
          />
          {/* Main Gold Line */}
          <line 
            x1="14" 
            y1="0" 
            x2="0" 
            y2="100" 
            stroke="#C5A06B" 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke"
            strokeOpacity="0.95"
          />
          {/* Specular White-Gold Glint */}
          <line 
            x1="11" 
            y1="20" 
            x2="5" 
            y2="65" 
            stroke="#FFF4E0" 
            strokeWidth="1.2" 
            vectorEffect="non-scaling-stroke"
            strokeOpacity="0.8"
          />
        </svg>

        {/* ========================================================================= */}
        {/* TILTED GOLD DIVIDER LINE (MOBILE: Bold angled separator at top of photo) */}
        {/* ========================================================================= */}
        <div className="lg:hidden absolute top-0 inset-x-0 w-full h-8 z-30 pointer-events-none overflow-visible">
          <svg 
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none" 
            viewBox="0 0 100 24"
          >
            {/* Ambient drop shadow under the angled line */}
            <line 
              x1="0" 
              y1="26" 
              x2="100" 
              y2="2" 
              stroke="#000000" 
              strokeWidth="4" 
              vectorEffect="non-scaling-stroke"
              strokeOpacity="0.6"
            />
            {/* Bold Glowing Gold Angled Line */}
            <line 
              x1="0" 
              y1="24" 
              x2="100" 
              y2="0" 
              stroke="#C5A06B" 
              strokeWidth="2.5" 
              vectorEffect="non-scaling-stroke"
            />
            {/* Sharp Specular Highlight on the angled ridge */}
            <line 
              x1="15" 
              y1="20" 
              x2="85" 
              y2="4" 
              stroke="#FFF6EA" 
              strokeWidth="1.2" 
              strokeOpacity="0.85" 
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Mobile Top Badge Indicating Site Photo */}
        <div className="lg:hidden absolute top-6 left-3 z-20 px-2.5 py-0.5 rounded-full liquid-glass-translucent text-[9px] font-sans tracking-wider text-[#EBD2AC] uppercase border border-white/20 flex items-center space-x-1 shadow-xs">
          <Sparkles size={8} className="text-[#C5A06B]" />
          <span>SITE PHOTO</span>
        </div>

        {/* Architectural Photo Label with Liquid Glass */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full liquid-glass-translucent backdrop-blur-xl border border-white/20 text-xs font-sans text-[#EBD2AC] shadow-lg flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A06B] animate-pulse" />
          <span>CASA SYLVA · SIOLIM, GOA</span>
        </div>

      </div>

    </section>
  );
};
