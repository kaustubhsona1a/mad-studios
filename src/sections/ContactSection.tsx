import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Phone, Mail, MapPin, Calendar, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  onOpenConsultation: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenConsultation
}) => {
  return (
    <section id="contact" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-20 sm:py-28 overflow-hidden border-b border-[#C5A06B]/20">
      {/* Ambient Burgundy Glow Bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#6E1C2E]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main CTA Block in Floating Liquid Glass */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="liquid-glass-card rounded-3xl border border-white/15 p-6 sm:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.65)] relative overflow-hidden backdrop-blur-2xl"
        >
          {/* Top Liquid Specular Reflection Sheen */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Direct Call to Action */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full liquid-glass-pill text-[11px] font-sans tracking-[0.2em] text-[#C5A06B] uppercase font-semibold">
                <Sparkles size={12} className="text-[#C5A06B]" />
                <span>GET IN TOUCH · 07</span>
              </div>

              <h2 className="font-serif-display text-3xl sm:text-5xl text-white uppercase tracking-wide leading-tight">
                Let's Design Something <span className="text-[#EBD2AC] block sm:inline">Beautiful.</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#D8C7B5] max-w-lg leading-relaxed font-light">
                Planning a new home, holiday villa, or workspace? We are here to guide you from the first sketch to move-in day.
              </p>
            </div>

            {/* Right: Booking Liquid Glass Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl liquid-glass-burgundy border border-white/20 flex flex-col justify-between space-y-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="space-y-2">
                <span className="text-xs font-sans text-[#C5A06B] uppercase tracking-wider block font-semibold">
                  FREE CONSULTATION
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase tracking-wide">
                  Talk To Our Architects
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#D8C7B5] leading-relaxed font-light">
                  Discuss your plot, budget, and design ideas directly with our principal architects.
                </p>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#C5A06B] via-[#EBD2AC] to-[#C5A06B] hover:brightness-110 text-[#140508] font-serif-display text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-2 font-bold shadow-[0_8px_25px_rgba(197,160,107,0.35)] cursor-pointer hover:scale-[1.01] active:scale-98"
              >
                <Calendar size={14} className="text-[#140508]" />
                <span>BOOK A CONSULTATION</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

          </div>
        </motion.div>

        {/* Contact Details Grid in Liquid Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-sans text-[#D8C7B5]">
          
          {/* Telephone */}
          <div className="liquid-glass-card rounded-2xl p-6 border border-white/12 hover:border-[#C5A06B]/40 transition-all space-y-2">
            <div className="flex items-center space-x-2 text-[#C5A06B]">
              <Phone size={14} />
              <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">
                CALL US
              </span>
            </div>
            <a href="tel:+918822225224" className="text-white hover:text-[#C5A06B] block text-base font-semibold transition-colors">
              +91 8822225224
            </a>
            <span className="text-[11px] text-[#D8C7B5]/80 block">Monday – Saturday, 10am – 7pm</span>
          </div>

          {/* Email & Instagram */}
          <div className="liquid-glass-card rounded-2xl p-6 border border-white/12 hover:border-[#C5A06B]/40 transition-all space-y-2">
            <div className="flex items-center space-x-2 text-[#C5A06B]">
              <Mail size={14} />
              <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">
                EMAIL & INSTAGRAM
              </span>
            </div>
            <a href="mailto:madstudio.reach@gmail.com" className="text-white hover:text-[#C5A06B] block text-xs font-medium transition-colors break-all">
              madstudio.reach@gmail.com
            </a>
            <a href="https://instagram.com/madstudio.arch" target="_blank" rel="noopener noreferrer" className="text-[#C5A06B] hover:text-[#EBD2AC] block text-xs mt-1 transition-colors font-medium">
              @madstudio.arch
            </a>
          </div>

          {/* Studio Office */}
          <div className="liquid-glass-card rounded-2xl p-6 border border-white/12 hover:border-[#C5A06B]/40 transition-all space-y-2">
            <div className="flex items-center space-x-2 text-[#C5A06B]">
              <MapPin size={14} />
              <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">
                STUDIO LOCATIONS
              </span>
            </div>
            <p className="text-white text-xs leading-relaxed">
              Lower Parel, Mumbai & Siolim, Goa
            </p>
            <span className="text-[11px] text-[#D8C7B5]/80 block">Open by appointment</span>
          </div>

        </div>

      </div>
    </section>
  );
};
