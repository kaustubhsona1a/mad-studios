import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FOUNDER_DATA, LEAD_TEAM_DATA, TeamMember } from '../data/team';
import { 
  Sparkles, 
  Quote as QuoteIcon, 
  Compass, 
  ArrowUpRight, 
  X, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

export const StudioSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section id="studio" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-20 sm:py-28 border-b border-[#C5A06B]/20 overflow-hidden">
      {/* Ambient Burgundy Glow */}
      <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-[#6E1C2E]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#542A33]/15 rounded-full blur-[130px] pointer-events-none" />

      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        {/* Section Header */}
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full liquid-glass-pill text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#C5A06B] uppercase font-semibold mb-3">
            <Compass size={12} className="text-[#C5A06B]" />
            <span>OUR TEAM · 07</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-wide break-words">
                THE STUDIO
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#D8C7B5] mt-1 font-light">
                An experienced team of architects, designers, and site engineers.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-sans text-[#EBD2AC] uppercase tracking-wider font-semibold block">
                MUMBAI & GOA
              </span>
              <span className="text-[11px] font-sans text-[#D8C7B5] block mt-0.5">
                ESTABLISHED PRACTICE
              </span>
            </div>
          </div>
          <div className="w-full h-[1.5px] bg-[#C5A06B]/80 mt-4" />
        </div>

        {/* 01: Founder Feature in Rich Liquid Glass Burgundy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="liquid-glass-translucent rounded-2xl sm:rounded-3xl border border-white/20 p-5 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          {/* Top Liquid Specular Highlight Line */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Founder Portrait */}
            <div className="lg:col-span-5 relative group">
              <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/20 bg-black/40 shadow-xl">
                <img
                  src={FOUNDER_DATA.image}
                  alt={FOUNDER_DATA.name}
                  className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0507]/90 via-transparent to-transparent" />
                
                {/* Name Tag on Photo */}
                <div className="absolute bottom-4 left-4 right-4 liquid-glass-pill rounded-xl p-3 backdrop-blur-md flex items-center justify-between text-xs font-sans text-white border border-white/20">
                  <div>
                    <span className="font-semibold block">{FOUNDER_DATA.name}</span>
                    <span className="text-[11px] text-[#C5A06B] block">Principal Architect</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#3E1D23] text-[#EBD2AC] text-[10px] font-semibold border border-[#C5A06B]/40">
                    LEAD
                  </span>
                </div>
              </div>
            </div>

            {/* Founder Statement & Info */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="inline-flex items-center space-x-2 text-xs font-sans text-[#C5A06B] uppercase tracking-wider font-semibold">
                  <Sparkles size={13} className="text-[#C5A06B]" />
                  <span>PRINCIPAL ARCHITECT</span>
                </div>
                <h3 className="font-serif-display text-3xl sm:text-4xl text-white uppercase tracking-wide font-normal">
                  {FOUNDER_DATA.name}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-[#D8C7B5]">
                  Council of Architecture Registered · 10+ Years Designing Spaces
                </p>
              </div>

              {/* Simple Pull Quote */}
              <div className="relative pl-5 border-l-2 border-[#C5A06B]">
                <QuoteIcon size={18} className="text-[#C5A06B]/60 absolute -top-1 -left-2 transform -translate-x-full" />
                <p className="font-sans text-base sm:text-lg text-[#F7F2EC] leading-relaxed font-light">
                  “{FOUNDER_DATA.quote}”
                </p>
              </div>

              {/* Simple Paragraph */}
              <p className="font-sans text-sm text-[#D8C7B5] leading-relaxed font-light">
                {FOUNDER_DATA.statement}
              </p>

              {/* Key Stats in Liquid Glass Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {FOUNDER_DATA.stats.map((stat, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl liquid-glass-pill border border-white/15">
                    <span className="font-serif-display text-xl sm:text-2xl text-[#C5A06B] font-medium block">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-sans text-[#D8C7B5] uppercase tracking-wider block mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </motion.div>

        {/* 02: Core Team Grid in Liquid Glass Cards */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="font-sans text-xs tracking-wider text-[#C5A06B] uppercase font-semibold block mb-1">
                DISCIPLINE LEADS
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-white uppercase tracking-wide">
                Studio Leads
              </h3>
            </div>
            <p className="font-sans text-xs text-[#D8C7B5] font-light">
              Direct involvement on every project from design to site handover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEAD_TEAM_DATA.slice(0, 4).map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setSelectedMember(member)}
                className="liquid-glass-card rounded-2xl border border-white/[0.12] hover:border-[#C5A06B]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg hover:shadow-2xl cursor-pointer relative"
              >
                {/* Member Portrait */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0507]/90 via-transparent to-transparent" />
                  
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-0.5 rounded-full liquid-glass-pill text-[#EBD2AC] text-[10px] font-sans font-semibold">
                      {member.experience}
                    </span>
                  </div>
                </div>

                {/* Member Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif-display text-base text-white uppercase tracking-wider font-semibold group-hover:text-[#EBD2AC] transition-colors">
                        {member.name}
                      </h4>
                      <ArrowUpRight size={14} className="text-[#C5A06B]/70 group-hover:text-[#C5A06B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
                    </div>
                    <span className="text-xs font-sans text-[#C5A06B] block font-medium">
                      {member.role}
                    </span>
                    <span className="text-[11px] font-sans text-[#D8C7B5]/80 block">
                      {member.education}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-white/10">
                    <span className="text-[10px] font-sans text-[#D8C7B5] block truncate">
                      Focus: <span className="text-white font-medium">{member.signatureProject}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Citation */}
        <div className="text-center pt-6 border-t border-white/10">
          <p className="font-sans text-base text-[#D8C7B5] font-light">
            “The strongest designs emerge when clear communication and quality guide every step.”
          </p>
          <span className="text-[11px] font-sans tracking-wider text-[#C5A06B] uppercase block mt-1.5 font-semibold">
            M.A.D STUDIO · REGISTERED PRACTICE · MUMBAI & GOA
          </span>
        </div>

      </div>

      {/* Interactive Member Modal in Liquid Glass */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg liquid-glass-burgundy rounded-3xl text-[#F7F2EC] border border-white/20 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 rounded-full liquid-glass-pill hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-4">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-white/20 shadow-md shrink-0"
                />
                <div>
                  <h3 className="font-serif-display text-xl text-white uppercase font-medium">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs font-sans text-[#C5A06B] font-semibold">
                    {selectedMember.role}
                  </p>
                  <p className="text-[11px] font-sans text-[#D8C7B5] mt-0.5">
                    {selectedMember.education} · {selectedMember.experience}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl liquid-glass-pill border border-white/10 space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#C5A06B] font-semibold block">
                  ROLE & APPROACH
                </span>
                <p className="text-xs font-sans text-[#D8C7B5] leading-relaxed">
                  {selectedMember.bio}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-sans pt-2 border-t border-white/10">
                <span className="text-[#D8C7B5]">Key Project:</span>
                <span className="text-white font-medium">{selectedMember.signatureProject}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
