import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FOUNDER_DATA, LEAD_TEAM_DATA, ATELIER_CULTURE_ITEMS, TeamMember } from '../data/team';
import { 
  Sparkles, 
  Quote as QuoteIcon, 
  Compass, 
  ArrowUpRight, 
  Layers, 
  CheckCircle2, 
  X, 
  MapPin, 
  BookOpen, 
  Ruler
} from 'lucide-react';

export const StudioSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'leadership' | 'design' | 'visualization' | 'engineering'>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeFounderTab, setActiveFounderTab] = useState<'statement' | 'materials'>('statement');

  const filteredMembers = activeCategory === 'all'
    ? LEAD_TEAM_DATA
    : LEAD_TEAM_DATA.filter(m => m.category === activeCategory || (activeCategory === 'design' && m.category === 'leadership'));

  return (
    <section id="studio" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-20 sm:py-28 border-b border-[#C5A06B]/20">
      {/* Background Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header with PDF Monograph Gold Line */}
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono-tech tracking-[0.25em] text-[#C5A06B] uppercase font-semibold mb-1">
            <Compass size={12} className="text-[#C5A06B]" />
            <span>PAGE 05 · THE ATELIER & ARCHITECTURAL MINDS</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#F7F2EC] uppercase tracking-wide">
                THE STUDIO
              </h2>
              <p className="font-serif-editorial italic text-base text-[#D8C7B5] mt-1">
                A collective of architects, computational designers, and site engineers crafting tropical modernism.
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs font-mono-tech text-[#D8C7B5] uppercase tracking-wider block">
                LOWER PAREL, MUMBAI · NORTH GOA
              </span>
              <span className="text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-widest mt-0.5 block">
                LAT 18.9986° N · LON 72.8258° E
              </span>
            </div>
          </div>
          <div className="w-full h-[1.5px] bg-[#C5A06B]/80 mt-4" />
        </div>

        {/* 01: Founder Feature - Architectural Monograph Double-Spread */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#48232B] border border-[#C5A06B]/40 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Top Monograph Watermark Bar */}
          <div className="bg-[#33151A] px-6 py-2.5 border-b border-[#C5A06B]/25 flex flex-wrap items-center justify-between text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-widest">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-[#C5A06B] animate-pulse" />
              <span>PRINCIPAL ARCHITECT MONOGRAPH</span>
            </div>
            <div className="flex items-center space-x-4 text-[#D8C7B5]">
              <span>COUNCIL OF ARCHITECTURE REG.</span>
              <span>·</span>
              <span>10+ YEARS CRAFTING SPACES</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Founder Portrait with Technical Drafting Framing */}
              <div className="lg:col-span-5 relative group">
                <div className="relative aspect-[3/4] overflow-hidden border border-[#C5A06B]/50 bg-[#33151A] shadow-2xl">
                  <img
                    src={FOUNDER_DATA.image}
                    alt={FOUNDER_DATA.name}
                    className="w-full h-full object-cover filter contrast-[1.05] grayscale-[15%] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#33151A] via-transparent to-transparent opacity-70" />
                  
                  {/* Brass Corner Crosshairs & Registration Brackets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C5A06B]" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C5A06B]" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C5A06B]" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C5A06B]" />

                  {/* Stamp Monogram */}
                  <div className="absolute top-4 right-4 bg-[#33151A]/90 border border-[#C5A06B]/40 px-2.5 py-1 text-[9px] font-mono-tech text-[#C5A06B] backdrop-blur-xs font-bold tracking-widest">
                    M.A.D / MH
                  </div>

                  {/* Caption Strip */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#33151A]/95 border border-[#C5A06B]/30 p-2.5 backdrop-blur-xs flex items-center justify-between text-[11px] font-mono-tech text-[#C5A06B]">
                    <span className="font-semibold">MUDDASSIR HAQUE</span>
                    <span className="text-[#D8C7B5]">MUMBAI & GOA</span>
                  </div>
                </div>

                {/* Micro Technical Scale Callout */}
                <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono-tech text-[#D8C7B5]/80 uppercase tracking-widest px-1">
                  <span>SCALE 1:1 ATELIER</span>
                  <span>REF: DIR-01-MH</span>
                </div>
              </div>

              {/* Founder Statement & Editorial Philosophy */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Header Lockup */}
                <div className="space-y-1.5 border-b border-[#C5A06B]/25 pb-4">
                  <div className="inline-flex items-center space-x-2 text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-[0.2em] font-bold">
                    <Sparkles size={11} className="text-[#C5A06B]" />
                    <span>{FOUNDER_DATA.credentials}</span>
                  </div>
                  <h3 className="font-serif-display text-3xl sm:text-4xl text-white uppercase tracking-wide font-medium">
                    {FOUNDER_DATA.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech text-[#D4B07B]">
                    <span className="uppercase tracking-wider font-semibold">{FOUNDER_DATA.role}</span>
                    <span>·</span>
                    <span className="text-[#D8C7B5]">{FOUNDER_DATA.education}</span>
                  </div>
                </div>

                {/* Editorial Pull Quote */}
                <div className="relative pl-5 border-l-2 border-[#C5A06B]">
                  <QuoteIcon size={20} className="text-[#C5A06B]/50 absolute -top-1 -left-2 transform -translate-x-full" />
                  <p className="font-serif-editorial italic text-lg sm:text-xl text-[#F7F2EC] leading-relaxed">
                    “{FOUNDER_DATA.quote}”
                  </p>
                </div>

                {/* Interactive Monograph Tabs (Statement vs Material Affinity) */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-[#C5A06B]/20 pb-2">
                    <button
                      onClick={() => setActiveFounderTab('statement')}
                      className={`text-xs font-mono-tech tracking-wider uppercase transition-colors pb-1 cursor-pointer ${
                        activeFounderTab === 'statement'
                          ? 'text-[#C5A06B] font-bold border-b-2 border-[#C5A06B]'
                          : 'text-[#D8C7B5] hover:text-[#C5A06B]'
                      }`}
                    >
                      PRACTICE ETHOS
                    </button>
                    <span className="text-[#C5A06B]/40">·</span>
                    <button
                      onClick={() => setActiveFounderTab('materials')}
                      className={`text-xs font-mono-tech tracking-wider uppercase transition-colors pb-1 cursor-pointer ${
                        activeFounderTab === 'materials'
                          ? 'text-[#C5A06B] font-bold border-b-2 border-[#C5A06B]'
                          : 'text-[#D8C7B5] hover:text-[#C5A06B]'
                      }`}
                    >
                      MATERIAL PALETTE AFFINITY
                    </button>
                  </div>

                  {activeFounderTab === 'statement' ? (
                    <div className="space-y-3 font-sans text-xs sm:text-sm text-[#D8C7B5] leading-relaxed font-light">
                      <p>
                        {FOUNDER_DATA.statement}
                      </p>
                      <p>
                        {FOUNDER_DATA.philosophy}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {FOUNDER_DATA.materials.map((mat, idx) => (
                        <div key={idx} className="p-3 bg-[#33151A] border border-[#C5A06B]/30 space-y-1">
                          <span className="font-serif-display text-xs text-[#C5A06B] uppercase block font-semibold">
                            {mat.name}
                          </span>
                          <p className="font-sans text-[11px] text-[#D8C7B5]/80 leading-snug">
                            {mat.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Milestone Statistics Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#C5A06B]/25">
                  {FOUNDER_DATA.stats.map((stat, idx) => (
                    <div key={idx} className="p-3 bg-[#33151A] border border-[#C5A06B]/25">
                      <span className="font-serif-display text-2xl sm:text-3xl text-[#C5A06B] font-medium block">
                        {stat.value}
                      </span>
                      <span className="text-[9px] font-mono-tech text-[#D8C7B5] uppercase tracking-wider block mt-0.5">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Signature Lockup */}
                <div className="pt-4 border-t border-[#C5A06B]/25 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-serif-editorial italic text-3xl text-[#C5A06B] tracking-wider block font-medium">
                      {FOUNDER_DATA.signature}
                    </span>
                    <span className="text-[10px] font-mono-tech text-[#D8C7B5]/80 uppercase tracking-widest block mt-0.5">
                      FOUNDER & PRINCIPAL ARCHITECT
                    </span>
                  </div>
                  <div className="border border-[#C5A06B]/40 px-3 py-1.5 bg-[#33151A] flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A06B]" />
                    <span className="text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-widest">
                      M.A.D ARCHITECTURAL ATELIER
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>

        {/* 02: Core Team Atelier Gallery - Dynamic, Interactive & Engaging */}
        <div className="space-y-8 pt-4">
          
          {/* Header & Category Filter Segmented Control */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C5A06B]/30 pb-4">
            <div>
              <span className="font-mono-tech text-xs tracking-[0.25em] text-[#C5A06B] uppercase font-semibold block mb-1">
                DISCIPLINARY TEAMS
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-white uppercase tracking-wider font-medium">
                THE ATELIER COLLECTIVE
              </h3>
              <p className="font-serif-editorial italic text-sm text-[#D8C7B5] mt-0.5">
                Every project is directed by dedicated discipline leads from planning to on-site handover.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#33151A] p-1.5 border border-[#C5A06B]/30 shadow-md">
              {[
                { id: 'all', label: `ALL ATELIER (${LEAD_TEAM_DATA.length})` },
                { id: 'leadership', label: `DESIGN & PLANNING` },
                { id: 'visualization', label: `3D & COMPUTATION` },
                { id: 'engineering', label: `STRUCTURE & SITE` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-mono-tech tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#542A33] text-[#C5A06B] font-bold border border-[#C5A06B]/70 shadow-sm'
                      : 'text-[#F7F2EC]/70 hover:text-[#C5A06B] hover:bg-[#48232B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Core Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setSelectedMember(member)}
                className="bg-[#48232B] border border-[#C5A06B]/30 hover:border-[#C5A06B] transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg hover:shadow-2xl cursor-pointer relative"
              >
                {/* Member Portrait */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#33151A]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter contrast-[1.05] grayscale-[15%] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#48232B] via-transparent to-transparent opacity-80" />
                  
                  {/* Discipline Code & Technical Index */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 bg-[#33151A]/95 text-[#C5A06B] border border-[#C5A06B]/40 text-[9px] font-mono-tech uppercase tracking-wider backdrop-blur-xs font-bold">
                      {member.code}
                    </span>
                    <span className="px-2 py-0.5 bg-[#542A33]/90 text-[#D8C7B5] border border-[#C5A06B]/30 text-[9px] font-mono-tech">
                      {member.experience}
                    </span>
                  </div>

                  {/* Corner Crosshairs */}
                  <div className="absolute bottom-2 left-2 text-[#C5A06B]/70 text-[9px] font-mono-tech pointer-events-none">
                    +
                  </div>
                  <div className="absolute bottom-2 right-2 text-[#C5A06B]/70 text-[9px] font-mono-tech pointer-events-none">
                    +
                  </div>
                </div>

                {/* Member Info Block */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#48232B]">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif-display text-base text-white uppercase tracking-wider font-semibold group-hover:text-[#C5A06B] transition-colors">
                        {member.name}
                      </h4>
                      <ArrowUpRight size={14} className="text-[#C5A06B]/60 group-hover:text-[#C5A06B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                    </div>
                    <span className="text-xs font-mono-tech text-[#D4B07B] block font-medium">
                      {member.role}
                    </span>
                    <span className="text-[10px] font-sans text-[#D8C7B5]/75 block truncate">
                      {member.education}
                    </span>
                  </div>

                  {/* Signature Project Tag */}
                  <div className="pt-2 border-t border-[#C5A06B]/20">
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono-tech text-[#C5A06B] bg-[#33151A] px-2 py-1 border border-[#C5A06B]/25">
                      <Layers size={10} className="text-[#C5A06B] shrink-0" />
                      <span className="truncate">{member.signatureProject}</span>
                    </div>
                  </div>

                  {/* Specialties List */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((spec, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-[9px] font-mono-tech text-[#D8C7B5] bg-[#33151A]/60 px-1.5 py-0.5 border border-[#C5A06B]/15"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote preview */}
                  <p className="font-serif-editorial italic text-xs text-[#EBD2AC]/90 leading-snug line-clamp-2 pt-1 border-t border-[#C5A06B]/15">
                    “{member.quote}”
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 03: Inside the Atelier Strip (From PDF Page 28 / Studio Culture) */}
        <div className="pt-8 border-t border-[#C5A06B]/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="font-mono-tech text-xs tracking-[0.25em] text-[#C5A06B] uppercase font-semibold block mb-1">
                BEHIND THE DRAWINGS
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-white uppercase tracking-wider font-medium">
                INSIDE THE ATELIER
              </h3>
            </div>
            <span className="text-xs font-mono-tech text-[#D8C7B5] uppercase tracking-wider">
              PHYSICAL MODELS · MATERIAL LAB · SITE CRAFT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ATELIER_CULTURE_ITEMS.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#48232B] border border-[#C5A06B]/30 overflow-hidden group shadow-md flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#33151A]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover filter contrast-[1.05] grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#33151A]/90 text-[9px] font-mono-tech text-[#C5A06B] border border-[#C5A06B]/30 backdrop-blur-xs">
                    {item.location}
                  </div>
                </div>

                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between bg-[#48232B]">
                  <h4 className="font-serif-display text-sm text-white uppercase tracking-wide font-semibold group-hover:text-[#C5A06B] transition-colors">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-[#D8C7B5] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Studio Manifesto Citation */}
        <div className="text-center pt-8 border-t border-[#C5A06B]/25">
          <p className="font-serif-editorial italic text-base sm:text-lg text-[#F7F2EC]">
            “The strongest designs emerge when collaboration inspires creativity and excellence guides every decision.”
          </p>
          <div className="flex items-center justify-center space-x-3 mt-3 text-[10px] font-mono-tech tracking-[0.25em] text-[#C5A06B] uppercase font-semibold">
            <span>M.A.D ATELIER REGISTERED PRACTICE</span>
            <span>·</span>
            <span>MUMBAI & GOA</span>
            <span>·</span>
            <span>BUILT WITH INTEGRITY</span>
          </div>
        </div>

      </div>

      {/* Interactive Member Dossier Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#3E1D23] text-[#F7F2EC] border-2 border-[#C5A06B]/50 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 text-[#C5A06B] hover:text-white hover:bg-[#542A33] border border-[#C5A06B]/30 transition-colors cursor-pointer"
                aria-label="Close Profile"
              >
                <X size={18} />
              </button>

              {/* Modal Top Lockup */}
              <div className="flex items-center space-x-2 text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-[0.2em] font-semibold border-b border-[#C5A06B]/30 pb-3">
                <Compass size={12} className="text-[#C5A06B]" />
                <span>ARCHITECTURAL DOSSIER · {selectedMember.code}</span>
              </div>

              {/* Member Profile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 relative aspect-[3/4] overflow-hidden border border-[#C5A06B]/50 bg-[#33151A]">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover filter contrast-[1.05]"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-[#33151A]/90 p-1.5 border border-[#C5A06B]/30 text-center text-[10px] font-mono-tech text-[#C5A06B]">
                    {selectedMember.experience} EXPERIENCE
                  </div>
                </div>

                <div className="sm:col-span-8 space-y-4">
                  <div>
                    <h3 className="font-serif-display text-2xl text-white uppercase tracking-wide font-medium">
                      {selectedMember.name}
                    </h3>
                    <span className="text-sm font-mono-tech text-[#D4B07B] block mt-0.5">
                      {selectedMember.role}
                    </span>
                    <span className="text-xs font-sans text-[#D8C7B5] block mt-0.5">
                      {selectedMember.education}
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="pl-3 border-l-2 border-[#C5A06B] py-0.5">
                    <p className="font-serif-editorial italic text-sm text-[#F7F2EC]">
                      “{selectedMember.quote}”
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="font-sans text-xs text-[#D8C7B5] leading-relaxed">
                    {selectedMember.bio}
                  </p>

                  {/* Signature Project & Specialties */}
                  <div className="space-y-2 pt-2 border-t border-[#C5A06B]/20">
                    <div className="flex items-center space-x-2 text-xs font-mono-tech text-[#C5A06B]">
                      <span className="font-bold">SIGNATURE PROJECT:</span>
                      <span className="text-white">{selectedMember.signatureProject}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedMember.specialties.map((spec, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-[10px] font-mono-tech text-[#C5A06B] bg-[#33151A] px-2 py-0.5 border border-[#C5A06B]/30"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Footer */}
              <div className="pt-4 border-t border-[#C5A06B]/30 flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 bg-[#542A33] hover:bg-[#62323D] text-[#F7F2EC] border border-[#C5A06B] font-serif-display text-xs tracking-wider uppercase transition-colors font-medium cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
