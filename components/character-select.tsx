import React from 'react';
import { CharacterAvatar } from './character-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Cat, Sparkles, Squirrel, Dog, Cloud } from 'lucide-react';

type Character = 'robot' | 'cat' | 'dinosaur' | 'bear' | 'meerkat' | 'sheep';

const characters: Character[] = ['robot', 'cat', 'dinosaur', 'bear', 'meerkat', 'sheep'];

const characterIcons = {
  robot: Bot,
  cat: Cat,
  dinosaur: Sparkles,
  bear: Squirrel,
  meerkat: Dog,
  sheep: Cloud
};

export const characterBubbleStyles = {
  robot: {
    bg: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    text: 'text-cyan-900',
  },
  cat: {
    bg: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    text: 'text-amber-900',
  },
  dinosaur: {
    bg: 'bg-gradient-to-br from-emerald-100 to-green-100',
    text: 'text-emerald-900',
  },
  bear: {
    bg: 'bg-gradient-to-br from-rose-100 to-pink-100',
    text: 'text-rose-900',
  },
  meerkat: {
    bg: 'bg-gradient-to-br from-orange-100 to-amber-100',
    text: 'text-orange-900',
  },
  sheep: {
    bg: 'bg-gradient-to-br from-purple-100 to-violet-100',
    text: 'text-purple-900',
  }
} as const;

const characterInfo = {
  robot: {
    name: 'Robo',
    description: 'A friendly helper robot who loves to learn and play!',
    color: 'text-blue-600'
  },
  cat: {
    name: 'Kitty',
    description: 'A playful kitty who loves to purr and tell stories!',
    color: 'text-orange-500'
  },
  dinosaur: {
    name: 'Dino',
    description: 'A gentle dinosaur who loves making new friends!',
    color: 'text-green-600'
  },
  bear: {
    name: 'Berry',
    description: 'A cuddly bear who loves honey and giving hugs!',
    color: 'text-amber-700'
  },
  meerkat: {
    name: 'Milo',
    description: 'A curious meerkat who loves to explore and discover!',
    color: 'text-yellow-600'
  },
  sheep: {
    name: 'Wooley',
    description: 'A fluffy sheep who loves to bounce and giggle!',
    color: 'text-purple-500'
  }
};

interface CharacterSelectProps {
  value: Character;
  onValueChange: (value: Character) => void;
  isTalking?: boolean;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ 
  value, 
  onValueChange,
  isTalking = false
}) => {
  const currentIndex = characters.indexOf(value);

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % characters.length;
    onValueChange(characters[nextIndex]);
  };

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + characters.length) % characters.length;
    onValueChange(characters[prevIndex]);
  };

  return (
    <div className="w-full px-4 md:px-0">
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {/* Previous Button */}
        <motion.button
          onClick={goToPrevious}
          className="text-2xl md:text-4xl bg-white/80 hover:bg-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>

        {/* Character Display */}
        <div className="relative flex-1 max-w-[280px] md:max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center"
            >
              <CharacterAvatar
                character={value}
                isTalking={isTalking}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-2 md:mt-4"
              >
                <h3 className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 ${characterInfo[value].color}`}>
                  {characterInfo[value].name}
                </h3>
                <p className="text-gray-600 text-base md:text-lg px-2">
                  {characterInfo[value].description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={goToNext}
          className="text-2xl md:text-4xl bg-white/80 hover:bg-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </div>

      {/* Character Icons */}
      <div className="flex justify-center gap-2 md:gap-3 mt-4 md:mt-6">
        {characters.map((char) => {
          const Icon = characterIcons[char];
          return (
            <motion.button
              key={char}
              onClick={() => onValueChange(char)}
              className={`
                p-1.5 rounded-full 
                shadow-sm transition-all duration-200
                ${value === char 
                  ? `${characterBubbleStyles[char].bg} shadow-lg ring-2 ring-offset-2 ring-offset-white ${characterBubbleStyles[char].text.replace('text-', 'ring-')} scale-125` 
                  : `${characterBubbleStyles[char].bg} opacity-60 hover:opacity-80`
                }
              `}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon 
                className={`
                  ${value === char ? 'w-4 h-4 md:w-5 md:h-5' : 'w-3 h-3 md:w-4 md:h-4'} 
                  ${characterBubbleStyles[char].text}
                `}
                strokeWidth={2.5}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}; 