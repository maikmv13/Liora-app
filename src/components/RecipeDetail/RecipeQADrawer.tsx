import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronUp, Bot, Sparkles, X, Send, Loader2, ChevronRight } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { Recipe } from '../../types';

interface RecipeQADrawerProps {
  recipe: Recipe;
}

export function RecipeQADrawer({ recipe }: RecipeQADrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [faqs, setFaqs] = useState<string[]>([]);
  const [isGeneratingFAQs, setIsGeneratingFAQs] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage } = useAI();

  // Motion values for drag
  const y = useMotionValue(0);
  const height = useMotionValue(96); // Initial compressed height
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;
  const background = useTransform(
    y,
    [0, -maxHeight],
    ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.98)']
  );

  // Generate FAQs on mount
  useEffect(() => {
    const generateFAQs = async () => {
      try {
        setIsGeneratingFAQs(true);
        await sendMessage(`Genera 5 preguntas cortas y específicas sobre la receta ${recipe.name}. Considera los ingredientes, el método de preparación, el valor nutricional y consejos. Formatea como una lista.`);
        setIsGeneratingFAQs(false);
      } catch (error) {
        console.error('Error al generar preguntas:', error);
        setIsGeneratingFAQs(false);
      }
    };

    generateFAQs();
  }, [recipe.id]);

  // Extract FAQs from AI response
  useEffect(() => {
    if (messages.length > 0 && !isGeneratingFAQs) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const questions = lastMessage.content
          .split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^\d+\.\s*/, '').trim());
        setFaqs(questions);
      }
    }
  }, [messages, isGeneratingFAQs]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const shouldExpand = info.offset.y < -50 || info.velocity.y < -500;
    setIsExpanded(shouldExpand);
    
    if (shouldExpand) {
      height.set(maxHeight);
      y.set(-maxHeight);
    } else {
      height.set(96);
      y.set(0);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    height.set(96);
    y.set(0);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const message = input;
    setInput('');
    
    try {
      await sendMessage(`Sobre la receta "${recipe.name}": ${message}`);
      
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const handleFAQClick = async (question: string) => {
    setInput(question);
    setIsExpanded(true);
    height.set(maxHeight);
    y.set(-maxHeight);
  };

  return (
    <motion.div
      className="fixed bottom-16 left-0 right-0 z-40"
      style={{ y, height, background }}
      drag="y"
      dragConstraints={{ top: -maxHeight, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white rounded-t-2xl shadow-lg border border-rose-100 overflow-hidden">
        {/* Drag Handle */}
        <div 
          className="h-8 flex items-center justify-center cursor-grab active:cursor-grabbing border-b border-rose-100"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isExpanded ? (
            // Expanded Chat View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100%-2rem)]"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-rose-100 flex items-center justify-between">
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
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-13rem)]"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl ${
                        message.role === 'user'
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Pensando...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-rose-100">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Haz una pregunta sobre la receta..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // Compressed FAQ View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Bot size={16} className="text-rose-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Preguntas frecuentes
                  </span>
                </div>
                <ChevronUp size={16} className="text-gray-400" />
              </div>
              
              {isGeneratingFAQs ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Generando preguntas...</span>
                </div>
              ) : (
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                  {faqs.map((faq, index) => (
                    <button
                      key={index}
                      onClick={() => handleFAQClick(faq)}
                      className="flex items-center justify-between space-x-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap text-sm"
                    >
                      <span>{faq}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}