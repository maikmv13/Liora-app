import React from 'react';
import { Send, Loader2, Bot, Sparkles } from 'lucide-react';
import type { Recipe } from '../../../../types';
import { motion } from 'framer-motion';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  loading?: boolean;
  recipe?: Recipe;
  isDrawerVisible?: boolean;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  onFocus,
  loading, 
  recipe, 
  isDrawerVisible = true 
}: ChatInputProps) {
  return (
    <div className={`
      flex items-center space-x-3 transition-all duration-300
      ${!isDrawerVisible ? 'py-3' : 'py-1.5'}
    `}>
      {!isDrawerVisible && (
        <div className="relative flex-shrink-0">
          <div className="bg-violet-100 p-2.5 rounded-xl">
            <Bot size={22} className="text-violet-500" />
          </div>
          <div className="absolute -top-1 -right-1 bg-violet-500 rounded-full p-1">
            <Sparkles size={8} className="text-white" />
          </div>
        </div>
      )}
      
      <div className="flex-1 relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={!isDrawerVisible ? "" : recipe ? `Pregunta sobre ${recipe.name}...` : "Haz una pregunta sobre la receta..."}
          className={`
            w-full px-4 bg-gradient-to-r from-violet-50 to-white
            rounded-xl border border-violet-100 
            focus:ring-2 focus:ring-violet-500 focus:border-violet-500
            placeholder:text-violet-300
            transition-all duration-300
            ${!isDrawerVisible ? 
              'h-14 text-base shadow-sm group-hover:shadow-md py-4' : 
              'h-11 text-sm py-3'
            }
          `}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          onFocus={onFocus}
        />
        {!isDrawerVisible && !value && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="text-violet-400 text-sm font-medium">
              {recipe ? `Pregunta sobre ${recipe.name}...` : "Haz clic para hacer preguntas sobre la receta"}
            </span>
          </div>
        )}
      </div>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onSubmit();
        }}
        disabled={loading || !value.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex-shrink-0 flex items-center justify-center 
          bg-gradient-to-r from-violet-500 to-fuchsia-500
          text-white rounded-xl 
          hover:from-violet-600 hover:to-fuchsia-600
          active:from-violet-700 active:to-fuchsia-700
          disabled:from-violet-400 disabled:to-fuchsia-400
          disabled:opacity-70
          transition-all duration-300 
          disabled:cursor-not-allowed
          shadow-sm hover:shadow-md
          ${!isDrawerVisible ? 'h-14 w-14' : 'h-11 w-11'}
        `}
      >
        {loading ? (
          <Loader2 size={!isDrawerVisible ? 22 : 18} className="animate-spin" />
        ) : (
          <Send size={!isDrawerVisible ? 22 : 18} />
        )}
      </motion.button>
    </div>
  );
}