import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactSiriwave from 'react-siriwave';

interface BroadcastButtonProps {
  isSessionActive: boolean;
  onClick: () => void;
  currentVolume?: number;
}

export const BroadcastButton: React.FC<BroadcastButtonProps> = ({
  isSessionActive,
  onClick,
  currentVolume = 0
}) => {
  const siriWaveConfig = {
    theme: "ios9" as const,
    ratio: 1.8,
    speed: isSessionActive ? (currentVolume > 0.01 ? currentVolume * 100 : 0.5) : 0,
    amplitude: isSessionActive ? (currentVolume > 0.01 ? currentVolume * 120 : 1) : 0,
    frequency: isSessionActive ? (currentVolume > 0.01 ? currentVolume * 90 : 1) : 0,
    color: isSessionActive ? '#3B82F6' : '#9E9E9E',
    cover: true,
    width: 320,
    height: 60,
    autostart: true,
    pixelDepth: 1.4,
    lerpSpeed: 0.1,
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Wave visualization */}
      <motion.div
        className="w-full flex justify-center items-center h-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isSessionActive ? 1 : 0,
          y: isSessionActive ? 0 : 10,
        }}
        transition={{ duration: 0.4 }}
      >
        <div className="-mb-2">
          <ReactSiriwave {...siriWaveConfig} />
        </div>
      </motion.div>

      {/* Button container */}
      <div className="flex flex-col items-center">
        {/* Main button */}
        <motion.button
          onClick={onClick}
          className={`
            flex items-center justify-center w-14 h-14 rounded-full 
            ${isSessionActive 
              ? 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30' 
              : 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30'
            }
            transition-all duration-300
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isSessionActive ? (
              <motion.div
                key="stop"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <MicOff className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="start"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <Mic className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Status text */}
        <motion.div
          className="mt-1.5"
          initial={{ opacity: 0, y: 5 }}
          animate={{ 
            opacity: 0.7, 
            y: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
        >
          <span className={`text-xs font-medium ${
            isSessionActive ? 'text-rose-500/70' : 'text-blue-500/70'
          }`}>
            {isSessionActive ? 'Recording' : 'Ready'}
          </span>
        </motion.div>
      </div>
    </div>
  );
}; 