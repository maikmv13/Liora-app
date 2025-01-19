import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, Image, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, loading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [isComposing, setIsComposing] = React.useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      onSubmit();
    }
  };

  const addEmoji = (emoji: any) => {
    onChange(value + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 p-4 border-t border-rose-100/20 bg-gradient-to-r from-rose-50/50 via-pink-50/50 to-purple-50/50 backdrop-blur-sm"
    >
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full right-4 mb-2 z-50"
          >
            <div className="shadow-lg rounded-2xl overflow-hidden">
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
                perLine={8}
                maxFrequentRows={0}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center gap-2 max-w-4xl mx-auto bg-white/80 rounded-2xl p-2 shadow-sm border border-rose-100">
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Emoji Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Smile size={20} />
          </motion.button>

          {/* File Upload Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Image size={20} />
          </motion.button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-rose-100/50 mx-1" />

        {/* Main Input */}
        <div className="flex-1 relative flex items-center">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Escribe un mensaje..."
            className="w-full px-3 py-2.5 bg-transparent rounded-xl focus:outline-none resize-none placeholder-gray-400 min-h-[40px] max-h-[120px] leading-5"
            rows={1}
            style={{ 
              maxHeight: '150px',
              marginTop: '0',
              marginBottom: '0'
            }}
            disabled={disabled}
          />
          
          {/* Loading Animation */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Sparkles size={18} className="text-rose-400 animate-pulse" />
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
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Send size={20} />
        </motion.button>
      </div>

      {/* Visual Feedback for Typing */}
      <AnimatePresence>
        {value && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-4 -top-6 text-xs text-gray-500"
          >
            Escribiendo...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}