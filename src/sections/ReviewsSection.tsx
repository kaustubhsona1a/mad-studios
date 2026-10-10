import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquarePlus, Quote, CheckCircle2, X, Compass, Sparkles, MessageCircle } from 'lucide-react';

export interface ClientReview {
  id: string;
  author: string;
  roleOrLocation: string;
  project: string;
  typology: 'Homes & Villas' | 'Restaurants' | 'Workspaces' | 'Interiors';
  rating: number;
  text: string;
  date: string;
  isUserSubmitted?: boolean;
}

const DEFAULT_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    author: 'Dr. Vikram & Sunita Deshmukh',
    roleOrLocation: 'Siolim, North Goa',
    project: 'Casa Sylva Villa',
    typology: 'Homes & Villas',
    rating: 5,
    text: 'Muddassir and the M.A.D Studio team brought our dream retreat in Goa to life with rare sensitivity to breeze, rain, and light. The steep pitched roof, central courtyard reflection pool, and local laterite masonry keep the house naturally cool all year round. Pure bliss.',
    date: 'January 2026'
  },
  {
    id: 'rev-2',
    author: 'Ananya & Rohan Singhania',
    roleOrLocation: 'Lonavala, Maharashtra',
    project: 'Indus Villa 8 & 9',
    typology: 'Homes & Villas',
    rating: 5,
    text: 'From the initial floor layout sketches to handover, working with M.A.D Studio was completely transparent. They balanced open entertainment verandas with secluded family bedrooms and sports facilities. The board-formed concrete and teak wood craftsmanship is second to none.',
    date: 'November 2025'
  },
  {
    id: 'rev-3',
    author: 'Arjun K. Mehra',
    roleOrLocation: 'Goregaon, Mumbai',
    project: 'Espirit Stones HQ',
    typology: 'Workspaces',
    rating: 5,
    text: 'We entrusted our 13,000 sq.ft corporate space to M.A.D Studio. Their vision for monolithic bookmatched quartz walls, acoustic oak ceilings, and natural illumination created a space our executive clients continuously admire.',
    date: 'February 2026'
  },
  {
    id: 'rev-4',
    author: 'Naveen Patil',
    roleOrLocation: 'Dharwad, Karnataka',
    project: 'Airani Mane Courtyard Home',
    typology: 'Homes & Villas',
    rating: 5,
    text: 'Their commitment to honest materials won our complete trust. Building with exposed wire-cut clay bricks and an open skylit central courtyard gives our family a grounded, peaceful sanctuary with wonderful morning light.',
    date: 'August 2025'
  }
];

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    author: '',
    roleOrLocation: '',
    project: '',
    typology: 'Homes & Villas' as ClientReview['typology'],
    rating: 5,
    text: '',
    notifyOnWhatsApp: true
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Load reviews on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mad_studio_reviews');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
          return;
        }
      }
    } catch {
      // ignore JSON parse error
    }
    setReviews(DEFAULT_REVIEWS);
  }, []);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.text.trim()) return;

    const newReview: ClientReview = {
      id: `rev-${Date.now()}`,
      author: formData.author.trim(),
      roleOrLocation: formData.roleOrLocation.trim() || 'Verified Client',
      project: formData.project.trim() || 'Bespoke Space',
      typology: formData.typology,
      rating: formData.rating,
      text: formData.text.trim(),
      date: 'Just now',
      isUserSubmitted: true
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('mad_studio_reviews', JSON.stringify(updated));
    } catch {
      // storage quota or private browsing
    }

    // Optional WhatsApp notification to 8822225224
    if (formData.notifyOnWhatsApp) {
      const waMsg = 
        `⭐ *NEW CLIENT REVIEW FOR M.A.D STUDIO*\n` +
        `-----------------------------------------\n` +
        `👤 *Client:* ${formData.author.trim()} (${formData.roleOrLocation.trim() || 'Client'})\n` +
        `🏠 *Project:* ${formData.project.trim() || 'Architecture / Interiors'}\n` +
        `🌟 *Rating:* ${formData.rating} / 5 Stars\n` +
        `💬 *Review:*\n"${formData.text.trim()}"\n` +
        `-----------------------------------------\n` +
        `🌐 *Submitted on madstudio.arch website*`;
      try {
        window.open(`https://wa.me/918822225224?text=${encodeURIComponent(waMsg)}`, '_blank');
      } catch {
        // popup block
      }
    }

    // Reset & Close
    setFormData({
      author: '',
      roleOrLocation: '',
      project: '',
      typology: 'Homes & Villas',
      rating: 5,
      text: '',
      notifyOnWhatsApp: true
    });
    setIsModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  return (
    <section id="reviews" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-14 sm:py-24 border-b border-[#C5A06B]/20 overflow-hidden">
      {/* Ambient Lighting & Grid */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#6E1C2E]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-[#542A33]/15 rounded-full blur-[130px] pointer-events-none" />

      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header with Rating Pill and Write Review Button */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full liquid-glass-pill text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#C5A06B] uppercase font-semibold">
              <Compass size={12} className="text-[#C5A06B]" />
              <span>TESTIMONIALS · CLIENT STORIES</span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight break-words">
              What Our Clients Say
            </h2>
            <p className="font-sans text-xs sm:text-sm lg:text-base text-[#D8C7B5] leading-relaxed font-light">
              Genuine experiences from homeowners, estate developers, and founders we have designed for.
            </p>
          </div>

          {/* Action Zone: Aggregate Rating Card + Write Review CTA */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            {/* Rating pill */}
            <div className="liquid-glass-translucent px-3.5 py-2 rounded-xl sm:rounded-2xl border border-white/15 flex items-center space-x-2.5 shadow-sm">
              <div className="flex items-center text-[#EBD2AC]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-[#C5A06B] text-[#C5A06B]" />
                ))}
              </div>
              <div className="text-left border-l border-white/15 pl-2.5">
                <span className="font-serif-display text-xs text-white font-bold block">4.9 / 5.0</span>
                <span className="text-[10px] font-sans text-[#D8C7B5] block">30+ Reviews</span>
              </div>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] hover:from-[#5C202C] hover:to-[#842238] text-[#F7F2EC] border border-[#C5A06B]/70 hover:border-[#C5A06B] font-serif-display text-[11px] sm:text-xs tracking-[0.14em] uppercase transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-98 font-semibold cursor-pointer shrink-0"
            >
              <MessageSquarePlus size={14} className="text-[#C5A06B]" />
              <span>WRITE A REVIEW</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid (Responsive for iPad and iPhone) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
              className="liquid-glass-card rounded-2xl p-5 sm:p-7 flex flex-col justify-between border border-white/15 hover:border-[#C5A06B]/50 transition-all duration-300 relative group shadow-lg"
            >
              {/* Top specular highlight */}
              <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              <div className="space-y-4">
                {/* Header of review: Stars + Typology */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < rev.rating ? 'fill-[#C5A06B] text-[#C5A06B]' : 'text-white/20'}
                      />
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    {rev.isUserSubmitted && (
                      <span className="px-2 py-0.5 rounded-full bg-[#6E1C2E] text-[#EBD2AC] text-[9px] font-sans font-semibold tracking-wider uppercase border border-[#C5A06B]/40">
                        RECENT
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full liquid-glass-pill text-[#EBD2AC] text-[10px] font-sans uppercase font-medium">
                      {rev.typology}
                    </span>
                  </div>
                </div>

                {/* Review Text with Quote Mark */}
                <div className="relative">
                  <Quote size={20} className="text-[#C5A06B]/30 absolute -top-1 -left-1 pointer-events-none" />
                  <p className="font-sans text-xs sm:text-sm text-[#F7F2EC]/90 leading-relaxed font-light pl-4">
                    “{rev.text}”
                  </p>
                </div>
              </div>

              {/* Author & Project Footer */}
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-sans">
                <div>
                  <h4 className="font-serif-display text-xs sm:text-sm text-white font-semibold uppercase tracking-wider group-hover:text-[#EBD2AC] transition-colors">
                    {rev.author}
                  </h4>
                  <span className="text-[11px] text-[#C5A06B] block">
                    {rev.project} · {rev.roleOrLocation}
                  </span>
                </div>
                <span className="text-[10px] text-[#D8C7B5]/60 font-light hidden sm:inline">
                  {rev.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Success Notification Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 liquid-glass-burgundy rounded-2xl border border-[#C5A06B] p-4 shadow-2xl flex items-center space-x-3 max-w-md text-sm text-[#F7F2EC]"
          >
            <CheckCircle2 size={20} className="text-[#C5A06B] shrink-0" />
            <div className="flex-1">
              <span className="font-semibold block text-white font-serif-display text-xs uppercase tracking-wider">Review Published</span>
              <span className="text-xs text-[#D8C7B5]">Thank you! Your review has been added to our client stories.</span>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="p-1 hover:text-white text-white/60 cursor-pointer"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg liquid-glass-burgundy rounded-2xl sm:rounded-3xl border border-white/20 p-5 sm:p-8 text-[#F7F2EC] shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-5 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-sans tracking-widest text-[#C5A06B] uppercase font-semibold">
                    <Sparkles size={11} />
                    <span>SHARE YOUR EXPERIENCE</span>
                  </div>
                  <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-medium">
                    Write a Review
                  </h3>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full liquid-glass-pill hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                
                {/* Rating Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans text-[#EBD2AC] uppercase tracking-wider block font-semibold">
                    Overall Experience
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating !== null ? hoverRating : formData.rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            size={24}
                            className={isFilled ? 'fill-[#C5A06B] text-[#C5A06B]' : 'text-white/30'}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-sans text-[#D8C7B5] ml-2">
                      {formData.rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-sans text-[#EBD2AC] uppercase tracking-wider block font-semibold">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Deshmukh"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 focus:border-[#C5A06B] text-white text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>

                {/* Location & Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-sans text-[#EBD2AC] uppercase tracking-wider block font-semibold">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Siolim, Goa"
                      value={formData.roleOrLocation}
                      onChange={(e) => setFormData({ ...formData, roleOrLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 focus:border-[#C5A06B] text-white text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-sans text-[#EBD2AC] uppercase tracking-wider block font-semibold">
                      Project Name / Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Casa Sylva Villa"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 focus:border-[#C5A06B] text-white text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Typology */}
                <div className="space-y-1">
                  <label className="text-xs font-sans text-[#EBD2AC] uppercase tracking-wider block font-semibold">
                    Category
                  </label>
                  <select
                    value={formData.typology}
                    onChange={(e) => setFormData({ ...formData, typology: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A0E13] border border-white/20 focus:border-[#C5A06B] text-white text-xs sm:text-sm outline-none transition-colors cursor-pointer"
                  >
                    <option value="Homes & Villas">Homes & Villas</option>
                    <option value="Restaurants">Restaurants & Hospitality</option>
                    <option value="Workspaces">Workspaces & Corporate</option>
                    <option value="Interiors">Interior Architecture</option>
                  </select>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-xs font-sans text-[#EBD2AC] uppercase tracking-wider block font-semibold">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your architectural design or build experience with M.A.D Studio..."
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 focus:border-[#C5A06B] text-white text-xs sm:text-sm outline-none transition-colors resize-none"
                  />
                </div>

                {/* WhatsApp Notification Checkbox */}
                <div className="flex items-center space-x-2 pt-1 pb-1">
                  <input
                    type="checkbox"
                    id="notifyWa"
                    checked={formData.notifyOnWhatsApp}
                    onChange={(e) => setFormData({ ...formData, notifyOnWhatsApp: e.target.checked })}
                    className="w-4 h-4 rounded text-[#25D366] bg-white/10 border-white/20 focus:ring-[#25D366] cursor-pointer"
                  />
                  <label htmlFor="notifyWa" className="text-xs font-sans text-[#D8C7B5] cursor-pointer flex items-center space-x-1.5">
                    <MessageCircle size={13} className="text-[#25D366]" />
                    <span>Also notify M.A.D Studio on WhatsApp (<strong className="text-white">8822225224</strong>)</span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#C5A06B] via-[#EBD2AC] to-[#C5A06B] hover:brightness-110 text-[#140508] font-serif-display text-xs tracking-[0.2em] uppercase transition-all font-bold shadow-[0_8px_25px_rgba(197,160,107,0.35)] cursor-pointer hover:scale-[1.01] active:scale-98"
                  >
                    SUBMIT REVIEW
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
