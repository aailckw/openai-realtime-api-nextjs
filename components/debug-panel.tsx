import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenUsageDisplay } from '@/components/token-usage';
import { MessageControls } from '@/components/message-controls';
import { StatusDisplay } from '@/components/status';
import { ToolsEducation } from '@/components/tools-education';
import { Conversation } from '@/lib/conversations';
import { Message } from '@/types';

interface DebugPanelProps {
  msgs: Message[];
  status: string;
  conversation: Conversation[];
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  msgs,
  status,
  conversation,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-2 w-96 max-h-[80vh] overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="text-sm text-gray-500 font-medium">Debug Information</div>
                
                {status && <StatusDisplay status={status} />}
                
                {msgs.length > 4 && (
                  <div className="border-t pt-2">
                    <TokenUsageDisplay messages={msgs} />
                  </div>
                )}
                
                <div className="border-t pt-2">
                  <MessageControls conversation={conversation} msgs={msgs} />
                </div>
                
                <div className="border-t pt-2">
                  <ToolsEducation />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full 
            ${isOpen ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'}
            text-sm font-medium text-gray-600 shadow-md
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{isOpen ? '🔽 Hide Debug' : '🔼 Show Debug'}</span>
        </motion.button>
      </motion.div>
    </div>
  );
}; 