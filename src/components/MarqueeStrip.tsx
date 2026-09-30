import React from 'react';

interface MarqueeStripProps {
  variant?: 'burgundy' | 'gold';
  speed?: 'normal' | 'slow';
  reverse?: boolean;
}

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  variant = 'burgundy',
  speed = 'normal',
  reverse = false
}) => {
  const items = [
    'CONTEMPORARY TROPICAL ARCHITECTURE',
    'BESPOKE PRIVATE HOMES',
    'LUXURY VILLAS & ESTATES',
    'INTEGRATED INTERIOR ARCHITECTURE',
    'CLIMATE-RESPONSIVE PLANNING',
    'MUMBAI · GOA · LONAVALA · KARJAT',
    'BENGALURU · AHMEDABAD · DHARWAD',
    '250,000+ SQ.FT. CRAFTED',
    'BUILT FOR LIVING, DESIGNED FOR TIMELESSNESS'
  ];

  return (
    <div
      className={`w-full overflow-hidden border-y py-3.5 select-none flex items-center ${
        variant === 'burgundy'
          ? 'bg-[#33151A] border-[#C5A06B]/25 text-[#C5A06B]'
          : 'bg-[#482229] border-[#C5A06B]/40 text-[#F7F2EC]'
      }`}
    >
      <div
        className={`flex shrink-0 items-center space-x-8 animate-marquee ${
          reverse ? 'flex-row-reverse' : ''
        }`}
        style={{
          animationDuration: speed === 'slow' ? '45s' : '30s'
        }}
      >
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="flex items-center space-x-8 shrink-0">
            <span className="font-serif-display text-xs font-semibold tracking-[0.22em] uppercase">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rotate-45 border border-[#C5A06B]/60 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
