import React, { useState, useEffect } from 'react';
import { PageLoader } from './components/PageLoader';
import { Navbar } from './components/Navbar';
import { MarqueeStrip } from './components/MarqueeStrip';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { SelectedWorksSection } from './sections/SelectedWorksSection';
import { ServicesSection } from './sections/ServicesSection';
import { PresenceSection } from './sections/PresenceSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { StudioSection } from './sections/StudioSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDossierModal } from './components/ProjectDossierModal';
import { ConsultationModal } from './components/ConsultationModal';
import { OperatorAuthModal } from './components/operator/OperatorAuthModal';
import { OperatorPortal } from './components/operator/OperatorPortal';
import { PROJECTS_DATA, Project } from './data/projects';

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDossierProject, setSelectedDossierProject] = useState<Project | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Operator Terminal State (Secret Access for Architect)
  const [isOperatorOpen, setIsOperatorOpen] = useState(false);
  const [isOperatorAuthenticated, setIsOperatorAuthenticated] = useState(false);

  // Check initial hash/query and auth status
  useEffect(() => {
    try {
      const user = localStorage.getItem('mad_operator_user');
      if (user) {
        setIsOperatorAuthenticated(true);
      }
    } catch {}

    const checkHashOrQuery = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#portal' || hash === '#operator' || hash === '#admin' || params.get('portal') === 'true' || params.get('operator') === 'true') {
        setIsOperatorOpen(true);
      }
    };

    checkHashOrQuery();
    window.addEventListener('hashchange', checkHashOrQuery);
    return () => window.removeEventListener('hashchange', checkHashOrQuery);
  }, []);

  // Secret Keyboard Shortcut: Cmd/Ctrl + Shift + P OR Alt/Option + Shift + M
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setIsOperatorOpen(prev => !prev);
      } else if (e.altKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        setIsOperatorOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen text-[#F7F2EC] selection:bg-[#5E2B35] selection:text-[#EBD2AC] relative antialiased overflow-x-hidden bg-[#3E1D23]">

      {/* Brand Intro Screen */}
      {isLoading && (
        <PageLoader onComplete={() => setIsLoading(false)} />
      )}

      {/* Floating Liquid Glass Navigation Bar */}
      <Navbar
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* Main Content Area Layered Above Full Background Image */}
      <main className="relative z-10">
        {/* 01: Hero Section */}
        <HeroSection
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />

        {/* Architectural Marquee Ticker (Running in laptop layout, hidden on mobile) */}
        <div className="hidden lg:block">
          <MarqueeStrip variant="burgundy" />
        </div>

        {/* 02: About Section */}
        <AboutSection />

        {/* 03: Selected Works */}
        <SelectedWorksSection
          onOpenDossier={(proj) => setSelectedDossierProject(proj)}
        />

        {/* 04: Services Section */}
        <ServicesSection />

        {/* 05: Locations & National Reach */}
        <PresenceSection />

        {/* 06: Genuine Client Reviews & Testimonials */}
        <ReviewsSection />

        {/* 07: Studio Leadership & Team */}
        <StudioSection />

        {/* 07: Contact & Discovery Consultation */}
        <ContactSection
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />

        {/* 08: Classy Liquid Glass Footer with Secret Operator Access */}
        <Footer 
          onOpenOperatorPortal={() => setIsOperatorOpen(true)}
        />
      </main>

      {/* Interactive Project Case Study Dossier Modal */}
      {selectedDossierProject && (
        <ProjectDossierModal
          project={selectedDossierProject}
          onClose={() => setSelectedDossierProject(null)}
          onSelectProject={(proj) => setSelectedDossierProject(proj)}
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />
      )}

      {/* Consultation Discovery Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* Secret Architect Operator Portal */}
      {isOperatorOpen && (
        isOperatorAuthenticated ? (
          <OperatorPortal
            onClose={() => {
              setIsOperatorOpen(false);
              if (window.location.hash === '#portal' || window.location.hash === '#operator') {
                history.replaceState(null, '', window.location.pathname);
              }
            }}
            onLogout={() => {
              localStorage.removeItem('mad_operator_user');
              setIsOperatorAuthenticated(false);
            }}
          />
        ) : (
          <OperatorAuthModal
            onSuccess={() => setIsOperatorAuthenticated(true)}
            onCancel={() => {
              setIsOperatorOpen(false);
              if (window.location.hash === '#portal' || window.location.hash === '#operator') {
                history.replaceState(null, '', window.location.pathname);
              }
            }}
          />
        )
      )}
    </div>
  );
}

export default App;
