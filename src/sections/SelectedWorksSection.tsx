import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROJECTS_DATA, Project } from '../data/projects';
import { ArchitecturalVisual } from '../components/ArchitecturalVisual';
import { MapPin, Sparkles, ArrowUpRight } from 'lucide-react';

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
    <section id="works" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-20 sm:py-24 border-b border-[#C5A06B]/20">
      {/* Background Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header & Filter */}
        <div className="border-b border-[#C5A06B]/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-tech text-xs tracking-[0.25em] text-[#C5A06B] uppercase block mb-1 font-semibold">
              SIGNATURE PORTFOLIO
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-[#F7F2EC] uppercase tracking-wide">
              SELECTED WORKS
            </h2>
            <p className="font-serif-editorial italic text-base text-[#D8C7B5] mt-1 max-w-xl">
              Curated private residences, tropical holiday villas, and modern workspaces built across India.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#33151A] p-1.5 border border-[#C5A06B]/30 shadow-md">
            {[
              { id: 'all', label: `ALL WORKS (${PROJECTS_DATA.length})` },
              { id: 'residential', label: `HOMES & VILLAS (${PROJECTS_DATA.filter(p => p.category === 'residential').length})` },
              { id: 'commercial', label: `WORKSPACES (${PROJECTS_DATA.filter(p => p.category === 'commercial').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 text-xs font-mono-tech tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#542A33] text-[#C5A06B] font-bold border border-[#C5A06B]/70 shadow-sm'
                    : 'text-[#F7F2EC]/70 hover:text-[#C5A06B] hover:bg-[#48232B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Balanced Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              onClick={() => project.hasDossier && onOpenDossier(project)}
              className="group relative bg-[#48232B] border border-[#C5A06B]/30 hover:border-[#C5A06B] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
            >
              {/* Visual Media Canvas with Bright Daylight Property Photo */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#33151A]">
                <ArchitecturalVisual
                  src={project.imageUrl}
                  alt={project.title}
                  aspectRatio="aspect-[16/10]"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Clean Category Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono-tech tracking-wider uppercase pointer-events-none">
                  <span className="px-2.5 py-0.5 bg-[#33151A]/90 text-[#C5A06B] border border-[#C5A06B]/40 font-semibold backdrop-blur-xs">
                    {project.category === 'residential' ? 'VILLA / RESIDENCE' : 'COMMERCIAL SPACE'}
                  </span>

                  <span className="px-2.5 py-0.5 bg-[#542A33]/90 text-[#C5A06B] border border-[#C5A06B] flex items-center space-x-1 font-semibold backdrop-blur-xs shadow-xs">
                    <Sparkles size={10} className="text-[#C5A06B]" />
                    <span>EXPLORE</span>
                  </span>
                </div>

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-[#542A33]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 bg-[#33151A]/95 border border-[#C5A06B] text-xs font-serif-display text-[#C5A06B] uppercase tracking-wider flex items-center space-x-2 font-bold shadow-2xl">
                    <span>VIEW CASE STUDY</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>

              {/* Card Information */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-[#48232B]">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif-display text-lg sm:text-xl text-[#F7F2EC] uppercase tracking-wide group-hover:text-[#C5A06B] transition-colors font-semibold line-clamp-1">
                      {project.title}
                    </h3>
                    <span className="font-mono-tech text-xs text-[#C5A06B] font-bold ml-2">
                      0{project.catalogIndex}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-[#D8C7B5] font-sans mt-1">
                    <MapPin size={13} className="shrink-0 text-[#C5A06B]" />
                    <span className="line-clamp-1">{project.location}</span>
                  </div>

                  {project.highlight && (
                    <p className="font-serif-editorial italic text-xs sm:text-sm text-[#D8C7B5] mt-2 line-clamp-2">
                      {project.highlight}
                    </p>
                  )}
                </div>

                {/* Bottom Line and Status Action */}
                <div className="pt-3 border-t border-[#C5A06B]/20 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-mono-tech text-[#C5A06B]/80 uppercase tracking-wider">
                    {project.dossier?.statusTag?.split('—')[0]?.trim() || 'FEATURED WORK'}
                  </span>

                  <span className="text-xs font-sans text-[#C5A06B] font-semibold group-hover:underline flex items-center space-x-1">
                    <span>EXPLORE PROJECT</span>
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>

              {/* Animated Bottom Border */}
              <div className="h-[2px] w-full bg-transparent group-hover:bg-[#C5A06B] transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center pt-6 border-t border-[#C5A06B]/20">
          <p className="font-serif-editorial italic text-sm text-[#D8C7B5]">
            Curated architectural residences, tropical villas, and modern workspaces built across India.
          </p>
        </div>
      </div>
    </section>
  );
};
