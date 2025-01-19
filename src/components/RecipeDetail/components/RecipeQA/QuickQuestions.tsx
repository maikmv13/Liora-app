import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';

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
        <div className="flex items-center justify-center space-x-2 text-gray-500 py-4">
          <Loader2 size={20} className="animate-spin" />
          <span>Generando preguntas...</span>
        </div>
      ) : (
        <div className="relative">
          {!isExpanded && (
            <div className="absolute -top-1 left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 bg-rose-200 rounded-full transition-all duration-150"
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
                ? 'flex flex-col gap-2 pt-2' 
                : 'flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2 pt-3 scrollbar-hide'}
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
                  flex items-start gap-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors text-sm
                  ${isExpanded 
                    ? 'p-4 w-full' 
                    : 'p-3 flex-shrink-0 snap-start w-[280px] h-[4.5rem]'}
                `}
              >
                <span className={`text-left ${isExpanded ? 'flex-1' : 'line-clamp-2'}`}>
                  {question}
                </span>
                <ChevronRight size={14} className="flex-shrink-0 mt-0.5" />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}