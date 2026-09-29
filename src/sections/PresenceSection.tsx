import React from 'react';
import { motion } from 'motion/react';
import { PRESENCE_STATS } from '../data/presence';
import { PresenceMap } from '../components/PresenceMap';

export const PresenceSection: React.FC = () => {
  return (
    <section id="presence" className="relative w-full bg-[#120407] text-[#F7F3EB] py-16 sm:py-24 border-b border-[#DFC18D]/25">
      {/* Background Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(223, 193, 141, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(223, 193, 141, 0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-10 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-b border-[#DFC18D]/25 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2"
        >
          <div>
            <span className="font-mono-tech text-xs tracking-[0.25em] text-[#DFC18D] uppercase block mb-1 font-semibold">
              NATIONAL REACH
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#DFC18D] uppercase tracking-wide">
              WHERE WE BUILD
            </h2>
          </div>
          <span className="text-xs font-mono-tech text-[#D4C8BC] uppercase tracking-wider">
            MUMBAI · GOA · LONAVALA · BENGALURU
          </span>
        </motion.div>

        {/* Interactive India Map & Selected Region Hub */}
        <div>
          <PresenceMap />
        </div>

        {/* Key Metrics Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-2 border-[#DFC18D]/35 bg-[#1C060C] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#DFC18D]/20">
            {PRESENCE_STATS.map((stat, idx) => (
              <div key={idx} className={`${idx !== 0 ? 'sm:pl-6' : ''} pt-3 sm:pt-0 flex flex-col justify-between group`}>
                <div>
                  <span className="font-serif-display text-3xl sm:text-4xl text-[#DFC18D] font-light tracking-tight block group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </span>
                  <p className="font-sans text-xs text-[#F7F3EB] uppercase tracking-wider mt-1.5 font-semibold leading-snug">
                    {stat.label}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#DFC18D]/20">
                  <span className="text-[10px] font-mono-tech text-[#D4C8BC] uppercase tracking-wider block">
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
