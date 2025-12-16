import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string;
  verifyUrl: string;
  date: string;
}

const certificates: Certificate[] = [
  {
    id: '1',
    title: 'Frontend Developer (React)',
    issuer: 'HackerRank',
    imageUrl: 'https://hrcdn.net/community-frontend/assets/brand/logo-new-white-green-a5cb16e0ae.svg',
    verifyUrl: 'https://www.hackerrank.com/certificates/iframe/dd277c38097f',
    date: '2024'
  },
  {
    id: '2',
    title: 'Software Engineer Intern',
    issuer: 'HackerRank',
    imageUrl: 'https://hrcdn.net/community-frontend/assets/brand/logo-new-white-green-a5cb16e0ae.svg',
    verifyUrl: 'https://www.hackerrank.com/certificates/iframe/fa1fb865f3f1',
    date: '2024'
  },
];

const CertificatesSection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-primary" />
            <h2 className="section-title gradient-text">Certificates & Courses</h2>
          </div>
          <p className="section-subtitle max-w-2xl mx-auto">
            Professional certifications validating my technical expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {certificates.map((cert, index) => (
            <motion.a
              key={cert.id}
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredId(cert.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative block"
            >
              <div className="relative overflow-hidden rounded-2xl glass-card border border-border/50 transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20">
                {/* Certificate preview with grayscale to color transition */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted/50 to-background">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="relative w-full h-full"
                      animate={{
                        filter: hoveredId === cert.id ? 'grayscale(0%)' : 'grayscale(100%)',
                        scale: hoveredId === cert.id ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                        <Award className="w-20 h-20 text-primary/50" />
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                    animate={{
                      translateX: hoveredId === cert.id ? '200%' : '-100%',
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-space font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">{cert.issuer}</p>
                      <p className="text-muted-foreground/60 text-xs mt-2">{cert.date}</p>
                    </div>
                    <motion.div
                      animate={{
                        rotate: hoveredId === cert.id ? 0 : -45,
                        scale: hoveredId === cert.id ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </motion.div>
                  </div>
                </div>

                {/* Border glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: hoveredId === cert.id 
                      ? 'inset 0 0 30px hsl(var(--primary) / 0.1)' 
                      : 'inset 0 0 0px transparent',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;