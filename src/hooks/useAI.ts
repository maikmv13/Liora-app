import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';
import type { Database } from '../types/supabase';
import { categories, mealTypes } from '../types/categories';

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

    type DBResult<T> = { data: T | null; error: Error | null };

    const queries = {
      profile: supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          user_type,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .single() as Promise<DBResult<AIContext['userProfile']>>,
      
      weeklyMenu: (categories.includes('planning') 
        ? supabase
            .from('weekly_menus')
            .select(`
              id,
              user_id,
              status,
              start_date,
              created_at,
              updated_at,
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
              monday_breakfast:monday_breakfast_id(id, name, description, meal_type, category),
              monday_lunch:monday_lunch_id(id, name, description, meal_type, category),
              monday_dinner:monday_dinner_id(id, name, description, meal_type, category),
              monday_snack:monday_snack_id(id, name, description, meal_type, category),
              tuesday_breakfast:tuesday_breakfast_id(id, name, description, meal_type, category),
              tuesday_lunch:tuesday_lunch_id(id, name, description, meal_type, category),
              tuesday_dinner:tuesday_dinner_id(id, name, description, meal_type, category),
              tuesday_snack:tuesday_snack_id(id, name, description, meal_type, category),
              wednesday_breakfast:wednesday_breakfast_id(id, name, description, meal_type, category),
              wednesday_lunch:wednesday_lunch_id(id, name, description, meal_type, category),
              wednesday_dinner:wednesday_dinner_id(id, name, description, meal_type, category),
              wednesday_snack:wednesday_snack_id(id, name, description, meal_type, category),
              thursday_breakfast:thursday_breakfast_id(id, name, description, meal_type, category),
              thursday_lunch:thursday_lunch_id(id, name, description, meal_type, category),
              thursday_dinner:thursday_dinner_id(id, name, description, meal_type, category),
              thursday_snack:thursday_snack_id(id, name, description, meal_type, category),
              friday_breakfast:friday_breakfast_id(id, name, description, meal_type, category),
              friday_lunch:friday_lunch_id(id, name, description, meal_type, category),
              friday_dinner:friday_dinner_id(id, name, description, meal_type, category),
              friday_snack:friday_snack_id(id, name, description, meal_type, category),
              saturday_breakfast:saturday_breakfast_id(id, name, description, meal_type, category),
              saturday_lunch:saturday_lunch_id(id, name, description, meal_type, category),
              saturday_dinner:saturday_dinner_id(id, name, description, meal_type, category),
              saturday_snack:saturday_snack_id(id, name, description, meal_type, category),
              sunday_breakfast:sunday_breakfast_id(id, name, description, meal_type, category),
              sunday_lunch:sunday_lunch_id(id, name, description, meal_type, category),
              sunday_dinner:sunday_dinner_id(id, name, description, meal_type, category),
              sunday_snack:sunday_snack_id(id, name, description, meal_type, category)
            `)
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
        : Promise.resolve({ data: [] })) as Promise<DBResult<AIContext['weeklyMenu']>>,
      
      recipes: (categories.includes('recipes')
        ? supabase
            .from('recipes')
            .select(`
              id,
              name,
              side_dish,
              meal_type,
              category,
              servings,
              calories,
              energy_kj,
              fats,
              saturated_fats,
              carbohydrates,
              sugars,
              fiber,
              proteins,
              sodium,
              prep_time,
              instructions,
              url,
              pdf_url,
              image_url,
              created_at,
              updated_at,
              recipe_ingredients!inner (
                id,
                quantity,
                unit,
                ingredient_id,
                ingredients!inner (
                  id,
                  name,
                  category
                )
              )
            `)
            .order('name')
        : Promise.resolve({ data: [] })) as Promise<DBResult<AIContext['recipes']>>,
      
      shoppingList: (categories.includes('shopping')
        ? supabase
            .from('shopping_lists')
            .select(`
              id,
              user_id,
              name,
              created_at,
              updated_at,
              items:shopping_list_items!inner (
                id,
                name_id,
                item_name,
                category,
                quantity,
                unit,
                checked,
                date,
                created_at,
                updated_at
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        : Promise.resolve({ data: null })) as Promise<DBResult<AIContext['shoppingList']>>
    };

    try {
      const [
        { data: profile, error: profileError },
        { data: weeklyMenu, error: weeklyMenuError },
        { data: recipes, error: recipesError },
        { data: shoppingList, error: shoppingListError }
      ] = await Promise.all([
        queries.profile,
        queries.weeklyMenu,
        queries.recipes,
        queries.shoppingList
      ]);

      if (profileError) throw profileError;
      if (weeklyMenuError) throw weeklyMenuError;
      if (recipesError) throw recipesError;
      if (shoppingListError) throw shoppingListError;
      if (!profile) throw new Error('Perfil no encontrado');

      return {
        userProfile: profile,
        weeklyMenu: weeklyMenu || [],
        recipes: recipes || [],
        shoppingList: shoppingList,
        categories
      };
    } catch (error) {
      console.error('Error al obtener el contexto:', error);
      throw error;
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    try {
      if (loading) return;
      setLoading(true);
      setError(null);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

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

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.choices[0].message.content || 'Lo siento, no pude generar una respuesta.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error en useAI:', error);
      setError(error as Error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. ¿Podrías intentarlo de nuevo?',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  return { messages, sendMessage, loading, error };
}

// Función mejorada para formatear el menú
const formatWeeklyMenu = (menu: AIContext['weeklyMenu'][0]) => {
  if (!menu) {
    console.log('No hay menú disponible');
    return 'No hay menú semanal configurado';
  }
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  const meals = mealTypes.map(type => type.id);
  
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'lowercase' });
  const todayIndex = days.indexOf(today as typeof days[number]);
  
  console.log('Menú actual:', menu);
  console.log('Día actual:', today, 'Índice:', todayIndex);
  
  if (todayIndex === -1) {
    console.log('Error: día no encontrado');
    return 'Error al obtener el día actual';
  }
  
  const todayMeals = meals.map(meal => {
    const mealIdKey = `${days[todayIndex]}_${meal}_id` as keyof typeof menu;
    const mealInfo = menu[mealIdKey];
    const mealType = mealTypes.find(t => t.id === meal);
    
    console.log(`Comida ${meal}:`, {
      key: mealIdKey,
      info: mealInfo,
      type: mealType
    });
    
    return `${mealType?.emoji} ${mealType?.label}: ${
      typeof mealInfo === 'object' && mealInfo 
        ? (mealInfo as any).name || 'No planificado'
        : 'No planificado'
    }`;
  }).join('\n        ');

  return `Menú de hoy (${today}):\n        ${todayMeals}`;
};