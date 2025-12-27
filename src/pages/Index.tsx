import { DomainProvider } from '@/contexts/DomainContext';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import SkillsSection from '@/components/sections/SkillsSection';
import TechStackSection from '@/components/sections/TechStackSection';
import CurrentlyExploringSection from '@/components/sections/CurrentlyExploringSection';
import GitHubStatsSection from '@/components/sections/GitHubStatsSection';
import CodingStatsSection from '@/components/sections/CodingStatsSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import HobbiesSection from '@/components/sections/HobbiesSection';
import ResumeSection from '@/components/sections/ResumeSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';
import BackgroundMusic from '@/components/BackgroundMusic';

const Index = () => {
  return (
    <DomainProvider>
      <div className="relative min-h-screen bg-background overflow-x-hidden">
        {/* Interactive Background */}
        <ParticleBackground />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <ExperienceSection />
          <SkillsSection />
          <TechStackSection />
          <CurrentlyExploringSection />
          <GitHubStatsSection />
          <CodingStatsSection />
          <CertificatesSection />
          <HobbiesSection />
          <ResumeSection />
          <ContactSection />
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Background Music Player */}
        <BackgroundMusic />
      </div>
    </DomainProvider>
  );
};

export default Index;
