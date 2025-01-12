import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusPopupProps {
  status: string;
  isVisible: boolean;
}

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { emoji: string; color: string; loadingEmojis: string[]; }> = {
    'Requesting microphone access...': {
      emoji: '🎤',
      color: 'bg-blue-500',
      loadingEmojis: ['🎵', '🎶', '🎼']
    },
    'Fetching ephemeral token...': {
      emoji: '🔑',
      color: 'bg-purple-500',
      loadingEmojis: ['💫', '✨', '⭐']
    },
    'Establishing connection...': {
      emoji: '🌟',
      color: 'bg-yellow-500',
      loadingEmojis: ['🌈', '☁️', '✨']
    },
    'Session established successfully!': {
      emoji: '✨',
      color: 'bg-green-500',
      loadingEmojis: ['🎉', '🎊', '🌟']
    },
    'Session stopped': {
      emoji: '👋',
      color: 'bg-gray-500',
      loadingEmojis: ['✌️', '💫', '👋']
    }
  };

  return statusMap[status] || { 
    emoji: '💭', 
    color: 'bg-blue-500',
    loadingEmojis: ['✨', '💫', '⭐']
  };
};

export const StatusPopup: React.FC<StatusPopupProps> = ({ status, isVisible }) => {
  const { emoji, color, loadingEmojis } = getStatusInfo(status);

  return (
    <AnimatePresence>
      {isVisible && status && (
        <motion.div
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={`
              ${color} text-white px-6 py-3 rounded-full
              shadow-lg flex items-center gap-3
              border-2 border-white relative
            `}
            animate={{
              scale: [1, 1.03, 1],
              rotate: [-0.5, 0.5, -0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Background Sparkles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute text-white/30 text-sm"
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: '100%',
                    scale: 0
                  }}
                  animate={{ 
                    y: '0%',
                    scale: [0.5, 1, 0.5],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>

            {/* Main Emoji */}
            <motion.div
              className="relative"
              animate={{ 
                rotate: [-10, 10, -10],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-2xl">{emoji}</span>
              <motion.div
                className="absolute -top-1 -right-1 text-sm"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                ✨
              </motion.div>
            </motion.div>

            {/* Status Text */}
            <span className="text-lg font-medium whitespace-nowrap">
              {status}
            </span>

            {/* Loading Animation */}
            {!status.includes('successfully') && !status.includes('stopped') && (
              <div className="flex items-center">
                {loadingEmojis.map((loadingEmoji, i) => (
                  <motion.span
                    key={i}
                    className="text-sm"
                    animate={{
                      y: [-3, 0, -3],
                      opacity: [0.5, 1, 0.5],
                      scale: [0.9, 1.1, 0.9]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    {loadingEmoji}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Success Animation */}
            {status.includes('successfully') && (
              <div className="relative">
                <motion.div
                  className="absolute top-0 left-0"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-sm"
                      style={{
                        transform: `rotate(${i * 60}deg) translate(12px)`
                      }}
                    >
                      ✨
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 