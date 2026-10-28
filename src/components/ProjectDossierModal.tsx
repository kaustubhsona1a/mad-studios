import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  ArrowLeft,
  MessageCircle
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

  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset active photo & lock body scroll reliably
  useEffect(() => {
    setActivePhotoIdx(0);
    setFailedImages({});
    if (project) {
      const scrollY = window.scrollY;
      const prevBodyPosition = document.body.style.position;
      const prevBodyTop = document.body.style.top;
      const prevBodyWidth = document.body.style.width;
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Scroll the project page to top
      if (overlayRef.current) {
        overlayRef.current.scrollTop = 0;
      }

      return () => {
        document.body.style.position = prevBodyPosition;
        document.body.style.top = prevBodyTop;
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = prevBodyWidth;
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [project?.id]);

  const gallery: ProjectGalleryImage[] = project ? getProjectGallery(project.id, project) : [];

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isLightboxOpen) {
        setIsLightboxOpen(false);
      } else {
        onClose();
      }
    } else if (e.key === 'ArrowRight' && !isLightboxOpen) {
      if (gallery.length > 0) {
        setActivePhotoIdx(prev => (prev < gallery.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowLeft' && !isLightboxOpen) {
      if (gallery.length > 0) {
        setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : gallery.length - 1));
      }
    }
  }, [isLightboxOpen, onClose, gallery.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!project) return null;

  const currentPhoto = gallery[activePhotoIdx] || gallery[0] || {
    url: project.imageUrl || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=90',
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

  const handleImageError = (index: number) => {
    setFailedImages(prev => ({ ...prev, [index]: true }));
  };

  const categoryLabel = project.category === 'residential' 
    ? 'Private Villa & Residence' 
    : project.category === 'restaurant' 
    ? 'Hospitality & Dining' 
    : 'Bespoke Workspace';

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-[#FAF8F5] text-[#221013] overflow-y-auto no-scrollbar select-text transition-colors duration-300"
    >
      {/* ========================================================================= */}
      {/* 1. TOP STICKY ARCHITECTURAL PAGE HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#E8DFD3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left: Back to Projects Navigation */}
          <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
            <button
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#2A0E13]/5 hover:bg-[#2A0E13]/10 text-[#3E1D23] hover:text-[#180609] border border-[#2A0E13]/10 text-xs font-sans font-medium transition-all cursor-pointer group"
              title="Return to main portfolio"
            >
              <ArrowLeft size={14} className="text-[#9E7A4A] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Works</span>
            </button>

            <div className="h-5 w-[1px] bg-[#E0D5C7] hidden sm:block" />

            <div className="min-w-0 hidden md:block">
              <span className="font-serif-display text-xs text-[#9E7A4A] uppercase tracking-[0.16em] block font-semibold">
                {categoryLabel}
              </span>
              <h2 className="font-serif-display text-base text-[#221013] tracking-wide uppercase truncate font-medium">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Center: Mobile Project Title */}
          <div className="min-w-0 text-center md:hidden truncate">
            <h2 className="font-serif-display text-sm text-[#221013] tracking-wide uppercase truncate font-medium">
              {project.title}
            </h2>
          </div>

          {/* Right: Quick Inquiry & Navigation Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* WhatsApp Enquiry Button */}
            <a
              href={`https://wa.me/918822225224?text=${encodeURIComponent(`Hi M.A.D Studio, I am viewing ${project.title} (${project.location}) on your website and would like to inquire about design and consultation.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-sans font-semibold transition-all cursor-pointer"
              title="Inquire directly on WhatsApp"
            >
              <MessageCircle size={13} className="text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Consultation Button */}
            {onOpenConsultation && (
              <button
                onClick={() => {
                  onClose();
                  onOpenConsultation();
                }}
                className="hidden lg:inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full bg-[#3E1D23] hover:bg-[#52252F] text-[#FAF8F5] border border-[#C5A06B]/50 text-xs font-serif-display tracking-wider uppercase font-semibold transition-all shadow-xs cursor-pointer"
              >
                <span>Consultation</span>
              </button>
            )}

            {/* Previous Project Button */}
            {prevProject && (
              <button
                onClick={() => onSelectProject(prevProject)}
                className="p-2 rounded-full text-[#3E1D23] hover:bg-[#2A0E13]/10 border border-[#E8DFD3] transition-all cursor-pointer hidden sm:flex items-center justify-center"
                title={`Previous: ${prevProject.title}`}
                aria-label="Previous project"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {/* Next Project Button */}
            {nextProject && (
              <button
                onClick={() => onSelectProject(nextProject)}
                className="p-2 rounded-full text-[#3E1D23] hover:bg-[#2A0E13]/10 border border-[#E8DFD3] transition-all cursor-pointer hidden sm:flex items-center justify-center"
                title={`Next: ${nextProject.title}`}
                aria-label="Next project"
              >
                <ChevronRight size={16} />
              </button>
            )}

            {/* Close Page Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#3E1D23] hover:text-[#180609] hover:bg-[#2A0E13]/10 border border-[#E8DFD3] transition-all cursor-pointer ml-1"
              aria-label="Close project page"
              title="Close (ESC)"
            >
              <X size={18} />
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN PAGE HERO PHOTO STAGE (Clean, Uncluttered, Maximum Impact) */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-20">
        
        {/* Photo Stage: Pristine, cinematic, NO text overlapping the image */}
        <div className="relative w-full max-h-[76vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-[#E8DFD3] shadow-[0_24px_64px_rgba(42,14,19,0.12)] group">
          
          <img
            src={failedImages[activePhotoIdx] ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90' : currentPhoto.url}
            alt={`${project.title} - ${currentPhoto.title || 'Architectural View'}`}
            referrerPolicy="no-referrer"
            loading="eager"
            onError={() => handleImageError(activePhotoIdx)}
            onClick={() => setIsLightboxOpen(true)}
            className="w-full h-[52vh] sm:h-[68vh] lg:h-[72vh] object-cover object-center filter brightness-[0.98] cursor-zoom-in transition-transform duration-700 group-hover:scale-[1.01]"
          />

          {/* Discreet Minimal Arrow Navigation across photos */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
                aria-label="Next photo"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Minimal Fullscreen hint (Bottom right, subtle) */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white/90 text-xs font-sans border border-white/20 backdrop-blur-md flex items-center space-x-1.5 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Maximize2 size={12} />
            <span>Expand</span>
          </button>
        </div>

        {/* Clean Photo Caption & Pagination Bar below the photo (Not on it!) */}
        <div className="mt-3.5 flex items-center justify-between text-xs font-sans text-[#756255] px-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-[#221013] uppercase tracking-wider">
              {currentPhoto.title || project.title}
            </span>
            {currentPhoto.category && (
              <>
                <span className="text-[#C5A06B]">·</span>
                <span className="text-[#9E7A4A] font-medium">{currentPhoto.category}</span>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="font-mono-tech tracking-wider text-[#9E7A4A] font-semibold">
              {activePhotoIdx + 1} / {gallery.length}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. CLEAN GALLERY THUMBNAIL STRIP (With Generous Breathing Room) */}
        {/* ========================================================================= */}
        {gallery.length > 1 && (
          <div className="mt-4 flex items-center space-x-2.5 sm:space-x-3.5 overflow-x-auto no-scrollbar py-1">
            {gallery.map((photo, pIdx) => (
              <button
                key={pIdx}
                onClick={() => setActivePhotoIdx(pIdx)}
                className={`relative w-20 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activePhotoIdx === pIdx 
                    ? 'border-[#C5A06B] shadow-[0_4px_16px_rgba(197,160,107,0.35)] scale-102 ring-2 ring-[#C5A06B]/30' 
                    : 'border-[#E8DFD3] opacity-60 hover:opacity-100 hover:border-[#9E7A4A]'
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
              </button>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. REFINED ARCHITECTURAL DETAILS SECTION (Spacious Off-White Layout) */}
        {/* ========================================================================= */}
        <section className="mt-12 sm:mt-16 max-w-5xl mx-auto space-y-12">
          
          {/* Headline Lockup */}
          <div className="space-y-3 border-b border-[#E8DFD3] pb-8">
            <div className="flex items-center space-x-2 text-xs font-sans tracking-[0.2em] text-[#9E7A4A] uppercase font-semibold">
              <span>{categoryLabel}</span>
            </div>

            <h1 className="font-serif-display text-2xl sm:text-4xl md:text-5xl text-[#221013] uppercase tracking-[0.04em] font-medium leading-tight">
              {project.title}
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#574438] leading-relaxed max-w-3xl font-light">
              {project.highlight || 'A bespoke contemporary architecture project harmonizing climate, indigenous stone, and refined proportion.'}
            </p>
          </div>

          {/* Key Architectural Metrics in an Elegant Editorial Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-[#E8DFD3]">
            {/* Total Area */}
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#9E7A4A] uppercase font-semibold flex items-center space-x-1.5">
                <Sparkles size={12} className="text-[#9E7A4A]" />
                <span>TOTAL AREA</span>
              </span>
              <p className="font-serif-display text-base sm:text-xl text-[#221013] uppercase font-semibold">
                {sqFtText}
              </p>
            </div>

            {/* Location (Stated Once Simply) */}
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#9E7A4A] uppercase font-semibold flex items-center space-x-1.5">
                <MapPin size={12} className="text-[#9E7A4A]" />
                <span>LOCATION</span>
              </span>
              <p className="font-serif-display text-base sm:text-xl text-[#221013] uppercase font-medium">
                {project.location}
              </p>
            </div>

            {/* Typology */}
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#9E7A4A] uppercase font-semibold flex items-center space-x-1.5">
                <Layers size={12} className="text-[#9E7A4A]" />
                <span>TYPOLOGY</span>
              </span>
              <p className="font-serif-display text-base sm:text-xl text-[#221013] uppercase font-medium">
                {project.dossier?.projectType || (project.category === 'residential' ? 'Private Villa' : 'Hospitality')}
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#9E7A4A] uppercase font-semibold flex items-center space-x-1.5">
                <Calendar size={12} className="text-[#9E7A4A]" />
                <span>COMPLETION</span>
              </span>
              <p className="font-serif-display text-base sm:text-xl text-[#221013] uppercase font-medium">
                {project.dossier?.timeline || '2025'}
              </p>
            </div>
          </div>

          {/* Editorial Architectural Narrative */}
          {project.dossier?.description && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif-display text-lg sm:text-xl text-[#221013] uppercase tracking-wide font-medium">
                Design Intent &amp; Materiality
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#574438] leading-relaxed font-light">
                {project.dossier.description}
              </p>
            </div>
          )}

          {/* Clean Action & Enquiry Card (Subtle warm contrast) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F2ECE1] border border-[#E0D5C7] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 max-w-xl">
              <h4 className="font-serif-display text-lg sm:text-xl text-[#221013] uppercase font-medium tracking-wide">
                Commission a bespoke architectural design
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#665346] leading-relaxed">
                Connect directly with M.A.D Studio architects to discuss site feasibility, planning, or turnkey execution for your property.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/918822225224?text=${encodeURIComponent(`Hi M.A.D Studio, I am inspired by ${project.title} (${project.location}) and would like to discuss designing a project. Here are my requirements:`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5C] text-white font-sans text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-98 text-center cursor-pointer whitespace-nowrap"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Consultation CTA */}
              {onOpenConsultation && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenConsultation();
                  }}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-full bg-[#3E1D23] hover:bg-[#52252F] text-[#FAF8F5] border border-[#C5A06B]/50 font-serif-display text-xs tracking-wider uppercase font-semibold transition-all shadow-md hover:scale-[1.02] active:scale-98 text-center cursor-pointer whitespace-nowrap"
                >
                  <Calendar size={13} className="text-[#C5A06B]" />
                  <span>Book Consultation</span>
                </button>
              )}
            </div>
          </div>

          {/* Project Navigation Footer (Previous / Next Project) */}
          <div className="pt-8 flex items-center justify-between border-t border-[#E8DFD3] text-xs font-sans">
            {prevProject ? (
              <button
                onClick={() => onSelectProject(prevProject)}
                className="group flex items-center space-x-2 text-[#665346] hover:text-[#221013] transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} className="text-[#9E7A4A] group-hover:-translate-x-1 transition-transform" />
                <span className="uppercase tracking-wider font-medium">Prev: {prevProject.title}</span>
              </button>
            ) : <div />}

            {nextProject ? (
              <button
                onClick={() => onSelectProject(nextProject)}
                className="group flex items-center space-x-2 text-[#665346] hover:text-[#221013] transition-colors cursor-pointer"
              >
                <span className="uppercase tracking-wider font-medium">Next: {nextProject.title}</span>
                <ArrowRight size={14} className="text-[#9E7A4A] group-hover:translate-x-1 transition-transform" />
              </button>
            ) : <div />}
          </div>

        </section>

      </main>

      {/* ========================================================================= */}
      {/* 5. FULLSCREEN LIGHTBOX (When user clicks photo to zoom in) */}
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
