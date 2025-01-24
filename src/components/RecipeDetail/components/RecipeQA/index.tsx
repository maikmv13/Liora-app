import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, ChevronUp, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import type { Recipe } from '../../../../types';
import { useAI } from '../../../../hooks/useAI';
import { ChatInput } from './ChatInput';
import { QuickQuestions } from './QuickQuestions';
import { ChatMessage } from '../../../LioraChat/components/ChatMessage';
import { Loader2 } from 'lucide-react';

interface RecipeQAProps {
  recipe: Recipe;
}

const variants = {
  expanded: {
    height: 'calc(100vh - 7rem)',
    scale: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 200
    }
  },
  collapsed: {
    height: '12rem',
    scale: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 200
    }
  }
};

export function RecipeQA({ recipe }: RecipeQAProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [quickQuestions, setQuickQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'questions'>('questions');
  const { messages, loading, sendMessage, generateRecipeQuestions } = useAI(recipe);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Generate quick questions on mount
  useEffect(() => {
    const generateQuestions = async () => {
      try {
        setIsGenerating(true);
        const questions = await generateRecipeQuestions(recipe);
        setQuickQuestions(questions);
      } catch (error) {
        console.error('Error generating questions:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQuestions();
  }, [recipe.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && isExpanded) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const message = input;
    setInput('');
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const handleQuestionClick = async (question: string) => {
    setIsExpanded(true);
    setActiveTab('chat');
    await sendMessage(question);
  };

  return (
    <motion.div
      initial={false}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      variants={variants}
      className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-rose-500/5 backdrop-blur-md border-t border-x border-rose-200/30 rounded-t-3xl shadow-[0_-8px_25px_-6px_rgba(0,0,0,0.1)] overflow-hidden"
    >
      {/* Header */}
      <div className="sticky top-0 z10">
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
                  <Bot size={18} className="text-white" />
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -top-1 -right-1 bg-white rounded-full p-1"
                >
                  <Sparkles size={8} className="text-violet-500" />
                </motion.div>
              </div>
              <div>
                <h2 className="text-white font-medium">Pregúntame sobre</h2>
                <p className="text-white/80 text-sm truncate">{recipe.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {isExpanded && (
                <button
                  onClick={() => setActiveTab(activeTab === 'chat' ? 'questions' : 'chat')}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {activeTab === 'chat' ? (
                    <HelpCircle size={18} className="text-white" />
                  ) : (
                    <MessageCircle size={18} className="text-white" />
                  )}
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <ChevronUp 
                  size={18} 
                  className={`text-white transform transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  } group-hover:scale-110`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs - Only show when expanded */}
        {isExpanded && (
          <div className="flex bg-white/95 backdrop-blur-sm border-b border-rose-100">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'questions'
                  ? 'text-violet-600 border-b-2 border-violet-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HelpCircle size={16} />
              <span>Preguntas</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-violet-600 border-b-2 border-violet-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle size={16} />
              <span>Chat</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="h-full flex flex-col bg-gradient-to-b from-violet-50/50 via-fuchsia-50/50 to-rose-50/50">
        {isExpanded ? (
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chat' ? (
              <div 
                ref={chatContainerRef}
                className="flex-1 p-4 space-y-4 pb-24"
              >
                {messages.map((message) => (
                  <ChatMessage 
                    key={message.id}
                    message={message}
                  />
                ))}
                
                {loading && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Pensando...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3">
                <QuickQuestions
                  questions={quickQuestions}
                  isLoading={isGenerating}
                  onQuestionClick={handleQuestionClick}
                  isExpanded={true}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-none p-3">
              <QuickQuestions
                questions={quickQuestions}
                isLoading={isGenerating}
                onQuestionClick={handleQuestionClick}
                isExpanded={false}
              />
            </div>
            {messages.length > 0 && (
              <div className="flex-1 overflow-y-auto px-4 pb-20">
                <div className="space-y-3">
                  {messages.slice(-2).map((message) => (
                    <ChatMessage 
                      key={message.id}
                      message={message}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Input at Bottom */}
      <div className="sticky bottom-0 left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-rose-100">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSendMessage}
          loading={loading}
          recipe={recipe}
          isDrawerVisible={isExpanded}
        />
      </div>
    </motion.div>
  );
}