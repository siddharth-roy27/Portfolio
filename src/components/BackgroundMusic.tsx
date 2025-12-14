import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Tron-like ECE/Synthwave ambient music (royalty-free)
  // Using multiple fallback URLs for reliability
  const musicUrls = [
    'https://cdn.pixabay.com/audio/2022/10/25/audio_4f3b0a816e.mp3', // Synthwave ambient
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Fallback 1
    'https://archive.org/download/SynthwaveAmbientLoop/SynthwaveAmbientLoop.mp3', // Fallback 2
  ];

  useEffect(() => {
    // Try to load audio with fallbacks
    let currentUrlIndex = 0;
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.2;
    audio.preload = 'auto';
    
    const tryLoadAudio = (index: number) => {
      if (index >= musicUrls.length) {
        console.warn('All audio URLs failed to load');
        setIsLoaded(true);
        return;
      }
      
      audio.src = musicUrls[index];
      
      const handleCanPlay = () => {
        setIsLoaded(true);
        audioRef.current = audio;
      };

      const handleError = () => {
        console.warn(`Audio URL ${index} failed, trying next...`);
        tryLoadAudio(index + 1);
      };

      audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
      audio.addEventListener('loadeddata', handleCanPlay, { once: true });
      audio.addEventListener('error', handleError, { once: true });
      
      // Try to load
      audio.load();
    };

    tryLoadAudio(0);
    
    // Fallback: show button after 3 seconds regardless
    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      audio.pause();
      audio.src = '';
      audio.removeEventListener('canplaythrough', () => {});
      audio.removeEventListener('loadeddata', () => {});
      audio.removeEventListener('error', () => {});
    };
  }, []);

  useEffect(() => {
    // Hide pulse after 5 seconds
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = async () => {
    if (!audioRef.current) {
      // If audio not loaded, try to create it now with fallbacks
      let audio: HTMLAudioElement | null = null;
      for (const url of musicUrls) {
        try {
          audio = new Audio(url);
          audio.loop = true;
          audio.volume = 0.2;
          audio.preload = 'auto';
          // Test if this URL works
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 2000);
            audio!.addEventListener('canplay', () => {
              clearTimeout(timeout);
              resolve(true);
            }, { once: true });
            audio!.addEventListener('error', () => {
              clearTimeout(timeout);
              reject(new Error('Load failed'));
            }, { once: true });
            audio!.load();
          });
          audioRef.current = audio;
          break;
        } catch (e) {
          console.warn(`Failed to load ${url}, trying next...`);
          if (audio) {
            audio.src = '';
          }
        }
      }
      
      if (!audioRef.current) {
        console.error('All music URLs failed to load');
        return;
      }
    }

    if (audioRef.current) {
      try {
        if (isMuted) {
          // Ensure audio is loaded before playing
          if (audioRef.current.readyState < 2) {
            await new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error('Audio load timeout'));
              }, 5000);
              
              const handleCanPlay = () => {
                clearTimeout(timeout);
                audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
                audioRef.current?.removeEventListener('error', handleError);
                resolve();
              };
              
              const handleError = (e: Event) => {
                clearTimeout(timeout);
                audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
                audioRef.current?.removeEventListener('error', handleError);
                reject(new Error('Audio failed to load'));
              };
              
              audioRef.current.addEventListener('canplaythrough', handleCanPlay);
              audioRef.current.addEventListener('error', handleError);
              audioRef.current.load();
            });
          }
          await audioRef.current.play();
          setIsMuted(false);
        } else {
          audioRef.current.pause();
          setIsMuted(true);
        }
      } catch (error) {
        console.error('Error toggling audio:', error);
        // If autoplay is blocked, the user interaction should have already happened
        // so this shouldn't be an issue, but handle it gracefully
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            console.warn('Autoplay blocked - user interaction required');
          }
        }
      }
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