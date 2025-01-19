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
    <>
      {/* Main Drawer */}
      <div className="fixed inset-x-0 bottom-[3.25rem] z-40">
        <AnimatePresence>
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'calc(100vh - 7rem)' : '12rem',
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200
            }}
            className="bg-white/70 backdrop-blur-sm rounded-t-2xl shadow-lg border border-rose-100 overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-rose-100">
              <div className="flex items-center justify-between py-2 px-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Bot size={20} className="text-rose-500" />
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
                      className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1"
                    >
                      <Sparkles size={8} className="text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Preguntas sobre la receta</h3>
                    <p className="text-sm text-gray-500">{recipe.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronUp 
                      size={20} 
                      className={`text-gray-500 transform transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs - Only show when expanded */}
              {isExpanded && (
                <div className="flex border-t border-rose-100">
                  <button
                    onClick={() => setActiveTab('questions')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'questions'
                        ? 'text-rose-600 border-b-2 border-rose-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <HelpCircle size={16} />
                    <span>Preguntas Frecuentes</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'chat'
                        ? 'text-rose-600 border-b-2 border-rose-500'
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
            <div className="h-full flex flex-col">
              {isExpanded ? (
                <div className="flex-1 overflow-y-auto">
                  {activeTab === 'chat' ? (
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 p-4 space-y-4 pb-16"
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
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3">
                  <QuickQuestions
                    questions={quickQuestions}
                    isLoading={isGenerating}
                    onQuestionClick={handleQuestionClick}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-3 py-2 bg-white/95 backdrop-blur-sm border-t border-rose-100 z-50">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSendMessage}
          loading={loading}
          recipe={recipe}
        />
      </div>
    </>
  );
}