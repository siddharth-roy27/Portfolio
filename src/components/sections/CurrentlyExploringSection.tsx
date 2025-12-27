import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Zap, Server, Cpu } from 'lucide-react';

interface ExploringItem {
  name: string;
  icon: React.ReactNode;
  description: string;
  progress: number; // 0-100 for progress indication
  color: string;
}

const exploringItems: ExploringItem[] = [
  {
    name: 'LLMs (Inference, RAG, Systems)',
    icon: <Brain className="w-5 h-5" />,
    description: 'Exploring large language models, retrieval-augmented generation, and LLM system architectures',
    progress: 75,
    color: '#8b5cf6',
  },
  {
    name: 'Reinforcement Learning (Policy Optimization, Safety)',
    icon: <Zap className="w-5 h-5" />,
    description: 'Deep diving into advanced RL algorithms, safety constraints, and multi-agent policy optimization',
    progress: 60,
    color: '#f59e0b',
  },
  {
    name: 'Infrastructure & Distributed Systems',
    icon: <Server className="w-5 h-5" />,
    description: 'Building scalable distributed systems, microservices, and cloud-native architectures',
    progress: 45,
    color: '#10b981',
  },
];

const CurrentlyExploringSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="currently-exploring" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Currently <span className="gradient-text">Exploring</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Technologies and concepts I'm actively learning and researching
          </p>
        </motion.div>

        {/* Exploring Items */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {exploringItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className="group relative"
            >
              {/* Floating Animation Container */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Main Badge */}
                <div
                  className="glass-card p-6 md:p-8 cursor-pointer group-hover:scale-105 transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                    border: `1px solid rgba(255,255,255,0.1)`,
                  }}
                >
                  {/* Pulsing Glow Background */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `radial-gradient(circle, ${item.color}20 0%, transparent 70%)`,
                    }}
                  />

                  {/* Gradient Border */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${item.color}40, transparent, ${item.color}40)`,
                      padding: '1px',
                    }}
                  >
                    <div className="w-full h-full bg-background/80 backdrop-blur-sm rounded-xl" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          delay: index * 0.8,
                        }}
                        className="p-3 rounded-full"
                        style={{
                          background: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="font-space font-semibold text-lg mb-3 text-center group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 text-center leading-relaxed">
                      {item.description}
                    </p>

                    {/* Progress Indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Exploration Progress</span>
                        <span className="font-mono font-medium" style={{ color: item.color }}>
                          {item.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${item.progress}%` } : {}}
                          transition={{
                            duration: 1.5,
                            delay: index * 0.2 + 0.5,
                            ease: "easeOut"
                          }}
                          className="h-full rounded-full relative overflow-hidden"
                          style={{
                            background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                          }}
                        >
                          {/* Animated shine effect */}
                          <motion.div
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5,
                              ease: "easeInOut",
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Collapse Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12 md:hidden"
        >
          <p className="text-xs text-muted-foreground">
            Tap badges to explore current learning focus
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentlyExploringSection;
