import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bot, Brain, Apple, Calendar, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import type { ContextCategory } from '../../../types/ai';

interface QuickSuggestionsProps {
  inputValue: string;
  onSuggestionSelect: (suggestion: string) => void;
  isVisible: boolean;
}

interface SuggestionCategory {
  id: ContextCategory;
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
  suggestions: string[];
}

const CATEGORIES: SuggestionCategory[] = [
  {
    id: 'recipes',
    icon: Apple,
    label: 'Recetas',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    suggestions: [
      "¿Qué puedo cocinar con pollo?",
      "Necesito una receta vegetariana",
      "Receta saludable para cena",
      "Postres bajos en calorías"
    ]
  },
  {
    id: 'nutrition',
    icon: Brain,
    label: 'Nutrición',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    suggestions: [
      "¿Cuántas proteínas necesito?",
      "Alimentos ricos en hierro",
      "Mejores snacks saludables",
      "Beneficios de la avena"
    ]
  },
  {
    id: 'planning',
    icon: Calendar,
    label: 'Planificación',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    suggestions: [
      "Planificar menú semanal",
      "Ideas para desayunos",
      "Preparar comida para llevar",
      "Organizar las comidas"
    ]
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
    label: 'Compras',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    suggestions: [
      "Lista de compra saludable",
      "¿Qué necesito comprar?",
      "Productos básicos para cocina",
      "Alimentos que no deben faltar"
    ]
  }
];

const identifyCategories = (input: string): ContextCategory[] => {
  const categories: ContextCategory[] = [];
  
  const patterns = {
    recipes: /receta|cocinar|preparar|plato|comida|cena|menu/i,
    nutrition: /nutrición|calorías|proteínas|dieta|saludable/i,
    planning: /planificar|semana|horario|organizar/i,
    shopping: /comprar|lista|supermercado|ingredientes|falta|necesito/i
  };

  Object.entries(patterns).forEach(([category, pattern]) => {
    if (pattern.test(input)) {
      categories.push(category as ContextCategory);
    }
  });

  return categories.length > 0 ? categories : ['general'];
};

export function QuickSuggestions({ inputValue, onSuggestionSelect, isVisible }: QuickSuggestionsProps) {
  const [relevantCategories, setRelevantCategories] = useState<ContextCategory[]>(['general']);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (inputValue.length > 2) {
      const categories = identifyCategories(inputValue);
      setRelevantCategories(categories);

      // Get suggestions from relevant categories
      const newSuggestions = categories.flatMap(categoryId => {
        const category = CATEGORIES.find(c => c.id === categoryId);
        return category?.suggestions || [];
      });

      // Filter suggestions based on input
      const filteredSuggestions = newSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      );

      setSuggestions(filteredSuggestions.slice(0, 4)); // Limit to 4 suggestions
    } else {
      setRelevantCategories(['general']);
      setSuggestions([]);
    }
  }, [inputValue]);

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-lg border border-rose-100/20 overflow-hidden max-w-lg mx-auto"
      >
        {/* Barra de progreso */}
        <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-rose-100/50 via-fuchsia-200/50 to-rose-100/50 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 bg-gradient-to-r from-rose-400 to-fuchsia-500 rounded-full transition-all duration-150"
            style={{
              width: '30%',
              left: '0%'
            }}
          />
        </div>

        <div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 p-3 pt-4 scrollbar-hide"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSuggestionSelect(suggestion)}
              className={`
                group relative flex items-start gap-3 
                bg-gradient-to-r from-rose-50 to-white
                hover:from-rose-100 hover:to-rose-50
                active:from-rose-200 active:to-rose-100
                text-rose-900 rounded-xl transition-all duration-200
                border border-rose-100/50 hover:border-rose-200/50
                shadow-sm hover:shadow-md
                p-3.5 flex-shrink-0 snap-start w-[280px] h-[4.5rem]
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
              <span className="text-left text-sm font-medium line-clamp-2">
                {suggestion}
              </span>
              <ChevronRight 
                size={16} 
                className="flex-shrink-0 mt-0.5 text-rose-400 group-hover:text-rose-500 
                  transition-transform group-hover:translate-x-0.5" 
              />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}