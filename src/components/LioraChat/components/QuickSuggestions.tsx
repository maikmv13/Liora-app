import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bot, Brain, Apple, Calendar, Heart, ShoppingCart } from 'lucide-react';
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
    <div className="absolute bottom-full left-0 right-0 mb-2 px-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-lg border border-rose-100/20 overflow-hidden max-w-lg mx-auto"
      >
        {/* Category Indicators */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          <Bot size={16} className="text-rose-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 whitespace-nowrap">Sugerencias:</span>
          <div className="flex items-center space-x-2">
            {relevantCategories.map(categoryId => {
              const category = CATEGORIES.find(c => c.id === categoryId);
              if (!category) return null;

              return (
                <span
                  key={categoryId}
                  className={`
                    inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs
                    ${category.bgColor} ${category.color} whitespace-nowrap
                  `}
                >
                  <category.icon size={12} />
                  <span>{category.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Suggestions List */}
        <div className="p-2">
          <AnimatePresence mode="sync">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSuggestionSelect(suggestion)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-50 text-left group transition-colors"
              >
                <span className="text-sm text-gray-600 group-hover:text-rose-600">
                  {suggestion}
                </span>
                <ChevronRight 
                  size={16} 
                  className="text-gray-400 group-hover:text-rose-500 transition-colors" 
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}