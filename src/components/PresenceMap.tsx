import React, { useState } from 'react';
import { PRESENCE_CITIES, CityPresence } from '../data/presence';
import { MapPin, Building, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface PresenceMapProps {
  onSelectCity?: (city: CityPresence) => void;
}

export const PresenceMap: React.FC<PresenceMapProps> = ({ onSelectCity }) => {
  const [activeCity, setActiveCity] = useState<CityPresence>(PRESENCE_CITIES[0]);

  return (
    <div className="w-full bg-[#1C060C] border-2 border-[#DFC18D]/35 p-6 sm:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#DFC18D]/25 pb-4 mb-6 gap-2">
        <div>
          <span className="font-mono-tech text-xs tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
            WHERE WE BUILD · NATIONAL REACH
          </span>
          <h4 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-semibold">
            OUR LOCATIONS ACROSS INDIA
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono-tech text-[#DFC18D]/70 tracking-wider block uppercase">
            ACTIVE REGIONS
          </span>
          <span className="font-mono-tech text-xs text-[#DFC18D] font-bold">
            10+ CITIES & METROS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive India Map Vector on Velvet Burgundy Background */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[400px] bg-[#140407] p-5 border border-[#DFC18D]/30 shadow-inner">
          {/* Subtle Grid Backdrop */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(223, 193, 141, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(223, 193, 141, 0.2) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <svg viewBox="0 0 500 560" className="w-full max-w-[420px] h-auto select-none relative z-10" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="mapGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFC18D" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#B88E48" stopOpacity="0.12" />
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
              stroke="#DFC18D"
              strokeWidth="1.5"
            />

            {/* Topographic State Boundary Lines */}
            <path
              d="M 170,120 L 240,150 L 280,200 M 140,215 L 210,230 L 260,280 M 150,330 L 210,340 L 250,380 M 195,450 L 240,430"
              stroke="#DFC18D"
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
                    <circle cx={cx} cy={cy} r="16" fill="none" stroke="#DFC18D" strokeWidth="1.5" strokeDasharray="3 2" className="animate-spin" style={{ animationDuration: '8s' }} />
                  )}

                  {/* Outer circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#DFC18D' : '#6E1A2C'}
                    stroke="#DFC18D"
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
                    fill={isSelected ? '#DFC18D' : '#F7F3EB'}
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
          <div className="mt-3 text-[10px] font-mono-tech text-[#DFC18D]/70 tracking-widest uppercase">
            CLICK ANY REGION TO EXPLORE ACTIVE PROJECTS
          </div>
        </div>

        {/* Selected City Dossier Card in Rich Burgundy */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#250810] p-6 sm:p-7 border border-[#DFC18D]/40 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DFC18D]/25 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-[#DFC18D]" />
                <span className="font-serif-display text-xl text-[#DFC18D] uppercase font-bold tracking-wider">
                  {activeCity.name}
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-[#3E1019] text-[#DFC18D] border border-[#DFC18D]/30 text-[10px] font-mono-tech tracking-wider uppercase font-bold">
                {activeCity.state}
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#D4C8BC] leading-relaxed">
              {activeCity.type} across {activeCity.state}. Tailored contemporary architecture and turnkey interior design.
            </p>

            {/* Key Project Types in this city */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono-tech text-[#DFC18D] uppercase tracking-wider block font-bold">
                COMPLETED & ACTIVE PROJECTS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCity.activeProjects.map((proj, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-[#180509] border border-[#DFC18D]/25 text-xs font-sans text-[#F7F3EB] flex items-center space-x-1"
                  >
                    <CheckCircle2 size={11} className="text-[#DFC18D]" />
                    <span>{proj}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Project in this city */}
            <div className="p-3.5 bg-[#1C060C] border-l-2 border-[#DFC18D] space-y-1 mt-3">
              <span className="text-[10px] font-mono-tech text-[#DFC18D]/80 uppercase tracking-widest block">
                TYPOLOGY IN FOCUS
              </span>
              <div className="font-serif-display text-sm text-white uppercase font-bold">
                {activeCity.type}
              </div>
              <div className="text-xs text-[#D4C8BC] font-sans">
                {activeCity.activeProjects.length} Active Projects in Region
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DFC18D]/25 flex items-center justify-between text-xs font-mono-tech text-[#DFC18D]/80">
            <span>PROJECT LOCATIONS</span>
            <span className="font-bold text-[#DFC18D]">ACTIVE REGION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
