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
    <section id="works" className="relative w-full bg-[#120407] text-[#F7F3EB] py-20 sm:py-28 border-b border-[#DFC18D]/25">
      {/* Background Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(223, 193, 141, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(223, 193, 141, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-10 relative z-10">
        
        {/* Section Header & Clean Filter */}
        <div className="border-b border-[#DFC18D]/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-tech text-xs tracking-[0.25em] text-[#DFC18D] uppercase block mb-1 font-semibold">
              SIGNATURE PORTFOLIO
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#DFC18D] uppercase tracking-wide">
              SELECTED WORKS
            </h2>
            <p className="font-serif-editorial italic text-base text-[#D4C8BC] mt-1 max-w-xl">
              Curated private residences, tropical holiday villas, and modern workspaces built across India.
            </p>
          </div>

          {/* Clean Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#1C060C] p-1.5 border border-[#DFC18D]/35 shadow-md">
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
                    ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/60 shadow-sm'
                    : 'text-[#F7F3EB]/70 hover:text-[#DFC18D] hover:bg-[#250810]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Balanced Architectural Grid with Pristine Bright Daylight Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              onClick={() => project.hasDossier && onOpenDossier(project)}
              className="group relative bg-[#1C060C] border border-[#DFC18D]/35 hover:border-[#DFC18D] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(110,26,44,0.6)] cursor-pointer"
            >
              {/* Visual Media Canvas with Bright Daylight Property Photo */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#160509]">
                <ArchitecturalVisual
                  src={project.imageUrl}
                  alt={project.title}
                  aspectRatio="aspect-[16/10]"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Clean Category Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono-tech tracking-wider uppercase pointer-events-none">
                  <span className="px-2.5 py-0.5 bg-[#140407]/90 text-[#DFC18D] border border-[#DFC18D]/40 font-semibold backdrop-blur-xs">
                    {project.category === 'residential' ? 'VILLA / RESIDENCE' : 'COMMERCIAL SPACE'}
                  </span>

                  <span className="px-2.5 py-0.5 bg-[#581424]/90 text-[#DFC18D] border border-[#DFC18D] flex items-center space-x-1 font-semibold backdrop-blur-xs shadow-xs">
                    <Sparkles size={10} className="text-[#DFC18D]" />
                    <span>EXPLORE</span>
                  </span>
                </div>

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-[#380E18]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 bg-[#180509]/95 border border-[#DFC18D] text-xs font-serif-display text-[#DFC18D] uppercase tracking-wider flex items-center space-x-2 font-bold shadow-2xl">
                    <span>VIEW CASE STUDY</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>

              {/* Card Information */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#1C060C] to-[#160509]">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif-display text-lg sm:text-xl text-[#F7F3EB] uppercase tracking-wide group-hover:text-[#DFC18D] transition-colors font-semibold line-clamp-1">
                      {project.title}
                    </h3>
                    <span className="font-mono-tech text-xs text-[#DFC18D] font-bold ml-2">
                      0{project.catalogIndex}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-[#D4C8BC] font-sans mt-1">
                    <MapPin size={13} className="shrink-0 text-[#DFC18D]" />
                    <span className="line-clamp-1">{project.location}</span>
                  </div>

                  {project.highlight && (
                    <p className="font-serif-editorial italic text-xs sm:text-sm text-[#D4C8BC] mt-2 line-clamp-2">
                      {project.highlight}
                    </p>
                  )}
                </div>

                {/* Bottom Line and Status Action */}
                <div className="pt-3 border-t border-[#DFC18D]/20 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-mono-tech text-[#DFC18D]/70 uppercase tracking-wider">
                    {project.dossier?.statusTag?.split('—')[0]?.trim() || 'FEATURED WORK'}
                  </span>

                  <span className="text-xs font-sans text-[#DFC18D] font-semibold group-hover:underline flex items-center space-x-1">
                    <span>EXPLORE PROJECT</span>
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>

              {/* Animated Bottom Border */}
              <div className="h-[2px] w-full bg-transparent group-hover:bg-[#DFC18D] transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center pt-6 border-t border-[#DFC18D]/25">
          <p className="font-serif-editorial italic text-sm text-[#D4C8BC]">
            Curated architectural residences, tropical villas, and modern workspaces built across India.
          </p>
        </div>
      </div>
    </section>
  );
};
