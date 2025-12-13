import { DomainProvider } from '@/contexts/DomainContext';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ResumeSection from '@/components/sections/ResumeSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

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
          <ResumeSection />
          <ContactSection />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </DomainProvider>
  );
};

export default Index;
