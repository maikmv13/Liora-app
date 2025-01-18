import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';
import { categories, mealTypes } from '../types/categories';

interface DBResult<T> {
  data: T | null;
  error: Error | null;
}

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Extraer loadChatHistory para poder reutilizarlo
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
          timestamp: msg.timestamp
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Usar loadChatHistory en useEffect
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Guardar mensaje en la base de datos
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
          session_id: sessionId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const identifyCategory = (content: string): ContextCategory[] => {
    const categories: ContextCategory[] = [];
    
    const patterns = {
      recipes: /receta|cocinar|preparar|plato|comida|cena|menu/i,
      nutrition: /nutrición|calorías|proteínas|dieta|saludable/i,
      planning: /planificar|semana|horario|organizar/i,
      shopping: /comprar|lista|supermercado|ingredientes|falta|necesito/i
    };

    Object.entries(patterns).forEach(([category, pattern]) => {
      if (pattern.test(content)) {
        categories.push(category as ContextCategory);
      }
    });

    return categories.length > 0 ? categories : ['general'];
  };

  const getFilteredContext = async (categories: ContextCategory[]): Promise<AIContext> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const queries = {
      profile: (supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single() as unknown) as Promise<DBResult<AIContext['userProfile']>>,

      weeklyMenu: (supabase
        .from('weekly_menus')
        .select(`
          id,
          user_id,
          monday_breakfast_id,
          monday_lunch_id,
          monday_dinner_id,
          monday_snack_id,
          tuesday_breakfast_id,
          tuesday_lunch_id,
          tuesday_dinner_id,
          tuesday_snack_id,
          wednesday_breakfast_id,
          wednesday_lunch_id,
          wednesday_dinner_id,
          wednesday_snack_id,
          thursday_breakfast_id,
          thursday_lunch_id,
          thursday_dinner_id,
          thursday_snack_id,
          friday_breakfast_id,
          friday_lunch_id,
          friday_dinner_id,
          friday_snack_id,
          saturday_breakfast_id,
          saturday_lunch_id,
          saturday_dinner_id,
          saturday_snack_id,
          sunday_breakfast_id,
          sunday_lunch_id,
          sunday_dinner_id,
          sunday_snack_id,
          monday_breakfast:monday_breakfast_id(id, name, meal_type, category),
          monday_lunch:monday_lunch_id(id, name, meal_type, category),
          monday_dinner:monday_dinner_id(id, name, meal_type, category),
          monday_snack:monday_snack_id(id, name, meal_type, category),
          tuesday_breakfast:tuesday_breakfast_id(id, name, meal_type, category),
          tuesday_lunch:tuesday_lunch_id(id, name, meal_type, category),
          tuesday_dinner:tuesday_dinner_id(id, name, meal_type, category),
          tuesday_snack:tuesday_snack_id(id, name, meal_type, category),
          wednesday_breakfast:wednesday_breakfast_id(id, name, meal_type, category),
          wednesday_lunch:wednesday_lunch_id(id, name, meal_type, category),
          wednesday_dinner:wednesday_dinner_id(id, name, meal_type, category),
          wednesday_snack:wednesday_snack_id(id, name, meal_type, category),
          thursday_breakfast:thursday_breakfast_id(id, name, meal_type, category),
          thursday_lunch:thursday_lunch_id(id, name, meal_type, category),
          thursday_dinner:thursday_dinner_id(id, name, meal_type, category),
          thursday_snack:thursday_snack_id(id, name, meal_type, category),
          friday_breakfast:friday_breakfast_id(id, name, meal_type, category),
          friday_lunch:friday_lunch_id(id, name, meal_type, category),
          friday_dinner:friday_dinner_id(id, name, meal_type, category),
          friday_snack:friday_snack_id(id, name, meal_type, category),
          saturday_breakfast:saturday_breakfast_id(id, name, meal_type, category),
          saturday_lunch:saturday_lunch_id(id, name, meal_type, category),
          saturday_dinner:saturday_dinner_id(id, name, meal_type, category),
          saturday_snack:saturday_snack_id(id, name, meal_type, category),
          sunday_breakfast:sunday_breakfast_id(id, name, meal_type, category),
          sunday_lunch:sunday_lunch_id(id, name, meal_type, category),
          sunday_dinner:sunday_dinner_id(id, name, meal_type, category),
          sunday_snack:sunday_snack_id(id, name, meal_type, category)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1) as unknown) as Promise<DBResult<AIContext['weeklyMenu']>>,

      recipes: (categories.includes('recipes')
        ? supabase
            .from('recipes')
            .select('id, name, meal_type, category')
            .limit(10)
        : Promise.resolve({ data: [] })) as Promise<DBResult<AIContext['recipes']>>,

      shoppingList: (categories.includes('shopping')
        ? supabase
            .from('shopping_list_items')
            .select(`
              id,
              item_name,
              category,
              quantity,
              unit,
              checked,
              shopping_lists!inner (
                id,
                user_id,
                name
              )
            `)
            .eq('shopping_lists.user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        : Promise.resolve({ data: null })) as Promise<DBResult<AIContext['shoppingList']>>,

      favorites: (categories.includes('recipes')
        ? supabase
            .from('favorites')
            .select(`
              id,
              recipe_id,
              created_at,
              notes,
              rating,
              last_cooked,
              tags,
              recipes:recipe_id (
                id,
                name,
                meal_type,
                category,
                instructions
              )
            `)
            .eq('user_id', user.id)
            .order('rating', { ascending: false })
            .limit(5)
        : Promise.resolve({ data: [] })) as Promise<DBResult<AIContext['favorites']>>
    };

    try {
      const [
        { data: profile, error: profileError },
        { data: weeklyMenu, error: weeklyMenuError },
        { data: recipes, error: recipesError },
        { data: shoppingList, error: shoppingListError },
        { data: favorites, error: favoritesError }
      ] = await Promise.all([
        queries.profile,
        queries.weeklyMenu,
        queries.recipes,
        queries.shoppingList,
        queries.favorites
      ]);

      if (profileError) throw profileError;
      if (weeklyMenuError) throw weeklyMenuError;
      if (recipesError) throw recipesError;
      if (shoppingListError) throw shoppingListError;
      if (favoritesError) throw favoritesError;
      if (!profile) throw new Error('Perfil no encontrado');

      return {
        userProfile: profile,
        weeklyMenu: weeklyMenu || [],
        recipes: recipes || [],
        shoppingList: shoppingList,
        favorites: favorites || [],
        categories
      };
    } catch (error) {
      console.error('Error al obtener el contexto:', error);
      throw error;
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      // Crear y guardar mensaje del usuario
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      await saveChatMessage(userMessage);
      setMessages(prev => [...prev, userMessage]);

      const categories = identifyCategory(content);
      const context = await getFilteredContext(categories);

      const systemPrompt = `Eres un asistente experto en nutrición y planificación de comidas. 
        Contexto del usuario:
        - Perfil: ${JSON.stringify(context.userProfile)}
        - Menú semanal actual:
          ${formatWeeklyMenu(context.weeklyMenu[0])}
        - Recetas disponibles: ${context.recipes.length} recetas
        ${context.shoppingList ? `- Lista de compras actual: ${JSON.stringify(context.shoppingList)}` : ''}
        
        Instrucciones específicas:
        - Si el usuario pregunta sobre ingredientes o compras, consulta la lista de compras actual
        - Si sugiere nuevas recetas, considera los ingredientes disponibles
        - Usa formato Markdown para resaltar información importante
        - Responde de manera concisa y práctica
        
        Responde en español y usa emojis cuando sea apropiado.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content }
        ]
      });

      // Crear y guardar respuesta de la IA
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
  }, [messages, loading]);

  const clearMessages = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Limpiar mensajes en la UI
      setMessages([]);

      // Borrar todos los mensajes del usuario en la base de datos
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting messages:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error clearing messages:', error);
      // Recargar mensajes si hay error
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
// Función mejorada para formatear el menú
const formatWeeklyMenu = (menu: AIContext['weeklyMenu'][0]) => {
  if (!menu) {
    console.log('No hay menú disponible');
    return 'No hay menú semanal configurado';
  }
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  const mealMapping = {
    'desayuno': 'breakfast',
    'comida': 'lunch',
    'cena': 'dinner',
    'snack': 'snack'
  } as const;
  
  const dayMap: Record<string, typeof days[number]> = {
    'lunes': 'monday',
    'martes': 'tuesday',
    'miércoles': 'wednesday',
    'jueves': 'thursday',
    'viernes': 'friday',
    'sábado': 'saturday',
    'domingo': 'sunday'
  };

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
  const mappedDay = dayMap[today];
  const todayIndex = days.indexOf(mappedDay);
  
  if (todayIndex === -1) {
    console.log('Error: día no encontrado');
    return 'Error al obtener el día actual';
  }
  
  const todayMeals = mealTypes.map(type => {
    const mealKey = mealMapping[type.id as keyof typeof mealMapping];
    const mealIdKey = `${days[todayIndex]}_${mealKey}_id` as keyof typeof menu;
    const mealInfoKey = `${days[todayIndex]}_${mealKey}` as keyof typeof menu;
    const mealInfo = menu[mealInfoKey];
    
    console.log(`Comida ${type.id}:`, {
      idKey: mealIdKey,
      infoKey: mealInfoKey,
      info: mealInfo,
      type
    });
    
    return `${type.emoji} ${type.label}: ${
      mealInfo ? (mealInfo as any).name || 'No planificado' : 'No planificado'
    }`;
  }).join('\n        ');

  return `Menú de hoy (${today}):\n        ${todayMeals}`;
};
