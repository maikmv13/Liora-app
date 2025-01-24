import React, { useRef, useEffect } from 'react';
import { Bot, X, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../../../../components/LioraChat/components/ChatMessage';
import { ChatInput } from '../../../../components/LioraChat/components/ChatInput';
import type { Recipe } from '../../../../types';
import type { Message } from '../../../../types/ai';

interface ChatViewProps {
  recipe: Recipe;
  messages: Message[];
  loading: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatView({ recipe, messages, loading, onClose, onSendMessage }: ChatViewProps) {
  const [input, setInput] = React.useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      if (isFirstLoad.current) {
        // Scroll instantáneo en la primera carga
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        isFirstLoad.current = false;
      } else {
        // Scroll suave para mensajes nuevos
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const message = input;
    setInput('');
    await onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-rose-100 bg-white/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="bg-rose-100 p-2 rounded-lg">
              <Bot size={20} className="text-rose-500" />
            </div>
            <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1">
              <Sparkles size={8} className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Preguntas sobre la receta</h3>
            <p className="text-sm text-gray-500">{recipe.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-32 space-y-4 bg-white/80"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      {/* Fixed Input at Bottom */}
      <div className="sticky bottom-0 left-0 right-0 border-t border-rose-100 bg-white/90 backdrop-blur-sm p-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}