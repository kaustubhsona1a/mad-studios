import React, { useEffect, useState } from 'react';
import { Project, ALL_DOSSIERS } from '../data/projects';
import { MadLogo } from './MadLogo';
import { FloorPlanViewer } from './FloorPlanViewer';
import { MaterialPaletteViewer } from './MaterialPaletteViewer';
import { ConceptDiagrams } from './ConceptDiagrams';
import { ArchitecturalVisual } from './ArchitecturalVisual';
import { ArchitecturalSheetViewer } from './ArchitecturalSheetViewer';
import { 
  X, 
  MapPin, 
  Home, 
  Layers, 
  Maximize, 
  Calendar, 
  CheckCircle2, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  Quote as QuoteIcon
} from 'lucide-react';

interface ProjectDossierModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  project,
  onClose,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'concept' | 'materials' | 'experience'>('overview');

  useEffect(() => {
    // Lock body scroll when dossier is open
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [project]);

  if (!project || !project.dossier) return null;

  const { dossier } = project;

  // Find index among all dossiers for Next/Prev
  const currentIdx = ALL_DOSSIERS.findIndex(d => d.id === project.id);
  const prevProject = currentIdx > 0 ? ALL_DOSSIERS[currentIdx - 1] : ALL_DOSSIERS[ALL_DOSSIERS.length - 1];
  const nextProject = currentIdx < ALL_DOSSIERS.length - 1 ? ALL_DOSSIERS[currentIdx + 1] : ALL_DOSSIERS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex flex-col items-center select-none">
      {/* Top Floating Dossier Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#140407]/95 backdrop-blur-md border-b border-[#DFC18D]/35 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-4">
          <MadLogo size="sm" variant="gold" />
          <div className="hidden sm:block h-6 w-[1px] bg-[#DFC18D]/30" />
          <div className="hidden sm:block">
            <span className="font-mono-tech text-[10px] tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
              PROJECT CASE STUDY
            </span>
            <span className="font-serif-display text-sm text-white tracking-wider uppercase font-bold">
              {project.title}
            </span>
          </div>
        </div>

        {/* Section Tabs inside dossier */}
        <div className="hidden md:flex items-center space-x-1 bg-[#20050B] p-1 border border-[#DFC18D]/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 text-xs tracking-wider font-mono-tech uppercase transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/40' : 'text-[#D4C8BC] hover:text-[#DFC18D]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1 text-xs tracking-wider font-mono-tech uppercase transition-colors cursor-pointer ${
              activeTab === 'plans' ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/40' : 'text-[#D4C8BC] hover:text-[#DFC18D]'
            }`}
          >
            Floor Plans
          </button>
          <button
            onClick={() => setActiveTab('concept')}
            className={`px-3 py-1 text-xs tracking-wider font-mono-tech uppercase transition-colors cursor-pointer ${
              activeTab === 'concept' ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/40' : 'text-[#D4C8BC] hover:text-[#DFC18D]'
            }`}
          >
            Design Concept
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1 text-xs tracking-wider font-mono-tech uppercase transition-colors cursor-pointer ${
              activeTab === 'materials' ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/40' : 'text-[#D4C8BC] hover:text-[#DFC18D]'
            }`}
          >
            Materials
          </button>
          {dossier.experienceImages && (
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1 text-xs tracking-wider font-mono-tech uppercase transition-colors cursor-pointer ${
                activeTab === 'experience' ? 'bg-[#581424] text-[#DFC18D] font-bold border border-[#DFC18D]/40' : 'text-[#D4C8BC] hover:text-[#DFC18D]'
              }`}
            >
              Gallery ({dossier.experienceImages.length})
            </button>
          )}
        </div>

        {/* Next / Previous & Close */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="p-1.5 text-[#DFC18D] hover:text-white hover:bg-[#380E18] border border-[#DFC18D]/30 transition-colors cursor-pointer"
            title={`Previous: ${prevProject.title}`}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => onSelectProject(nextProject)}
            className="p-1.5 text-[#DFC18D] hover:text-white hover:bg-[#380E18] border border-[#DFC18D]/30 transition-colors cursor-pointer"
            title={`Next: ${nextProject.title}`}
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-white hover:text-[#DFC18D] hover:bg-[#581424] border border-[#DFC18D]/40 transition-colors ml-2 cursor-pointer"
            title="Close Case Study"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Dossier Content Canvas */}
      <main className="w-full max-w-6xl px-4 sm:px-8 py-8 md:py-12 space-y-12 bg-[#180509] text-[#F7F3EB] shadow-2xl my-6 border border-[#DFC18D]/35">
        {/* Dossier Header Lockup */}
        <div className="text-center space-y-2 border-b border-[#DFC18D]/25 pb-6">
          <span className="font-mono-tech text-xs tracking-[0.3em] text-[#DFC18D] uppercase block font-semibold">
            PROJECT CASE STUDY
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl text-[#DFC18D] tracking-wider uppercase font-semibold">
            {project.title}
          </h1>
          <span className="font-mono-tech text-xs md:text-sm tracking-[0.2em] text-[#D4C8BC] uppercase block font-medium">
            {dossier.statusTag}
          </span>
        </div>

        {/* Hero Real Property Photo */}
        <div className="w-full border-2 border-[#DFC18D]/35 shadow-2xl overflow-hidden bg-[#140407]">
          <ArchitecturalVisual 
            src={project.imageUrl}
            alt={project.title}
            aspectRatio="aspect-[16/9]"
            caption={`${project.title} — Architectural Perspective · ${dossier.location}`}
          />
        </div>

        {/* 2-Column Dossier Spread: Left Specs Strip, Right Narrative & Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Architectural Specifications Strip in Velvet Burgundy */}
          <div className="lg:col-span-4 bg-[#22070E] border border-[#DFC18D]/35 p-6 space-y-5 shadow-lg">
            <h3 className="font-mono-tech text-xs tracking-[0.2em] text-[#DFC18D] uppercase pb-2 border-b border-[#DFC18D]/25 font-bold">
              PROJECT FACTS & SPECS
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#DFC18D] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase block font-semibold">
                    Location
                  </span>
                  <span className="text-sm font-sans font-medium text-white">
                    {dossier.location}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Home size={18} className="text-[#DFC18D] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase block font-semibold">
                    Typology
                  </span>
                  <span className="text-sm font-sans font-medium text-white">
                    {dossier.projectType}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Layers size={18} className="text-[#DFC18D] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase block font-semibold">
                    Configuration
                  </span>
                  <span className="text-sm font-sans font-medium text-white">
                    {dossier.configuration}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Maximize size={18} className="text-[#DFC18D] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase block font-semibold">
                    Area Metrics
                  </span>
                  {dossier.plotArea && (
                    <span className="text-xs font-mono-tech text-white block">
                      Plot Area: {dossier.plotArea}
                    </span>
                  )}
                  {dossier.builtUpArea && (
                    <span className="text-xs font-mono-tech text-[#D4C8BC] block">
                      Built-Up: {dossier.builtUpArea}
                    </span>
                  )}
                  {dossier.unitArea && (
                    <span className="text-xs font-mono-tech text-white block">
                      Unit Area: {dossier.unitArea}
                    </span>
                  )}
                  {dossier.carpetArea && (
                    <span className="text-xs font-mono-tech text-[#D4C8BC] block">
                      Carpet Area: {dossier.carpetArea}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar size={18} className="text-[#DFC18D] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase block font-semibold">
                    Project Timeline
                  </span>
                  <span className="text-sm font-sans font-medium text-white">
                    {dossier.timeline}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-[#DFC18D] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase block font-semibold">
                    Site Status
                  </span>
                  <span className="text-sm font-mono-tech text-[#DFC18D] font-bold">
                    {dossier.status}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-2 border-t border-[#DFC18D]/25">
                <Briefcase size={18} className="text-[#DFC18D] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono-tech tracking-[0.15em] text-[#DFC18D]/80 uppercase block mb-1 font-semibold">
                    Scope of Work
                  </span>
                  <ul className="space-y-1">
                    {dossier.scopeOfWork.map((sc, i) => (
                      <li key={i} className="text-xs text-[#D4C8BC] flex items-center space-x-1.5 font-sans">
                        <span className="w-1.5 h-1.5 bg-[#DFC18D] inline-block shrink-0" />
                        <span>{sc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Current Stage */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#22070E] border border-[#DFC18D]/35 p-6 md:p-8 space-y-3 shadow-lg">
              <span className="font-mono-tech text-xs tracking-[0.2em] text-[#DFC18D] uppercase block font-semibold">
                DESIGN NARRATIVE
              </span>
              <p className="font-serif-editorial text-lg md:text-xl text-white leading-relaxed italic">
                “{dossier.description}”
              </p>
            </div>

            {/* Current Stage Box */}
            <div className="bg-[#1C060C] border border-[#DFC18D]/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono-tech tracking-[0.2em] text-[#DFC18D] uppercase font-bold block">
                  Current Stage on Site
                </span>
                <p className="text-sm font-sans font-semibold text-white mt-1">
                  {dossier.status}
                </p>
                {dossier.currentStageNote && (
                  <p className="text-xs text-[#D4C8BC] mt-1 font-sans">
                    {dossier.currentStageNote}
                  </p>
                )}
              </div>
              <div className="px-3.5 py-1.5 border border-[#DFC18D] bg-[#2E0A12] text-[11px] font-mono-tech text-[#DFC18D] uppercase tracking-wider font-semibold shrink-0">
                ACTIVE SITE RECORD
              </div>
            </div>

            {/* Dossier Quote Block */}
            <div className="border-l-3 border-[#DFC18D] pl-5 py-3 bg-[#24070F] border-y border-r border-[#DFC18D]/20">
              <div className="flex items-center space-x-2 text-[#DFC18D] mb-1">
                <QuoteIcon size={16} />
                <span className="text-[11px] font-mono-tech tracking-[0.18em] uppercase font-semibold">Studio Philosophy</span>
              </div>
              <p className="font-serif-display text-base md:text-lg text-white tracking-wide uppercase font-medium">
                {dossier.quote}
              </p>
            </div>
          </div>
        </div>

        {/* Authentic Architectural Drawing Sheet from Portfolio PDF */}
        <section id="sheets" className="space-y-4">
          <ArchitecturalSheetViewer
            projectId={project.id}
            projectTitle={project.title}
            location={dossier.location}
          />
        </section>

        {/* Floor Plans Section */}
        <section id="plans" className="space-y-4">
          <FloorPlanViewer
            levels={dossier.floorPlans}
            projectName={project.title}
            sections={dossier.sections}
          />
        </section>

        {/* Concept & Morphology Section */}
        <section id="concept" className="space-y-4">
          <ConceptDiagrams
            title={dossier.designConcept.title}
            points={dossier.designConcept.points}
            projectId={project.id}
          />
        </section>

        {/* Material Palette Section */}
        <section id="materials" className="space-y-4">
          <MaterialPaletteViewer
            materials={dossier.materialPalette}
            stampTagline={dossier.stampTagline}
          />
        </section>

        {/* Experience Section */}
        {dossier.experienceImages && (
          <section id="experience" className="space-y-6 pt-4 border-t border-[#DFC18D]/25">
            <div className="text-center space-y-1">
              <span className="font-mono-tech text-xs tracking-[0.25em] text-[#DFC18D] uppercase block font-semibold">
                ARCHITECTURAL PHOTOGRAPHY
              </span>
              <h2 className="font-serif-display text-3xl md:text-4xl text-white uppercase font-medium">
                Experience Gallery
              </h2>
              <p className="font-serif-editorial italic text-sm text-[#D4C8BC]">
                Moments of natural illumination, textured materials, and living spaces.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dossier.experienceImages.map((exp, idx) => (
                <div key={idx} className="bg-[#1C060C] border border-[#DFC18D]/30 overflow-hidden flex flex-col group hover:border-[#DFC18D] transition-colors shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#160509]">
                    <ArchitecturalVisual 
                      src={project.imageUrl}
                      alt={exp.title}
                      aspectRatio="aspect-[4/3]" 
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#140407]/90 border border-[#DFC18D]/40 text-[10px] font-mono-tech text-[#DFC18D] uppercase tracking-wider">
                      {exp.tag}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between bg-[#180509]">
                    <div>
                      <h4 className="font-serif-display text-base text-white uppercase tracking-wide group-hover:text-[#DFC18D] transition-colors font-medium">
                        {exp.title}
                      </h4>
                      {exp.subtitle && (
                        <span className="text-xs font-serif-editorial italic text-[#DFC18D] block mb-1.5">
                          {exp.subtitle}
                        </span>
                      )}
                      <p className="font-sans text-xs text-[#D4C8BC] leading-relaxed">
                        {exp.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dossier Footer & Navigation */}
        <div className="pt-8 border-t border-[#DFC18D]/25 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="flex items-center space-x-2 text-xs font-mono-tech tracking-wider text-[#DFC18D] uppercase hover:text-white transition-colors font-semibold cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Prev: {prevProject.title}</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#581424] text-[#F7F3EB] border border-[#DFC18D] hover:bg-[#6E1C2E] font-serif-display text-xs uppercase tracking-[0.2em] transition-all cursor-pointer font-semibold shadow-lg"
          >
            Close Case Study
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="flex items-center space-x-2 text-xs font-mono-tech tracking-wider text-[#DFC18D] uppercase hover:text-white transition-colors font-semibold cursor-pointer"
          >
            <span>Next: {nextProject.title}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};
