import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { Message } from '../../../../types/ai';

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

export function ChatMessages({ messages, loading }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-xl ${
              message.role === 'user'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.content}
          </div>
        </motion.div>
      ))}
      
      {loading && (
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          <span>Pensando...</span>
        </div>
      )}
    </div>
  );
}