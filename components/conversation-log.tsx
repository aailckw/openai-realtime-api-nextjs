import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  character: 'robot' | 'cat' | 'dinosaur' | 'bear' | 'meerkat' | 'sheep';
}

interface ConversationLogProps {
  messages: Message[];
  character: 'robot' | 'cat' | 'dinosaur' | 'bear' | 'meerkat' | 'sheep';
}

const characterBubbleStyles = {
  robot: {
    bg: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    text: 'text-cyan-900'
  },
  cat: {
    bg: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    text: 'text-amber-900'
  },
  dinosaur: {
    bg: 'bg-gradient-to-br from-emerald-100 to-green-100',
    text: 'text-emerald-900'
  },
  bear: {
    bg: 'bg-gradient-to-br from-rose-100 to-pink-100',
    text: 'text-rose-900'
  },
  meerkat: {
    bg: 'bg-gradient-to-br from-orange-100 to-amber-100',
    text: 'text-orange-900'
  },
  sheep: {
    bg: 'bg-gradient-to-br from-purple-100 to-violet-100',
    text: 'text-purple-900'
  }
} as const;

const characterEmojis = {
  robot: '🤖',
  cat: '😺',
  dinosaur: '🦖',
  bear: '🐻',
  meerkat: '🦦',
  sheep: '🐑'
} as const;

export const ConversationLog: React.FC<ConversationLogProps> = ({ messages, character }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-[500px] bg-white/95 rounded-2xl shadow-lg p-2 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10 select-none"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {characterEmojis[character]}
          </div>
        ))}
      </div>

      <div 
        ref={scrollRef}
        className="w-full h-full overflow-y-auto rounded-xl p-4 relative z-10"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#E2E8F0 transparent'
        }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`
                  max-w-[85%] rounded-2xl px-6 py-3
                  ${message.isUser 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' 
                    : `${characterBubbleStyles[character].bg} ${characterBubbleStyles[character].text}`
                  }
                  shadow-lg relative
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {message.isUser ? '👤' : characterEmojis[character]}
                  </span>
                  <span className="text-xs font-medium opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-medium leading-relaxed relative z-10"
                >
                  {message.text}
                </motion.p>

                {!message.isUser && (
                  <motion.div 
                    className="flex gap-2 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-base opacity-75"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [-5, 5, -5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      >
                        {['✨', '💫', '⭐'][i]}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center justify-center text-gray-400 text-lg"
          >
            Start talking with your new friend! 🎉
          </motion.div>
        )}
      </div>
    </div>
  );
}; 