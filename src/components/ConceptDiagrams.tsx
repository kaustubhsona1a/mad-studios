import React from 'react';

interface ConceptDiagramsProps {
  title: string;
  points: { title: string; desc: string }[];
  projectId?: string;
}

export const ConceptDiagrams: React.FC<ConceptDiagramsProps> = ({
  title,
  points,
  projectId
}) => {
  return (
    <div className="w-full bg-white border border-[#D8C7B0] p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between border-b border-[#EAE2D5] pb-3 mb-5 gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-serif-display text-sm tracking-wider text-[#8E2838] uppercase font-bold">
            Design Ideas & Structure
          </span>
          <span className="text-xs text-[#D8C7B0]">·</span>
          <span className="font-sans text-xs text-[#523B33] tracking-wider uppercase font-medium">
            {title}
          </span>
        </div>
        <span className="text-[11px] font-sans tracking-wider text-[#8E2838] uppercase font-semibold">
          Architectural Concept
        </span>
      </div>

      {/* Special Visual Formula Banner for Casa Sylva */}
      {projectId === 'casa-sylva' && (
        <div className="mb-6 bg-[#FAF7F2] border border-[#D8C7B0] p-4 text-center">
          <span className="text-[11px] font-sans tracking-[0.2em] text-[#8E2838] uppercase block mb-3 font-bold">
            Building Composition Formula
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-sans text-[#2A0C12]">
            <span className="px-2.5 py-1 bg-white border border-[#D8C7B0] font-medium">Gable Roof</span>
            <span className="text-[#8E2838] font-bold">+</span>
            <span className="px-2.5 py-1 bg-white border border-[#D8C7B0] font-medium">Stone Block</span>
            <span className="text-[#8E2838] font-bold">+</span>
            <span className="px-2.5 py-1 bg-white border border-[#D8C7B0] font-medium">Wooden Screen</span>
            <span className="text-[#8E2838] font-bold">+</span>
            <span className="px-2.5 py-1 bg-white border border-[#D8C7B0] font-medium">Upper Floor Box</span>
            <span className="text-[#8E2838] font-bold">+</span>
            <span className="px-2.5 py-1 bg-white border border-[#D8C7B0] font-medium">Stone Base Plinth</span>
            <span className="text-[#8E2838] font-bold">=</span>
            <span className="px-3 py-1 bg-[#3E131A] text-white border border-[#3E131A] font-bold tracking-widest uppercase">CASA SYLVA</span>
          </div>
        </div>
      )}

      {/* Concept Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {points.map((pt, i) => (
          <div
            key={i}
            className="p-5 bg-[#FAF7F2] border border-[#EAE2D5] hover:border-[#8E2838] transition-colors flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-[#8E2838] font-bold tracking-wider">
                  0{i + 1}
                </span>
                <span className="h-[1px] flex-1 mx-3 bg-[#D8C7B0]/60 group-hover:bg-[#8E2838]/40 transition-colors" />
                <span className="w-1.5 h-1.5 bg-[#8E2838] rounded-full" />
              </div>
              <h5 className="font-serif-display text-sm text-[#2A0C12] uppercase tracking-wide group-hover:text-[#8E2838] transition-colors mb-2 font-bold">
                {pt.title}
              </h5>
              <p className="font-sans text-xs text-[#4A3D36] leading-relaxed">
                {pt.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
