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
    <div className="w-full bg-white border border-[#D8C7B0] p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between border-b border-[#EAE2D5] pb-3 mb-5 gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-serif-display text-sm tracking-wider text-[#8E2838] uppercase font-bold">
            Material Palette
          </span>
          <span className="text-xs text-[#D8C7B0]">·</span>
          <span className="font-sans text-xs text-[#523B33] tracking-wider uppercase font-medium">
            Textures & Finishes
          </span>
        </div>
        <div className="text-[11px] font-sans tracking-[0.18em] text-[#8E2838] uppercase font-semibold">
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
                ? 'border-[#8E2838] bg-[#F7F2EC] shadow-sm'
                : 'border-[#EAE2D5] bg-[#FAF7F2] hover:border-[#8E2838]/60'
            }`}
          >
            {/* Color/Texture Box */}
            <div
              className="w-full h-16 mb-2.5 relative border border-[#D8C7B0] overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-[1.02]"
              style={{ backgroundColor: mat.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            <span className="font-serif-display text-xs text-[#2A0C12] font-semibold leading-tight group-hover:text-[#8E2838] transition-colors line-clamp-1">
              {mat.name}
            </span>
            <span className="font-sans text-[10px] text-[#6E5A52] tracking-wider uppercase mt-0.5 line-clamp-1">
              {mat.category}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Material Detail Callout & Stamp */}
      <div className="mt-5 pt-4 border-t border-[#EAE2D5] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8">
          {selectedMaterial ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border border-[#8E2838]" style={{ backgroundColor: selectedMaterial.color }} />
                <h5 className="font-serif-display text-sm text-[#2A0C12] uppercase tracking-wider font-bold">
                  {selectedMaterial.name} — <span className="font-sans text-xs text-[#8E2838] font-semibold">{selectedMaterial.category}</span>
                </h5>
              </div>
              <p className="text-xs text-[#4A3D36] font-sans leading-relaxed">
                {selectedMaterial.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#6E5A52] italic font-serif">
              Click any material swatch above to see how it is used in the project.
            </p>
          )}
        </div>

        {/* Studio Architectural Seal / Stamp */}
        <div className="md:col-span-4 flex justify-start md:justify-end">
          <div className="border border-[#8E2838] bg-[#3E131A] text-white p-3 px-4 text-center max-w-[220px] shadow-sm">
            <span className="font-serif-display text-[9px] tracking-[0.2em] text-[#DFC18D] uppercase block font-semibold">
              {stampTagline}
            </span>
            <div className="mt-1 flex items-center justify-center space-x-1.5 opacity-70">
              <span className="h-[0.5px] w-6 bg-[#DFC18D]" />
              <span className="text-[9px] font-mono text-[#DFC18D]">M.A.D</span>
              <span className="h-[0.5px] w-6 bg-[#DFC18D]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
