import React from 'react';
import { motion } from 'motion/react';
import { PRESENCE_STATS } from '../data/presence';
import { PresenceMap } from '../components/PresenceMap';

export const PresenceSection: React.FC = () => {
  return (
    <section id="presence" className="relative w-full bg-transparent text-[#F7F2EC] py-16 sm:py-20 border-b border-white/[0.08]">
      {/* Background Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-b border-[#C5A06B]/25 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2"
        >
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full liquid-glass-pill text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#C5A06B] uppercase font-semibold mb-2">
              <span>LOCATIONS · 05</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-wide break-words">
              Where We Build
            </h2>
          </div>
          <span className="text-xs font-sans text-[#D8C7B5] uppercase tracking-wider">
            Mumbai · Goa · Lonavala · Bengaluru
          </span>
        </motion.div>

        {/* Interactive India Map & Selected Region Hub */}
        <div>
          <PresenceMap />
        </div>

        {/* Key Metrics Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="liquid-glass-card rounded-2xl border border-white/12 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top specular reflection line */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {PRESENCE_STATS.map((stat, idx) => (
              <div key={idx} className={`${idx !== 0 ? 'sm:pl-6' : ''} pt-3 sm:pt-0 flex flex-col justify-between group`}>
                <div>
                  <span className="font-serif-display text-3xl sm:text-4xl text-[#C5A06B] font-light tracking-tight block group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </span>
                  <p className="font-sans text-xs text-[#F7F2EC] uppercase tracking-wider mt-1.5 font-semibold leading-snug">
                    {stat.label}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#C5A06B]/20">
                  <span className="text-[10px] font-mono-tech text-[#D8C7B5] uppercase tracking-wider block">
                    {stat.sublabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
