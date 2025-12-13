import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDomain } from '@/contexts/DomainContext';

const ResumeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { domain } = useDomain();

  const resumeUrl = domain === 'software' 
    ? '/resumes/Siddharth_Roy_Resume_Software.pdf'
    : '/resumes/Siddharth_Roy_Resume_ECE.pdf';

  return (
    <section id="resume" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">
            My <span className="gradient-text">Resume</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {domain === 'software'
              ? 'Software Engineering focused resume highlighting full-stack and systems experience'
              : 'ECE & Robotics focused resume highlighting embedded systems and hardware projects'
            }
          </p>
        </motion.div>

        {/* Resume Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card p-4 md:p-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button variant="hero" size="lg" asChild>
                <a href={resumeUrl} download>
                  <Download className="w-5 h-5" />
                  Download Resume
                </a>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5" />
                  Open in New Tab
                </a>
              </Button>
            </div>

            {/* PDF Viewer */}
            <div className="relative w-full aspect-[8.5/11] bg-muted rounded-lg overflow-hidden border border-white/10">
              <iframe
                src={resumeUrl}
                className="w-full h-full"
                title={`Siddharth Roy - ${domain === 'software' ? 'Software' : 'ECE'} Resume`}
              />
              
              {/* Fallback for browsers that don't support PDF embed */}
              <div className="absolute inset-0 flex items-center justify-center bg-muted/90 opacity-0 hover:opacity-0">
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="body-text mb-4">PDF preview not available</p>
                  <Button variant="neon" asChild>
                    <a href={resumeUrl} download>
                      Download PDF
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Domain Switch Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center mt-6 caption-text"
            >
              💡 Toggle between <span className="text-primary">Software</span> and{' '}
              <span className="text-secondary">ECE</span> domains in the navbar to view different resumes
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeSection;
