import React from 'react';
import Lottie from 'react-lottie-player';
import { motion, AnimatePresence } from 'framer-motion';

interface CharacterAvatarProps {
  character: 'robot' | 'cat' | 'dinosaur' | 'bear' | 'meercat' | 'sheep';
  onClick?: () => void;
  isTalking?: boolean;
}

const characterEmojis = {
  robot: ['⚡', '🤖', '💫', '🔧', '✨', '🎮', '🔋', '💡'],
  cat: ['🎵', '🐱', '🎶', '💫', '✨', '🎸', '🌙', '🎭'],
  dinosaur: ['🦖', '🌿', '🌟', '🦕', '✨', '🌴', '🍃', '🦎'],
  bear: ['🍯', '🐻', '💝', '🌸', '✨', '🌺', '🍓', '❤️'],
  meercat: ['🌟', '🦦', '💫', '⭐', '✨', '🌞', '🌼', '🔆'],
  sheep: ['🌈', '🐑', '💫', '☁️', '✨', '🌥️', '💜', '🦋']
};

const characterColors = {
  robot: { primary: '#3B82F6', secondary: '#60A5FA', glow: '#2563EB' },
  cat: { primary: '#F97316', secondary: '#FB923C', glow: '#EA580C' },
  dinosaur: { primary: '#22C55E', secondary: '#4ADE80', glow: '#16A34A' },
  bear: { primary: '#F59E0B', secondary: '#FCD34D', glow: '#D97706' },
  meercat: { primary: '#EAB308', secondary: '#FDE047', glow: '#CA8A04' },
  sheep: { primary: '#A855F7', secondary: '#C084FC', glow: '#9333EA' }
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ 
  character, 
  onClick,
  isTalking = false
}) => {
  const [animation, setAnimation] = React.useState<Record<string, unknown> | null>(null);

  React.useEffect(() => {
    import(`@/public/animations/${character}.json`)
      .then((animationData) => {
        setAnimation(animationData.default);
      })
      .catch(console.error);
  }, [character]);

  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      animate={isTalking ? {
        scale: [1, 1.15, 1],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}}
    >
      {/* Character container with enhanced glow effect */}
      <motion.div 
        className="w-80 h-80 relative"
        animate={isTalking ? {
          filter: [
            `drop-shadow(0 0 40px ${characterColors[character].primary}99)`,
            `drop-shadow(0 0 60px ${characterColors[character].secondary}99)`,
            `drop-shadow(0 0 80px ${characterColors[character].glow}99)`,
            `drop-shadow(0 0 100px ${characterColors[character].primary}99)`,
            `drop-shadow(0 0 60px ${characterColors[character].secondary}99)`,
            `drop-shadow(0 0 40px ${characterColors[character].glow}99)`
          ],
        } : {}}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {animation && (
          <Lottie
            loop
            play
            animationData={animation}
            style={{ width: '100%', height: '100%' }}
          />
        )}

        {/* Floating emojis when talking */}
        <AnimatePresence>
          {isTalking && characterEmojis[character].map((emoji, index) => (
            <motion.div
              key={`${emoji}-${index}`}
              className="absolute pointer-events-none text-4xl"
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: '50%',
                y: '50%'
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.4, 0.5],
                x: [
                  '50%',
                  `${50 + Math.cos(index * Math.PI * 0.25) * 180}%`,
                  '50%'
                ],
                y: [
                  '50%',
                  `${50 + Math.sin(index * Math.PI * 0.25) * 180}%`,
                  '50%'
                ]
              }}
              transition={{
                duration: 4,
                delay: index * 0.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="text-center mt-4 text-2xl font-medium text-gray-700">
        {characterEmojis[character][1]} {/* Use the character's main emoji */}
      </p>
    </motion.div>
  );
}; 