import React from 'react';
import { Bot, User, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../../types/ai';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-start space-x-3 ${
        !isAssistant ? 'justify-end' : ''
      }`}
    >
      {isAssistant && (
        <div className="relative">
          <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-2 rounded-xl shadow-sm">
            <Bot size={16} className="text-rose-500" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm"
          >
            <Sparkles size={8} className="text-rose-400" />
          </motion.div>
        </div>
      )}

      <motion.div
        layout
        className={`relative max-w-[80%] p-4 rounded-2xl shadow-sm ${
          isAssistant
            ? 'bg-white border border-rose-100'
            : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
        }`}
      >
        {/* Message content with Markdown support */}
        <div className={`prose prose-sm ${!isAssistant && 'prose-invert'} max-w-none`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Personalizar estilos de elementos Markdown
              strong: ({node, ...props}) => <span className="font-bold" {...props} />,
              em: ({node, ...props}) => <span className="italic" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
              li: ({node, ...props}) => <li className="marker:text-rose-400" {...props} />,
              a: ({node, ...props}) => (
                <a 
                  className={`underline ${isAssistant ? 'text-rose-500' : 'text-white'} hover:opacity-80`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  {...props}
                />
              ),
              code: ({node, inline, ...props}) => (
                inline ? 
                  <code className="px-1 py-0.5 bg-gray-100 rounded text-sm" {...props} /> :
                  <code className="block p-2 bg-gray-100 rounded-lg text-sm overflow-x-auto" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Timestamp */}
        <div className={`flex items-center space-x-2 mt-2 text-xs ${
          isAssistant ? 'text-gray-400' : 'text-white/70'
        }`}>
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-10 pointer-events-none" />
      </motion.div>

      {!isAssistant && (
        <div className="relative">
          <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-2 rounded-xl shadow-sm">
            <User size={16} className="text-rose-500" />
          </div>
        </div>
      )}
    </motion.div>
  );
}