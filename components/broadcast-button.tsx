import React from 'react';
import { motion } from 'framer-motion';

interface BroadcastButtonProps {
  isSessionActive: boolean;
  onClick: () => void;
}

export const BroadcastButton: React.FC<BroadcastButtonProps> = ({
  isSessionActive,
  onClick,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative px-8 py-4 rounded-full text-lg font-semibold
        ${isSessionActive 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
        }
        shadow-lg transform transition-all duration-200
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Ripple effect when active */}
      {isSessionActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ 
            opacity: 0,
            scale: 1.5,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
          style={{
            border: '2px solid rgba(239, 68, 68, 0.5)',
          }}
        />
      )}

      {/* Microphone icon with animation */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={isSessionActive ? {
            scale: [1, 1.2, 1],
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }
          } : {}}
        >
          {isSessionActive ? '🎤' : '🎙️'}
        </motion.div>

        <span>
          {isSessionActive ? 'Stop Talking' : 'Start Talking!'}
        </span>

        {/* Animated dots when active */}
        {isSessionActive && (
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-50 blur-md -z-10"
        animate={{
          background: isSessionActive
            ? ['rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.5)']
            : ['rgba(147, 51, 234, 0.5)', 'rgba(79, 70, 229, 0.3)', 'rgba(147, 51, 234, 0.5)']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}; 