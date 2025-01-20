import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2, Sparkles } from 'lucide-react';

interface QuickQuestionsProps {
  questions: string[];
  isLoading: boolean;
  onQuestionClick: (question: string) => void;
  isExpanded?: boolean;
}

export function QuickQuestions({ questions, isLoading, onQuestionClick, isExpanded = false }: QuickQuestionsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const progress = (container.scrollLeft / scrollWidth) * 100;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2 text-rose-500/80 py-6">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm font-medium">Generando preguntas...</span>
        </div>
      ) : (
        <div className="relative">
          {!isExpanded && (
            <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-rose-100/50 via-rose-200/50 to-rose-100/50 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-150"
                style={{
                  width: '30%',
                  left: `${Math.min(Math.max(scrollProgress, 0), 70)}%`
                }}
              />
            </div>
          )}
          <div
            ref={scrollContainerRef}
            className={`
              ${isExpanded 
                ? 'flex flex-col gap-2.5 pt-2' 
                : 'flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-2 pt-3 scrollbar-hide'}
            `}
          >
            {questions.map((question, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onQuestionClick(question)}
                className={`
                  group relative flex items-start gap-3 
                  bg-gradient-to-r from-rose-50 to-white
                  hover:from-rose-100 hover:to-rose-50
                  active:from-rose-200 active:to-rose-100
                  text-rose-900 rounded-xl transition-all duration-200
                  border border-rose-100/50 hover:border-rose-200/50
                  shadow-sm hover:shadow-md
                  ${isExpanded 
                    ? 'p-4 w-full' 
                    : 'p-3.5 flex-shrink-0 snap-start w-[280px] h-[4.5rem]'}
                `}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute -top-0.5 -right-0.5"
                  >
                    <Sparkles size={6} className="text-rose-500" />
                  </motion.div>
                </div>
                <span className={`text-left text-sm font-medium ${isExpanded ? 'flex-1' : 'line-clamp-2'}`}>
                  {question}
                </span>
                <ChevronRight 
                  size={16} 
                  className="flex-shrink-0 mt-0.5 text-rose-400 group-hover:text-rose-500 
                    transition-transform group-hover:translate-x-0.5" 
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}