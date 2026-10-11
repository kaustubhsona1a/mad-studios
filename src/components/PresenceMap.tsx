import React, { useState } from 'react';
import { PRESENCE_CITIES, CityPresence } from '../data/presence';
import { INDIA_MAP_OUTLINE } from '../data/indiaMapPath';
import { MapPin, Building, ArrowUpRight, CheckCircle2, Compass, Sparkles } from 'lucide-react';

interface PresenceMapProps {
  onSelectCity?: (city: CityPresence) => void;
}

// Geographically calibrated coordinates for official 667x778 India Projection
const CITY_COORDS: Record<string, { x: number; y: number; labelPos: 'left' | 'right' | 'top' | 'bottom'; regionTag?: string }> = {
  'Mumbai': { x: 118, y: 482, labelPos: 'left', regionTag: 'Flagship Studio' },
  'Karjat': { x: 130, y: 476, labelPos: 'top', regionTag: 'Weekend Retreats' },
  'Lonavala': { x: 134, y: 494, labelPos: 'bottom', regionTag: 'Hill Villas' },
  'Goa': { x: 138, y: 563, labelPos: 'left', regionTag: 'Coastal Architecture' },
  'Dharwad': { x: 164, y: 563, labelPos: 'right', regionTag: 'Heritage & Modern Homes' },
  'Chalisgaon': { x: 160, y: 438, labelPos: 'right', regionTag: 'Dining & Living Spaces' },
  'Ahmedabad': { x: 105, y: 376, labelPos: 'left', regionTag: 'Modern Workplaces' },
  'Lucknow': { x: 283, y: 270, labelPos: 'right', regionTag: 'Bespoke Residences' },
  'Hyderabad': { x: 238, y: 510, labelPos: 'right', regionTag: 'Turnkey Residences' },
  'Bangalore': { x: 222, y: 622, labelPos: 'right', regionTag: 'Modern Bungalows' },
};

export const PresenceMap: React.FC<PresenceMapProps> = ({ onSelectCity }) => {
  const [activeCity, setActiveCity] = useState<CityPresence>(PRESENCE_CITIES[0]);

  const handleCityClick = (city: CityPresence) => {
    setActiveCity(city);
    if (onSelectCity) onSelectCity(city);
  };

  return (
    <div className="w-full liquid-glass-burgundy rounded-2xl sm:rounded-3xl border border-[#C5A06B]/35 p-4 sm:p-7 lg:p-8 relative overflow-hidden shadow-2xl">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#C5A06B]/25 pb-4 mb-6 gap-3">
        <div>
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] text-[#C5A06B] uppercase block font-semibold">
            WHERE WE BUILD · NATIONAL REACH
          </span>
          <h4 className="font-serif-display text-lg sm:text-2xl text-white uppercase font-semibold">
            OUR LOCATIONS ACROSS INDIA
          </h4>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[10px] font-sans text-[#C5A06B]/80 tracking-wider block uppercase">
            ACTIVE REGIONS
          </span>
          <span className="font-sans text-xs sm:text-sm text-[#EBD2AC] font-bold">
            10+ CITIES & METROS
          </span>
        </div>
      </div>

      {/* Quick Region Selector Pills for Easy Touch Navigation on Mobile & iPad */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-6 max-w-full">
        {PRESENCE_CITIES.map((c) => {
          const isSelected = activeCity.name === c.name;
          return (
            <button
              key={c.name}
              onClick={() => handleCityClick(c)}
              className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-sans tracking-wider uppercase transition-all duration-300 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#C5A06B] to-[#EBD2AC] text-[#1A070B] font-bold shadow-md scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-[#D8C7B5] hover:text-white border border-white/10'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        
        {/* Interactive India Map Canvas (Authentic Full Survey of India Silhouette) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[420px] sm:min-h-[520px] bg-[#2A0E13]/90 rounded-2xl p-3 sm:p-6 border border-[#C5A06B]/30 shadow-inner overflow-hidden">
          
          {/* Subtle Architectural Drafting Grid */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.25) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          {/* Compass Rose Accent */}
          <div className="absolute top-4 right-4 text-[#C5A06B]/40 pointer-events-none flex flex-col items-center">
            <Compass size={28} className="text-[#C5A06B]/50 animate-spin-slow" />
            <span className="text-[8px] font-mono-tech text-[#C5A06B]/60 tracking-widest mt-0.5">NORTH</span>
          </div>

          <svg 
            viewBox="0 0 667 778" 
            className="w-full max-w-[480px] h-auto select-none relative z-10 overflow-visible" 
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="indiaMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C5A06B" stopOpacity="0.32" />
                <stop offset="45%" stopColor="#8A2E3E" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4A1520" stopOpacity="0.42" />
              </linearGradient>

              <filter id="goldGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Geographically Authentic Full India Outline (Jammu, Kashmir & Ladakh, Gujarat, North-East, Peninsula) */}
            <path
              d={INDIA_MAP_OUTLINE}
              fill="url(#indiaMapGrad)"
              stroke="#C5A06B"
              strokeWidth="1.8"
              strokeLinejoin="round"
              filter="drop-shadow(0px 8px 20px rgba(0,0,0,0.7))"
              className="transition-colors duration-500"
            />

            {/* Subtle Tropic of Cancer Reference Line (23.5° N) */}
            <path
              d="M 25,372 Q 280,360 540,340"
              stroke="#C5A06B"
              strokeWidth="0.85"
              strokeDasharray="4 4"
              strokeOpacity="0.4"
              fill="none"
            />
            <text x="546" y="343" fill="#C5A06B" opacity="0.55" fontSize="8" fontFamily="sans-serif" letterSpacing="0.08em">
              23.5° N · TROPIC OF CANCER
            </text>

            {/* Lakshadweep Archipelago */}
            <g className="opacity-80">
              <ellipse cx="106" cy="658" rx="2.5" ry="4.5" fill="#C5A06B" />
              <ellipse cx="102" cy="672" rx="2.5" ry="5.5" fill="#C5A06B" />
              <ellipse cx="98" cy="688" rx="3" ry="6" fill="#C5A06B" />
              <ellipse cx="108" cy="700" rx="2.5" ry="4" fill="#C5A06B" />
              <ellipse cx="118" cy="722" rx="2.5" ry="5" fill="#C5A06B" />
              <ellipse cx="128" cy="748" rx="3" ry="4" fill="#C5A06B" />
              <text x="45" y="700" fill="#C5A06B" opacity="0.6" fontSize="7.5" fontFamily="sans-serif" letterSpacing="0.1em">
                LAKSHADWEEP
              </text>
            </g>

            {/* Andaman & Nicobar Archipelago */}
            <g className="opacity-80">
              <path d="M 558,582 C 560,578 564,582 563,594 C 562,602 557,605 558,582 Z" fill="#C5A06B" />
              <path d="M 561,602 C 563,598 566,602 565,616 C 564,623 560,626 561,602 Z" fill="#C5A06B" />
              <path d="M 564,624 C 566,620 568,624 567,640 C 566,647 563,650 564,624 Z" fill="#C5A06B" />
              <ellipse cx="566" cy="656" rx="3" ry="5.5" fill="#C5A06B" />
              <ellipse cx="574" cy="688" rx="3.5" ry="5" fill="#C5A06B" />
              <ellipse cx="581" cy="716" rx="4" ry="7" fill="#C5A06B" />
              <ellipse cx="587" cy="744" rx="4.5" ry="8" fill="#C5A06B" />
              <text x="540" y="764" fill="#C5A06B" opacity="0.6" fontSize="7.5" fontFamily="sans-serif" letterSpacing="0.1em">
                ANDAMAN &amp; NICOBAR
              </text>
            </g>

            {/* Regional Architectural Corridors linking Mumbai Studio Hub */}
            <path
              d="
                M 118,482 L 283,270
                M 118,482 L 105,376
                M 118,482 L 160,438
                M 118,482 L 238,510
                M 118,482 L 138,563
                M 138,563 L 164,563
                M 164,563 L 222,622
                M 118,482 L 130,476
                M 130,476 L 134,494
              "
              stroke="#C5A06B"
              strokeWidth="0.9"
              strokeDasharray="3 4"
              strokeOpacity="0.4"
              fill="none"
            />

            {/* Interactive City Pinpoints with Calibrated Coordinates */}
            {PRESENCE_CITIES.map((c) => {
              const coords = CITY_COORDS[c.name] || { x: (c.x / 100) * 667, y: (c.y / 100) * 778, labelPos: 'right' };
              const { x: cx, y: cy, labelPos } = coords;
              const isSelected = activeCity.name === c.name;

              // Compute clean text anchor and offset based on label position
              let textX = cx + 11;
              let textY = cy + 4;
              let textAnchor: 'start' | 'middle' | 'end' = 'start';

              if (labelPos === 'left') {
                textX = cx - 11;
                textAnchor = 'end';
              } else if (labelPos === 'top') {
                textX = cx;
                textY = cy - 11;
                textAnchor = 'middle';
              } else if (labelPos === 'bottom') {
                textX = cx;
                textY = cy + 16;
                textAnchor = 'middle';
              }

              return (
                <g
                  key={c.name}
                  className="cursor-pointer group transition-transform duration-200"
                  onClick={() => handleCityClick(c)}
                  onMouseEnter={() => handleCityClick(c)}
                >
                  {/* Subtle target radar ring for selected */}
                  {isSelected && (
                    <>
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r="22" 
                        fill="none" 
                        stroke="#C5A06B" 
                        strokeWidth="1.5" 
                        strokeDasharray="3 3" 
                        className="animate-spin" 
                        style={{ animationDuration: '6s', transformOrigin: `${cx}px ${cy}px` }} 
                      />
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r="12" 
                        fill="#C5A06B" 
                        fillOpacity="0.25" 
                      />
                    </>
                  )}

                  {/* Outer Pin Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 7 : 4.5}
                    fill={isSelected ? '#C5A06B' : '#4E1D25'}
                    stroke={isSelected ? '#FFF2DF' : '#C5A06B'}
                    strokeWidth={isSelected ? 2 : 1.4}
                    className="transition-all duration-300 group-hover:scale-125"
                    filter={isSelected ? 'url(#goldGlow)' : undefined}
                  />

                  {/* Inner Core */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 3 : 1.8}
                    fill="#FFFFFF"
                  />

                  {/* City Label text with dark drop shadow */}
                  <text
                    x={textX}
                    y={textY}
                    textAnchor={textAnchor}
                    fill={isSelected ? '#EBD2AC' : '#F7F2EC'}
                    fontSize={isSelected ? '12' : '10'}
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? '700' : '600'}
                    letterSpacing="0.06em"
                    className="select-none pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  >
                    {c.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Footer Note */}
          <div className="mt-2 text-[10px] font-sans text-[#C5A06B]/80 tracking-widest uppercase text-center">
            TAP ANY CITY TO VIEW ACTIVE PROJECTS
          </div>
        </div>

        {/* Selected City Dossier Card in Rich Burgundy (Responsive for iPad & iPhone) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 liquid-glass-translucent rounded-2xl p-5 sm:p-7 border border-[#C5A06B]/35 shadow-xl">
          <div className="space-y-4">
            
            {/* Header Lockup */}
            <div className="flex items-center justify-between border-b border-[#C5A06B]/25 pb-3">
              <div className="flex items-center space-x-2 min-w-0">
                <MapPin size={20} className="text-[#C5A06B] shrink-0" />
                <span className="font-serif-display text-xl sm:text-2xl text-[#EBD2AC] uppercase font-bold tracking-wider truncate">
                  {activeCity.name}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#3E1D23] text-[#C5A06B] border border-[#C5A06B]/40 text-[10px] font-sans tracking-wider uppercase font-bold shrink-0">
                {activeCity.state}
              </span>
            </div>

            {/* Description */}
            <p className="font-sans text-xs sm:text-sm text-[#D8C7B5] leading-relaxed font-light">
              {activeCity.type} across {activeCity.state}. Bespoke climate-responsive architecture and turnkey project execution.
            </p>

            {/* Key Project Types in this city */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-sans text-[#C5A06B] uppercase tracking-wider block font-bold">
                COMPLETED & ACTIVE PROJECTS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCity.activeProjects.map((proj, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#2A0E13]/90 border border-[#C5A06B]/30 text-xs font-sans text-[#F7F2EC] flex items-center space-x-1.5 shadow-xs"
                  >
                    <CheckCircle2 size={11} className="text-[#C5A06B] shrink-0" />
                    <span>{proj}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Typology in this city */}
            <div className="p-3.5 rounded-xl bg-[#2A0E13]/90 border-l-3 border-[#C5A06B] space-y-1 mt-3">
              <span className="text-[10px] font-sans text-[#C5A06B]/80 uppercase tracking-widest block font-semibold">
                TYPOLOGY IN FOCUS
              </span>
              <div className="font-serif-display text-sm text-white uppercase font-bold">
                {activeCity.type}
              </div>
              <div className="text-xs text-[#D8C7B5] font-sans">
                {activeCity.activeProjects.length} Active & Delivered Projects in Region
              </div>
            </div>
          </div>

          <div className="pt-3.5 border-t border-[#C5A06B]/25 flex items-center justify-between text-xs font-sans text-[#C5A06B]/80">
            <span>ARCHITECTURAL REACH</span>
            <span className="font-bold text-[#EBD2AC] flex items-center space-x-1">
              <Sparkles size={12} className="text-[#C5A06B]" />
              <span>ACTIVE PRACTICE</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
