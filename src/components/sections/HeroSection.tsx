import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDomain } from '@/contexts/DomainContext';

const HeroSection = () => {
  const { domain } = useDomain();

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 md:mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/5"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-mono text-sm text-muted-foreground">
              {domain === 'software' ? 'Software Engineer' : 'ECE & Robotics Engineer'}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title mb-4 md:mb-6"
          >
            Siddharth Roy
          </motion.h1>

          {/* Subtitle with domain-specific content */}
          <motion.p
            key={domain}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-subtitle mb-8 md:mb-12 max-w-2xl mx-auto"
          >
            {domain === 'software' ? (
              <>
                Building <span className="text-primary text-glow">high-performance systems</span> & 
                <span className="text-secondary text-glow-mint"> AI-powered applications</span>
              </>
            ) : (
              <>
                Crafting <span className="text-secondary text-glow-mint">embedded systems</span> & 
                <span className="text-primary text-glow"> autonomous robotics</span>
              </>
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16"
          >
            <Button
              variant="hero"
              size="lg"
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects
            </Button>
            <Button
              variant="hero-outline"
              size="lg"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get In Touch
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            {[
              { icon: Github, href: 'https://github.com/siddharthroy', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com/in/siddharthroy', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:siddharthroy2708@gmail.com', label: 'Email' },
              { icon: FileText, href: '#resume', label: 'Resume' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={href === '#resume' ? (e) => {
                  e.preventDefault();
                  document.querySelector('#resume')?.scrollIntoView({ behavior: 'smooth' });
                } : undefined}
                className="p-3 rounded-xl glass-card hover:bg-primary/10 hover:border-primary/30 transition-all group"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
