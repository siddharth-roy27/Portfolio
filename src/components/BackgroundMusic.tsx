import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synthwave ambient music URL (royalty-free)
  const musicUrl = 'https://cdn.pixabay.com/audio/2022/10/25/audio_4f3b0a816e.mp3';

  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.15;
    audio.preload = 'auto';
    
    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('loadeddata', handleCanPlay);
    
    // Fallback: show button after 2 seconds regardless
    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    audioRef.current = audio;

    return () => {
      clearTimeout(fallbackTimer);
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('loadeddata', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    // Hide pulse after 5 seconds
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Attention pulse ring */}
      {showPulse && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ 
            scale: [1, 1.8, 1.8],
            opacity: [0.6, 0, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeOut"
          }}
        />
      )}
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMute}
        className="relative p-4 rounded-full bg-card/80 backdrop-blur-xl border-2 border-primary/40 hover:border-primary shadow-lg shadow-primary/20 transition-all group"
        aria-label={isMuted ? 'Play music' : 'Mute music'}
      >
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.div
              key="muted"
              initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Music className="w-5 h-5 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Volume2 className="w-5 h-5 text-primary" />
              {/* Equalizer bars animation */}
              <div className="absolute -top-1 -right-1 flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-primary rounded-full"
                    animate={{
                      height: [4, 8, 4, 6, 4],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glow effect when playing */}
        {!isMuted && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10"
            animate={{ 
              boxShadow: [
                '0 0 10px hsl(var(--primary) / 0.3)',
                '0 0 30px hsl(var(--primary) / 0.5)',
                '0 0 10px hsl(var(--primary) / 0.3)',
              ]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>
    </motion.div>
  );
};

export default BackgroundMusic;