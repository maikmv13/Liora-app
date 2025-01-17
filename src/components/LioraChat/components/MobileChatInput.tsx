import React, { useRef, useEffect, useState } from 'react';
import { Send, Sparkles, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

// Quick suggestions with full queries
const QUICK_SUGGESTIONS = [
  { text: "🍽️ ¿Qué debería cenar hoy?", query: "¿Qué debería cenar hoy? Necesito una idea saludable y fácil de preparar" },
  { text: "🥗 ¿Cómo mejorar mi nutrición?", query: "¿Cómo puedo mejorar mi nutrición? Dame consejos prácticos" },
  { text: "📋 Plan de comidas semanal", query: "Necesito un plan de comidas saludable para toda la semana" },
  { text: "🍳 Desayuno saludable", query: "¿Qué desayuno saludable y nutritivo me recomiendas?" }
];

interface MobileChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function MobileChatInput({ value, onChange, onSubmit, loading, disabled }: MobileChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [value]);

  // Ocultar sugerencias cuando el usuario empieza a escribir
  useEffect(() => {
    if (value.trim()) {
      setShowSuggestions(false);
      setHasInteracted(true);
    }
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      onSubmit();
      setHasInteracted(true);
      setShowSuggestions(false);
    }
  };

  const addEmoji = (emoji: any) => {
    onChange(value + emoji.native);
    setShowEmojiPicker(false);
    setHasInteracted(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setHasInteracted(true);
    textareaRef.current?.focus();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg"
    >
      {/* Quick Suggestions */}
      <AnimatePresence>
        {showSuggestions && !hasInteracted && !value && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-3 px-4"
          >
            <p className="text-xs font-medium text-gray-500 mb-3">Sugerencias</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <motion.button
                  key={suggestion.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSuggestionClick(suggestion.query)}
                  className="flex-none px-4 py-2 bg-gray-50 hover:bg-rose-50 rounded-xl text-sm text-gray-700 transition-colors whitespace-nowrap"
                >
                  {suggestion.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 mb-2 px-4"
          >
            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
                searchPosition="none"
                navPosition="none"
                perLine={8}
                maxFrequentRows={0}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-lg mx-auto flex items-end space-x-2">
        {/* Emoji Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2.5 text-gray-500 hover:text-rose-500 transition-colors rounded-full"
          aria-label="Emojis"
        >
          <Smile size={24} />
        </motion.button>

        {/* Input Field */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Escribe un mensaje..."
            className="w-full pl-4 pr-10 py-2.5 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-gray-500"
            rows={1}
            style={{ maxHeight: '100px' }}
            disabled={disabled}
            aria-label="Mensaje"
          />
          
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute right-3 bottom-3"
              >
                <Sparkles size={16} className="text-rose-400 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          disabled={!value.trim() || loading || disabled}
          className="p-2.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          aria-label="Enviar mensaje"
        >
          <Send size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}