import React from 'react';
import { motion } from 'motion/react';
import { FOUNDER_DATA, LEAD_TEAM_DATA } from '../data/team';

export const StudioSection: React.FC = () => {
  return (
    <section id="studio" className="relative w-full bg-[#120407] text-[#F7F3EB] py-16 sm:py-20 border-b border-[#DFC18D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="border-b border-[#DFC18D]/25 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="font-mono-tech text-xs tracking-[0.25em] text-[#DFC18D] uppercase font-semibold block mb-1">
              PRACTICE LEADERSHIP
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#DFC18D] uppercase tracking-wide">
              THE STUDIO & TEAM
            </h2>
          </div>
          <span className="text-xs font-mono-tech text-[#D4C8BC] uppercase tracking-wider">
            LOWER PAREL, MUMBAI · NORTH GOA
          </span>
        </div>

        {/* 2-Column Split: Founder on Left, Team Grid on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Founder Profile */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#1C060C] border border-[#DFC18D]/30 space-y-5 shadow-md">
            <div>
              <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#DFC18D] uppercase font-bold block mb-1">
                {FOUNDER_DATA.role}
              </span>
              <h3 className="font-serif-display text-2xl text-white uppercase font-bold tracking-wide">
                {FOUNDER_DATA.name}
              </h3>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#D4C8BC] leading-relaxed">
              {FOUNDER_DATA.statement}
            </p>

            <div className="pt-4 border-t border-[#DFC18D]/20 flex items-center justify-between">
              <span className="font-serif-editorial italic text-xl text-[#DFC18D]">
                {FOUNDER_DATA.signature}
              </span>
              <span className="text-[10px] font-mono-tech text-[#DFC18D]/60 uppercase">
                M.A.D PRACTICE
              </span>
            </div>
          </div>

          {/* Lead Team Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEAD_TEAM_DATA.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-4 bg-[#180509] border border-[#DFC18D]/20 hover:border-[#DFC18D]/60 transition-colors space-y-1.5 shadow-xs"
              >
                <div className="flex items-baseline justify-between">
                  <h4 className="font-serif-display text-sm text-white uppercase tracking-wider font-semibold">
                    {member.name}
                  </h4>
                  <span className="text-[10px] font-mono-tech text-[#DFC18D]/60">
                    0{idx + 1}
                  </span>
                </div>
                <span className="text-xs font-mono-tech text-[#DFC18D] block">
                  {member.role}
                </span>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed pt-0.5">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
