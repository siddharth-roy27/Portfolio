import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink, Code2, Cpu, Layers, Zap, Globe } from 'lucide-react';
import { useDomain } from '@/contexts/DomainContext';
import { Button } from '@/components/ui/button';

interface Project {
  title: string;
  subtitle?: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  icon: React.ReactNode;
  highlights: string[];
}

const softwareProjects: Project[] = [
  {
    title: 'Portfolio Website',
    subtitle: 'Modern Full-Stack Portfolio',
    description: 'A stunning, responsive portfolio website built with React and Vite, featuring real-time competitive programming stats, animated UI, and seamless user experience.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Framer Motion', 'shadcn-ui'],
    github: 'https://github.com/siddharth-roy27/Portfolio',
    live: 'https://siddharth-roy-portfolio.com',
    icon: <Globe className="w-6 h-6" />,
    highlights: [
      'Real-time coding stats integration',
      'Animated particle background',
      'Responsive design',
    ],
  },
  {
    title: 'Multi-threaded Reverse Proxy Server',
    description: 'High-performance reverse proxy handling 5,000+ concurrent connections with epoll-based I/O, custom thread pool, and asynchronous logging.',
    tech: ['C++', 'epoll', 'Thread Pool', 'HTTP Parsing', 'Load Balancing', 'LRU Cache'],
    github: 'https://github.com/siddharth-roy27/reverse-proxy',
    icon: <Layers className="w-6 h-6" />,
    highlights: [
      'epoll-based async I/O',
      'Round-Robin & Least-Connections LB',
      'Nginx-inspired architecture',
    ],
  },
  {
    title: 'NoteForge-AI',
    subtitle: 'AI-Enhanced Notion-Style Notes App',
    description: 'Full-stack SaaS notes platform with AI assistance, enabling 100+ concurrent users with 50% faster note creation via AI summarization.',
    tech: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Prisma', 'OpenAI API', 'WebSockets', 'Stripe'],
    github: 'https://github.com/siddharth-roy27/NoteForge-AI',
    icon: <Code2 className="w-6 h-6" />,
    highlights: [
      'Real-time WebSocket sync',
      'Stripe subscriptions',
      'AI-powered summarization',
    ],
  },
  {
    title: 'Distributed Key-Value Store',
    subtitle: 'Raft-Based Consensus',
    description: 'Fault-tolerant distributed KV store with 3–5 node clusters, ensuring 100% data consistency using Raft consensus and leader election.',
    tech: ['Go', 'gRPC', 'Protobuf', 'Raft Consensus', 'WAL Storage'],
    github: 'https://github.com/siddharth-roy27/Distributed-kv-store',
    icon: <Zap className="w-6 h-6" />,
    highlights: [
      'Leader election & log replication',
      'gRPC/Protobuf communication',
      'Write-ahead logging',
    ],
  },
];

const eceProjects: Project[] = [
  {
    title: 'VEGA',
    subtitle: 'Vehicle Embedded Generalized Architecture',
    description: 'Modular automotive embedded platform using STM32F407 and ESP32 for real-time BLDC motor control, multi-sensor fusion, and CAN bus networking.',
    tech: ['STM32F407', 'ESP32', 'FreeRTOS', 'CAN Bus', 'PID Control', 'PCB Design'],
    icon: <Cpu className="w-6 h-6" />,
    highlights: [
      'Real-time BLDC motor control',
      'Custom CAN protocols',
      'Robust EV architecture',
    ],
  },
  {
    title: 'MAVERICK',
    subtitle: 'Modular Aerospace Flight Controller',
    description: 'Full-scale flight control system for rockets and UAVs using STM32H7 + ESP32-S3, with redundant IMUs, GNSS, and telemetry systems.',
    tech: ['STM32H7', 'ESP32-S3', 'LoRa', 'IMU Fusion', 'Pyro Ignition', 'Telemetry'],
    icon: <Zap className="w-6 h-6" />,
    highlights: [
      'Redundant sensor fusion',
      'LoRa + WiFi/BLE telemetry',
      'Autonomous flight operations',
    ],
  },
  {
    title: 'Combat Robot',
    subtitle: '7kg Robo War - 2nd Place',
    description: 'Designed and built a combat robot for Ojass 2025, achieving 2nd place in the 7kg category with advanced motor control and weapon systems.',
    tech: ['Arduino', 'BLDC Motors', 'LiPo Batteries', 'Combat Mechanics', 'Radio Control'],
    icon: <Layers className="w-6 h-6" />,
    highlights: [
      'Ojass 2025 - 2nd Place',
      'Advanced weapon systems',
      'Real-time control',
    ],
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { domain } = useDomain();

  const projects = domain === 'software' ? softwareProjects : eceProjects;

  return (
    <section id="projects" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {domain === 'software' 
              ? 'Building high-performance systems and full-stack applications'
              : 'Designing embedded systems and autonomous robotics solutions'
            }
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 md:p-8 interactive-hover group"
            >
              {/* Icon */}
              <div className={`p-3 rounded-xl w-fit mb-6 ${
                domain === 'software' 
                  ? 'bg-primary/10 border border-primary/20 text-primary' 
                  : 'bg-secondary/10 border border-secondary/20 text-secondary'
              }`}>
                {project.icon}
              </div>

              {/* Title */}
              <h3 className="project-title mb-1 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="project-meta mb-4">{project.subtitle}</p>
              )}

              {/* Description */}
              <p className="body-text text-sm mb-6 line-clamp-3">
                {project.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2 mb-6">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      domain === 'software' ? 'bg-primary' : 'bg-secondary'
                    }`} />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs font-mono rounded-md bg-muted/50 text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="px-2 py-1 text-xs font-mono rounded-md bg-muted/50 text-muted-foreground">
                    +{project.tech.length - 4}
                  </span>
                )}
              </div>

              {/* Links */}
              {project.github && (
                <div className="flex gap-3">
                  <Button variant="neon" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  </Button>
                  {project.live && (
                    <Button variant="glass" size="sm" asChild>
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
