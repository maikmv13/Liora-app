import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';
import type { Recipe } from '../types';

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(50);

        if (error) throw error;

        if (data) {
          setMessages(data.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            recipes: msg.recipes
          })));
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  const searchRecipes = async (query: string): Promise<Recipe[]> => {
    try {
      // Extract ingredients from query
      const ingredients = query.toLowerCase()
        .replace(/receta|con|de|y|para|hacer/g, '')
        .trim()
        .split(/[,\s]+/)
        .filter(word => word.length > 2);

      // Extract potential categories from query
      const categoryKeywords = {
        'Aves': ['pollo', 'pavo', 'ave', 'pechuga', 'muslo'],
        'Pescados': ['pescado', 'atún', 'salmón', 'merluza', 'bacalao'],
        'Vegetariano': ['vegetariano', 'vegetal', 'verdura'],
        'Pastas y Arroces': ['pasta', 'arroz', 'espagueti', 'macarrón'],
        'Ensaladas': ['ensalada', 'verde'],
        'Sopas y Cremas': ['sopa', 'crema', 'caldo'],
        'Desayuno': ['desayuno', 'breakfast'],
        'Snack': ['snack', 'merienda']
      };

      let categories = Object.entries(categoryKeywords)
        .filter(([_, keywords]) => 
          keywords.some(keyword => query.toLowerCase().includes(keyword))
        )
        .map(([category]) => category);

      // If no specific category found, try to determine from ingredients
      if (categories.length === 0) {
        if (ingredients.some(ing => ['pollo', 'pavo', 'pechuga', 'muslo'].includes(ing))) {
          categories = ['Aves'];
        } else if (ingredients.some(ing => ['pescado', 'atún', 'salmón'].includes(ing))) {
          categories = ['Pescados'];
        }
      }

      // If still no category, use a default set
      if (categories.length === 0) {
        categories = ['Aves', 'Pescados', 'Vegetariano', 'Pastas y Arroces'];
      }

      // First try matching recipes with ingredients
      const { data: ingredientMatches, error: ingredientError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id,
            quantity,
            unit,
            ingredients (
              id,
              name,
              category
            )
          )
        `)
        .in('category', categories)
        .limit(10);

      if (ingredientError) throw ingredientError;

      if (ingredientMatches) {
        // Score recipes based on ingredient matches
        const scoredRecipes = ingredientMatches.map(recipe => {
          let score = 0;
          const recipeIngredients = recipe.recipe_ingredients?.map(ri => 
            ri.ingredients?.name.toLowerCase()
          ) || [];

          // Score based on ingredient matches
          ingredients.forEach(ingredient => {
            if (recipeIngredients.some(ri => ri?.includes(ingredient))) {
              score += 2;
            }
          });

          // Bonus score for name match
          if (recipe.name.toLowerCase().includes(query.toLowerCase())) {
            score += 3;
          }

          // Bonus score for exact category match
          if (categories.length === 1 && recipe.category === categories[0]) {
            score += 2;
          }

          return { recipe, score };
        });

        // Sort by score and take top 3
        const topMatches = scoredRecipes
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(({ recipe }) => recipe);

        if (topMatches.length > 0) {
          return topMatches;
        }
      }

      // Fallback to basic category search if no ingredient matches
      const { data: categoryMatches, error: categoryError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id,
            quantity,
            unit,
            ingredients (
              id,
              name,
              category
            )
          )
        `)
        .in('category', categories)
        .limit(3);

      if (categoryError) throw categoryError;
      return categoryMatches || [];

    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      // Save user message
      await supabase.from('chat_history').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        content,
        role: 'user',
        timestamp: userMessage.timestamp
      });

      setMessages(prev => [...prev, userMessage]);

      // Check if it's a recipe request
      if (content.toLowerCase().includes('receta')) {
        const recipes = await searchRecipes(content);
        
        // Create AI response with recipes
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `¡Aquí tienes algunas recetas que podrían interesarte! 👩‍🍳✨`,
          timestamp: new Date().toISOString(),
          recipes
        };

        // Save AI message
        await supabase.from('chat_history').insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          content: aiMessage.content,
          role: 'assistant',
          timestamp: aiMessage.timestamp,
          recipes
        });

        setMessages(prev => [...prev, aiMessage]);
        return;
      }

      // Regular chat completion
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un asistente experto en nutrición y planificación de comidas.' },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content }
        ]
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.choices[0].message.content || 'Lo siento, no pude generar una respuesta.',
        timestamp: new Date().toISOString()
      };

      // Save AI message
      await supabase.from('chat_history').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        content: aiMessage.content,
        role: 'assistant',
        timestamp: aiMessage.timestamp
      });

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in sendMessage:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Clear messages in UI
      setMessages([]);

      // Delete all user messages from database
      await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user.id);

    } catch (error) {
      console.error('Error clearing messages:', error);
      setError(error as Error);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages
  };
}