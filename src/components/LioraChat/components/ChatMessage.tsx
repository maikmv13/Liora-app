import React from 'react';
import { Bot, User, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../../types/ai';
import { RecipeCard } from './RecipeCard';

interface ChatMessageProps {
  message: Message;
  onViewRecipe?: (recipe: any) => void;
  onShareRecipe?: (recipe: any) => void;
}

export function ChatMessage({ message, onViewRecipe, onShareRecipe }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  // If message has recipes, render recipe cards
  if (isAssistant && message.recipes && message.recipes.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-start space-x-3"
      >
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

        <div className="flex-1 space-y-4">
          {/* Message text */}
          <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm">
            <p className="text-gray-700">{message.content}</p>
          </div>

          {/* Recipe cards */}
          <div className="grid grid-cols-1 gap-4">
            {message.recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={() => onViewRecipe?.(recipe)}
                onShare={() => onShareRecipe?.(recipe)}
                inChat
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular message rendering
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
        <div className={`prose prose-sm ${!isAssistant && 'prose-invert'} max-w-none`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
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

        <div className={`flex items-center space-x-2 mt-2 text-xs ${
          isAssistant ? 'text-gray-400' : 'text-white/70'
        }`}>
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>

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