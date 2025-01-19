import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';

interface QuickQuestionsProps {
  questions: string[];
  isLoading: boolean;
  onQuestionClick: (question: string) => void;
}

export function QuickQuestions({ questions, isLoading, onQuestionClick }: QuickQuestionsProps) {
  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          <span>Generando preguntas...</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {questions.map((question, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onQuestionClick(question)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <span className="text-sm">{question}</span>
              <ChevronRight size={14} />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}