import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Calendar, ArrowUpRight } from 'lucide-react';
import { PROJECTS_DATA, Project } from '../data/projects';

interface HeroSectionProps {
  onOpenConsultation?: () => void;
  onExploreWork?: () => void;
  onOpenDossier?: (project: Project) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onExploreWork,
  onOpenDossier
}) => {
  // Flagship featured project corresponding to Villa in Siolim
  const featuredProject = PROJECTS_DATA.find(p => p.id === 'casa-sylva') || PROJECTS_DATA[0];

  const handleFeaturedClick = () => {
    if (onOpenDossier && featuredProject) {
      onOpenDossier(featuredProject);
    } else if (onExploreWork) {
      onExploreWork();
    }
  };

  return (
    <section 
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden text-[#F7F2EC] bg-[#120507]"
    >
      {/* ========================================================================= */}
      {/* FULL-BLEED ARCHITECTURAL PHOTOGRAPH WITH DARKENED UPPER SCRIM */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=90"
          alt="Villa in Siolim, North Goa - Modern Architecture by M.A.D Studio"
          referrerPolicy="no-referrer"
          loading="eager"
          className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.04]"
        />

        {/* Top-down dark vignette specifically over the text zone for contrast and legibility */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(16, 5, 8, 0.94) 0%, rgba(22, 7, 11, 0.82) 35%, rgba(28, 9, 14, 0.52) 60%, rgba(14, 4, 7, 0.2) 80%, rgba(18, 6, 9, 0.88) 100%)'
          }}
        />

        {/* Left radial gradient to deepen background behind left-aligned text */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(14, 4, 7, 0.88) 0%, rgba(18, 6, 9, 0.55) 45%, rgba(0, 0, 0, 0.05) 100%)'
          }}
        />

        {/* Subtle architectural drafting grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.2) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* FOREGROUND CONTENT: Clean typography, few words, high legibility */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full relative z-10 flex-1 flex flex-col justify-between pt-28 sm:pt-36 lg:pt-40 pb-8 sm:pb-12">
        
        {/* Top & Middle Block: Disciplines, Studio Statement & Clickable Featured Project */}
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          
          {/* Studio Disciplines Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2.5 text-[10px] sm:text-xs font-sans tracking-[0.22em] text-[#C5A06B] uppercase font-semibold"
          >
            <span>ARCHITECTURE</span>
            <span className="text-[#C5A06B]/50 font-normal">|</span>
            <span>INTERIORS</span>
            <span className="text-[#C5A06B]/50 font-normal">|</span>
            <span>LANDSCAPES</span>
          </motion.div>

          {/* Confident, Minimalist Headline Statement */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-2"
          >
            <h1 className="font-serif-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-white tracking-[0.06em] uppercase font-light leading-[1.12] drop-shadow-md">
              Crafting Spaces. <br />
              <span className="text-[#EBD2AC] font-normal">Building Experiences.</span>
            </h1>
          </motion.div>

          {/* ========================================================================= */}
          {/* CLICKABLE FEATURED PROJECT LOCKUP (Directly opens project dossier) */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              onClick={handleFeaturedClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFeaturedClick(); }}
              className="group inline-flex flex-col text-left cursor-pointer p-3 -ml-3 rounded-xl hover:bg-white/[0.06] transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A06B]"
              title="Click to view Villa in Siolim complete project dossier"
            >
              <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-mono-tech tracking-[0.25em] text-[#C5A06B] uppercase font-semibold">
                <span>FEATURED PROJECT</span>
                <ArrowUpRight size={13} className="text-[#C5A06B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              <div className="font-serif-display text-xl sm:text-2xl lg:text-3xl text-white uppercase tracking-wider group-hover:text-[#EBD2AC] transition-colors font-medium mt-1 drop-shadow-md">
                VILLA IN SIOLIM
              </div>

              <div className="text-xs sm:text-sm font-sans tracking-[0.2em] text-[#EBD2AC] uppercase font-medium mt-0.5 drop-shadow-xs">
                NORTH GOA
              </div>

              {/* Gold Hairline Accent Line matching user reference */}
              <div className="w-24 sm:w-32 h-[1.5px] bg-gradient-to-r from-[#C5A06B] via-[#EBD2AC] to-transparent mt-2.5 group-hover:w-44 transition-all duration-300" />
            </div>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ROW: Action Buttons (Location is shown cleanly once above in Featured Project) */}
        {/* ========================================================================= */}
        <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 border-t border-white/10">
          
          {/* Action Buttons: Sleek, compact, perfectly proportioned, zero viewport overflow */}
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto max-w-full">
            <a
              href="#works"
              onClick={onExploreWork}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] hover:from-[#5C202C] hover:to-[#842238] text-[#F7F2EC] border border-[#C5A06B]/70 hover:border-[#C5A06B] font-serif-display text-[9.5px] sm:text-xs tracking-[0.06em] sm:tracking-[0.14em] uppercase transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-98 font-semibold cursor-pointer text-center whitespace-nowrap min-w-0 shrink-0"
            >
              <span>EXPLORE WORKS</span>
              <ArrowDown size={11} className="text-[#C5A06B] shrink-0" />
            </a>

            {onOpenConsultation && (
              <button
                type="button"
                onClick={onOpenConsultation}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white hover:text-[#EBD2AC] border border-white/20 hover:border-[#C5A06B]/60 font-serif-display text-[9.5px] sm:text-xs tracking-[0.06em] sm:tracking-[0.14em] uppercase transition-all duration-300 shadow-xs font-medium cursor-pointer text-center whitespace-nowrap backdrop-blur-md min-w-0 shrink-0"
              >
                <Calendar size={11} className="text-[#C5A06B] shrink-0" />
                <span>BOOK CONSULTATION</span>
                <ArrowUpRight size={11} className="text-[#C5A06B] hidden sm:inline shrink-0" />
              </button>
            )}
          </div>

        </div>

      </div>

    </section>
  );
};
