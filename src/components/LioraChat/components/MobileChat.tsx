import React, { useState, useEffect, useRef } from 'react';
import { MobileChatHeader } from './MobileChatHeader';
import { MobileChatInput } from './MobileChatInput';
import { ChatMessage } from './ChatMessage';
import { WelcomeMessage } from './WelcomeMessage';
import { useAI } from '../../../hooks/useAI';
import { FallingEmojis } from './FallingEmojis';

export function MobileChat() {
  const [input, setInput] = useState('');
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const { messages, loading, sendMessage } = useAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstVisit = useRef(localStorage.getItem('liora_visited') === null);

  const scrollToBottom = () => {
    if (!isFirstVisit.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      messagesEndRef.current?.scrollIntoView();
      localStorage.setItem('liora_visited', 'true');
      isFirstVisit.current = false;
    }
  };

  useEffect(() => {
    if (messages.length > 0 || isThinking) {
      scrollToBottom();
    }
  }, [messages, isThinking]);

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
    setIsThinking(true);
    
    try {
      await Promise.all([
        sendMessage(message),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuerySelect = (query: string) => {
    setInput(query);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50/50 to-purple-50/50">
      <FallingEmojis />
      <MobileChatHeader />
      
      <div className="flex-1 overflow-y-auto pt-4 pb-2 px-0 space-y-4 custom-scrollbar">
        <WelcomeMessage 
          welcomeIndex={welcomeIndex} 
          isMobile 
          onSelectQuery={handleQuerySelect}
        />
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isThinking && (
          <div className="flex items-start space-x-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <MobileChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        loading={loading || isThinking}
      />
    </div>
  );
}