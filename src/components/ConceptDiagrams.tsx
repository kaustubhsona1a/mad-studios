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
    <div className="w-full bg-[#3E1D23] border border-[#C5A06B]/40 p-6 shadow-2xl text-[#F7F2EC]">
      <div className="flex flex-wrap items-center justify-between border-b border-[#C5A06B]/25 pb-3 mb-5 gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-serif-display text-sm tracking-wider text-[#C5A06B] uppercase font-bold">
            Design Morphology & Structure
          </span>
          <span className="text-xs text-[#C5A06B]/40">·</span>
          <span className="font-sans text-xs text-[#D8C7B5] tracking-wider uppercase font-medium">
            {title}
          </span>
        </div>
        <span className="text-[11px] font-mono-tech tracking-wider text-[#C5A06B] uppercase font-semibold">
          Architectural Concept
        </span>
      </div>

      {/* Special Visual Formula Banner for Casa Sylva */}
      {projectId === 'casa-sylva' && (
        <div className="mb-6 bg-[#33151A] border border-[#C5A06B]/30 p-4 text-center">
          <span className="text-[11px] font-mono-tech tracking-[0.2em] text-[#C5A06B] uppercase block mb-3 font-bold">
            Building Composition Formula
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono-tech text-[#F7F2EC]">
            <span className="px-2.5 py-1 bg-[#48232B] border border-[#C5A06B]/40 font-medium">Gable Roof</span>
            <span className="text-[#C5A06B] font-bold">+</span>
            <span className="px-2.5 py-1 bg-[#48232B] border border-[#C5A06B]/40 font-medium">Stone Block</span>
            <span className="text-[#C5A06B] font-bold">+</span>
            <span className="px-2.5 py-1 bg-[#48232B] border border-[#C5A06B]/40 font-medium">Wooden Screen</span>
            <span className="text-[#C5A06B] font-bold">+</span>
            <span className="px-2.5 py-1 bg-[#48232B] border border-[#C5A06B]/40 font-medium">Upper Floor Box</span>
            <span className="text-[#C5A06B] font-bold">+</span>
            <span className="px-2.5 py-1 bg-[#48232B] border border-[#C5A06B]/40 font-medium">Stone Base Plinth</span>
            <span className="text-[#C5A06B] font-bold">=</span>
            <span className="px-3 py-1 bg-[#542A33] text-[#C5A06B] border border-[#C5A06B] font-bold tracking-widest uppercase">CASA SYLVA</span>
          </div>
        </div>
      )}

      {/* Concept Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {points.map((pt, i) => (
          <div
            key={i}
            className="p-5 bg-[#48232B] border border-[#C5A06B]/25 hover:border-[#C5A06B] transition-colors flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-tech text-xs text-[#C5A06B] font-bold tracking-wider">
                  0{i + 1}
                </span>
                <span className="h-[1px] flex-1 mx-3 bg-[#C5A06B]/30 group-hover:bg-[#C5A06B]/60 transition-colors" />
                <span className="w-1.5 h-1.5 bg-[#C5A06B] rounded-full" />
              </div>
              <h5 className="font-serif-display text-sm text-white uppercase tracking-wide group-hover:text-[#C5A06B] transition-colors mb-2 font-bold">
                {pt.title}
              </h5>
              <p className="font-sans text-xs text-[#D8C7B5] leading-relaxed font-light">
                {pt.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
