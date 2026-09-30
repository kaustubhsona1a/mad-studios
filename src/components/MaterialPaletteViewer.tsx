import React, { useState } from 'react';
import { MaterialItem } from '../data/projects';

interface MaterialPaletteViewerProps {
  materials: MaterialItem[];
  stampTagline?: string;
}

export const MaterialPaletteViewer: React.FC<MaterialPaletteViewerProps> = ({
  materials,
  stampTagline = 'BUILT FOR LIVING, DESIGNED FOR TIMELESSNESS.'
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  const selectedMaterial = selectedIdx !== null ? materials[selectedIdx] : null;

  return (
    <div className="w-full bg-[#3E1D23] border border-[#C5A06B]/40 p-6 shadow-2xl text-[#F7F2EC]">
      <div className="flex flex-wrap items-center justify-between border-b border-[#C5A06B]/25 pb-3 mb-5 gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-serif-display text-sm tracking-wider text-[#C5A06B] uppercase font-bold">
            Material Palette
          </span>
          <span className="text-xs text-[#C5A06B]/40">·</span>
          <span className="font-sans text-xs text-[#D8C7B5] tracking-wider uppercase font-medium">
            Tactile Textures & Regional Finishes
          </span>
        </div>
        <div className="text-[11px] font-mono-tech tracking-[0.18em] text-[#C5A06B] uppercase font-semibold">
          {materials.length} Finishes Selected
        </div>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {materials.map((mat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`group text-left p-3 transition-all duration-200 border flex flex-col items-start cursor-pointer ${
              selectedIdx === idx
                ? 'border-[#C5A06B] bg-[#542A33] shadow-md'
                : 'border-[#C5A06B]/25 bg-[#48232B] hover:border-[#C5A06B]/60'
            }`}
          >
            {/* Color/Texture Box */}
            <div
              className="w-full h-16 mb-2.5 relative border border-[#C5A06B]/40 overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-[1.02]"
              style={{ backgroundColor: mat.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            <span className="font-serif-display text-xs text-[#F7F2EC] font-semibold leading-tight group-hover:text-[#C5A06B] transition-colors line-clamp-1">
              {mat.name}
            </span>
            <span className="font-mono-tech text-[10px] text-[#D8C7B5] tracking-wider uppercase mt-0.5 line-clamp-1">
              {mat.category}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Material Detail Callout & Stamp */}
      <div className="mt-5 pt-4 border-t border-[#C5A06B]/25 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8">
          {selectedMaterial ? (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border border-[#C5A06B]" style={{ backgroundColor: selectedMaterial.color }} />
                <h5 className="font-serif-display text-sm text-[#F7F2EC] uppercase tracking-wider font-bold">
                  {selectedMaterial.name} — <span className="font-mono-tech text-xs text-[#C5A06B] font-semibold">{selectedMaterial.category}</span>
                </h5>
              </div>
              <p className="text-xs text-[#D8C7B5] font-sans leading-relaxed font-light">
                {selectedMaterial.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#D8C7B5] italic font-serif-editorial">
              Click any material swatch above to see how it is used in the project.
            </p>
          )}
        </div>

        {/* Studio Architectural Seal / Stamp */}
        <div className="md:col-span-4 flex justify-start md:justify-end">
          <div className="border border-[#C5A06B]/50 bg-[#33151A] text-white p-3 px-4 text-center max-w-[220px] shadow-md">
            <span className="font-serif-display text-[9px] tracking-[0.2em] text-[#C5A06B] uppercase block font-semibold">
              {stampTagline}
            </span>
            <div className="mt-1 flex items-center justify-center space-x-1.5 opacity-80">
              <span className="h-[0.5px] w-6 bg-[#C5A06B]" />
              <span className="text-[9px] font-mono-tech text-[#C5A06B]">M.A.D ATELIER</span>
              <span className="h-[0.5px] w-6 bg-[#C5A06B]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
