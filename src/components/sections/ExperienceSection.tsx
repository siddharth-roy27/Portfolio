import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useDomain } from '@/contexts/DomainContext';

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { domain } = useDomain();

  const softwareExperience = {
    role: 'AI/ML Intern',
    company: 'ROBOMANTHAN',
    duration: 'May 2025 – July 2025',
    description: [
      'Developed computer vision and ML applications on Raspberry Pi using OpenCV and Python for real-time object detection, image processing, and autonomous perception.',
      'Integrated ML models with ROS frameworks to enable autonomous navigation, obstacle detection, and tracking for robotics research platforms.',
    ],
  };

  const eceExperience = {
    role: 'Robotics and ML Intern',
    company: 'ROBOMANTHAN',
    duration: 'May 2025 – July 2025',
    description: [
      'Built advanced IoT/IIoT solutions using ESP32, Arduino (Uno, Mega, Nano), and sensor-integrated embedded systems.',
      'Contributed to autonomous platforms including drones, UAVs, and rovers with ROS, Gazebo, and RViz for simulation.',
      'Created intelligent robotic systems with face recognition, humanoid robot programming, and PCB development.',
    ],
  };

  const experience = domain === 'software' ? softwareExperience : eceExperience;

  const achievements = [
    {
      title: 'E-Summit Chat JPG',
      org: 'E-Cell NIT Jamshedpur',
      description: 'Won the competitive Prompt Engineering challenge',
      year: '2024',
    },
    {
      title: '7kg Robo War - 2nd Place',
      org: 'Ojass 2025',
      description: 'Combat robotics competition showcasing hardware skills',
      year: '2025',
    },
  ];

  const positions = [
    {
      title: 'Vice President',
      org: 'Society of Electronics & Communication Engineering',
      description: 'Leading technical initiatives and organizing workshops',
    },
    {
      title: 'Head of Electronics & Avionics',
      org: 'Cosmology And Rocketry Club',
      description: 'Overseeing flight controller development and avionics systems',
    },
  ];

  return (
    <section id="experience" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Experience & <span className="gradient-text">Leadership</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Professional experience and positions of responsibility
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Work Experience */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-space text-xl font-semibold mb-6 flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-primary" />
              Work Experience
            </h3>
            
            <div className="glass-card p-6 md:p-8 relative">
              {/* Timeline dot */}
              <div className="absolute left-6 top-8 w-3 h-3 rounded-full bg-primary glow-blue" />
              
              <div className="pl-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="font-space text-lg font-semibold">{experience.role}</h4>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-primary/10 text-primary border border-primary/20">
                    Internship
                  </span>
                </div>
                
                <p className="highlight-text mb-2">{experience.company}</p>
                
                <div className="flex items-center gap-4 mb-4 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {experience.duration}
                  </span>
                </div>
                
                <ul className="space-y-3">
                  {experience.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                      <span className="body-text text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Achievements */}
            <h3 className="font-space text-xl font-semibold mt-10 mb-6 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              Achievements
            </h3>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="glass-card p-4 md:p-5 interactive-hover"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-space font-semibold">{achievement.title}</h4>
                    <span className="font-mono text-xs text-muted-foreground">{achievement.year}</span>
                  </div>
                  <p className="text-sm text-secondary mb-1">{achievement.org}</p>
                  <p className="caption-text">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Positions of Responsibility */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-space text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="text-2xl">👑</span>
              Leadership Roles
            </h3>
            
            <div className="space-y-4">
              {positions.map((position, index) => (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="glass-card p-6 md:p-8 interactive-hover relative overflow-hidden"
                >
                  {/* Decorative gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                  
                  <div className="relative">
                    <h4 className="font-space text-lg font-semibold mb-2">{position.title}</h4>
                    <p className="text-secondary font-medium mb-3">{position.org}</p>
                    <p className="body-text text-sm">{position.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Education Timeline */}
            <h3 className="font-space text-xl font-semibold mt-10 mb-6 flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              Education
            </h3>
            
            <div className="glass-card p-6 md:p-8">
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-primary/30">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary glow-blue" />
                  <h4 className="font-space font-semibold">B.Tech in ECE</h4>
                  <p className="text-primary text-sm">NIT Jamshedpur</p>
                  <p className="caption-text">2023 - 2027</p>
                </div>
                
                <div className="relative pl-6 border-l-2 border-secondary/30">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-secondary glow-mint" />
                  <h4 className="font-space font-semibold">12th Grade - 75.6%</h4>
                  <p className="text-secondary text-sm">Indian High School, Dubai</p>
                  <p className="caption-text">2022 - 2023</p>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-muted-foreground" />
                  <h4 className="font-space font-semibold">10th Grade - 88.4%</h4>
                  <p className="text-muted-foreground text-sm">Birla Public School, Pilani</p>
                  <p className="caption-text">2020 - 2021</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
