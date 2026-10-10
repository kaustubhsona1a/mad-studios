import React, { useState } from 'react';
import { X, Check, Phone, Mail, Instagram, MapPin, Sparkles, Calendar, MessageCircle, ArrowUpRight } from 'lucide-react';
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
    sector: 'Private Homes & Villas',
    city: '',
    area: '',
    description: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Format full requirement payload for WhatsApp notification to 8822225224
    const message = 
      `🏛️ *NEW ARCHITECTURAL LEAD - M.A.D STUDIO*\n` +
      `-----------------------------------------\n` +
      `👤 *Client Name:* ${formData.name.trim()}\n` +
      `📞 *Phone Number:* ${formData.phone.trim()}\n` +
      `✉️ *Email:* ${formData.email.trim()}\n` +
      `🏡 *Project Typology:* ${formData.sector}\n` +
      `📍 *Location / Site:* ${formData.city.trim() || 'Not specified'}\n` +
      `📐 *Plot / Built Area:* ${formData.area.trim() || 'Not specified'}\n` +
      `📝 *Client Requirements & Vision:*\n"${formData.description.trim() || 'Consultation request'}"\n` +
      `-----------------------------------------\n` +
      `📅 *Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n` +
      `🌐 *Source:* M.A.D Studio Website`;

    const generatedUrl = `https://wa.me/918822225224?text=${encodeURIComponent(message)}`;
    setWhatsAppUrl(generatedUrl);

    // 2. Persist lead in localStorage for record keeping
    try {
      const storedLeads = JSON.parse(localStorage.getItem('mad_studio_leads') || '[]');
      storedLeads.unshift({
        id: `lead-${Date.now()}`,
        ...formData,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('mad_studio_leads', JSON.stringify(storedLeads));
    } catch {
      // ignore localStorage quota errors
    }

    // 3. Trigger WhatsApp notification immediately
    try {
      window.open(generatedUrl, '_blank');
    } catch {
      // popup blocker handled by interactive button
    }

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#180508]/92 via-[#110305]/96 to-[#090204]/98 backdrop-blur-3xl text-[#F7F2EC] border border-white/20 p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.35)] overflow-hidden">
        
        {/* Top Liquid Specular Reflection Sheen */}
        <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#C5A06B] hover:text-white hover:bg-white/10 border border-white/15 transition-all cursor-pointer"
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-8 border-b border-white/10 pb-6">
          <MadLogo size="sm" variant="gold" className="mb-2" />
          <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#C5A06B] uppercase block font-semibold">
            M.A.D DESIGN STUDIO · ARCHITECTURE & INTERIORS
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl text-white uppercase font-normal">
            Book a Consultation
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#D8C7B5] max-w-md mx-auto leading-relaxed font-light">
            Discuss your plot, budget, and design ideas directly with our architects.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full liquid-glass-burgundy border border-[#C5A06B] flex items-center justify-center text-[#C5A06B] shadow-xl">
              <Check size={30} />
            </div>
            <h3 className="font-serif-display text-2xl text-white uppercase tracking-wide">
              Consultation Requested
            </h3>
            <p className="font-sans text-sm text-[#D8C7B5] max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-[#C5A06B] font-semibold">{formData.name}</span>. Your requirements have been recorded and formatted for direct notification.
            </p>

            {/* Direct WhatsApp Notification Button to 8822225224 */}
            <div className="p-4 rounded-2xl bg-[#140609] border border-[#25D366]/40 max-w-md mx-auto space-y-2.5 shadow-lg">
              <div className="flex items-center justify-center space-x-1.5 text-xs text-[#25D366] font-semibold font-sans">
                <MessageCircle size={14} />
                <span>Instant Notification to Architect</span>
              </div>
              <p className="text-[11px] text-[#D8C7B5]/90 font-sans">
                Click below to send all your project details directly to our WhatsApp number <span className="text-white font-semibold">+91 8822225224</span>:
              </p>
              <a
                href={whatsAppUrl || `https://wa.me/918822225224?text=${encodeURIComponent(`Hi M.A.D Studio, I am ${formData.name} and would like to consult about ${formData.sector}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-[#0A2612] font-sans text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 font-bold shadow-[0_4px_20px_rgba(37,211,102,0.35)] cursor-pointer hover:scale-[1.01]"
              >
                <MessageCircle size={16} />
                <span>Notify On WhatsApp (8822225224)</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap justify-center gap-5 text-xs font-sans text-[#C5A06B]">
              <a href="tel:+918822225224" className="hover:text-white flex items-center space-x-1 font-semibold transition-colors">
                <Phone size={14} />
                <span>+91 8822225224</span>
              </a>
              <a href="https://www.instagram.com/madstudio.arch/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center space-x-1 font-semibold transition-colors">
                <Instagram size={14} />
                <span>@madstudio.arch</span>
              </a>
              <a href="mailto:madstudio.reach@gmail.com" className="hover:text-white flex items-center space-x-1 font-semibold transition-colors">
                <Mail size={14} />
                <span>madstudio.reach@gmail.com</span>
              </a>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="mt-4 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] text-[#F7F2EC] border border-[#C5A06B]/60 font-serif-display text-xs tracking-widest uppercase hover:brightness-110 cursor-pointer shadow-lg"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sector Selector */}
            <div>
              <label className="block text-[11px] font-sans tracking-[0.18em] text-[#C5A06B] uppercase mb-2 font-bold">
                Project Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                {[
                  'Private Homes & Villas',
                  'Restaurants & Hospitality',
                  'Luxury Home Interiors',
                  'Offices & Workspaces'
                ].map((sec) => (
                  <button
                    type="button"
                    key={sec}
                    onClick={() => setFormData({ ...formData, sector: sec })}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      formData.sector === sec
                        ? 'border-[#C5A06B] bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] text-white font-semibold shadow-md'
                        : 'border-white/12 bg-white/[0.04] text-[#D8C7B5] hover:border-white/30 hover:bg-white/[0.08]'
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
                <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#D8C7B5] uppercase mb-1 font-semibold">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muddassir Haque"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-[#8B7B70] focus:border-[#C5A06B] focus:bg-white/[0.08] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#D8C7B5] uppercase mb-1 font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 8822225224"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-[#8B7B70] focus:border-[#C5A06B] focus:bg-white/[0.08] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#D8C7B5] uppercase mb-1 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-[#8B7B70] focus:border-[#C5A06B] focus:bg-white/[0.08] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#D8C7B5] uppercase mb-1 font-semibold">
                  Location (City / State)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Siolim, Goa or Lower Parel, Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-[#8B7B70] focus:border-[#C5A06B] focus:bg-white/[0.08] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#D8C7B5] uppercase mb-1 font-semibold">
                Project Scope & Vision
              </label>
              <textarea
                rows={3}
                placeholder="Mention plot area, rooms needed, style preferences, or envisioned timeline..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-[#8B7B70] focus:border-[#C5A06B] focus:bg-white/[0.08] focus:outline-none resize-none transition-all"
              />
            </div>

            {/* Direct Studio Contact Strip */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono-tech text-[#D8C7B5] gap-2">
              <span className="flex items-center space-x-1">
                <MapPin size={13} className="text-[#C5A06B]" />
                <span>Lower Parel West, Mumbai</span>
              </span>
              <span className="flex items-center space-x-3">
                <a href="tel:+918822225224" className="hover:text-[#C5A06B] flex items-center space-x-1 font-semibold">
                  <Phone size={13} />
                  <span>+91 8822225224</span>
                </a>
                <a href="https://www.instagram.com/madstudio.arch/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A06B] flex items-center space-x-1 font-semibold">
                  <Instagram size={13} />
                  <span>@madstudio.arch</span>
                </a>
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#C5A06B] via-[#EBD2AC] to-[#C5A06B] text-[#140508] font-serif-display text-xs tracking-[0.2em] uppercase transition-all font-bold shadow-[0_8px_30px_rgba(197,160,107,0.35)] cursor-pointer hover:brightness-110 hover:scale-[1.01] active:scale-98"
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
