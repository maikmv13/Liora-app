import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
  const [isVisible, setIsVisible] = useState(true);
  const [input, setInput] = useState('');
  const [quickQuestions, setQuickQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'questions'>('questions');
  const { messages, loading, sendMessage, generateRecipeQuestions } = useAI(recipe);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const DRAG_THRESHOLD = 50;
    if (info.offset.y > DRAG_THRESHOLD) {
      if (!isExpanded) {
        setIsVisible(false);
      } else {
        setIsExpanded(false);
      }
    } else if (info.offset.y < -DRAG_THRESHOLD && !isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* Main Drawer */}
      <div 
        className={`fixed inset-x-0 bottom-[3.25rem] z-40 transition-transform duration-300 ${
          !isVisible ? 'translate-y-full' : 'translate-y-0'
        }`}
        data-qa-container
        data-expanded={isExpanded}
      >
        <AnimatePresence>
          <motion.div
            variants={variants}
            initial={false}
            animate={isExpanded ? 'expanded' : 'collapsed'}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`
              bg-rose-50/70 backdrop-blur-sm rounded-t-2xl 
              border-x border-t border-rose-100 overflow-hidden touch-pan-y
              shadow-[0_-8px_25px_-6px_rgba(0,0,0,0.1)]
              ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
          >
            {/* Header */}
            <div className="sticky top-0 z-10">
              <div className="bg-gradient-to-r from-rose-500 to-rose-400 px-4 py-2.5 rounded-t-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.0)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
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
                        <Sparkles size={8} className="text-rose-500" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Pregúntale a Liora sobre</h3>
                      <p className="text-xs text-white/80 truncate max-w-[200px]">{recipe.name} {recipe.side_dish}</p>
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
                      data-expand-button
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

              {/* Indicador de arrastre */}
              <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 transition-opacity duration-200
                ${isDragging ? 'opacity-100' : 'opacity-50'}`}>
                <div className="h-1 w-12 bg-white rounded-full mt-1" />
              </div>

              {/* Tabs - Only show when expanded */}
              {isExpanded && (
                <div className="flex bg-white border-b border-rose-100">
                  <button
                    onClick={() => setActiveTab('questions')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'questions'
                        ? 'text-rose-600 border-b-2 border-rose-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <HelpCircle size={16} />
                    <span>Preguntas</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    data-tab="chat"
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
            <div className="h-full flex flex-col bg-gradient-to-b from-rose-100/90 via-rose-50/80 to-rose-50/70">
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white/95 backdrop-blur-sm border-t border-rose-100 z-50">
        <div onClick={() => setIsVisible(true)}>
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSendMessage}
            loading={loading}
            recipe={recipe}
            isDrawerVisible={isVisible}
          />
        </div>
      </div>
    </>
  );
}