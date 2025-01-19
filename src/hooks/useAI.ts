import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';
import type { Recipe } from '../types';

export function useAI(recipe?: Recipe) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());

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
          .eq('session_id', sessionId)
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
  }, [sessionId]);

  const generateRecipeQuestions = async (recipe: Recipe) => {
    try {
      const recipeContext = `
        Receta: ${recipe.name}
        Acompañamiento: ${recipe.side_dish}
        Tipo de comida: ${recipe.meal_type}
        Categoría: ${recipe.category}
        
        Información nutricional:
        - Porciones: ${recipe.servings}
        - Calorías: ${recipe.calories}
        - Energía (KJ): ${recipe.energy_kj}
        - Proteínas: ${recipe.proteins}
        - Carbohidratos: ${recipe.carbohydrates}
          · Azúcares: ${recipe.sugars}
          · Fibra: ${recipe.fiber}
        - Grasas: ${recipe.fats}
          · Grasas saturadas: ${recipe.saturated_fats}
        - Sodio: ${recipe.sodium}
        
        Tiempos:
        - Preparación: ${recipe.prep_time}
        
        Ingredientes:
        ${recipe.recipe_ingredients?.map(ing => `- ${ing.quantity} ${ing.unit} ${ing.ingredients?.name}`).join('\n')}
        
        Instrucciones detalladas:
        ${recipe.instructions}
      `;

      const prompt = `
        Como chef experto, genera 3 preguntas cortas sobre esta receta.
        Las preguntas deben ser cortas enfocándote en:

        - Técnicas de preparación y puntos críticos
        - Dudas sobre las instrucciones
        - Métodos de conservación
        
        Contexto de la receta:
        ${recipeContext}

        Formato: Devuelve solo las preguntas, una por línea, sin números ni viñetas.
        Las preguntas deben ser específicas para esta receta y sus características únicas.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: `Eres un chef experto especializado en ${recipe.name} ${recipe.side_dish}.
                     Tu objetivo es ayudar a los usuarios a entender esta receta considerando sus aracterísticas específicas.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 200
      });

      const questions = response.choices[0].message.content?.split('\n')
        .filter(q => q.trim().length > 0)
        .map(q => q.trim())
        .slice(0, 3); // Aseguramos solo 3 preguntas

      return questions || [];
    } catch (error) {
      console.error('Error generating recipe questions:', error);
      return [];
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Regular chat completion with enhanced context
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: recipe ? `Eres un asistente culinario experto ayudando con la receta "${recipe.name} ${recipe.side_dish}".
              Tienes acceso a:
              - Porciones: ${recipe.servings}
              - Tiempo: ${recipe.prep_time}
              - Ingredientes y cantidades: ${recipe.recipe_ingredients?.map(ing => `- ${ing.quantity} ${ing.unit} ${ing.ingredients?.name}`).join('\n')}
              - Instrucciones: ${recipe.instructions}

              Proporciona respuestas concisas con emojis y bien estructuradas.` 
            : 'Eres un asistente culinario experto.'
          },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content }
        ],
        temperature: 0.2,
        max_tokens: 500
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.choices[0].message.content || 'Lo siento, no pude generar una respuesta.',
        timestamp: new Date().toISOString()
      };

      await supabase.from('chat_history').insert({
        user_id: user.id,
        session_id: sessionId,
        content: aiMessage.content,
        role: 'assistant',
        timestamp: aiMessage.timestamp
      });

      setMessages(prev => [...prev, aiMessage]);
      return aiMessage.content;

    } catch (error) {
      console.error('Error in sendMessage:', error);
      setError(error as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [messages, sessionId, recipe]);

  const clearMessages = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setMessages([]);

      await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user.id)
        .eq('session_id', sessionId);

    } catch (error) {
      console.error('Error clearing messages:', error);
      setError(error as Error);
    }
  }, [sessionId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    generateRecipeQuestions
  };
}