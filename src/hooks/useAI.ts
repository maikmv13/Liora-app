import { useState, useCallback } from 'react';
import { ai } from '../services/ai';
import type { Message, AIContext, AIResponse } from '../types/ai';
import { supabase } from '../lib/supabase';
import { useActiveMenu } from './useActiveMenu';
import { useShoppingList } from './useShoppingList';
import { useFavorites } from './useFavorites';

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { menuItems } = useActiveMenu();
  const { shoppingList } = useShoppingList();
  const { favorites } = useFavorites();

  const getUserContext = async (): Promise<AIContext> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return {
      favorites,
      weeklyMenu: menuItems,
      shoppingList,
      userProfile: profile
    };
  };

  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Get context and send to AI
      const context = await getUserContext();
      const response = await ai.chat(content, context);

      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      return response;

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [favorites, menuItems, shoppingList]);

  return {
    messages,
    loading,
    error,
    sendMessage
  };
}