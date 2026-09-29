import React, { useState } from 'react';
import { FloorPlanLevel } from '../data/projects';
import { ZoomIn, ZoomOut, Maximize2, Compass } from 'lucide-react';

interface FloorPlanViewerProps {
  levels: FloorPlanLevel[];
  projectName: string;
  sections?: string[];
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  levels,
  projectName,
  sections
}) => {
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentLevel = levels[activeLevelIndex] || levels[0];

  const handleZoom = (delta: number) => {
    setZoomScale(prev => Math.min(Math.max(0.8, prev + delta), 1.8));
  };

  return (
    <div className={`relative bg-white border border-[#D8C7B0] overflow-hidden flex flex-col shadow-sm ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'w-full'}`}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#D8C7B0] bg-[#F7F3EC] px-4 py-3 gap-3">
        <div className="flex items-center space-x-3">
          <span className="font-serif-display text-sm tracking-wider text-[#8E2838] uppercase font-bold">
            Floor Plans
          </span>
          <span className="text-xs text-[#D8C7B0]">|</span>
          <span className="font-sans text-xs tracking-wider text-[#4A3D36] uppercase font-medium">
            {projectName}
          </span>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex items-center space-x-1 bg-white p-1 border border-[#D8C7B0]">
          {levels.map((level, idx) => (
            <button
              key={level.id}
              onClick={() => setActiveLevelIndex(idx)}
              className={`px-3 py-1 text-xs tracking-wider font-sans transition-all duration-200 uppercase cursor-pointer ${
                activeLevelIndex === idx
                  ? 'bg-[#3E131A] text-white font-semibold'
                  : 'text-[#4A3D36] hover:text-[#8E2838]'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        {/* Zoom & Screen Controls */}
        <div className="flex items-center space-x-2 text-[#4A3D36]">
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 hover:bg-[#EFE9DF] transition-colors border border-transparent hover:border-[#D8C7B0] cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-[11px] font-mono tracking-tight text-[#2A0C12] w-12 text-center font-medium">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 hover:bg-[#EFE9DF] transition-colors border border-transparent hover:border-[#D8C7B0] cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-[#EFE9DF] transition-colors border border-transparent hover:border-[#D8C7B0] cursor-pointer"
            title="Toggle Expanded View"
            aria-label="Toggle Expanded View"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Canvas & Blueprint Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] bg-[#FAF8F5]">
        {/* Left / Center: Interactive SVG Blueprint rendering */}
        <div className="lg:col-span-8 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle architectural graph paper grid */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(#2A0C12 1px, transparent 1px), linear-gradient(90deg, #2A0C12 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* North Arrow & Scale Indicator */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 text-[#8E2838] select-none">
            <Compass size={18} />
            <span className="text-[10px] tracking-widest font-sans uppercase font-semibold">True North</span>
          </div>

          <div className="absolute top-4 right-4 text-[10px] font-mono text-[#6E5A52] tracking-wider">
            Architectural Scale 1:100
          </div>

          {/* Dynamic Technical Floor Plate Visualization */}
          <div 
            className="transition-transform duration-300 origin-center max-w-full"
            style={{ transform: `scale(${zoomScale})` }}
          >
            <svg viewBox="0 0 600 420" className="w-[480px] max-w-full h-auto drop-shadow-sm">
              {/* Boundary / Setback line */}
              <rect x="20" y="20" width="560" height="380" fill="none" stroke="#D8C7B0" strokeWidth="1" strokeDasharray="4 4" />

              {/* Exterior structural walls */}
              <rect x="60" y="60" width="480" height="300" fill="#FFF" stroke="#2A0C12" strokeWidth="3" />

              {/* Zone A: Living / Social */}
              <rect x="70" y="70" width="220" height="180" fill="#FBF9F5" stroke="#8E2838" strokeWidth="1.5" />
              <text x="85" y="105" className="font-serif-display text-xs fill-[#2A0C12] font-semibold tracking-wider">
                {currentLevel.spaces[0] || 'MAIN LIVING ROOM'}
              </text>
              <text x="85" y="125" className="font-mono text-[10px] fill-[#8E2838]">
                6740 × 7250 MM
              </text>

              {/* Zone B: Dining & Culinary */}
              <rect x="70" y="260" width="220" height="90" fill="#FBF9F5" stroke="#8E2838" strokeWidth="1.5" />
              <text x="85" y="295" className="font-serif-display text-xs fill-[#2A0C12] font-semibold tracking-wider">
                {currentLevel.spaces[1] || 'DINING & KITCHEN'}
              </text>
              <text x="85" y="315" className="font-mono text-[10px] fill-[#8E2838]">
                4792 × 2600 MM
              </text>

              {/* Zone C: Suites & Private Wing */}
              <rect x="300" y="70" width="230" height="150" fill="#FBF9F5" stroke="#8E2838" strokeWidth="1.5" />
              <text x="315" y="105" className="font-serif-display text-xs fill-[#2A0C12] font-semibold tracking-wider">
                {currentLevel.spaces[2] || 'BEDROOM SUITE'}
              </text>
              <text x="315" y="125" className="font-mono text-[10px] fill-[#8E2838]">
                4593 × 4140 MM
              </text>

              {/* Zone D: Outdoor Deck / Veranda */}
              <rect x="300" y="230" width="230" height="120" fill="#EAF2EB" stroke="#4C7853" strokeWidth="1.5" />
              <text x="315" y="265" className="font-serif-display text-xs fill-[#234D2A] font-semibold tracking-wider">
                {currentLevel.spaces[3] || 'TERRACE DECK & POOL'}
              </text>
              <text x="315" y="285" className="font-mono text-[10px] fill-[#4C7853]">
                OPEN TO SKY VERANDA
              </text>

              {/* Door swing arcs */}
              <path d="M290,130 A30,30 0 0,1 320,160" fill="none" stroke="#8E2838" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="290" y1="130" x2="290" y2="160" stroke="#8E2838" strokeWidth="1.5" />

              <path d="M290,280 A30,30 0 0,1 320,310" fill="none" stroke="#8E2838" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="290" y1="280" x2="290" y2="310" stroke="#8E2838" strokeWidth="1.5" />

              {/* Dimension lines */}
              <line x1="60" y1="45" x2="540" y2="45" stroke="#8E2838" strokeWidth="1" strokeOpacity="0.8" />
              <line x1="60" y1="40" x2="60" y2="50" stroke="#8E2838" strokeWidth="1" />
              <line x1="540" y1="40" x2="540" y2="50" stroke="#8E2838" strokeWidth="1" />
              <text x="260" y="40" className="font-mono text-[10px] fill-[#2A0C12] font-semibold text-center">15,800 MM OVERALL</text>
            </svg>
          </div>

          {/* Bottom scale & legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#523B33] font-sans">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-white border border-[#2A0C12]" />
              <span>Indoor Rooms</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-[#EAF2EB] border border-[#4C7853]" />
              <span>Garden / Open Veranda</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 border-dashed border border-[#8E2838]" />
              <span>Roof Overhang</span>
            </span>
          </div>
        </div>

        {/* Right: Architectural Spatial Breakdown */}
        <div className="lg:col-span-4 p-6 bg-white border-t lg:border-t-0 lg:border-l border-[#D8C7B0] flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#8E2838] uppercase block font-semibold">
                Floor Details
              </span>
              <h4 className="font-serif-display text-xl text-[#2A0C12] uppercase font-bold mt-0.5">
                {currentLevel.label}
              </h4>
              <p className="font-serif-editorial italic text-xs text-[#6E5A52]">
                {currentLevel.sublabel}
              </p>
              <div className="mt-2 text-xs font-mono text-[#8E2838] border-b border-[#EAE2D5] pb-2 font-semibold">
                {currentLevel.dimensionsSummary}
              </div>
            </div>

            {/* Spaces list */}
            <div>
              <span className="text-[10px] font-sans tracking-[0.18em] text-[#8E2838] uppercase block mb-2 font-bold">
                Rooms on this Floor
              </span>
              <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {currentLevel.spaces.map((space, i) => (
                  <li key={i} className="text-xs text-[#4A3D36] flex items-start space-x-2">
                    <span className="text-[#8E2838] font-mono text-[10px] font-bold mt-0.5">0{i + 1}</span>
                    <span className="leading-tight font-medium">{space}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Features */}
            {currentLevel.keyFeatures && (
              <div className="pt-2 border-t border-[#EAE2D5]">
                <span className="text-[10px] font-sans tracking-[0.18em] text-[#8E2838] uppercase block mb-1.5 font-bold">
                  Design Highlights
                </span>
                <div className="space-y-1">
                  {currentLevel.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="text-xs text-[#523B33] flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-[#8E2838] rounded-full" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sections note if provided */}
          {sections && sections.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#EAE2D5]">
              <span className="text-[10px] font-sans tracking-wider text-[#8E2838] uppercase block mb-1 font-semibold">
                Cross Sections
              </span>
              {sections.map((sec, idx) => (
                <p key={idx} className="text-xs font-mono text-[#6E5A52] truncate">
                  {sec}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
