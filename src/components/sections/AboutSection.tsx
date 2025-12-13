import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, GraduationCap, Briefcase, Award } from 'lucide-react';
import { useDomain } from '@/contexts/DomainContext';
import profileAvatar from '@/assets/profile-avatar.jpg';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { domain } = useDomain();

  const stats = domain === 'software' 
    ? [
        { label: 'Systems Built', value: '10+' },
        { label: 'Languages', value: '8+' },
        { label: 'Projects', value: '15+' },
        { label: 'GitHub Repos', value: '20+' },
      ]
    : [
        { label: 'Embedded Systems', value: '10+' },
        { label: 'Robots Built', value: '5+' },
        { label: 'PCBs Designed', value: '8+' },
        { label: 'Microcontrollers', value: '6+' },
      ];

  const highlights = domain === 'software'
    ? [
        'Full-Stack Development with Next.js & TypeScript',
        'High-Performance Systems in C++ & Go',
        'Machine Learning & Computer Vision',
        'Distributed Systems & Cloud Architecture',
      ]
    : [
        'Embedded Systems with STM32 & ESP32',
        'Autonomous Robotics & ROS/ROS2',
        'FPGA & VLSI Design',
        'PCB Design & Hardware Prototyping',
      ];

  return (
    <section id="about" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Third-year ECE student at NIT Jamshedpur with a passion for both hardware and software
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-space font-semibold text-lg mb-1">Education</h3>
                  <p className="body-text">B.Tech in Electronics & Communication Engineering</p>
                  <p className="caption-text">NIT Jamshedpur • 2023 - 2027</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-space font-semibold text-lg mb-1">Location</h3>
                  <p className="body-text">Jamshedpur, Jharkhand, India</p>
                  <p className="caption-text">Previously: Dubai, UAE</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-space font-semibold text-lg mb-1">Positions</h3>
                  <p className="body-text">Vice President, Team Phocus</p>
                  <p className="caption-text">Official Photography & Filmmaking Club, NIT Jamshedpur</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <motion.p 
              key={domain}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="body-text"
            >
              {domain === 'software' ? (
                <>
                  I'm passionate about building <span className="highlight-text">high-performance systems</span> and 
                  <span className="text-secondary"> AI-powered applications</span>. From multi-threaded proxy servers 
                  to distributed key-value stores, I love tackling complex engineering challenges. My experience spans 
                  full-stack development, systems programming, and machine learning.
                </>
              ) : (
                <>
                  I specialize in <span className="text-secondary">embedded systems</span> and 
                  <span className="highlight-text"> autonomous robotics</span>. From designing PCBs and flight controllers 
                  to programming humanoid robots, I bridge the gap between hardware and software. My work includes 
                  aerospace systems, combat robots, and IoT solutions.
                </>
              )}
            </motion.p>
          </motion.div>

          {/* Right - Stats & Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="glass-card p-6 text-center interactive-hover"
                >
                  <p className="font-space text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {stat.value}
                  </p>
                  <p className="caption-text">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Highlights */}
            <div className="glass-card p-6">
              <h3 className="font-space font-semibold text-lg mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Key Focus Areas
              </h3>
              <ul className="space-y-3">
                {highlights.map((highlight, index) => (
                  <motion.li
                    key={highlight}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="body-text">{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
