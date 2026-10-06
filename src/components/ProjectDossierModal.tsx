import React, { useEffect, useState, useCallback } from 'react';
import { Project, ALL_DOSSIERS, getProjectSqFt } from '../data/projects';
import { getProjectGallery, ProjectGalleryImage } from '../data/projectImages';
import { MadLogo } from './MadLogo';
import { 
  X, 
  MapPin, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface ProjectDossierModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  onOpenConsultation?: () => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  project,
  onClose,
  onSelectProject,
  onOpenConsultation
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Reset active photo when project changes
  useEffect(() => {
    setActivePhotoIdx(0);
    setFailedImages({});
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [project?.id]);

  // Handle keyboard navigation (Arrow keys + Escape)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isLightboxOpen) {
        setIsLightboxOpen(false);
      } else {
        onClose();
      }
    }
  }, [isLightboxOpen, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!project) return null;

  const gallery: ProjectGalleryImage[] = getProjectGallery(project.id);
  const currentPhoto = gallery[activePhotoIdx] || gallery[0] || {
    url: project.imageUrl || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    title: project.title,
    category: 'Site Photo'
  };

  const sqFtText = getProjectSqFt(project);

  // Find index among all projects for Next/Prev
  const currentIdx = ALL_DOSSIERS.findIndex(d => d.id === project.id);
  const prevProject = currentIdx > 0 ? ALL_DOSSIERS[currentIdx - 1] : ALL_DOSSIERS[ALL_DOSSIERS.length - 1];
  const nextProject = currentIdx < ALL_DOSSIERS.length - 1 ? ALL_DOSSIERS[currentIdx + 1] : ALL_DOSSIERS[0];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : gallery.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx(prev => (prev < gallery.length - 1 ? prev + 1 : 0));
  };

  // Safe image error handler
  const handleImageError = (index: number) => {
    setFailedImages(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div 
        className="w-full max-w-5xl liquid-glass-burgundy rounded-2xl sm:rounded-3xl border border-white/20 text-[#F7F2EC] shadow-[0_25px_80px_rgba(0,0,0,0.85)] relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Specular Edge Glow */}
        <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* ========================================================================= */}
        {/* MODAL HEADER: Title, Area, Prev/Next & Close */}
        {/* ========================================================================= */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between gap-3 bg-[#2A0E13]/80">
          <div className="flex items-center space-x-3 min-w-0">
            <MadLogo size="sm" variant="gold" />
            <div className="h-7 w-[1px] bg-white/15 hidden sm:block" />
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-sans text-[10px] tracking-[0.2em] text-[#C5A06B] uppercase font-semibold">
                  SITE PHOTOS & DETAILS
                </span>
                <span className="text-white/30 hidden sm:inline">·</span>
                <span className="text-[11px] font-sans text-[#EBD2AC] hidden sm:inline">
                  {project.category === 'residential' ? 'Villa / Home' : 'Workspace'}
                </span>
              </div>
              <h2 className="font-serif-display text-lg sm:text-2xl text-white tracking-wide uppercase truncate font-medium">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Quick Controls: Previous / Next Project & Close */}
          <div className="flex items-center space-x-2 shrink-0">
            {prevProject && (
              <button
                onClick={() => onSelectProject(prevProject)}
                className="p-2 rounded-full text-[#C5A06B] hover:text-white hover:bg-white/10 border border-white/15 transition-all cursor-pointer hidden sm:inline-flex items-center space-x-1 text-xs"
                title={`Previous: ${prevProject.title}`}
              >
                <ArrowLeft size={14} />
              </button>
            )}

            {nextProject && (
              <button
                onClick={() => onSelectProject(nextProject)}
                className="p-2 rounded-full text-[#C5A06B] hover:text-white hover:bg-white/10 border border-white/15 transition-all cursor-pointer hidden sm:inline-flex items-center space-x-1 text-xs"
                title={`Next: ${nextProject.title}`}
              >
                <ArrowRight size={14} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY: Site Photos & Basic Details Only */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 space-y-5">

          {/* 1. Large Main Site Photo Display */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[60vh] rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-2xl group">
            <img
              src={failedImages[activePhotoIdx] ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85' : currentPhoto.url}
              alt={`${project.title} - ${currentPhoto.title}`}
              referrerPolicy="no-referrer"
              loading="eager"
              onError={() => handleImageError(activePhotoIdx)}
              className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-700 group-hover:scale-102"
            />

            {/* Gradient Overlays for controls contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Photo Category Badge (Top Left) */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-3.5 py-1 rounded-full liquid-glass-pill text-xs font-sans text-[#EBD2AC] shadow-md border border-white/20 font-medium">
              <span>{currentPhoto.category || 'Site View'}</span>
            </div>

            {/* Fullscreen Button (Top Right) */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 px-3 py-1.5 rounded-full liquid-glass-pill text-xs font-sans text-white hover:text-[#C5A06B] border border-white/20 flex items-center space-x-1.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
            >
              <Maximize2 size={13} />
              <span className="hidden sm:inline">Full Photo</span>
            </button>

            {/* Left & Right Arrow Navigation */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full liquid-glass-burgundy text-white hover:text-[#C5A06B] border border-white/25 hover:border-[#C5A06B] cursor-pointer shadow-xl transition-transform hover:scale-110 active:scale-95"
                  aria-label="Previous site photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full liquid-glass-burgundy text-white hover:text-[#C5A06B] border border-white/25 hover:border-[#C5A06B] cursor-pointer shadow-xl transition-transform hover:scale-110 active:scale-95"
                  aria-label="Next site photo"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Bottom Photo Title and Counter */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-end justify-between z-10 pointer-events-none">
              <div>
                <span className="font-serif-display text-sm sm:text-base text-white tracking-wide uppercase block font-medium drop-shadow-md">
                  {currentPhoto.title || project.title}
                </span>
                <span className="text-[11px] font-sans text-[#EBD2AC] drop-shadow-sm">
                  {project.location}
                </span>
              </div>

              <div className="px-3 py-1 rounded-full liquid-glass text-xs font-sans text-white border border-white/20 font-medium">
                {activePhotoIdx + 1} / {gallery.length}
              </div>
            </div>
          </div>

          {/* 2. Photo Thumbnails Strip */}
          {gallery.length > 1 && (
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
              {gallery.map((photo, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setActivePhotoIdx(pIdx)}
                  className={`relative w-20 sm:w-28 aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activePhotoIdx === pIdx 
                      ? 'border-[#C5A06B] shadow-[0_0_15px_rgba(197,160,107,0.5)] scale-102 ring-2 ring-[#C5A06B]/50' 
                      : 'border-white/15 opacity-65 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <img 
                    src={failedImages[pIdx] ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=70' : photo.url} 
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={() => handleImageError(pIdx)}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 py-0.5 text-[9px] font-sans text-[#EBD2AC] truncate text-center px-1">
                    {photo.category || `Photo ${pIdx + 1}`}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ========================================================================= */}
          {/* BASIC DETAILS BAR: Which area, how much sq ft, thats it not more */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl liquid-glass border border-white/15">
            {/* 1. Which Area */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans tracking-[0.16em] text-[#C5A06B] uppercase font-semibold flex items-center space-x-1">
                <MapPin size={11} className="text-[#C5A06B]" />
                <span>AREA & LOCATION</span>
              </span>
              <p className="font-serif-display text-sm sm:text-base text-white uppercase font-medium">
                {project.location}
              </p>
            </div>

            {/* 2. How Much Sq Ft */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans tracking-[0.16em] text-[#C5A06B] uppercase font-semibold flex items-center space-x-1">
                <Sparkles size={11} className="text-[#C5A06B]" />
                <span>TOTAL AREA</span>
              </span>
              <p className="font-serif-display text-sm sm:text-base text-[#EBD2AC] uppercase font-semibold">
                {sqFtText}
              </p>
            </div>

            {/* 3. Property Type */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans tracking-[0.16em] text-[#C5A06B] uppercase font-semibold flex items-center space-x-1">
                <Layers size={11} className="text-[#C5A06B]" />
                <span>PROPERTY TYPE</span>
              </span>
              <p className="font-serif-display text-sm sm:text-base text-white uppercase font-medium">
                {project.dossier?.projectType || (project.category === 'residential' ? 'Private Villa' : 'Modern Workspace')}
              </p>
            </div>

            {/* 4. Timeline / Status */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans tracking-[0.16em] text-[#C5A06B] uppercase font-semibold flex items-center space-x-1">
                <Calendar size={11} className="text-[#C5A06B]" />
                <span>PROJECT YEAR</span>
              </span>
              <p className="font-serif-display text-sm sm:text-base text-white uppercase font-medium">
                {project.dossier?.timeline || '2025'}
              </p>
            </div>
          </div>

          {/* Quick Footer Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <p className="text-xs font-sans text-[#D8C7B5] text-center sm:text-left">
              Want to build something similar on your land or property?
            </p>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              {onOpenConsultation && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenConsultation();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4A1A24] to-[#6E1C2E] hover:from-[#5C202C] hover:to-[#842238] text-white border border-[#C5A06B]/60 font-serif-display text-xs tracking-wider uppercase font-semibold transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  Book Free Consultation
                </button>
              )}

              {nextProject && (
                <button
                  onClick={() => onSelectProject(nextProject)}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full liquid-glass hover:bg-white/10 text-[#C5A06B] hover:text-white border border-white/15 text-xs font-sans uppercase transition-all cursor-pointer font-medium"
                >
                  <span>Next: {nextProject.title}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX: Click any photo to see large site view */}
      {/* ========================================================================= */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[120] bg-black/95 flex flex-col items-center justify-center p-4 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-30 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer"
            aria-label="Close fullscreen"
          >
            <X size={22} />
          </button>

          <div 
            className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={failedImages[activePhotoIdx] ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90' : currentPhoto.url}
              alt={currentPhoto.title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/20"
            />

            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 cursor-pointer shadow-xl transition-all"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 cursor-pointer shadow-xl transition-all"
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="font-serif-display text-base sm:text-lg text-white uppercase block font-medium">
              {currentPhoto.title}
            </span>
            <span className="text-xs font-sans text-[#EBD2AC]">
              {project.title} · {project.location} · {sqFtText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
