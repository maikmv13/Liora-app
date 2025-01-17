import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getAIResponse } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const identifyCategory = (content: string): ContextCategory[] => {
    const categories: ContextCategory[] = [];
    
    const patterns = {
      recipes: /receta|cocinar|preparar|plato|comida|cena|menu/i,
      shopping: /compra|lista|ingredientes|supermercado/i,
      nutrition: /nutrición|calorías|proteínas|dieta|saludable/i,
      planning: /planificar|semana|horario|organizar/i
    };

    Object.entries(patterns).forEach(([category, pattern]) => {
      if (pattern.test(content)) {
        categories.push(category as ContextCategory);
      }
    });

    // Si no se identifica ninguna categoría, incluir todas
    return categories.length > 0 ? categories : ['general'];
  };

  const getFilteredContext = async (categories: ContextCategory[]): Promise<AIContext> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const queries = {
      profile: supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      favorites: categories.includes('recipes') ? 
        supabase.from('favorites').select('recipe_id, recipes(*)') : 
        Promise.resolve({ data: [] }),
      weeklyMenu: categories.includes('planning') ? 
        supabase.from('weekly_menus').select('*') : 
        Promise.resolve({ data: [] }),
      shoppingList: categories.includes('shopping') ? 
        supabase.from('shopping_list_items').select('*') : 
        Promise.resolve({ data: [] })
    };

    const [
      { data: profile },
      { data: favorites },
      { data: weeklyMenu },
      { data: shoppingList }
    ] = await Promise.all([
      queries.profile,
      queries.favorites,
      queries.weeklyMenu,
      queries.shoppingList
    ]);

    return {
      userProfile: profile,
      favorites: favorites?.map(f => f.recipes) || [],
      weeklyMenu: weeklyMenu || [],
      shoppingList: shoppingList || [],
      categories // Incluimos las categorías identificadas en el contexto
    };
  };

  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Verificar autenticación
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Usuario autenticado:', user);

      const categories = identifyCategory(content);
      console.log('Categorías identificadas:', categories);

      const context = await getFilteredContext(categories);
      console.log('Contexto obtenido:', context);
      
      const response = await getAIResponse([...messages, userMessage], context);
      console.log('Respuesta de AI:', response);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      return response;

    } catch (error) {
      console.error('Error detallado en useAI:', error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [messages]);

  return { 
    messages, 
    setMessages,
    loading, 
    error, 
    sendMessage 
  };
}