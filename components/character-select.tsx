import React from 'react';
import { CharacterAvatar } from './character-avatar';
import { motion, AnimatePresence } from 'framer-motion';

type Character = 'robot' | 'cat' | 'dinosaur' | 'bear' | 'meercat' | 'sheep';

const characters: Character[] = ['robot', 'cat', 'dinosaur', 'bear', 'meercat', 'sheep'];

const characterInfo = {
  robot: {
    name: 'Robo',
    description: 'A friendly helper robot who loves to learn and play! 🤖',
    color: 'text-blue-600'
  },
  cat: {
    name: 'Kitty',
    description: 'A playful kitty who loves to purr and tell stories! 😺',
    color: 'text-orange-500'
  },
  dinosaur: {
    name: 'Dino',
    description: 'A gentle dinosaur who loves making new friends! 🦖',
    color: 'text-green-600'
  },
  bear: {
    name: 'Berry',
    description: 'A cuddly bear who loves honey and giving hugs! 🐻',
    color: 'text-amber-700'
  },
  meercat: {
    name: 'Milo',
    description: 'A curious meerkat who loves to explore and discover! 🦦',
    color: 'text-yellow-600'
  },
  sheep: {
    name: 'Wooley',
    description: 'A fluffy sheep who loves to bounce and giggle! 🐑',
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
    <div className="w-full">
      <motion.h2 
        className="text-2xl font-bold text-center mb-6 text-purple-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Choose Your Friend!
      </motion.h2>

      <div className="flex items-center justify-center gap-8">
        {/* Previous Button */}
        <motion.button
          onClick={goToPrevious}
          className="text-4xl bg-white/80 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>

        {/* Character Display */}
        <div className="relative flex-1 max-w-md">
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
                className="text-center mt-4"
              >
                <h3 className={`text-2xl font-bold mb-2 ${characterInfo[value].color}`}>
                  {characterInfo[value].name}
                </h3>
                <p className="text-gray-600 text-lg">
                  {characterInfo[value].description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={goToNext}
          className="text-4xl bg-white/80 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </div>

      {/* Character Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {characters.map((char) => (
          <motion.button
            key={char}
            onClick={() => onValueChange(char)}
            className={`w-3 h-3 rounded-full ${
              value === char ? characterInfo[char].color.replace('text-', 'bg-') : 'bg-gray-300'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}; 