import React, { useState } from 'react';
import { PRESENCE_CITIES, CityPresence } from '../data/presence';
import { MapPin, Building, ArrowUpRight, CheckCircle2, Compass, Sparkles } from 'lucide-react';

interface PresenceMapProps {
  onSelectCity?: (city: CityPresence) => void;
}

// Geographically calibrated coordinates for standard 500x580 India Cartographic Projection
const CITY_COORDS: Record<string, { x: number; y: number; labelPos: 'left' | 'right' | 'top' | 'bottom' }> = {
  'Mumbai': { x: 136, y: 358, labelPos: 'left' },
  'Karjat': { x: 150, y: 364, labelPos: 'right' },
  'Lonavala': { x: 156, y: 374, labelPos: 'right' },
  'Goa': { x: 146, y: 435, labelPos: 'left' },
  'Chalisgaon': { x: 176, y: 330, labelPos: 'right' },
  'Ahmedabad': { x: 122, y: 285, labelPos: 'left' },
  'Lucknow': { x: 268, y: 224, labelPos: 'right' },
  'Hyderabad': { x: 222, y: 405, labelPos: 'right' },
  'Bangalore': { x: 194, y: 482, labelPos: 'right' },
  'Dharwad': { x: 164, y: 438, labelPos: 'right' }
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
        
        {/* Interactive India Map Canvas (Authentic Full India Silhouette) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[460px] bg-[#2A0E13]/90 rounded-2xl p-3 sm:p-6 border border-[#C5A06B]/30 shadow-inner overflow-hidden">
          
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
            viewBox="0 0 500 580" 
            className="w-full max-w-[440px] h-auto select-none relative z-10 overflow-visible" 
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="indiaMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C5A06B" stopOpacity="0.28" />
                <stop offset="50%" stopColor="#8A2E3E" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#541B26" stopOpacity="0.35" />
              </linearGradient>

              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Geographically Accurate Full India Coastline & International Border Silhouette */}
            {/* Covers Jammu & Kashmir, Ladakh, Punjab, Rajasthan, Gujarat (Kutch + Kathiawar), Maharashtra, Goa, Karnataka, Kerala, Kanyakumari, Tamil Nadu, Andhra, Odisha, Bengal, and the North-East */}
            <path
              d={`
                M 212,38 
                C 220,44 235,46 248,56 
                C 255,62 260,74 258,84 
                C 255,95 245,108 248,120 
                C 252,132 262,140 255,152 
                C 246,165 234,172 230,185 
                C 225,198 242,208 255,214 
                C 272,222 290,228 310,235 
                C 328,242 342,246 348,244 
                C 352,238 355,225 362,228 
                C 370,232 378,245 388,242 
                C 405,236 420,220 438,212 
                C 450,206 462,214 466,224 
                C 470,236 464,248 456,258 
                C 448,268 444,280 435,292 
                C 426,304 416,310 405,302 
                C 395,294 388,284 378,288 
                C 368,292 362,306 352,316 
                C 344,324 336,334 330,332 
                C 322,330 320,318 312,324 
                C 300,334 305,355 292,374 
                C 280,392 268,410 256,428 
                C 244,446 235,468 224,490 
                C 214,510 205,532 195,555 
                C 192,555 188,548 185,535 
                C 180,515 174,494 168,474 
                C 162,454 154,435 146,415 
                C 140,400 134,382 135,364 
                C 136,346 142,332 136,320 
                C 130,310 120,314 112,318 
                C 100,324 88,322 84,310 
                C 80,298 90,286 102,280 
                C 95,274 76,274 72,266 
                C 68,258 84,250 96,246 
                C 108,242 112,230 114,216 
                C 116,200 125,185 132,170 
                C 140,154 150,140 156,124 
                C 162,108 170,95 180,82 
                C 190,68 202,52 212,38 
                Z
              `}
              fill="url(#indiaMapGrad)"
              stroke="#C5A06B"
              strokeWidth="1.8"
              filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.6))"
            />

            {/* Subtle Tropic of Cancer & Latitude Reference Line */}
            <path
              d="M 100,280 Q 250,288 420,270"
              stroke="#C5A06B"
              strokeWidth="0.75"
              strokeDasharray="3 4"
              strokeOpacity="0.4"
              fill="none"
            />
            <text x="424" y="273" fill="#C5A06B" opacity="0.5" fontSize="7" fontFamily="sans-serif">23.5° N</text>

            {/* Internal Regional Transit / Project Corridors */}
            <path
              d="
                M 136,358 L 268,224
                M 136,358 L 146,435
                M 146,435 L 194,482
                M 136,358 L 222,405
              "
              stroke="#C5A06B"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              strokeOpacity="0.3"
              fill="none"
            />

            {/* Interactive City Pinpoints with Calibrated Coordinates */}
            {PRESENCE_CITIES.map((c) => {
              const coords = CITY_COORDS[c.name] || { x: c.x * 4.4 + 40, y: c.y * 4.6 + 40, labelPos: 'right' };
              const { x: cx, y: cy, labelPos } = coords;
              const isSelected = activeCity.name === c.name;

              // Compute clean text anchor and offset based on label position
              let textX = cx + 9;
              let textY = cy + 3.5;
              let textAnchor: 'start' | 'middle' | 'end' = 'start';

              if (labelPos === 'left') {
                textX = cx - 9;
                textAnchor = 'end';
              } else if (labelPos === 'top') {
                textX = cx;
                textY = cy - 9;
                textAnchor = 'middle';
              } else if (labelPos === 'bottom') {
                textX = cx;
                textY = cy + 14;
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
                        r="18" 
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
                        r="10" 
                        fill="#C5A06B" 
                        fillOpacity="0.25" 
                      />
                    </>
                  )}

                  {/* Outer Pin Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#C5A06B' : '#4E1D25'}
                    stroke={isSelected ? '#FFF2DF' : '#C5A06B'}
                    strokeWidth={isSelected ? 2 : 1.2}
                    className="transition-all duration-300 group-hover:scale-125"
                    filter={isSelected ? 'url(#goldGlow)' : undefined}
                  />

                  {/* Inner Core */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 2.5 : 1.5}
                    fill="#FFFFFF"
                  />

                  {/* City Label text with dark drop shadow */}
                  <text
                    x={textX}
                    y={textY}
                    textAnchor={textAnchor}
                    fill={isSelected ? '#EBD2AC' : '#F7F2EC'}
                    fontSize={isSelected ? '11' : '9.5'}
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? '700' : '500'}
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
