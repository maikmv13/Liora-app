import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';
import type { Recipe } from '../types';

export function useAI() {
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
      const prompt = `Genera 5 preguntas cortas y específicas sobre la receta "${recipe.name}". 
      Considera:
      1. Ingredientes y sustitutos
      2. Técnicas de preparación
      3. Aspectos nutricionales
      4. Consejos y trucos
      5. Problemas comunes y soluciones
      
      Formatea: Devuelve solo las preguntas, una por línea, sin números ni viñetas.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a culinary expert assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      const questions = response.choices[0].message.content?.split('\n')
        .filter(q => q.trim().length > 0)
        .map(q => q.trim());

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

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      // Save user message
      await supabase.from('chat_history').insert({
        user_id: user.id,
        session_id: sessionId,
        content,
        role: 'user',
        timestamp: userMessage.timestamp
      });

      setMessages(prev => [...prev, userMessage]);

      // Check if it's a recipe question generation request
      if (content.includes('Generate 5 short, specific questions')) {
        const questions = content.split('\n')
          .filter(q => q.trim().length > 0 && !q.includes('Generate'))
          .map(q => q.trim());

        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: questions.join('\n'),
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
        return questions;
      }

      // Regular chat completion
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a culinary expert assistant.' },
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
  }, [messages, sessionId]);

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