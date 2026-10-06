import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROJECTS_DATA, Project, getProjectSqFt } from '../data/projects';
import { ArchitecturalVisual } from '../components/ArchitecturalVisual';
import { MapPin, Sparkles, ArrowUpRight, Compass } from 'lucide-react';

interface SelectedWorksSectionProps {
  onOpenDossier: (project: Project) => void;
}

export const SelectedWorksSection: React.FC<SelectedWorksSectionProps> = ({
  onOpenDossier
}) => {
  const [filter, setFilter] = useState<'all' | 'residential' | 'commercial'>('all');

  const filteredProjects = filter === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === filter);

  return (
    <section id="works" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-14 sm:py-28 border-b border-[#C5A06B]/20 overflow-hidden">
      {/* Ambient Lighting & Grid */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#6E1C2E]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#542A33]/15 rounded-full blur-[130px] pointer-events-none" />

      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full liquid-glass-pill text-[11px] font-sans tracking-[0.2em] text-[#C5A06B] uppercase font-semibold">
              <Compass size={12} className="text-[#C5A06B]" />
              <span>OUR WORK · 03</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight">
              Selected Projects
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#D8C7B5] leading-relaxed font-light">
              Private villas, holiday retreats, and modern workspaces designed across India.
            </p>
          </div>

          {/* Liquid Glass Category Filter Tabs (Single clean row on mobile, no deformed wrapping) */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar max-w-full p-1 sm:p-1.5 rounded-full liquid-glass border border-white/10 shadow-lg shrink-0">
            {[
              { id: 'all', label: `ALL (${PROJECTS_DATA.length})` },
              { id: 'residential', label: `HOMES & VILLAS (${PROJECTS_DATA.filter(p => p.category === 'residential').length})` },
              { id: 'commercial', label: `WORKSPACES (${PROJECTS_DATA.filter(p => p.category === 'commercial').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`shrink-0 whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-sans tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] text-white font-semibold border border-[#C5A06B]/50 shadow-md'
                    : 'text-[#D8C7B5] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Balanced Architectural Grid with Liquid Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              onClick={() => onOpenDossier(project)}
              className="liquid-glass-card rounded-2xl group flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_25px_60px_rgba(0,0,0,0.7)] cursor-pointer border border-white/[0.08] hover:border-[#C5A06B]/50 transition-all duration-500"
            >
              {/* Visual Media Canvas with Bright Daylight Property Photo */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <ArchitecturalVisual
                  src={project.imageUrl}
                  alt={project.title}
                  aspectRatio="aspect-[16/10]"
                  className="transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.98]"
                />

                {/* Floating Liquid Glass Category Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-sans tracking-wider uppercase pointer-events-none">
                  <span className="px-3 py-1 rounded-full liquid-glass-pill text-[#EBD2AC] font-semibold backdrop-blur-md">
                    {project.category === 'residential' ? 'VILLA / RESIDENCE' : 'COMMERCIAL SPACE'}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-[#140609]/80 text-[#C5A06B] border border-[#C5A06B]/40 flex items-center space-x-1 font-semibold backdrop-blur-md">
                    <Sparkles size={10} className="text-[#C5A06B]" />
                    <span>PHOTOS</span>
                  </span>
                </div>

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-[#140609]/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="px-5 py-2.5 rounded-full liquid-glass-burgundy text-xs font-serif-display text-white uppercase tracking-wider flex items-center space-x-2 font-semibold shadow-2xl border border-[#C5A06B]">
                    <span>VIEW SITE PHOTOS</span>
                    <ArrowUpRight size={14} className="text-[#C5A06B]" />
                  </div>
                </div>
              </div>

              {/* Card Information: Basic Area & Sq Ft */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif-display text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-[#EBD2AC] transition-colors font-medium line-clamp-1">
                      {project.title}
                    </h3>
                    <span className="font-sans text-xs text-[#C5A06B] font-semibold ml-2">
                      0{project.catalogIndex}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[#D8C7B5] leading-relaxed font-light mt-1.5 line-clamp-2">
                    {project.highlight || 'Contemporary bespoke architecture designed for comfort and natural light.'}
                  </p>
                </div>

                {/* Basic Details Bar: Area and Sq. Ft. */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans text-[#D8C7B5]">
                  <div className="flex items-center space-x-1.5 text-[#C5A06B]">
                    <MapPin size={12} className="text-[#C5A06B] shrink-0" />
                    <span className="font-medium truncate max-w-[140px] sm:max-w-none">{project.location}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#EBD2AC] font-semibold">{getProjectSqFt(project)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note in Liquid Glass */}
        <div className="text-center pt-8 border-t border-white/[0.08]">
          <p className="font-sans text-base text-[#D8C7B5] font-light">
            “Every project is an unrepeatable response to its site, climate, and client vision.”
          </p>
          <span className="text-[11px] font-mono-tech tracking-[0.25em] text-[#C5A06B] uppercase block mt-1.5 font-medium">
            25+ COMPLETED WORKS · MUMBAI · GOA · LONAVALA · BENGALURU
          </span>
        </div>

      </div>
    </section>
  );
};
