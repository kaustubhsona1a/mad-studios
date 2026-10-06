import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sun, Sparkles, Heart, Quote } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Sun,
      title: 'Climate Built',
      desc: 'Natural breezes, morning sunlight, and shaded verandas.'
    },
    {
      icon: Compass,
      title: 'Simple Living',
      desc: 'Thoughtful floor layouts where rooms flow naturally.'
    },
    {
      icon: Sparkles,
      title: 'Natural Materials',
      desc: 'Local stone, teak wood, and clean textures that age well.'
    },
    {
      icon: Heart,
      title: 'Family Comfort',
      desc: 'Quiet, calm spaces built for everyday living.'
    }
  ];

  return (
    <section id="about" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-10 sm:py-20 overflow-hidden border-b border-[#C5A06B]/20">
      {/* Ambient Burgundy Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-[#542A33]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full liquid-glass-pill text-[10px] sm:text-xs font-sans tracking-wider text-[#C5A06B] uppercase font-semibold">
              <Compass size={11} className="text-[#C5A06B]" />
              <span>OUR APPROACH · 02</span>
            </div>
            
            <h2 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-tight">
              Built for Life. <span className="text-[#EBD2AC] block sm:inline">Made for Comfort.</span>
            </h2>
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#D8C7B5] leading-relaxed font-light max-w-sm">
            We design homes that feel peaceful, let in fresh air and light, and look beautiful for generations.
          </p>
        </div>

        {/* Compact Liquid Translucent Glass Cards (2x2 on mobile, 4-col on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="liquid-glass-translucent rounded-xl sm:rounded-2xl p-3 sm:p-4 group flex flex-col justify-between"
              >
                {/* Top specular glint highlight */}
                <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg liquid-glass-pill flex items-center justify-center text-[#C5A06B] shrink-0">
                      <Icon size={13} />
                    </div>
                    <h3 className="font-serif-display text-[11px] sm:text-sm text-white uppercase tracking-wider font-semibold truncate group-hover:text-[#EBD2AC] transition-colors">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="font-sans text-[10.5px] sm:text-xs text-[#D8C7B5] leading-snug font-light line-clamp-2 sm:line-clamp-none">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Ambient Quote Card with Translucent Liquid Glass */}
        <div className="liquid-glass-translucent rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20 shadow-xl relative overflow-hidden">
          <div className="flex items-start space-x-3 max-w-3xl">
            <Quote size={20} className="text-[#C5A06B] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-sans text-xs sm:text-base text-white/95 leading-relaxed font-light">
                “True luxury is not about excess decoration. It is quiet rooms, morning light, and fresh air in every corner.”
              </p>
              <span className="font-sans text-[10px] sm:text-xs tracking-wider text-[#C5A06B] uppercase font-semibold block pt-0.5">
                — MUDDASSIR HAQUE · LEAD ARCHITECT
              </span>
            </div>
          </div>

          <div className="shrink-0 hidden sm:flex items-center space-x-2 text-xs font-sans text-[#D8C7B5]">
            <span className="px-3.5 py-1 rounded-full liquid-glass-pill text-[#EBD2AC] font-medium border border-white/15 text-xs">
              MUMBAI & GOA
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
