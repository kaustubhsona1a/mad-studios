import React from 'react';
import { motion } from 'motion/react';
import { PRESENCE_STATS } from '../data/presence';
import { PresenceMap } from '../components/PresenceMap';

export const PresenceSection: React.FC = () => {
  return (
    <section id="presence" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-16 sm:py-20 border-b border-[#C5A06B]/20">
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
            <span className="font-mono-tech text-xs tracking-[0.25em] text-[#C5A06B] uppercase block mb-1 font-semibold">
              NATIONAL REACH
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#C5A06B] uppercase tracking-wide">
              WHERE WE BUILD
            </h2>
          </div>
          <span className="text-xs font-mono-tech text-[#D8C7B5] uppercase tracking-wider">
            MUMBAI · GOA · LONAVALA · BENGALURU
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
          className="border border-[#C5A06B]/30 bg-[#48232B] p-6 sm:p-8 shadow-xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#C5A06B]/20">
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
