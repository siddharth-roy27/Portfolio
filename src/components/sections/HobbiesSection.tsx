import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Target, Film, Camera, BookOpen, X } from 'lucide-react';

interface Hobby {
  id: string;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  color: string;
  bgGradient: string;
  images: string[];
}

const hobbies: Hobby[] = [
  {
    id: 'shooting',
    icon: <Target className="w-8 h-8" />,
    title: 'Shooting Sports',
    tagline: 'I shoot only 10x',
    description: 'Precision air rifle shooting with focus on achieving perfect scores. The discipline, concentration, and mental fortitude required in shooting sports have shaped my approach to problem-solving.',
    color: 'primary',
    bgGradient: 'from-primary/20 to-primary/5',
    images: [
      'https://images.unsplash.com/photo-1584281722662-88d02a0e4f15?w=800',
      'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800',
    ],
  },
  {
    id: 'filmmaking',
    icon: <Film className="w-8 h-8" />,
    title: 'Filmmaking',
    tagline: 'I am basically Christopher Nolan',
    description: 'Creating cinematic experiences through visual storytelling. From concept to color grading, every frame is crafted with intention to evoke emotion and tell compelling narratives.',
    color: 'secondary',
    bgGradient: 'from-secondary/20 to-secondary/5',
    images: [
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    ],
  },
  {
    id: 'photography',
    icon: <Camera className="w-8 h-8" />,
    title: 'Photography',
    tagline: 'The most cinematic pictures are taken by my eyes',
    description: 'Capturing moments with a cinematic eye. As VP of Team Phocus, I lead photography initiatives and mentor aspiring photographers in visual composition and storytelling.',
    color: 'accent',
    bgGradient: 'from-accent/20 to-accent/5',
    images: [
      'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    ],
  },
  {
    id: 'storytelling',
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Storytelling',
    tagline: "I don't tell tales, I take you to them",
    description: 'Weaving narratives that transport audiences to different worlds. Whether through code, film, or words, every creation is a story waiting to be experienced.',
    color: 'neon-purple',
    bgGradient: 'from-neon-purple/20 to-neon-purple/5',
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800',
    ],
  },
];

const HobbiesSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="hobbies" className="py-24 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-4">Beyond Code</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            The passions that fuel my creativity and shape my perspective
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.15,
                type: 'spring',
                stiffness: 200
              }}
              viewport={{ once: true }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                {expandedId === hobby.id ? (
                  <motion.div
                    key="expanded"
                    layoutId={`hobby-${hobby.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                    onClick={() => setExpandedId(null)}
                  >
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/90 backdrop-blur-xl"
                    />
                    
                    {/* Expanded Card */}
                    <motion.div
                      initial={{ scale: 0.8, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.8, y: 50 }}
                      transition={{ type: 'spring', damping: 25 }}
                      onClick={(e) => e.stopPropagation()}
                      className={`relative w-full max-w-3xl glass-card p-8 rounded-3xl border border-${hobby.color}/30 bg-gradient-to-br ${hobby.bgGradient}`}
                    >
                      <button
                        onClick={() => setExpandedId(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                          <motion.div 
                            className={`text-${hobby.color} mb-4`}
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            {hobby.icon}
                          </motion.div>
                          <h3 className="font-space text-3xl font-bold text-foreground mb-2">
                            {hobby.title}
                          </h3>
                          <p className={`text-${hobby.color} font-space text-lg italic mb-4`}>
                            "{hobby.tagline}"
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            {hobby.description}
                          </p>
                        </div>

                        {/* Image Gallery */}
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          {hobby.images.map((img, imgIndex) => (
                            <motion.div
                              key={imgIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + imgIndex * 0.1 }}
                              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                              onClick={() => setSelectedImage(img)}
                            >
                              <img
                                src={img}
                                alt={hobby.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className={`absolute inset-0 bg-${hobby.color}/0 group-hover:bg-${hobby.color}/20 transition-colors`} />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <motion.div
                        className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-${hobby.color}/10 blur-3xl`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                      />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="collapsed"
                    layoutId={`hobby-${hobby.id}`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setExpandedId(hobby.id)}
                    className="group relative"
                  >
                    {/* Orbiting ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full border-2 border-dashed border-${hobby.color}/30`}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                      style={{ scale: 1.5 }}
                    />
                    
                    {/* Main icon container */}
                    <motion.div
                      className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full glass-card flex items-center justify-center border-2 border-${hobby.color}/40 bg-gradient-to-br ${hobby.bgGradient} cursor-pointer overflow-hidden`}
                      whileHover={{
                        boxShadow: `0 0 40px hsl(var(--${hobby.color}) / 0.4)`,
                      }}
                    >
                      <motion.div
                        className={`text-${hobby.color}`}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {hobby.icon}
                      </motion.div>

                      {/* Ripple effect on hover */}
                      <motion.div
                        className={`absolute inset-0 rounded-full border-2 border-${hobby.color}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ 
                          scale: [0.8, 1.5], 
                          opacity: [0.5, 0],
                        }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    </motion.div>

                    {/* Title label */}
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: -10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      <span className={`text-sm font-space font-medium text-${hobby.color}`}>
                        {hobby.title}
                      </span>
                    </motion.div>

                    {/* Particle effects */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1 h-1 rounded-full bg-${hobby.color}`}
                        animate={{
                          x: [0, (i - 1) * 30],
                          y: [0, -20 - i * 10],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: i * 0.3,
                        }}
                        style={{ 
                          left: '50%',
                          top: '50%',
                        }}
                      />
                    ))}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Instruction text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground/60 text-sm mt-16"
        >
          Click on an icon to explore
        </motion.p>
      </div>

      {/* Full image lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HobbiesSection;