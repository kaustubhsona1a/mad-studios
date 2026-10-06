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

        {/* 06: Studio Leadership & Team */}
        <StudioSection />

        {/* 07: Contact & Discovery Consultation */}
        <ContactSection
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />

        {/* 08: Classy Liquid Glass Footer */}
        <Footer />
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
    </div>
  );
}

export default App;
