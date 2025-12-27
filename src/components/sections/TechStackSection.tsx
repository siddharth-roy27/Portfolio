import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';
import {
  Code2,
  Database,
  Cloud,
  Cpu,
  Brain,
  Layers,
  Globe,
  Smartphone,
  Zap,
  Wrench,
  GitBranch,
  Server
} from 'lucide-react';
import { useGitHubStats } from '@/hooks/useGitHubStats';

interface TechItem {
  name: string;
  icon: React.ReactNode;
  category: string;
  color: string;
  githubUsage?: number;
}

// Tech stack data as specified
const techStackData: TechItem[] = [
  // Languages
  { name: 'JavaScript', icon: <Code2 className="w-5 h-5" />, category: 'Languages', color: '#f7df1e' },
  { name: 'TypeScript', icon: <Code2 className="w-5 h-5" />, category: 'Languages', color: '#3178c6' },
  { name: 'Python', icon: <Code2 className="w-5 h-5" />, category: 'Languages', color: '#3776ab' },
  { name: 'C', icon: <Code2 className="w-5 h-5" />, category: 'Languages', color: '#a8b9cc' },
  { name: 'C++', icon: <Code2 className="w-5 h-5" />, category: 'Languages', color: '#00599c' },
  { name: 'Java', icon: <Code2 className="w-5 h-5" />, category: 'Languages', color: '#007396' },
  { name: 'Bash / Shell', icon: <Server className="w-5 h-5" />, category: 'Languages', color: '#89e051' },

  // Libraries & Frameworks
  { name: 'React', icon: <Layers className="w-5 h-5" />, category: 'Libraries & Frameworks', color: '#61dafb' },
  { name: 'Next.js', icon: <Globe className="w-5 h-5" />, category: 'Libraries & Frameworks', color: '#000000' },
  { name: 'Tailwind CSS', icon: <Smartphone className="w-5 h-5" />, category: 'Libraries & Frameworks', color: '#06b6d4' },
  { name: 'Node.js', icon: <Server className="w-5 h-5" />, category: 'Libraries & Frameworks', color: '#339933' },
  { name: 'Express.js', icon: <Server className="w-5 h-5" />, category: 'Libraries & Frameworks', color: '#000000' },
  { name: 'FastAPI', icon: <Zap className="w-5 h-5" />, category: 'Libraries & Frameworks', color: '#009688' },
  { name: 'Vercel', icon: <Cloud className="w-5 h-5" />, category: 'Libraries & Frameworks', color: '#000000' },
  { name: 'Firebase SDK', icon: <Database className="w-5 h-5" />, category: 'Libraries & Frameworks', color: '#ffca28' },

  // AI / ML
  { name: 'PyTorch', icon: <Brain className="w-5 h-5" />, category: 'AI / ML', color: '#ee4c2c' },
  { name: 'Scikit-learn', icon: <Brain className="w-5 h-5" />, category: 'AI / ML', color: '#f7931e' },
  { name: 'NumPy', icon: <Brain className="w-5 h-5" />, category: 'AI / ML', color: '#013243' },
  { name: 'Pandas', icon: <Brain className="w-5 h-5" />, category: 'AI / ML', color: '#150458' },
  { name: 'Reinforcement Learning', icon: <Brain className="w-5 h-5" />, category: 'AI / ML', color: '#ff6b35' },
  { name: 'Multi-Agent Systems', icon: <Brain className="w-5 h-5" />, category: 'AI / ML', color: '#4a90e2' },
  { name: 'Time-Series Forecasting', icon: <Brain className="w-5 h-5" />, category: 'AI / ML', color: '#9c27b0' },
  { name: 'Simulation-Based Optimization', icon: <Brain className="w-5 h-5" />, category: 'AI / ML', color: '#3f51b5' },

  // Databases
  { name: 'PostgreSQL', icon: <Database className="w-5 h-5" />, category: 'Databases', color: '#336791' },
  { name: 'MySQL', icon: <Database className="w-5 h-5" />, category: 'Databases', color: '#4479a1' },
  { name: 'MongoDB', icon: <Database className="w-5 h-5" />, category: 'Databases', color: '#47a248' },
  { name: 'Firebase Firestore', icon: <Database className="w-5 h-5" />, category: 'Databases', color: '#ffca28' },
  { name: 'Redis', icon: <Database className="w-5 h-5" />, category: 'Databases', color: '#dc382d' },

  // Cloud & DevOps
  { name: 'AWS', icon: <Cloud className="w-5 h-5" />, category: 'Cloud & DevOps', color: '#ff9900' },
  { name: 'Docker', icon: <Layers className="w-5 h-5" />, category: 'Cloud & DevOps', color: '#2496ed' },
  { name: 'GitHub Actions', icon: <GitBranch className="w-5 h-5" />, category: 'Cloud & DevOps', color: '#2088ff' },
  { name: 'Vercel', icon: <Cloud className="w-5 h-5" />, category: 'Cloud & DevOps', color: '#000000' },
  { name: 'GCP (Basics)', icon: <Cloud className="w-5 h-5" />, category: 'Cloud & DevOps', color: '#4285f4' },

  // Tools & Systems
  { name: 'Git & GitHub', icon: <GitBranch className="w-5 h-5" />, category: 'Tools & Systems', color: '#f05032' },
  { name: 'Linux (Ubuntu)', icon: <Server className="w-5 h-5" />, category: 'Tools & Systems', color: '#e95420' },
  { name: 'ROS 2', icon: <Cpu className="w-5 h-5" />, category: 'Tools & Systems', color: '#22314e' },
  { name: 'STM32 / ESP32', icon: <Cpu className="w-5 h-5" />, category: 'Tools & Systems', color: '#03234b' },
  { name: 'OpenCV', icon: <Wrench className="w-5 h-5" />, category: 'Tools & Systems', color: '#5c3ee8' },
  { name: 'Supabase', icon: <Database className="w-5 h-5" />, category: 'Tools & Systems', color: '#3ecf8e' },
];

const TechStackSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { stats: githubStats, loading: githubLoading } = useGitHubStats();

  // Map GitHub languages to tech stack items
  const enhancedTechStack = useMemo(() => {
    if (!githubStats?.languages) return techStackData;

    return techStackData.map(tech => {
      const githubLang = githubStats.languages.find(lang =>
        lang.name.toLowerCase().includes(tech.name.toLowerCase()) ||
        tech.name.toLowerCase().includes(lang.name.toLowerCase())
      );
      return {
        ...tech,
        githubUsage: githubLang?.percentage || 0,
      };
    }).sort((a, b) => (b.githubUsage || 0) - (a.githubUsage || 0));
  }, [githubStats]);

  const categories = Array.from(new Set(enhancedTechStack.map(tech => tech.category)));

  return (
    <section id="tech-stack" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {githubLoading ? 'Loading GitHub activity...' : 'Technologies I work with, prioritized by GitHub usage'}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h3 className="font-space font-semibold text-xl mb-6 text-center">
                {category}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {enhancedTechStack
                  .filter(tech => tech.category === category)
                  .map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: categoryIndex * 0.1 + index * 0.05,
                        type: "spring",
                        stiffness: 200
                      }}
                      className={`group relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
                        tech.githubUsage && tech.githubUsage > 10
                          ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/20'
                          : tech.githubUsage && tech.githubUsage > 5
                          ? 'bg-secondary/10 border-secondary/30 shadow-md shadow-secondary/10'
                          : 'bg-muted/20 border-white/10 hover:bg-muted/30'
                      }`}
                      style={{
                        boxShadow: tech.githubUsage && tech.githubUsage > 10
                          ? `0 0 20px ${tech.color}20`
                          : undefined
                      }}
                    >
                      {/* Icon */}
                      <div className="flex justify-center mb-3">
                        <div
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            tech.githubUsage && tech.githubUsage > 10
                              ? 'bg-primary/20 scale-110'
                              : 'bg-white/5 group-hover:bg-white/10'
                          }`}
                          style={{ color: tech.color }}
                        >
                          {tech.icon}
                        </div>
                      </div>

                      {/* Name */}
                      <div className="text-center">
                        <p className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {tech.name}
                        </p>
                        {tech.githubUsage && tech.githubUsage > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {tech.githubUsage.toFixed(1)}%
                          </p>
                        )}
                      </div>

                      {/* Glow effect for highly used tech */}
                      {tech.githubUsage && tech.githubUsage > 15 && (
                        <div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle, ${tech.color}15 0%, transparent 70%)`,
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
