import React, { useState } from 'react';
import { PRESENCE_CITIES, CityPresence } from '../data/presence';
import { MapPin, Building, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface PresenceMapProps {
  onSelectCity?: (city: CityPresence) => void;
}

export const PresenceMap: React.FC<PresenceMapProps> = ({ onSelectCity }) => {
  const [activeCity, setActiveCity] = useState<CityPresence>(PRESENCE_CITIES[0]);

  return (
    <div className="w-full bg-[#48232B] border border-[#C5A06B]/35 p-6 sm:p-8 relative overflow-hidden shadow-xl">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#C5A06B]/25 pb-4 mb-6 gap-2">
        <div>
          <span className="font-mono-tech text-xs tracking-[0.25em] text-[#C5A06B] uppercase block font-semibold">
            WHERE WE BUILD · NATIONAL REACH
          </span>
          <h4 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-semibold">
            OUR LOCATIONS ACROSS INDIA
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono-tech text-[#C5A06B]/70 tracking-wider block uppercase">
            ACTIVE REGIONS
          </span>
          <span className="font-mono-tech text-xs text-[#C5A06B] font-bold">
            10+ CITIES & METROS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive India Map Vector on Velvet Burgundy Background */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[400px] bg-[#33151A] p-5 border border-[#C5A06B]/30 shadow-inner">
          {/* Subtle Grid Backdrop */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.2) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <svg viewBox="0 0 500 560" className="w-full max-w-[420px] h-auto select-none relative z-10" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="mapGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C5A06B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#9E7A4A" stopOpacity="0.12" />
              </linearGradient>
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized Geometric India Landmass Silhouette */}
            <path
              d="M 180,60 
                 L 220,50 L 250,70 L 270,110 L 290,130 L 330,140 L 360,160 L 410,165 
                 L 450,190 L 440,230 L 400,240 L 370,230 L 340,250 L 320,290 L 310,330 
                 L 270,390 L 240,460 L 220,500 L 210,500 L 195,450 L 165,390 L 150,330 
                 L 135,280 L 105,270 L 95,240 L 120,210 L 140,215 L 160,180 L 170,120 Z"
              fill="url(#mapGoldGrad)"
              stroke="#C5A06B"
              strokeWidth="1.5"
            />

            {/* Topographic State Boundary Lines */}
            <path
              d="M 170,120 L 240,150 L 280,200 M 140,215 L 210,230 L 260,280 M 150,330 L 210,340 L 250,380 M 195,450 L 240,430"
              stroke="#C5A06B"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              strokeOpacity="0.35"
              fill="none"
            />

            {/* City Pinpoints with connection lines */}
            {PRESENCE_CITIES.map((c) => {
              const cx = c.x * 4.6 + 40;
              const cy = c.y * 4.8 + 60;
              const isSelected = activeCity.name === c.name;

              return (
                <g
                  key={c.name}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => {
                    setActiveCity(c);
                    if (onSelectCity) onSelectCity(c);
                  }}
                  onMouseEnter={() => setActiveCity(c)}
                >
                  {/* Subtle target radar ring for selected */}
                  {isSelected && (
                    <circle cx={cx} cy={cy} r="16" fill="none" stroke="#C5A06B" strokeWidth="1.5" strokeDasharray="3 2" className="animate-spin" style={{ animationDuration: '8s' }} />
                  )}

                  {/* Outer circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#C5A06B' : '#542A33'}
                    stroke="#C5A06B"
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-all duration-300"
                  />

                  {/* Inner pulse core */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 2.5 : 1.5}
                    fill="#FFFFFF"
                  />

                  {/* City Label text */}
                  <text
                    x={cx + 9}
                    y={cy + 3.5}
                    fill={isSelected ? '#C5A06B' : '#F7F2EC'}
                    fontSize={isSelected ? '11' : '9.5'}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    letterSpacing="0.08em"
                    className="select-none pointer-events-none drop-shadow-sm"
                  >
                    {c.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive instruction note */}
          <div className="mt-3 text-[10px] font-mono-tech text-[#C5A06B]/70 tracking-widest uppercase">
            CLICK ANY REGION TO EXPLORE ACTIVE PROJECTS
          </div>
        </div>

        {/* Selected City Dossier Card in Rich Burgundy */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#48232B] p-6 sm:p-7 border border-[#C5A06B]/35 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#C5A06B]/25 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-[#C5A06B]" />
                <span className="font-serif-display text-xl text-[#C5A06B] uppercase font-bold tracking-wider">
                  {activeCity.name}
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-[#4A242B] text-[#C5A06B] border border-[#C5A06B]/30 text-[10px] font-mono-tech tracking-wider uppercase font-bold">
                {activeCity.state}
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#D8C7B5] leading-relaxed">
              {activeCity.type} across {activeCity.state}. Tailored contemporary architecture and turnkey interior design.
            </p>

            {/* Key Project Types in this city */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-wider block font-bold">
                COMPLETED & ACTIVE PROJECTS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCity.activeProjects.map((proj, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-[#33151A] border border-[#C5A06B]/25 text-xs font-sans text-[#F7F2EC] flex items-center space-x-1"
                  >
                    <CheckCircle2 size={11} className="text-[#C5A06B]" />
                    <span>{proj}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Project in this city */}
            <div className="p-3.5 bg-[#33151A] border-l-2 border-[#C5A06B] space-y-1 mt-3">
              <span className="text-[10px] font-mono-tech text-[#C5A06B]/80 uppercase tracking-widest block">
                TYPOLOGY IN FOCUS
              </span>
              <div className="font-serif-display text-sm text-white uppercase font-bold">
                {activeCity.type}
              </div>
              <div className="text-xs text-[#D8C7B5] font-sans">
                {activeCity.activeProjects.length} Active Projects in Region
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#C5A06B]/25 flex items-center justify-between text-xs font-mono-tech text-[#C5A06B]/80">
            <span>PROJECT LOCATIONS</span>
            <span className="font-bold text-[#C5A06B]">ACTIVE REGION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
