import React, { useRef, useEffect, useState } from 'react';
import { Send, Sparkles, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { QuickSuggestions } from './QuickSuggestions';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    
    onChange(textarea.value);
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!value.trim() || loading || disabled) return;
    onSubmit();
  };

  return (
    <div className="relative">
      {showSuggestions && value.trim().length > 0 && (
        <div className="fixed inset-x-0 bottom-[56px] z-[60]">
          <QuickSuggestions
            inputValue={value}
            onSuggestionSelect={(suggestion) => {
              onChange(suggestion);
              textareaRef.current?.focus();
            }}
            isVisible={true}
          />
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-2 shadow-lg z-50">
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 right-0 mb-2 px-4 z-[70]">
            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  onChange(value + emoji.native);
                  setShowEmojiPicker(false);
                }}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
                searchPosition="none"
                navPosition="none"
                perLine={8}
                maxFrequentRows={0}
              />
            </div>
          </div>
        )}

        <div className="max-w-lg mx-auto flex items-center gap-2 bg-gray-50 rounded-2xl p-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-rose-500 hover:bg-rose-100/50 transition-colors rounded-xl"
          >
            <Smile size={20} />
          </button>

          <div className="w-px h-8 bg-gray-200 mx-1" />

          <div className="flex-1 relative flex items-center">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="Escribe un mensaje..."
              className="w-full px-3 py-2.5 bg-transparent rounded-xl resize-none focus:outline-none placeholder-gray-500 min-h-[40px] max-h-[100px] leading-5"
              rows={1}
              disabled={disabled}
            />
            
            {loading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Sparkles size={16} className="text-rose-400" />
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!value.trim() || loading || disabled}
            className="flex items-center justify-center w-10 h-10 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}