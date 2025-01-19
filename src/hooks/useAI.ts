import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';
import type { Recipe } from '../types';
import { searchRecipes } from '../services/recipes';

// Primero definimos los tipos de consultas que podemos recibir
type QueryIntent = {
  type: 'recipe_search' | 'recipe_step' | 'ingredient_info' | 'cooking_technique' | 'nutrition_info' | 'general';
  confidence: number;
  entities?: {
    recipe?: string;
    ingredient?: string;
    technique?: string;
    step?: number;
  };
};

// Palabras clave para cada categoría
const INTENT_KEYWORDS = {
  recipe_search: [
    'receta',
    'preparar',
    'cocinar',
    'hacer',
    'elaborar',
    'preparación',
    'plato',
    'comida',
    'cena',
    'almuerzo',
    'desayuno'
  ],
  ingredient_based_search: [
    'ingredientes',
    'tengo',
    'usar',
    'utilizar',
    'aprovechar',
    'con',
    'usando'
  ],
  meal_type_search: [
    'vegetariano',
    'vegano',
    'saludable',
    'rápido',
    'fácil',
    'ligero',
    'postre',
    'ensalada'
  ]
};

function analyzeQuery(content: string): QueryIntent {
  const normalizedContent = content.toLowerCase();
  let maxConfidence = 0;
  let detectedType: QueryIntent['type'] = 'general';

  // Analizar cada tipo de intención
  Object.entries(INTENT_KEYWORDS).forEach(([type, keywords]) => {
    const matchCount = keywords.reduce((count, keyword) => {
      return count + (normalizedContent.includes(keyword) ? 1 : 0);
    }, 0);
    
    const confidence = matchCount / keywords.length;
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      detectedType = type as QueryIntent['type'];
    }
  });

  // Extraer entidades relevantes
  const entities: QueryIntent['entities'] = {};
  
  // Detectar números de paso
  const stepMatch = content.match(/paso (\d+)/i);
  if (stepMatch) {
    entities.step = parseInt(stepMatch[1]);
  }

  // Detectar nombres de ingredientes (ejemplo simplificado)
  const commonIngredients = ['sal', 'azúcar', 'harina', 'huevos', 'leche'];
  commonIngredients.forEach(ing => {
    if (normalizedContent.includes(ing)) {
      entities.ingredient = ing;
    }
  });

  return {
    type: detectedType,
    confidence: maxConfidence,
    entities
  };
}

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

      const normalizedContent = content.toLowerCase();
      
      // Crear mensaje del usuario
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Detectar intención de búsqueda de recetas
      const isRecipeSearch = INTENT_KEYWORDS.recipe_search.some(keyword => 
        normalizedContent.includes(keyword)
      );

      const isIngredientBasedSearch = INTENT_KEYWORDS.ingredient_based_search.some(keyword => 
        normalizedContent.includes(keyword)
      );

      const isMealTypeSearch = INTENT_KEYWORDS.meal_type_search.some(keyword => 
        normalizedContent.includes(keyword)
      );

      // Si es una búsqueda relacionada con recetas
      if (isRecipeSearch || isIngredientBasedSearch || isMealTypeSearch) {
        const suggestedRecipes = await searchRecipes(content);
        
        if (suggestedRecipes.length > 0) {
          // Mensaje introductorio según el tipo de búsqueda
          let introMessage = 'He encontrado estas recetas que podrían interesarte:';
          
          if (isIngredientBasedSearch) {
            introMessage = 'Puedes preparar estas recetas con esos ingredientes:';
          } else if (isMealTypeSearch) {
            introMessage = 'Aquí tienes algunas opciones que coinciden con lo que buscas:';
          }

          // Enviar mensaje con la primera receta
          const recipeMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: introMessage,
            timestamp: new Date().toISOString(),
            recipe: suggestedRecipes[0]
          };
          
          setMessages(prev => [...prev, recipeMessage]);

          // Si hay más recetas, sugerir explorarlas
          if (suggestedRecipes.length > 1) {
            const suggestionsMessage: Message = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: '¿Te gustaría ver más recetas similares? Puedo mostrarte otras opciones.',
              timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, suggestionsMessage]);
          }
          
          return;
        } else {
          // Si no encontramos recetas, continuar con una respuesta normal
          const noRecipesMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'No he encontrado recetas exactas para tu búsqueda, pero puedo ayudarte a encontrar alternativas. ¿Qué tipo de plato te gustaría preparar?',
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, noRecipesMessage]);
          return;
        }
      }

      // Si no es una búsqueda de recetas, continuar con la respuesta normal del chat
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: getSystemPrompt(recipe, analyzeQuery(content))
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

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in sendMessage:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [messages, recipe]);

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

  const askAboutStep = async (stepNumber: number, instruction: string) => {
    try {
      setLoading(true);
      
      // Primero expandimos el chat y cambiamos a la pestaña de chat
      const recipeQA = document.querySelector('[data-qa-container]');
      if (recipeQA) {
        // Expandir el chat si está cerrado
        const expandButton = recipeQA.querySelector('[data-expand-button]');
        if (expandButton instanceof HTMLElement) {
          const isExpanded = recipeQA.getAttribute('data-expanded') === 'true';
          if (!isExpanded) {
            expandButton.click();
          }
        }

        // Cambiar a la pestaña de chat
        const chatTabButton = recipeQA.querySelector('[data-tab="chat"]');
        if (chatTabButton instanceof HTMLElement) {
          chatTabButton.click();
        }
      }

      // Preparamos el contenido del mensaje
      const messageContent = `💡 *Consulta sobre el Paso ${stepNumber}*:\n"${instruction}"\n\n¿Podrías explicar este paso con más detalle? ¿Hay alguna técnica o consejo especial a tener en cuenta?`;

      // Enviamos el mensaje usando la función existente sendMessage
      // que ya maneja el estado de mensajes y la base de datos
      await sendMessage(messageContent);

    } catch (error) {
      console.error('Error asking about step:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    generateRecipeQuestions,
    askAboutStep
  };
}

function getSystemPrompt(recipe: Recipe | undefined, intent: QueryIntent): string {
  let basePrompt = 'Eres un asistente culinario experto';
  
  if (recipe) {
    basePrompt += ` especializado en la receta "${recipe.name} ${recipe.side_dish}".`;
  }

  switch (intent.type) {
    case 'ingredient_info':
      basePrompt += ' Tu objetivo es explicar los ingredientes, sus propiedades y posibles sustitutos.';
      break;
    case 'cooking_technique':
      basePrompt += ' Tu enfoque es explicar técnicas de cocina de manera clara y detallada.';
      break;
    case 'nutrition_info':
      basePrompt += ' Tu prioridad es proporcionar información nutricional precisa y consejos saludables.';
      break;
  }

  return basePrompt;
}

// Función auxiliar para buscar recetas que coincidan con la consulta
async function findMatchingRecipe(query: string): Promise<Recipe | null> {
  try {
    const matchingRecipes = await searchRecipes(query);
    
    // Devolver la primera receta más relevante si existe
    return matchingRecipes.length > 0 ? matchingRecipes[0] : null;

  } catch (error) {
    console.error('Error finding matching recipe:', error);
    return null;
  }
}