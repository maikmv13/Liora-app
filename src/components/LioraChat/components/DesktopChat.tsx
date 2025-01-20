import React, { useState, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { WelcomeMessage } from './WelcomeMessage';
import { useAI } from '../../../hooks/useAI';

interface DesktopChatProps {
  initialInput?: string;
  onQuerySelect?: (query: string) => void;
}

export function DesktopChat({ initialInput = '', onQuerySelect }: DesktopChatProps) {
  const [input, setInput] = useState(initialInput);
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const { messages, loading, sendMessage } = useAI();

  useEffect(() => {
    if (welcomeIndex < 4) {
      const timer = setTimeout(() => {
        setWelcomeIndex(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [welcomeIndex]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    const message = input;
    setInput('');
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleQuerySelect = (query: string) => {
    setInput(query);
    onQuerySelect?.(query);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50/50 to-purple-50/50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <WelcomeMessage 
          welcomeIndex={welcomeIndex} 
          onSelectQuery={handleQuerySelect}
        />
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}