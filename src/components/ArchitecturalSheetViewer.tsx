import React, { useState } from 'react';
import { Layers, Compass, Maximize2, ZoomIn, ZoomOut, Check, ArrowRight, Sparkles } from 'lucide-react';

interface ArchitecturalSheetViewerProps {
  projectId: string;
  projectTitle: string;
  location: string;
}

export const ArchitecturalSheetViewer: React.FC<ArchitecturalSheetViewerProps> = ({
  projectId,
  projectTitle,
  location
}) => {
  const [activeSheet, setActiveSheet] = useState<'elevation' | 'plans' | 'concept' | 'sections'>('elevation');
  const [activePlanFloor, setActivePlanFloor] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState(1);

  const handleZoom = (delta: number) => {
    setZoomScale(prev => Math.min(Math.max(0.85, prev + delta), 1.6));
  };

  return (
    <div className="w-full bg-[#180509] border-2 border-[#DFC18D]/40 shadow-2xl overflow-hidden text-[#F7F3EB]">
      {/* Blueprint Header Strip */}
      <div className="bg-[#24070F] border-b border-[#DFC18D]/30 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 bg-[#DFC18D] rounded-full animate-pulse" />
          <div>
            <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
              ARCHITECTURAL WORKING DRAWING
            </span>
            <span className="font-serif-display text-sm sm:text-base text-white uppercase tracking-wider font-bold">
              {projectTitle} — {location}
            </span>
          </div>
        </div>

        {/* Sheet Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#140407] p-1 border border-[#DFC18D]/30">
          <button
            onClick={() => setActiveSheet('elevation')}
            className={`px-3 py-1 text-xs font-mono-tech uppercase tracking-wider transition-all cursor-pointer ${
              activeSheet === 'elevation'
                ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/50 shadow-xs'
                : 'text-[#D4C8BC] hover:text-[#DFC18D]'
            }`}
          >
            Elevation & Callouts
          </button>
          <button
            onClick={() => setActiveSheet('plans')}
            className={`px-3 py-1 text-xs font-mono-tech uppercase tracking-wider transition-all cursor-pointer ${
              activeSheet === 'plans'
                ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/50 shadow-xs'
                : 'text-[#D4C8BC] hover:text-[#DFC18D]'
            }`}
          >
            Architectural Floor Plans
          </button>
          <button
            onClick={() => setActiveSheet('concept')}
            className={`px-3 py-1 text-xs font-mono-tech uppercase tracking-wider transition-all cursor-pointer ${
              activeSheet === 'concept'
                ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/50 shadow-xs'
                : 'text-[#D4C8BC] hover:text-[#DFC18D]'
            }`}
          >
            Concept & Volumetric Form
          </button>
          <button
            onClick={() => setActiveSheet('sections')}
            className={`px-3 py-1 text-xs font-mono-tech uppercase tracking-wider transition-all cursor-pointer ${
              activeSheet === 'sections'
                ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/50 shadow-xs'
                : 'text-[#D4C8BC] hover:text-[#DFC18D]'
            }`}
          >
            Sections AA’ & BB’
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1.5 text-[#DFC18D]">
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1 hover:bg-[#380E18] border border-[#DFC18D]/25 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-[11px] font-mono-tech px-1 text-white">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1 hover:bg-[#380E18] border border-[#DFC18D]/25 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      {/* Main Drafting Sheet Viewport */}
      <div className="relative p-6 sm:p-8 bg-[#120407] min-h-[460px] overflow-hidden flex flex-col justify-between">
        {/* Subtle Architectural Blueprint Grid */}
        <div 
          className="absolute inset-0 opacity-12 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(223, 193, 141, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(223, 193, 141, 0.2) 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />

        {/* 1. ELEVATION & CALLOUTS SHEET */}
        {activeSheet === 'elevation' && (
          <div 
            className="transition-transform duration-300 origin-center space-y-6 relative z-10"
            style={{ transform: `scale(${zoomScale})` }}
          >
            {projectId === 'casa-verde' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#DFC18D]/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
                      SHEET 10 · NORTH-WEST FAÇADE ELEVATION
                    </span>
                    <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-bold">
                      CASA VERDE ELEVATION PERSPECTIVE
                    </h3>
                  </div>
                  <span className="text-xs font-mono-tech text-[#DFC18D] bg-[#2E0A12] px-3 py-1 border border-[#DFC18D]/30">
                    SCALE 1:100
                  </span>
                </div>

                {/* SVG Elevation Drawing with Real Annotations from PDF Page 10 */}
                <div className="bg-[#180509] border border-[#DFC18D]/35 p-6 rounded-xs relative">
                  <svg viewBox="0 0 800 480" className="w-full h-auto drop-shadow-md select-none">
                    <defs>
                      <linearGradient id="glazingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DFC18D" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2E0A12" stopOpacity="0.6" />
                      </linearGradient>
                      <pattern id="stonePattern" width="16" height="12" patternUnits="userSpaceOnUse">
                        <rect width="16" height="12" fill="#2A0B12" />
                        <line x1="0" y1="6" x2="16" y2="6" stroke="#DFC18D" strokeWidth="0.8" strokeOpacity="0.4" />
                        <line x1="8" y1="0" x2="8" y2="6" stroke="#DFC18D" strokeWidth="0.8" strokeOpacity="0.4" />
                        <line x1="16" y1="6" x2="16" y2="12" stroke="#DFC18D" strokeWidth="0.8" strokeOpacity="0.4" />
                      </pattern>
                    </defs>

                    {/* Ground line */}
                    <line x1="20" y1="420" x2="780" y2="420" stroke="#DFC18D" strokeWidth="2.5" />
                    <line x1="20" y1="424" x2="780" y2="424" stroke="#DFC18D" strokeWidth="1" strokeDasharray="6 3" strokeOpacity="0.5" />

                    {/* Natural Stone Boundary Wall */}
                    <rect x="60" y="360" width="680" height="60" fill="url(#stonePattern)" stroke="#DFC18D" strokeWidth="1.5" />
                    <text x="75" y="395" fill="#DFC18D" fontSize="11" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
                      NATURAL STONE BOUNDARY WALL
                    </text>

                    {/* Ground Floor Living Pavilion */}
                    <rect x="140" y="260" width="520" height="100" fill="#20060C" stroke="#DFC18D" strokeWidth="2" />
                    {/* Double-Height Glass Core */}
                    <rect x="420" y="140" width="220" height="220" fill="url(#glazingGrad)" stroke="#DFC18D" strokeWidth="2" />
                    <line x1="420" y1="200" x2="640" y2="200" stroke="#DFC18D" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="530" y1="140" x2="530" y2="360" stroke="#DFC18D" strokeWidth="1.5" />

                    {/* First Floor Cantilevered Terraces with Planters */}
                    <rect x="100" y="190" width="300" height="70" fill="#2E0A12" stroke="#DFC18D" strokeWidth="2" />
                    <rect x="90" y="180" width="320" height="15" fill="#3D5A40" stroke="#DFC18D" strokeWidth="1" />
                    {/* Foliage dots on terrace */}
                    <circle cx="120" cy="182" r="5" fill="#6B9071" />
                    <circle cx="150" cy="180" r="7" fill="#88B28E" />
                    <circle cx="190" cy="183" r="6" fill="#6B9071" />
                    <circle cx="240" cy="180" r="7" fill="#88B28E" />
                    <circle cx="310" cy="182" r="6" fill="#6B9071" />
                    <circle cx="380" cy="181" r="7" fill="#88B28E" />

                    {/* Second Floor Top Penthouse Volume */}
                    <rect x="180" y="90" width="280" height="90" fill="#20060C" stroke="#DFC18D" strokeWidth="2" />
                    {/* Deep Overhang Roof Canopy */}
                    <polygon points="150,85 490,85 470,70 170,70" fill="#DFC18D" stroke="#DFC18D" strokeWidth="1.5" />
                    <rect x="170" y="85" width="300" height="6" fill="#3E1019" />

                    {/* Callout Annotation Arrows & Labels from PDF Page 10 */}
                    {/* 1. Natural light from high level glazing */}
                    <line x1="330" y1="40" x2="330" y2="70" stroke="#DFC18D" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <circle cx="330" cy="40" r="3" fill="#DFC18D" />
                    <text x="340" y="45" fill="#DFC18D" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
                      NATURAL LIGHT FROM HIGH LEVEL GLAZING
                    </text>

                    {/* 2. Deep overhangs for shade */}
                    <line x1="560" y1="60" x2="480" y2="78" stroke="#DFC18D" strokeWidth="1.5" />
                    <circle cx="560" cy="60" r="3" fill="#DFC18D" />
                    <text x="570" y="65" fill="#DFC18D" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
                      DEEP OVERHANGS FOR SHADE
                    </text>

                    {/* 3. Vertical Elements */}
                    <line x1="720" y1="120" x2="630" y2="160" stroke="#DFC18D" strokeWidth="1.5" />
                    <circle cx="720" cy="120" r="3" fill="#DFC18D" />
                    <text x="730" y="125" fill="#DFC18D" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
                      VERTICAL ELEMENTS & MULLIONS
                    </text>

                    {/* 4. Lush Green Terraces at every level */}
                    <line x1="80" y1="140" x2="160" y2="178" stroke="#DFC18D" strokeWidth="1.5" />
                    <circle cx="80" cy="140" r="3" fill="#DFC18D" />
                    <text x="20" y="130" fill="#DFC18D" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
                      LUSH GREEN TERRACES AT EVERY LEVEL
                    </text>

                    {/* 5. Seamless Indoor - Outdoor Connection */}
                    <line x1="280" y1="445" x2="320" y2="365" stroke="#DFC18D" strokeWidth="1.5" />
                    <circle cx="280" cy="445" r="3" fill="#DFC18D" />
                    <text x="290" y="460" fill="#DFC18D" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
                      SEAMLESS INDOOR - OUTDOOR CONNECTION
                    </text>

                    {/* 6. Double Height Space */}
                    <line x1="680" y1="280" x2="570" y2="280" stroke="#DFC18D" strokeWidth="1.5" />
                    <circle cx="680" cy="280" r="3" fill="#DFC18D" />
                    <text x="690" y="285" fill="#DFC18D" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
                      DOUBLE HEIGHT LIVING CORE
                    </text>
                  </svg>
                </div>
              </div>
            )}

            {projectId === 'casa-sylva' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#DFC18D]/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
                      SHEET 12 · AXONOMETRIC & ELEVATION SPECIFICATION
                    </span>
                    <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-bold">
                      CASA SYLVA GABLE ROOF COMPOSITION
                    </h3>
                  </div>
                  <span className="text-xs font-mono-tech text-[#DFC18D] bg-[#2E0A12] px-3 py-1 border border-[#DFC18D]/30">
                    NORTH GOA ENCLAVE
                  </span>
                </div>

                {/* Building Composition Formula from Page 12 */}
                <div className="bg-[#24070F] border border-[#DFC18D]/40 p-4 sm:p-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono-tech">
                  <span className="px-3 py-1.5 bg-[#180509] border border-[#DFC18D]/40 text-[#DFC18D] font-bold">
                    GABLE ROOF (Charcoal Metal)
                  </span>
                  <span className="text-[#DFC18D] font-bold text-sm">+</span>
                  <span className="px-3 py-1.5 bg-[#180509] border border-[#DFC18D]/40 text-white font-bold">
                    STONE BLOCK (Goan Laterite)
                  </span>
                  <span className="text-[#DFC18D] font-bold text-sm">+</span>
                  <span className="px-3 py-1.5 bg-[#180509] border border-[#DFC18D]/40 text-[#DFC18D] font-bold">
                    VERTICAL SCREEN (Timber Louvers)
                  </span>
                  <span className="text-[#DFC18D] font-bold text-sm">+</span>
                  <span className="px-3 py-1.5 bg-[#180509] border border-[#DFC18D]/40 text-white font-bold">
                    FLOATING VOLUME (White Plaster)
                  </span>
                  <span className="text-[#DFC18D] font-bold text-sm">+</span>
                  <span className="px-3 py-1.5 bg-[#180509] border border-[#DFC18D]/40 text-[#DFC18D] font-bold">
                    HORIZONTAL PLINTH
                  </span>
                  <span className="text-[#DFC18D] font-bold text-sm">=</span>
                  <span className="px-4 py-1.5 bg-[#581424] border-2 border-[#DFC18D] text-white font-bold tracking-widest uppercase shadow-md">
                    CASA SYLVA RESIDENCE
                  </span>
                </div>

                {/* 4 Architectural Strategy Pillars from Page 12 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#1C060C] border border-[#DFC18D]/30 space-y-1.5">
                    <span className="text-[10px] font-mono-tech text-[#DFC18D] font-bold uppercase tracking-wider block">
                      01 · STRONG IDENTITY
                    </span>
                    <h5 className="font-serif-display text-sm text-white uppercase font-semibold">
                      Steep Gable Roof
                    </h5>
                    <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                      Steep gable roof gives the house a bold, memorable architectural silhouette that stands out from the street.
                    </p>
                  </div>

                  <div className="p-4 bg-[#1C060C] border border-[#DFC18D]/30 space-y-1.5">
                    <span className="text-[10px] font-mono-tech text-[#DFC18D] font-bold uppercase tracking-wider block">
                      02 · RAIN PROTECTION
                    </span>
                    <h5 className="font-serif-display text-sm text-white uppercase font-semibold">
                      Monsoon Runoff
                    </h5>
                    <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                      Steep pitched roof angles ensure lightning-quick rainwater runoff during heavy Goan monsoons.
                    </p>
                  </div>

                  <div className="p-4 bg-[#1C060C] border border-[#DFC18D]/30 space-y-1.5">
                    <span className="text-[10px] font-mono-tech text-[#DFC18D] font-bold uppercase tracking-wider block">
                      03 · STONE JALI WALLS
                    </span>
                    <h5 className="font-serif-display text-sm text-white uppercase font-semibold">
                      Light & Shadow Play
                    </h5>
                    <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                      Perforated stone screens create dancing patterns of light and shadows across interior living floors.
                    </p>
                  </div>

                  <div className="p-4 bg-[#1C060C] border border-[#DFC18D]/30 space-y-1.5">
                    <span className="text-[10px] font-mono-tech text-[#DFC18D] font-bold uppercase tracking-wider block">
                      04 · DEEP OVERHANGS
                    </span>
                    <h5 className="font-serif-display text-sm text-white uppercase font-semibold">
                      Passive Thermal Shade
                    </h5>
                    <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                      Generous overhangs shade south and west walls, drastically reducing internal heat gain throughout the year.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {projectId === 'airani-mane' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#DFC18D]/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
                      SHEET 17 · WIRE-CUT BRICK FAÇADE & VOLUMETRIC MORPHOLOGY
                    </span>
                    <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-bold">
                      AIRANI MANE COURTYARD HOUSE
                    </h3>
                  </div>
                  <span className="text-xs font-mono-tech text-[#DFC18D] bg-[#2E0A12] px-3 py-1 border border-[#DFC18D]/30">
                    DHARWAD, KARNATAKA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Facade Concept 4-Step Diagram */}
                  <div className="p-5 bg-[#1C060C] border border-[#DFC18D]/30 space-y-4">
                    <span className="text-xs font-mono-tech text-[#DFC18D] font-bold uppercase tracking-wider block border-b border-[#DFC18D]/20 pb-2">
                      FAÇADE CONCEPT EVOLUTION
                    </span>
                    <div className="space-y-3 font-sans text-xs text-[#D4C8BC]">
                      <div className="p-3 bg-[#24070F] border border-[#DFC18D]/20 flex items-start space-x-3">
                        <span className="font-mono-tech text-[#DFC18D] font-bold">01</span>
                        <div>
                          <strong className="text-white block uppercase">Basic Volumes</strong>
                          Starting with a pure rectangular dual-story geometric footprint.
                        </div>
                      </div>
                      <div className="p-3 bg-[#24070F] border border-[#DFC18D]/20 flex items-start space-x-3">
                        <span className="font-mono-tech text-[#DFC18D] font-bold">02</span>
                        <div>
                          <strong className="text-white block uppercase">Break + Shift</strong>
                          Shifting massing to create distinct private zones and shaded overhangs.
                        </div>
                      </div>
                      <div className="p-3 bg-[#24070F] border border-[#DFC18D]/20 flex items-start space-x-3">
                        <span className="font-mono-tech text-[#DFC18D] font-bold">03</span>
                        <div>
                          <strong className="text-white block uppercase">Introducing Central Courtyard</strong>
                          Carving an internal open-to-sky courtyard for passive ventilation and morning sunlight.
                        </div>
                      </div>
                      <div className="p-3 bg-[#24070F] border border-[#DFC18D]/20 flex items-start space-x-3">
                        <span className="font-mono-tech text-[#DFC18D] font-bold">04</span>
                        <div>
                          <strong className="text-white block uppercase">Adding Depth, Material + Character</strong>
                          Layering wire-cut terracotta brickwork, textured fair-faced concrete, and vertical wooden louvers.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Layout Concept 4-Step Diagram */}
                  <div className="p-5 bg-[#1C060C] border border-[#DFC18D]/30 space-y-4">
                    <span className="text-xs font-mono-tech text-[#DFC18D] font-bold uppercase tracking-wider block border-b border-[#DFC18D]/20 pb-2">
                      SPATIAL LAYOUT PRINCIPLES
                    </span>
                    <div className="space-y-3 font-sans text-xs text-[#D4C8BC]">
                      <div className="p-3 bg-[#24070F] border border-[#DFC18D]/20 flex items-start space-x-3">
                        <span className="font-mono-tech text-[#DFC18D] font-bold">01</span>
                        <div>
                          <strong className="text-white block uppercase">Smart Zoning</strong>
                          Clear separation between public entertaining foyer, living dining core, and private bedrooms.
                        </div>
                      </div>
                      <div className="p-3 bg-[#24070F] border border-[#DFC18D]/20 flex items-start space-x-3">
                        <span className="font-mono-tech text-[#DFC18D] font-bold">02</span>
                        <div>
                          <strong className="text-white block uppercase">Courtyard as Heart</strong>
                          The central courtyard acts as the visual and spiritual anchor for daily family interactions.
                        </div>
                      </div>
                      <div className="p-3 bg-[#24070F] border border-[#DFC18D]/20 flex items-start space-x-3">
                        <span className="font-mono-tech text-[#DFC18D] font-bold">03</span>
                        <div>
                          <strong className="text-white block uppercase">Openings for Light + Views</strong>
                          Strategic deep aperture windows capture garden greenery while blocking street glare.
                        </div>
                      </div>
                      <div className="p-3 bg-[#24070F] border border-[#DFC18D]/20 flex items-start space-x-3">
                        <span className="font-mono-tech text-[#DFC18D] font-bold">04</span>
                        <div>
                          <strong className="text-white block uppercase">Privacy Through Layering</strong>
                          Vertical wooden sliding gates and setback boundary landscaping maintain complete family intimacy.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ARCHITECTURAL FLOOR PLANS SHEET */}
        {activeSheet === 'plans' && (
          <div className="space-y-6 relative z-10">
            <div className="flex flex-wrap items-center justify-between border-b border-[#DFC18D]/20 pb-3 gap-3">
              <div>
                <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
                  ARCHITECTURAL SCHEMATIC DRAWINGS · CAD ACCREDITED
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-bold">
                  {projectTitle} FLOOR PLANS
                </h3>
              </div>

              {/* Floor Switcher */}
              <div className="flex items-center space-x-1.5 bg-[#180509] p-1 border border-[#DFC18D]/30">
                <button
                  onClick={() => setActivePlanFloor(0)}
                  className={`px-3 py-1 text-xs font-mono-tech uppercase tracking-wider cursor-pointer ${
                    activePlanFloor === 0 ? 'bg-[#581424] text-[#DFC18D] font-bold' : 'text-[#D4C8BC]'
                  }`}
                >
                  Ground Floor
                </button>
                <button
                  onClick={() => setActivePlanFloor(1)}
                  className={`px-3 py-1 text-xs font-mono-tech uppercase tracking-wider cursor-pointer ${
                    activePlanFloor === 1 ? 'bg-[#581424] text-[#DFC18D] font-bold' : 'text-[#D4C8BC]'
                  }`}
                >
                  First Floor
                </button>
                <button
                  onClick={() => setActivePlanFloor(2)}
                  className={`px-3 py-1 text-xs font-mono-tech uppercase tracking-wider cursor-pointer ${
                    activePlanFloor === 2 ? 'bg-[#581424] text-[#DFC18D] font-bold' : 'text-[#D4C8BC]'
                  }`}
                >
                  Second Floor / Terrace
                </button>
              </div>
            </div>

            {/* Technical Plan Plate */}
            <div className="bg-[#180509] border border-[#DFC18D]/40 p-6 sm:p-8 rounded-xs">
              {projectId === 'casa-verde' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono-tech text-[#DFC18D] border-b border-[#DFC18D]/20 pb-2">
                    <span>
                      {activePlanFloor === 0 ? 'GROUND FLOOR PLATE (150 SQM)' : activePlanFloor === 1 ? 'FIRST FLOOR SUITES (120 SQM)' : 'SECOND FLOOR PENTHOUSE & TERRACE (87 SQM)'}
                    </span>
                    <span>PROJECT ID: CV-2025-KARJAT</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono-tech">
                    {activePlanFloor === 0 && [
                      { room: 'LIVING ROOM', dim: '6740 × 7250 MM', note: 'Double-height core opening to pool' },
                      { room: 'DINING AREA', dim: '4792 × 2600 MM', note: 'Adjacent to garden terrace' },
                      { room: 'KITCHEN & PANTRY', dim: '2260 × 4792 MM', note: 'Central island & utility yard' },
                      { room: 'BEDROOM 01 SUITE', dim: '4593 × 4140 MM', note: 'Ground level guest sanctuary' },
                      { room: 'SWIMMING POOL DECK', dim: '7471 × 1695 MM', note: 'Reflection pool & sun deck' },
                      { room: 'SERVANT ROOM & WC', dim: '2189 × 2000 MM', note: 'Dedicated private service access' },
                      { room: 'POOJA ROOM', dim: '968 × 1365 MM', note: 'Auspicious northeast orientation' },
                      { room: 'POWDER ROOM', dim: '1350 × 2243 MM', note: 'Designer guest powder bath' },
                      { room: 'LIFT SHAFT', dim: '1465 × 2243 MM', note: 'Servicing all 3 levels' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-[#24070F] border border-[#DFC18D]/25 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white uppercase">{item.room}</span>
                          <span className="text-[#DFC18D]">{item.dim}</span>
                        </div>
                        <p className="text-[11px] font-sans text-[#D4C8BC]">{item.note}</p>
                      </div>
                    ))}

                    {activePlanFloor === 1 && [
                      { room: 'BEDROOM 02 SUITE', dim: '3755 × 4593 MM', note: 'Master bedroom with garden balcony' },
                      { room: 'BEDROOM 03 SUITE', dim: '3650 × 2787 MM', note: 'Children / guest luxury suite' },
                      { room: 'BALCONY 01', dim: '7215 × 872 MM', note: 'Cantilevered glass-railing terrace' },
                      { room: 'BALCONY 02', dim: '6740 × 2035 MM', note: 'Overlooking swimming pool core' },
                      { room: 'WALK-IN WARDROBE 02', dim: '2529 × 2450 MM', note: 'Full-height wood joinery' },
                      { room: 'WASHROOM 02', dim: '3539 × 1929 MM', note: 'Freestanding soaking bathtub' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-[#24070F] border border-[#DFC18D]/25 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white uppercase">{item.room}</span>
                          <span className="text-[#DFC18D]">{item.dim}</span>
                        </div>
                        <p className="text-[11px] font-sans text-[#D4C8BC]">{item.note}</p>
                      </div>
                    ))}

                    {activePlanFloor === 2 && [
                      { room: 'BEDROOM 04 SUITE', dim: '3545 × 4593 MM', note: 'Penthouse master suite' },
                      { room: 'FAMILY ROOM', dim: '8019 × 7040 MM', note: 'Private lounge & projector screening' },
                      { room: 'TERRACE DECK', dim: '7471 × 5495 MM', note: 'Open-to-sky panoramic mountain deck' },
                      { room: 'LAUNDRY ROOM', dim: '2787 × 2119 MM', note: 'Full service washer & ironing' },
                      { room: 'BALCONY 03', dim: '1105 × 4953 MM', note: 'Sunset view cantilever' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-[#24070F] border border-[#DFC18D]/25 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white uppercase">{item.room}</span>
                          <span className="text-[#DFC18D]">{item.dim}</span>
                        </div>
                        <p className="text-[11px] font-sans text-[#D4C8BC]">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {projectId !== 'casa-verde' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono-tech text-[#DFC18D] border-b border-[#DFC18D]/20 pb-2">
                    <span>ARCHITECTURAL FLOOR PLATE SUMMARY</span>
                    <span>STUDIO SPECIFICATION</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
                    <div className="p-4 bg-[#24070F] border border-[#DFC18D]/25 space-y-2">
                      <span className="text-[#DFC18D] font-bold block uppercase">Ground Floor Living & Courtyard</span>
                      <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                        Spacious open-plan living and dining pavilion positioned to capture natural morning sunlight, cross-breezes, and integrated garden courtyards.
                      </p>
                    </div>
                    <div className="p-4 bg-[#24070F] border border-[#DFC18D]/25 space-y-2">
                      <span className="text-[#DFC18D] font-bold block uppercase">Upper Level Suites & Terraces</span>
                      <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                        Private family bedrooms featuring vaulted ceilings, generous wardrobe dressing alcoves, and shaded private viewing balconies overlooking the landscape.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. CONCEPT & VOLUMETRIC FORM */}
        {activeSheet === 'concept' && (
          <div className="space-y-6 relative z-10">
            <div className="border-b border-[#DFC18D]/20 pb-3">
              <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
                DESIGN MORPHOLOGY & VOLUMETRIC EVOLUTION
              </span>
              <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-bold">
                CONCEPTUAL MASSING STRATEGY
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[#1C060C] border border-[#DFC18D]/30 space-y-2">
                <span className="font-mono-tech text-xs text-[#DFC18D] font-bold">STAGE 01</span>
                <h5 className="font-serif-display text-sm text-white uppercase font-bold">Basic Volume</h5>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  Starting with a pure functional mass aligned precisely with site boundary setbacks and sun path.
                </p>
              </div>

              <div className="p-4 bg-[#1C060C] border border-[#DFC18D]/30 space-y-2">
                <span className="font-mono-tech text-xs text-[#DFC18D] font-bold">STAGE 02</span>
                <h5 className="font-serif-display text-sm text-white uppercase font-bold">Carving Voids</h5>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  Carving double-height voids and open light wells to welcome prevailing wind currents and morning light.
                </p>
              </div>

              <div className="p-4 bg-[#1C060C] border border-[#DFC18D]/30 space-y-2">
                <span className="font-mono-tech text-xs text-[#DFC18D] font-bold">STAGE 03</span>
                <h5 className="font-serif-display text-sm text-white uppercase font-bold">Layering Screens</h5>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  Integrating vertical timber louvers and perforated stone jali walls to control solar gain and privacy.
                </p>
              </div>

              <div className="p-4 bg-[#1C060C] border border-[#DFC18D]/30 space-y-2">
                <span className="font-mono-tech text-xs text-[#DFC18D] font-bold">STAGE 04</span>
                <h5 className="font-serif-display text-sm text-white uppercase font-bold">Crowning Canopy</h5>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  Deep overhang roof canopies protecting exterior plaster finishes from torrential monsoons.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. SECTIONS AA’ & BB’ */}
        {activeSheet === 'sections' && (
          <div className="space-y-6 relative z-10">
            <div className="border-b border-[#DFC18D]/20 pb-3">
              <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
                BUILDING ENVELOPE & VERTICAL PROFILE
              </span>
              <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase font-bold">
                CROSS SECTIONS AA’ & BB’
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-[#1C060C] border border-[#DFC18D]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-[#DFC18D]/20 pb-2">
                  <span className="font-serif-display text-sm text-[#DFC18D] uppercase font-bold">SECTION AA’</span>
                  <span className="text-xs font-mono-tech text-[#D4C8BC]">TRANSVERSE CUT</span>
                </div>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  Cross section passing through the central double-height living core, internal floating staircase, and reflection swimming pool, highlighting the 6.8-meter vertical volume.
                </p>
                <div className="h-32 bg-[#140407] border border-[#DFC18D]/20 flex items-center justify-center p-3 text-center">
                  <span className="font-mono-tech text-xs text-[#DFC18D]/70 tracking-wider">
                    DOUBLE-HEIGHT VOID: +6.80M LVL · SWIMMING POOL: -0.45M LVL
                  </span>
                </div>
              </div>

              <div className="p-5 bg-[#1C060C] border border-[#DFC18D]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-[#DFC18D]/20 pb-2">
                  <span className="font-serif-display text-sm text-[#DFC18D] uppercase font-bold">SECTION BB’</span>
                  <span className="text-xs font-mono-tech text-[#D4C8BC]">LONGITUDINAL CUT</span>
                </div>
                <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                  Longitudinal profile extending from the front entry veranda through the dining kitchen suite and out to the master bedroom viewing balcony.
                </p>
                <div className="h-32 bg-[#140407] border border-[#DFC18D]/20 flex items-center justify-center p-3 text-center">
                  <span className="font-mono-tech text-xs text-[#DFC18D]/70 tracking-wider">
                    DEEP CANTILEVER EAVES: +3.40M LVL · TERRACE DECK: +7.20M LVL
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Sheet Stamp */}
        <div className="mt-6 pt-4 border-t border-[#DFC18D]/25 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech text-[#DFC18D]/75">
          <div className="flex items-center space-x-2">
            <Compass size={14} className="text-[#DFC18D]" />
            <span>ARCHITECTURAL PORTFOLIO SPECIFICATIONS · 2025-2026 EDITION</span>
          </div>
          <span className="font-bold text-[#DFC18D]">
            GENUINE ARCHITECTURAL PORTFOLIO SPECIFICATIONS
          </span>
        </div>
      </div>
    </div>
  );
};
