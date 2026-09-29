import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Sun, Heart } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Compass,
      title: 'Context First',
      desc: 'Shaped by natural breezes, sun path, and regional landscape.'
    },
    {
      icon: Sun,
      title: 'Design with Purpose',
      desc: 'Functional layouts where elegance emerges from clarity and ease.'
    },
    {
      icon: Sparkles,
      title: 'Honest Materials',
      desc: 'Local stone, seasoned teak, and raw concrete that age with grace.'
    },
    {
      icon: Heart,
      title: 'Human Experience',
      desc: 'Spaces measured by tranquility, comfort, and the joy of living.'
    }
  ];

  return (
    <section id="about" className="relative w-full bg-[#120407] text-[#F7F3EB] py-16 sm:py-20 border-b border-[#DFC18D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-10">
          <span className="font-mono-tech text-xs tracking-[0.25em] text-[#DFC18D] uppercase font-semibold block">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#DFC18D] uppercase tracking-wide leading-tight">
            Rooted in Context, <span className="text-white">Crafted for Life.</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#D4C8BC] leading-relaxed font-light">
            We believe architecture is far more than building walls—it is the art of shaping daily life. Rather than following trends, we design private homes and tropical retreats that respond honestly to climate, stay cool naturally, and endure through generations.
          </p>
        </div>

        {/* 4 Pillars Grid - Clean, Punchy, Fast to Read */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 bg-[#1C060C] border border-[#DFC18D]/30 hover:border-[#DFC18D] transition-colors space-y-2 group shadow-sm"
              >
                <div className="flex items-center space-x-2 text-[#DFC18D]">
                  <Icon size={16} />
                  <span className="font-serif-display text-sm text-white uppercase font-bold tracking-wider group-hover:text-[#DFC18D] transition-colors">
                    {pillar.title}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
