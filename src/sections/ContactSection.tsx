import React from 'react';
import { motion } from 'motion/react';
import { MadLogo } from '../components/MadLogo';
import { Phone, Mail, Instagram, MapPin, ArrowUpRight, Calendar } from 'lucide-react';

interface ContactSectionProps {
  onOpenConsultation: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenConsultation
}) => {
  return (
    <section id="contact" className="relative w-full bg-[#120407] text-[#F7F3EB] py-16 sm:py-20 overflow-hidden border-b border-[#DFC18D]/20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main CTA Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-[#DFC18D]/30 bg-[#1C060C] p-6 sm:p-10 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Direct Call to Action */}
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono-tech text-xs tracking-[0.25em] text-[#DFC18D] uppercase font-semibold block">
                START YOUR PROJECT
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-white uppercase tracking-wide leading-tight">
                Let's Design Something <span className="text-[#DFC18D]">Extraordinary.</span>
              </h2>
              <p className="font-sans text-sm text-[#D4C8BC] max-w-lg leading-relaxed font-light">
                Whether you are planning a tropical holiday villa, a private family estate, or a refined workspace, we are ready to bring your vision to life from sketch to keys.
              </p>
            </div>

            {/* Right: Booking Button Card */}
            <div className="lg:col-span-5 p-6 bg-[#250810] border border-[#DFC18D]/30 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono-tech text-[#DFC18D] uppercase tracking-wider block font-semibold">
                  DISCOVERY SESSION
                </span>
                <h3 className="font-serif-display text-xl text-white uppercase tracking-wide">
                  Schedule Free Consultation
                </h3>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  Discuss site parameters, design concepts, and realistic timelines with our senior architects.
                </p>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full py-3.5 bg-[#DFC18D] hover:bg-[#F4E2BE] text-[#140407] font-serif-display text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-2 font-bold shadow-lg cursor-pointer hover:scale-[1.01] active:scale-98"
              >
                <span>BOOK APPOINTMENT</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

          </div>
        </motion.div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-[#D4C8BC]">
          
          {/* Telephone */}
          <div className="p-4 bg-[#180509] border border-[#DFC18D]/20 space-y-1">
            <span className="text-[10px] font-mono-tech text-[#DFC18D] uppercase tracking-wider block font-semibold">
              TELEPHONE
            </span>
            <a href="tel:+918822225224" className="text-white hover:text-[#DFC18D] block text-sm font-semibold transition-colors">
              +91 8822225224
            </a>
            <span className="text-[11px] text-[#D4C8BC]/70 block">Mon – Sat, 10am – 7pm</span>
          </div>

          {/* Email & Instagram */}
          <div className="p-4 bg-[#180509] border border-[#DFC18D]/20 space-y-1">
            <span className="text-[10px] font-mono-tech text-[#DFC18D] uppercase tracking-wider block font-semibold">
              CORRESPONDENCE
            </span>
            <a href="mailto:madstudio.reach@gmail.com" className="text-white hover:text-[#DFC18D] block text-xs font-medium transition-colors break-all">
              madstudio.reach@gmail.com
            </a>
            <a href="https://instagram.com/madstudio.arch" target="_blank" rel="noopener noreferrer" className="text-[#DFC18D] hover:underline block text-xs mt-1">
              @madstudio.arch
            </a>
          </div>

          {/* Studio Office */}
          <div className="p-4 bg-[#180509] border border-[#DFC18D]/20 space-y-1">
            <span className="text-[10px] font-mono-tech text-[#DFC18D] uppercase tracking-wider block font-semibold">
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
