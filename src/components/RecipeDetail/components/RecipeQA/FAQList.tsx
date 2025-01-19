import React from 'react';
import { Bot, ChevronRight, Loader2, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface FAQListProps {
  faqs: string[];
  isGenerating: boolean;
  onFAQClick: (question: string) => void;
}

export function FAQList({ faqs, isGenerating, onFAQClick }: FAQListProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Bot size={16} className="text-rose-500" />
          <span className="text-sm font-medium text-gray-700">
            Preguntas frecuentes
          </span>
        </div>
        <ChevronUp size={16} className="text-gray-400" />
      </div>
      
      {isGenerating ? (
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Generando preguntas...</span>
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {faqs.map((faq, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onFAQClick(faq)}
              className="flex items-center justify-between space-x-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap text-sm"
            >
              <span>{faq}</span>
              <ChevronRight size={14} />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}