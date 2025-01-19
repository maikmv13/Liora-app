import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, loading }: ChatInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Haz una pregunta sobre la receta..."
        className="flex-1 h-9 px-3 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
      />
      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="h-9 aspect-square flex items-center justify-center bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
      </button>
    </div>
  );
}