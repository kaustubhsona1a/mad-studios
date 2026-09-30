import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface ContactSectionProps {
  onOpenConsultation: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenConsultation
}) => {
  return (
    <section id="contact" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-16 sm:py-24 overflow-hidden border-b border-[#C5A06B]/20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main CTA Block in Matte Burgundy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-[#C5A06B]/30 bg-[#48232B] p-6 sm:p-10 shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Direct Call to Action */}
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono-tech text-xs tracking-[0.25em] text-[#C5A06B] uppercase font-semibold block">
                START YOUR PROJECT
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-white uppercase tracking-wide leading-tight">
                Let's Design Something <span className="text-[#C5A06B]">Extraordinary.</span>
              </h2>
              <p className="font-sans text-sm text-[#D8C7B5] max-w-lg leading-relaxed font-light">
                Whether you are planning a tropical holiday villa, a private family estate, or a refined workspace, we are ready to bring your vision to life from sketch to keys.
              </p>
            </div>

            {/* Right: Booking Button Card */}
            <div className="lg:col-span-5 p-6 bg-[#33151A] border border-[#C5A06B]/30 flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs font-mono-tech text-[#C5A06B] uppercase tracking-wider block font-semibold">
                  DISCOVERY SESSION
                </span>
                <h3 className="font-serif-display text-xl text-white uppercase tracking-wide">
                  Schedule Free Consultation
                </h3>
                <p className="font-sans text-xs text-[#D8C7B5] leading-relaxed">
                  Discuss site parameters, design concepts, and realistic timelines with our senior architects.
                </p>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full py-3.5 bg-[#C5A06B] hover:bg-[#D4B07B] text-[#2A0E13] font-serif-display text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-2 font-bold shadow-lg cursor-pointer hover:scale-[1.01] active:scale-98"
              >
                <span>BOOK APPOINTMENT</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

          </div>
        </motion.div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-[#D8C7B5]">
          
          {/* Telephone */}
          <div className="p-5 bg-[#33151A] border border-[#C5A06B]/20 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-wider block font-semibold">
              TELEPHONE
            </span>
            <a href="tel:+918822225224" className="text-white hover:text-[#C5A06B] block text-sm font-semibold transition-colors">
              +91 8822225224
            </a>
            <span className="text-[11px] text-[#D8C7B5]/70 block">Mon – Sat, 10am – 7pm</span>
          </div>

          {/* Email & Instagram */}
          <div className="p-5 bg-[#33151A] border border-[#C5A06B]/20 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-wider block font-semibold">
              CORRESPONDENCE
            </span>
            <a href="mailto:madstudio.reach@gmail.com" className="text-white hover:text-[#C5A06B] block text-xs font-medium transition-colors break-all">
              madstudio.reach@gmail.com
            </a>
            <a href="https://instagram.com/madstudio.arch" target="_blank" rel="noopener noreferrer" className="text-[#C5A06B] hover:underline block text-xs mt-1">
              @madstudio.arch
            </a>
          </div>

          {/* Studio Office */}
          <div className="p-5 bg-[#33151A] border border-[#C5A06B]/20 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-wider block font-semibold">
              STUDIO LOCATION
            </span>
            <p className="text-white text-xs leading-relaxed">
              309, Vasan Udyog Bhavan, Lower Parel West, Mumbai 400013
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
