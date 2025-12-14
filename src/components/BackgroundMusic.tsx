import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synthwave ambient music URL (royalty-free)
  const musicUrl = 'https://cdn.pixabay.com/audio/2022/10/25/audio_4f3b0a816e.mp3';

  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.15;
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
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

  if (!isLoaded) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full glass-card border border-primary/30 hover:border-primary/50 transition-all group"
      aria-label={isMuted ? 'Play music' : 'Mute music'}
    >
      <AnimatePresence mode="wait">
        {isMuted ? (
          <motion.div
            key="muted"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            key="playing"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Volume2 className="w-5 h-5 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sound wave animation when playing */}
      {!isMuted && (
        <motion.div
          className="absolute -inset-1 rounded-full border border-primary/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.button>
  );
};

export default BackgroundMusic;
