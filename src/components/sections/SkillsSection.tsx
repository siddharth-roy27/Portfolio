import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useDomain } from '@/contexts/DomainContext';

interface SkillCategory {
  title: string;
  skills: { name: string; level: number }[];
}

const softwareSkills: SkillCategory[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'C/C++', level: 85 },
      { name: 'TypeScript', level: 85 },
      { name: 'Go', level: 75 },
      { name: 'JavaScript', level: 85 },
      { name: 'SQL', level: 80 },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    skills: [
      { name: 'Next.js', level: 85 },
      { name: 'React.js', level: 90 },
      { name: 'Node.js', level: 80 },
      { name: 'TensorFlow', level: 75 },
      { name: 'PyTorch', level: 70 },
    ],
  },
  {
    title: 'AI/ML & Systems',
    skills: [
      { name: 'Machine Learning', level: 80 },
      { name: 'Computer Vision', level: 75 },
      { name: 'Deep Learning', level: 70 },
      { name: 'Distributed Systems', level: 75 },
      { name: 'Operating Systems', level: 80 },
    ],
  },
  {
    title: 'Tools & Platforms',
    skills: [
      { name: 'Git/GitHub', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'Linux', level: 85 },
      { name: 'GCP', level: 70 },
      { name: 'PostgreSQL', level: 80 },
    ],
  },
];

const eceSkills: SkillCategory[] = [
  {
    title: 'Embedded Systems',
    skills: [
      { name: 'STM32', level: 85 },
      { name: 'ESP32', level: 90 },
      { name: 'Arduino', level: 95 },
      { name: 'Raspberry Pi', level: 85 },
      { name: 'FreeRTOS', level: 80 },
    ],
  },
  {
    title: 'Hardware Design',
    skills: [
      { name: 'PCB Design (KiCad)', level: 80 },
      { name: 'VHDL/Verilog', level: 75 },
      { name: 'Cadence', level: 70 },
      { name: 'Vivado', level: 70 },
      { name: 'ARM Architecture', level: 75 },
    ],
  },
  {
    title: 'Robotics',
    skills: [
      { name: 'ROS/ROS 2', level: 80 },
      { name: 'Gazebo', level: 75 },
      { name: 'SLAM', level: 70 },
      { name: 'Motor Control', level: 85 },
      { name: 'Sensor Fusion', level: 80 },
    ],
  },
  {
    title: 'Communication',
    skills: [
      { name: 'CAN Bus', level: 80 },
      { name: 'I2C/SPI/UART', level: 90 },
      { name: 'LoRa', level: 75 },
      { name: 'WiFi/BLE', level: 85 },
      { name: 'Telemetry', level: 80 },
    ],
  },
];

const codingPlatforms = [
  { name: 'Codeforces', icon: '🔥', color: 'text-red-400' },
  { name: 'CodeChef', icon: '👨‍🍳', color: 'text-amber-400' },
  { name: 'HackerRank', icon: '💚', color: 'text-green-400' },
  { name: 'LeetCode', icon: '🧩', color: 'text-yellow-400' },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { domain } = useDomain();

  const skills = domain === 'software' ? softwareSkills : eceSkills;

  return (
    <section id="skills" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {domain === 'software' 
              ? 'Full-stack development, systems programming, and AI/ML expertise'
              : 'Embedded systems, hardware design, and robotics capabilities'
            }
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="glass-card p-6 md:p-8"
            >
              <h3 className="font-space text-lg font-semibold mb-6 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  domain === 'software' ? 'bg-primary' : 'bg-secondary'
                }`} />
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-sm">{skill.name}</span>
                      <span className="text-muted-foreground text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                        className={`h-full rounded-full ${
                          domain === 'software'
                            ? 'bg-gradient-to-r from-primary to-secondary'
                            : 'bg-gradient-to-r from-secondary to-primary'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coding Platforms (only for software domain) */}
        {domain === 'software' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="font-space text-xl font-semibold mb-6 text-center">
              Competitive Programming
            </h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {codingPlatforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-muted/50 border border-white/5 cursor-pointer interactive-hover"
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className={`font-mono font-medium ${platform.color}`}>
                    {platform.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
