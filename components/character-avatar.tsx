import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player';

type Character = 'robot' | 'cat' | 'dinosaur' | 'bear' | 'meerkat' | 'sheep';

interface CharacterAvatarProps {
  character: Character;
  onClick?: () => void;
  isTalking?: boolean;
}

const characterEmojis: Record<Character, string[]> = {
  robot: ['🤖', '⚡', '💫', '🔧', '💭'],
  cat: ['😺', '🐱', '🐟', '🧶', '💕'],
  dinosaur: ['🦖', '🦕', '🌿', '🍖', '🦴'],
  bear: ['🐻', '🍯', '🌲', '🐝', '🍎'],
  meerkat: ['🦦', '🌞', '🌵', '🪲', '👀'],
  sheep: ['🐑', '🌾', '🌸', '☁️', '🌿']
};

const characterDelays: Record<Character, number> = {
  robot: 0.6,    // Mechanical, more precise timing
  cat: 0.8,      // Playful, varied timing
  dinosaur: 0.7, // Strong, impactful timing
  bear: 0.9,     // Slow, gentle timing
  meerkat: 0.5,  // Quick, alert timing
  sheep: 1.0     // Relaxed, slowest timing
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  onClick,
  isTalking = false
}) => {
  const [animation, setAnimation] = useState<Record<string, unknown> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const emojiKeyRef = useRef<string>(`${character}-${Date.now()}`);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number[]>([]);

  useEffect(() => {
    const loadAnimation = async () => {
      const animationData = await import(`@/public/animations/${character}.json`);
      setAnimation(animationData.default);
    };
    loadAnimation();
  }, [character]);

  // Update emoji key and animation offsets when character changes
  useEffect(() => {
    emojiKeyRef.current = `${character}-${Date.now()}`;
    // Generate random offsets for more natural animation
    animationRef.current = Array(characterEmojis[character].length)
      .fill(0)
      .map(() => Math.random() * Math.PI * 2);
  }, [character]);

  // Handle visibility with debounce
  useEffect(() => {
    if (isTalking) {
      setIsVisible(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isTalking]);

  const currentEmojis = characterEmojis[character];
  const baseDelay = characterDelays[character];

  return (
    <div className="relative w-full aspect-square h-[280px] md:h-[400px]">
      <motion.div
        className={`w-full h-full cursor-pointer ${isTalking ? 'animate-glow' : ''}`}
        onClick={onClick}
        animate={isTalking ? {
          scale: [1, 1.1, 0.95, 1.05, 1],
          rotate: [-1, 1, -1],
          transition: {
            scale: {
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 0.5,
              repeat: Infinity,
              ease: "linear"
            }
          }
        } : {}}
      >
        {animation && (
          <div className="w-full h-full">
            <Lottie
              loop
              play
              animationData={animation}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        )}
      </motion.div>
      
      <div className="absolute inset-0 pointer-events-none">
        {currentEmojis.map((emoji, index) => {
          const offset = animationRef.current[index] || 0;
          return (
            <motion.div
              key={`${emoji}-${index}-${emojiKeyRef.current}`}
              className="absolute text-2xl md:text-4xl filter drop-shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? {
                opacity: [0, 1, 1, 1, 0],
                scale: [0.5, 1.4, 1.4, 1.4, 0.5],
                x: [
                  -20 + Math.sin(index * 72 + offset) * 40,
                  -10 + Math.sin(index * 72 + offset) * 50,
                  -10 + Math.sin(index * 72 + offset) * 50,
                  -10 + Math.sin(index * 72 + offset) * 50,
                  -20 + Math.sin(index * 72 + offset) * 40
                ],
                y: [
                  -40 - Math.cos(index * 72 + offset) * 40,
                  -50 - Math.cos(index * 72 + offset) * 50,
                  -50 - Math.cos(index * 72 + offset) * 50,
                  -50 - Math.cos(index * 72 + offset) * 50,
                  -40 - Math.cos(index * 72 + offset) * 40
                ]
              } : {
                opacity: 0,
                scale: 0,
                x: -20 + Math.sin(index * 72 + offset) * 40,
                y: -40 - Math.cos(index * 72 + offset) * 40
              }}
              transition={{
                duration: 4,
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                delay: index * baseDelay,
                ease: "easeInOut",
                repeatDelay: 1
              }}
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))',
                WebkitFilter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))'
              }}
            >
              {emoji}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}; 