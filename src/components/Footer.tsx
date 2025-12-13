import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/siddharthroy', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/siddharthroy', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:siddharthroy2708@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="py-12 border-t border-white/10 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <motion.span 
              className="font-space text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              SR.
            </motion.span>
            <p className="footer-text mt-2">
              © {currentYear} Siddharth Roy. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                whileHover={{ y: -2 }}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
