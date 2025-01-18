import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';
import type { Recipe } from '../types';

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

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

  const searchRecipes = async (query: string): Promise<Recipe[]> => {
    try {
      // Extract potential categories from query
      const categoryKeywords = {
        'Carnes': ['carne', 'ternera', 'cerdo', 'pollo', 'pavo'],
        'Pescados': ['pescado', 'atún', 'salmón', 'merluza'],
        'Vegetariano': ['vegetariano', 'vegetal', 'verdura'],
        'Pastas y Arroces': ['pasta', 'arroz', 'espagueti'],
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

      // If no specific category found, search in all
      if (categories.length === 0) {
        categories = Object.keys(categoryKeywords);
      }

      // First try exact match with recipe name
      const { data: nameMatches, error: nameError } = await supabase
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
        .ilike('name', `%${query}%`)
        .in('category', categories)
        .limit(3);

      if (nameError) throw nameError;
      if (nameMatches && nameMatches.length > 0) {
        return nameMatches;
      }

      // If no name matches, try category matches
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

  const isRecipeQuery = (content: string): boolean => {
    const recipeKeywords = [
      'receta', 'cocinar', 'preparar', 'plato', 'comida',
      'cena', 'desayuno', 'almuerzo', 'menú', 'menu',
      'quiero', 'cómo', 'como', 'hacer'
    ];
    return recipeKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
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
      
      await saveChatMessage(userMessage);
      setMessages(prev => [...prev, userMessage]);

      // Check if it's a recipe query
      if (isRecipeQuery(content)) {
        const recipes = await searchRecipes(content);
        
        if (recipes.length > 0) {
          // Create recipe message
          const recipeMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '¡He encontrado estas recetas que podrían interesarte! 👩‍🍳✨',
            timestamp: new Date().toISOString(),
            recipes: recipes
          };

          await saveChatMessage(recipeMessage);
          setMessages(prev => [...prev, recipeMessage]);
          return;
        }
      }

      // Regular chat flow
      const systemPrompt = `Eres un asistente experto en nutrición y planificación de comidas.
        Si el usuario pregunta por recetas específicas, responde con sugerencias concretas.
        Usa emojis apropiados y mantén un tono amigable y profesional.
        Si no encuentras una receta específica, ofrece alternativas saludables.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
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

      await saveChatMessage(aiMessage);
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in sendMessage:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const saveChatMessage = async (message: Message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          content: message.content,
          role: message.role,
          timestamp: message.timestamp,
          session_id: sessionId,
          recipes: message.recipes
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const clearMessages = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setMessages([]);

      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

    } catch (error) {
      console.error('Error clearing messages:', error);
      loadChatHistory();
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