"use client"

import React, { useEffect, useState } from "react"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { tools } from "@/lib/tools"
import { CharacterSelect } from "@/components/character-select"
import { BroadcastButton } from "@/components/broadcast-button"
import { motion } from "framer-motion"
import { useToolsFunctions } from "@/hooks/use-tools"
import { DebugPanel } from "@/components/debug-panel"
import { StatusPopup } from "@/components/status-popup"

type Character = 'robot' | 'cat' | 'dinosaur' | 'bear' | 'meercat' | 'sheep';

const characterToVoice: Record<Character, string> = {
  robot: 'echo',
  cat: 'shimmer',
  dinosaur: 'sage',
  bear: 'coral',
  meercat: 'alloy',
  sheep: 'ballad'
};

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface WebRTCMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

const characterBubbleStyles = {
  robot: {
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
    border: 'border-blue-300',
    text: 'text-blue-900'
  },
  cat: {
    bg: 'bg-gradient-to-br from-orange-100 to-orange-200',
    border: 'border-orange-300',
    text: 'text-orange-900'
  },
  dinosaur: {
    bg: 'bg-gradient-to-br from-green-100 to-green-200',
    border: 'border-green-300',
    text: 'text-green-900'
  },
  bear: {
    bg: 'bg-gradient-to-br from-amber-100 to-amber-200',
    border: 'border-amber-300',
    text: 'text-amber-900'
  },
  meercat: {
    bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
    border: 'border-yellow-300',
    text: 'text-yellow-900'
  },
  sheep: {
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200',
    border: 'border-purple-300',
    text: 'text-purple-900'
  }
};

const App: React.FC = () => {
  // State for character selection
  const [character, setCharacter] = useState<Character>("robot")
  const [isTalking, setIsTalking] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])

  // WebRTC Audio Session Hook
  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    startSession,
    stopSession,
    msgs,
    conversation,
    currentVolume
  } = useWebRTCAudioSession(characterToVoice[character], tools)

  // Handle character change during active session
  const handleCharacterChange = async (newCharacter: Character) => {
    if (isSessionActive) {
      // Stop current session
      stopSession();
      // Update character after session is stopped
      setCharacter(newCharacter);
      // Small delay to ensure clean session restart
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Start new session with new character
      startSession();
    } else {
      setCharacter(newCharacter);
    }
  };

  // Show status popup when status changes
  useEffect(() => {
    if (status) {
      setShowStatus(true);
      // Hide success/stop message after 3 seconds
      if (status.includes('successfully') || status.includes('stopped')) {
        const timer = setTimeout(() => setShowStatus(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [status]);

  // Update talking state based on volume
  useEffect(() => {
    setIsTalking(currentVolume > 0.01);
  }, [currentVolume]);

  // Get all tools functions
  const toolsFunctions = useToolsFunctions();

  useEffect(() => {
    // Register all functions by iterating over the object
    Object.entries(toolsFunctions).forEach(([name, func]) => {
      const functionNames: Record<string, string> = {
        timeFunction: 'getCurrentTime',
        backgroundFunction: 'changeBackgroundColor',
        partyFunction: 'partyMode',
        launchWebsite: 'launchWebsite', 
        copyToClipboard: 'copyToClipboard',
        scrapeWebsite: 'scrapeWebsite'
      };
      
      registerFunction(functionNames[name], func);
    });
  }, [registerFunction, toolsFunctions])

  // Update messages when new WebRTC messages arrive
  useEffect(() => {
    if (msgs && msgs.length > 0) {
      const lastMsg = msgs[msgs.length - 1] as WebRTCMessage;
      if (lastMsg?.content) {
        setMessages(prevMessages => {
          // Check if this message is already in the list to avoid duplicates
          const isDuplicate = prevMessages.some(
            msg => msg.text === lastMsg.content && msg.timestamp.getTime() === new Date(lastMsg.timestamp).getTime()
          );
          
          if (!isDuplicate) {
            return [...prevMessages, {
              text: lastMsg.content,
              isUser: lastMsg.role === 'user',
              timestamp: new Date(lastMsg.timestamp)
            }];
          }
          return prevMessages;
        });
      }
    }
  }, [msgs]);

  // Update messages when conversation changes
  useEffect(() => {
    if (conversation) {
      const newMessages = conversation
        .filter(msg => msg.text && msg.isFinal) // Only include final messages with text
        .map(msg => ({
          text: msg.text,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.timestamp)
        }));
      
      setMessages(newMessages);
    }
  }, [conversation]);

  // Get the latest character message
  const latestCharacterMessage = messages
    .filter(msg => !msg.isUser)
    .slice(-1)[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      {/* Status Popup */}
      <StatusPopup 
        status={status} 
        isVisible={showStatus}
      />

      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-purple-100 shadow-xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            {/* Latest chat bubble */}
            {latestCharacterMessage && (
              <motion.div 
                className="absolute left-1/2 -top-20 -translate-x-1/2 w-full max-w-sm z-10"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }
                }}
              >
                <motion.div 
                  className={`
                    relative px-6 py-3 rounded-2xl shadow-lg
                    ${characterBubbleStyles[character].bg} 
                    ${characterBubbleStyles[character].border} border-2
                  `}
                  animate={isTalking ? {
                    scale: [1, 1.02, 1],
                    transition: {
                      duration: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  } : {}}
                >
                  {/* Animated pointer */}
                  <motion.div 
                    className={`
                      absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 
                      ${characterBubbleStyles[character].bg}
                      ${characterBubbleStyles[character].border} border-2
                      transform rotate-45 border-t-0 border-l-0
                    `}
                    animate={isTalking ? {
                      y: [0, 2, 0],
                      transition: {
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    } : {}}
                  />

                  {/* Text content */}
                  <motion.p 
                    className={`text-lg font-medium ${characterBubbleStyles[character].text}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {latestCharacterMessage.text}
                  </motion.p>

                  {/* Animated dots when talking */}
                  {isTalking && (
                    <div className="flex gap-1 mt-1 h-4">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-2 h-2 rounded-full ${characterBubbleStyles[character].border}`}
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
                </motion.div>
              </motion.div>
            )}

            {/* Character */}
            <div className="relative z-0">
              <CharacterSelect 
                value={character} 
                onValueChange={handleCharacterChange}
                isTalking={isSessionActive && isTalking}
              />
            </div>
          </div>
        </motion.div>

        {/* Broadcast Button - Moved outside the card */}
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BroadcastButton 
            isSessionActive={isSessionActive} 
            onClick={handleStartStopClick}
          />
        </motion.div>
      </div>

      {/* Debug Panel */}
      <DebugPanel
        msgs={msgs}
        status={status}
        conversation={conversation}
      />
    </main>
  )
}

export default App; 