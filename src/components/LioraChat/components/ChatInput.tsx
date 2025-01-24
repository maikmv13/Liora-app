import React, { useRef } from 'react';
import { Send, Sparkles, Image, Smile } from 'lucide-react';
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="sticky bottom-0 p-4 border-t border-rose-100/20 bg-gradient-to-r from-rose-50/50 via-pink-50/50 to-purple-50/50 backdrop-blur-sm">
      {showEmojiPicker && (
        <div className="absolute bottom-full right-4 mb-2 z-50">
          <div className="shadow-lg rounded-2xl overflow-hidden">
            <Picker
              data={data}
              onEmojiSelect={(emoji: any) => {
                onChange(value + emoji.native);
                setShowEmojiPicker(false);
              }}
              theme="light"
              previewPosition="none"
              skinTonePosition="none"
              perLine={8}
              maxFrequentRows={0}
            />
          </div>
        </div>
      )}

      <div className="relative flex items-center gap-2 max-w-4xl mx-auto bg-white/80 rounded-2xl p-2 shadow-sm border border-rose-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Smile size={20} />
          </button>

          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Image size={20} />
          </button>
        </div>

        <div className="w-px h-8 bg-rose-100/50 mx-1" />

        <div className="flex-1 relative flex items-center">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Escribe un mensaje..."
            className="w-full px-3 py-2.5 bg-transparent rounded-xl focus:outline-none resize-none placeholder-gray-400 leading-5 h-[40px] overflow-y-auto"
            rows={1}
            disabled={disabled}
          />
          
          {loading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Sparkles size={18} className="text-rose-400 animate-pulse" />
            </div>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={!value.trim() || loading || disabled}
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}