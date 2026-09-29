import React, { useState } from 'react';
import { PageLoader } from './components/PageLoader';
import { Navbar } from './components/Navbar';
import { MarqueeStrip } from './components/MarqueeStrip';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { SelectedWorksSection } from './sections/SelectedWorksSection';
import { ServicesSection } from './sections/ServicesSection';
import { PresenceSection } from './sections/PresenceSection';
import { StudioSection } from './sections/StudioSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDossierModal } from './components/ProjectDossierModal';
import { ConsultationModal } from './components/ConsultationModal';
import { PROJECTS_DATA, Project } from './data/projects';

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDossierProject, setSelectedDossierProject] = useState<Project | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Featured Project: Casa Sylva (Siolim, Goa)
  const featuredCasaSylva = PROJECTS_DATA.find(p => p.id === 'casa-sylva') || PROJECTS_DATA[0];

  return (
    <div className="min-h-screen bg-[#120407] text-[#F7F3EB] selection:bg-[#5E1A2B] selection:text-[#DFC18D] relative antialiased">
      {/* Brand Intro Screen (dismisses instantly on swipe up, tap, or scroll) */}
      {isLoading && (
        <PageLoader onComplete={() => setIsLoading(false)} />
      )}

      {/* Fixed Navigation */}
      <Navbar
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* 01: Hero Section (Brand Introduction) */}
      <HeroSection
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* Architectural Marquee Ticker */}
      <MarqueeStrip variant="burgundy" />

      {/* 02: About Section (Studio Purpose & Principles) */}
      <AboutSection />

      {/* 03: Selected Works (Curated Signature Architecture Showcase) */}
      <SelectedWorksSection
        onOpenDossier={(proj) => setSelectedDossierProject(proj)}
      />

      {/* 04: Services Section (Core Offerings & Deliverables) */}
      <ServicesSection />

      {/* 05: Locations & National Reach */}
      <PresenceSection />

      {/* 06: Studio Leadership & Team */}
      <StudioSection />

      {/* 07: Contact & Discovery Consultation */}
      <ContactSection
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* 08: Minimal Footer */}
      <Footer />

      {/* Interactive Project Case Study Dossier Modal */}
      {selectedDossierProject && (
        <ProjectDossierModal
          project={selectedDossierProject}
          onClose={() => setSelectedDossierProject(null)}
          onSelectProject={(proj) => setSelectedDossierProject(proj)}
        />
      )}

      {/* Consultation Discovery Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
}

export default App;
