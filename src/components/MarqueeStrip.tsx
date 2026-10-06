import React from 'react';

interface MarqueeStripProps {
  variant?: 'burgundy' | 'gold' | 'glass';
  speed?: 'normal' | 'slow';
  reverse?: boolean;
}

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  variant = 'glass',
  speed = 'normal',
  reverse = false
}) => {
  const items = [
    'CONTEMPORARY ARCHITECTURE',
    'PRIVATE HOMES & VILLAS',
    'MODERN INTERIOR DESIGN',
    'BUILT FOR CLIMATE & COMFORT',
    'MUMBAI · GOA · LONAVALA · KARJAT',
    'BENGALURU · PUNE · DHARWAD',
    '250,000+ SQ.FT BUILT',
    'SPACES DESIGNED FOR LIVING'
  ];

  return (
    <div
      className={`hidden lg:flex w-full overflow-hidden border-y py-4 select-none items-center relative z-20 ${
        variant === 'glass'
          ? 'bg-[#140609]/70 backdrop-blur-xl border-white/[0.08] text-[#EBD2AC]'
          : variant === 'burgundy'
          ? 'bg-gradient-to-r from-[#200A10] via-[#33151A] to-[#200A10] border-[#C5A06B]/25 text-[#C5A06B]'
          : 'bg-[#1C080E] border-[#C5A06B]/30 text-[#F7F2EC]'
      }`}
    >
      <div
        className={`flex shrink-0 items-center space-x-10 animate-marquee ${
          reverse ? 'flex-row-reverse' : ''
        }`}
        style={{
          animationDuration: speed === 'slow' ? '45s' : '30s'
        }}
      >
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="flex items-center space-x-10 shrink-0">
            <span className="font-serif-display text-xs font-medium tracking-[0.24em] uppercase text-white/90">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C5A06B]/80 shadow-[0_0_8px_rgba(197,160,107,0.6)] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
