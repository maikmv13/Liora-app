import React, { useState, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { WelcomeMessage } from './components/WelcomeMessage';
import { useAI } from '../../hooks/useAI';

export function DesktopChat() {
  const [input, setInput] = useState('');
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const { messages, loading, sendMessage } = useAI();

  // Solo animación del mensaje de bienvenida
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50/50 to-purple-50/50">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <WelcomeMessage welcomeIndex={welcomeIndex} />
        
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