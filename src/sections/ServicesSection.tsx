import React from 'react';
import { motion } from 'motion/react';
import { SERVICES_DATA } from '../data/services';
import { Home, Palette, Trees, KeyRound, Check } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Home size={18} className="text-[#DFC18D]" />;
      case 1: return <Palette size={18} className="text-[#DFC18D]" />;
      case 2: return <Trees size={18} className="text-[#DFC18D]" />;
      case 3: return <KeyRound size={18} className="text-[#DFC18D]" />;
      default: return <Home size={18} className="text-[#DFC18D]" />;
    }
  };

  return (
    <section id="services" className="relative w-full bg-[#120407] text-[#F7F3EB] py-16 sm:py-20 border-b border-[#DFC18D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-2 mb-10">
          <span className="font-mono-tech text-xs tracking-[0.25em] text-[#DFC18D] uppercase font-semibold block">
            CORE CAPABILITIES
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#DFC18D] uppercase tracking-wide">
            WHAT WE DO
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#D4C8BC] leading-relaxed font-light">
            End-to-end architectural services tailored to your land, lifestyle, and aesthetic vision.
          </p>
        </div>

        {/* 4 Clean Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES_DATA.map((service, idx) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-5 bg-[#1C060C] border border-[#DFC18D]/30 hover:border-[#DFC18D] transition-colors flex flex-col justify-between space-y-4 group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#250810] border border-[#DFC18D]/30">
                    {getIcon(idx)}
                  </div>
                  <span className="font-mono-tech text-xs text-[#DFC18D]/70 font-semibold">
                    {service.number}
                  </span>
                </div>

                <h3 className="font-serif-display text-base text-white uppercase tracking-wider font-semibold group-hover:text-[#DFC18D] transition-colors">
                  {service.title}
                </h3>

                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>

              {/* Deliverables Bullet Points */}
              <ul className="space-y-1.5 pt-3 border-t border-[#DFC18D]/20">
                {service.deliverables.map((del, dIdx) => (
                  <li key={dIdx} className="text-xs text-[#F7F3EB]/90 flex items-center space-x-2 font-sans">
                    <Check size={12} className="text-[#DFC18D] shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
