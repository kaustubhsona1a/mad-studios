import React, { useState } from 'react';
import { X, Check, Phone, Mail, Instagram, MapPin, Sparkles } from 'lucide-react';
import { MadLogo } from './MadLogo';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sector: 'Private Homes',
    city: '',
    area: '',
    description: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-2xl bg-[#1C060C] text-[#F7F3EB] border-2 border-[#DFC18D]/40 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#DFC18D] hover:text-white hover:bg-[#380E18] border border-[#DFC18D]/30 transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-8 border-b border-[#DFC18D]/25 pb-6">
          <MadLogo size="sm" variant="gold" className="mb-2" />
          <span className="font-mono-tech text-[11px] tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
            M.A.D DESIGN STUDIO
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl text-white uppercase font-normal">
            Book a Free Consultation
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#D4C8BC] max-w-md mx-auto leading-relaxed">
            Let's discuss your architectural vision, site parameters, and timeline to bring your dream project to life seamlessly.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 mx-auto bg-[#2E0A12] border-2 border-[#DFC18D] flex items-center justify-center text-[#DFC18D] shadow-lg">
              <Check size={28} />
            </div>
            <h3 className="font-serif-display text-xl text-white uppercase">
              Consultation Scheduled
            </h3>
            <p className="font-sans text-sm text-[#D4C8BC] max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-[#DFC18D] font-bold">{formData.name}</span>. Our senior architecture team will review your project details for <span className="text-[#DFC18D] font-bold">{formData.city || 'your site'}</span> and contact you within 24 hours.
            </p>
            <div className="pt-4 border-t border-[#DFC18D]/25 flex flex-wrap justify-center gap-4 text-xs font-mono-tech text-[#DFC18D]">
              <a href="tel:+918822225224" className="hover:underline flex items-center space-x-1 font-semibold">
                <Phone size={14} />
                <span>+91 8822225224</span>
              </a>
              <a href="mailto:madstudio.reach@gmail.com" className="hover:underline flex items-center space-x-1 font-semibold">
                <Mail size={14} />
                <span>madstudio.reach@gmail.com</span>
              </a>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="mt-6 px-6 py-2.5 bg-[#581424] text-[#F7F3EB] border border-[#DFC18D] font-serif-display text-xs tracking-widest uppercase hover:bg-[#6E1C2E] cursor-pointer shadow-lg"
            >
              Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sector Selector */}
            <div>
              <label className="block text-[11px] font-mono-tech tracking-[0.18em] text-[#DFC18D] uppercase mb-2 font-bold">
                Project Typology
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                {[
                  'Private Homes',
                  'Restaurants & Cafes',
                  'Home Interiors',
                  'Offices & Workspaces'
                ].map((sec) => (
                  <button
                    type="button"
                    key={sec}
                    onClick={() => setFormData({ ...formData, sector: sec })}
                    className={`p-2.5 text-left border transition-all cursor-pointer ${
                      formData.sector === sec
                        ? 'border-[#DFC18D] bg-[#3E1019] text-[#DFC18D] font-semibold'
                        : 'border-[#DFC18D]/25 bg-[#180509] text-[#D4C8BC] hover:border-[#DFC18D]/60'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Name, Email, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase mb-1 font-semibold">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muddassir Haque"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#140407] border border-[#DFC18D]/30 p-2.5 text-xs text-white placeholder-[#8B7B70] focus:border-[#DFC18D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase mb-1 font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 8822225224"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#140407] border border-[#DFC18D]/30 p-2.5 text-xs text-white placeholder-[#8B7B70] focus:border-[#DFC18D] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase mb-1 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#140407] border border-[#DFC18D]/30 p-2.5 text-xs text-white placeholder-[#8B7B70] focus:border-[#DFC18D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase mb-1 font-semibold">
                  Location (City / State)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Siolim, Goa or Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#140407] border border-[#DFC18D]/30 p-2.5 text-xs text-white placeholder-[#8B7B70] focus:border-[#DFC18D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase mb-1 font-semibold">
                Tell us about your project
              </label>
              <textarea
                rows={3}
                placeholder="Mention plot size, rooms needed, envisioned budget, or any special architectural requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#140407] border border-[#DFC18D]/30 p-2.5 text-xs text-white placeholder-[#8B7B70] focus:border-[#DFC18D] focus:outline-none resize-none"
              />
            </div>

            {/* Direct Studio Contact Strip */}
            <div className="pt-3 border-t border-[#DFC18D]/25 flex flex-wrap items-center justify-between text-xs font-mono-tech text-[#D4C8BC] gap-2">
              <span className="flex items-center space-x-1">
                <MapPin size={13} className="text-[#DFC18D]" />
                <span>Lower Parel West, Mumbai</span>
              </span>
              <span className="flex items-center space-x-3">
                <a href="tel:+918822225224" className="hover:text-[#DFC18D] flex items-center space-x-1 font-semibold">
                  <Phone size={13} />
                  <span>+91 8822225224</span>
                </a>
                <a href="https://instagram.com/madstudio.arch" target="_blank" rel="noreferrer" className="hover:text-[#DFC18D] flex items-center space-x-1 font-semibold">
                  <Instagram size={13} />
                  <span>@madstudio.arch</span>
                </a>
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#DFC18D] hover:bg-[#F4E2BE] text-[#140407] border border-[#DFC18D] font-serif-display text-xs tracking-[0.2em] uppercase transition-all font-bold shadow-xl cursor-pointer hover:scale-[1.01]"
              >
                Request Free Consultation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
