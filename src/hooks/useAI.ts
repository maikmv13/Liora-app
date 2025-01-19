import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import type { Message, AIContext, ContextCategory } from '../types/ai';
import type { Recipe } from '../types';
import { searchRecipes } from '../services/recipes';

// Actualizamos los tipos para incluir todos los casos
type QueryIntent = {
  type: 'recipe_search' | 'ingredient_based_search' | 'meal_type_search' | 'recipe_step' | 'ingredient_info' | 'cooking_technique' | 'nutrition_info' | 'general';
  confidence: number;
  entities?: {
    recipe?: string;
    ingredient?: string;
    technique?: string;
    step?: number;
  };
};

// Unificamos todas las palabras clave en un solo lugar
const INTENT_KEYWORDS = {
  recipe_search: [
    'receta', 'preparar', 'cocinar', 'hacer', 'elaborar',
    'preparación', 'plato', 'comida', 'cena', 'almuerzo', 'desayuno'
  ],
  ingredient_based_search: [
    'ingredientes', 'tengo', 'usar', 'utilizar', 'aprovechar',
    'con', 'usando'
  ],
  meal_type_search: [
    'vegetariano', 'vegano', 'saludable', 'rápido', 'fácil',
    'ligero', 'postre', 'ensalada'
  ],
  cooking_technique: [
    'técnica', 'método', 'cocer', 'hornear', 'freír', 'saltear'
  ],
  nutrition_info: [
    'calorías', 'proteínas', 'nutrientes', 'saludable', 'dieta'
  ]
};

// Actualizar la interfaz Message (agregar al inicio del archivo)
interface Message {
  id: string;
  role: 'user' | 'assistant';
  type: 'text' | 'card';   // Nuevo campo para diferenciar el tipo de mensaje
  content: string;
  timestamp: string;
  recipe?: Recipe;  // Cambiamos recipes por recipe para tarjetas individuales
}

interface RecipeCardMessage extends Message {
  type: 'card';
  recipe: Recipe;  // Una sola receta por tarjeta
  onView?: () => void;
  onShare?: () => void;
}

interface TextMessage extends Message {
  type: 'text';
}

type ChatMessage = TextMessage | RecipeCardMessage;

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

  return {
    type: detectedType,
    confidence: maxConfidence,
    entities: extractEntities(normalizedContent)
  };
}

// Separamos la extracción de entidades para mayor claridad
function extractEntities(content: string) {
  const entities: QueryIntent['entities'] = {};
  
  // Detectar números de paso
  const stepMatch = content.match(/paso (\d+)/i);
  if (stepMatch) {
    entities.step = parseInt(stepMatch[1]);
  }

  // Detectar ingredientes comunes
  const commonIngredients = ['sal', 'azúcar', 'harina', 'huevos', 'leche'];
  commonIngredients.forEach(ing => {
    if (content.includes(ing)) {
      entities.ingredient = ing;
    }
  });

  return entities;
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
            type: msg.type,
            content: msg.content,
            timestamp: msg.timestamp,
            recipe: msg.recipe
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

      const intent = analyzeQuery(content);
      
      // Mensaje del usuario (siempre tipo texto)
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        type: 'text',
        content,
        timestamp: new Date().toISOString(),
        recipe: recipe
      };
      setMessages(prev => [...prev, userMessage]);

      // Manejar diferentes tipos de intención
      let suggestedRecipes: Recipe[] = [];
      
      // Búsqueda de recetas
      if (['recipe_search', 'ingredient_based_search', 'meal_type_search'].includes(intent.type)) {
        suggestedRecipes = await searchRecipes(content);
        if (suggestedRecipes.length > 0) {
          await handleRecipeSearchResponse(suggestedRecipes, intent.type);
          return;
        }
      }

      // Preguntas sobre pasos específicos
      if (intent.type === 'recipe_step' && intent.entities?.step && recipe) {
        await askAboutStep(intent.entities.step, recipe.instructions);
        return;
      }

      // Respuesta general del chat
      const context = buildAIContext(intent, recipe, suggestedRecipes);
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: getSystemPrompt(recipe, intent) },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: `${context}\n\n${content}` }
        ],
        temperature: 0.2,
        max_tokens: 500
      });

      // Mensaje del asistente (tipo texto para respuestas generales)
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        type: 'text',
        content: response.choices[0].message.content || 'Lo siento, no pude generar una respuesta.',
        timestamp: new Date().toISOString(),
        recipe: recipe
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

  const askAboutStep = async (stepNumber: number, instructions: string | null) => {
    try {
      setLoading(true);
      
      if (!instructions) {
        throw new Error('No se encontraron instrucciones para esta receta');
      }

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
      const messageContent = `💡 *Consulta sobre el Paso ${stepNumber}*:\n"${instructions}"\n\n¿Podrías explicar este paso con más detalle? ¿Hay alguna técnica o consejo especial a tener en cuenta?`;

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

  const handleRecipeSearchResponse = async (
    suggestedRecipes: Recipe[], 
    intentType: QueryIntent['type']
  ) => {
    // Mensaje introductorio
    const introMessage: TextMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      type: 'text',
      content: formatIntroduction(intentType),
      timestamp: new Date().toISOString(),
    };

    // Convertir cada receta en un mensaje tipo card
    const recipeCards: RecipeCardMessage[] = suggestedRecipes.slice(0, 3).map(recipe => ({
      id: crypto.randomUUID(),
      role: 'assistant',
      type: 'card',
      content: '',  // El contenido se maneja en el componente RecipeCard
      timestamp: new Date().toISOString(),
      recipe,  // Pasamos la receta completa
      onView: () => handleViewRecipe(recipe),
      onShare: () => handleShareRecipe(recipe)
    }));

    // Mensaje de seguimiento
    const followUpMessage: TextMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      type: 'text',
      content: '¿Te gustaría saber más detalles sobre alguna de estas recetas?',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, introMessage, ...recipeCards, followUpMessage]);
  };

  const formatIntroduction = (intentType: QueryIntent['type']): string => {
    const intros = {
      recipe_search: 'He encontrado estas recetas que podrían interesarte:',
      ingredient_based_search: 'Basado en los ingredientes mencionados, te sugiero:',
      meal_type_search: 'He encontrado estas opciones que coinciden con tus preferencias:'
    };
    return intros[intentType as keyof typeof intros] || 'Aquí tienes algunas sugerencias:';
  };

  // Funciones auxiliares para manejar las acciones de la tarjeta
  const handleViewRecipe = (recipe: Recipe) => {
    // Aquí puedes implementar la navegación a la vista detallada de la receta
    console.log('Ver receta:', recipe);
    // Por ejemplo:
    // navigate(`/recipes/${recipe.id}`);
  };

  const handleShareRecipe = (recipe: Recipe) => {
    // Implementar la funcionalidad de compartir
    console.log('Compartir receta:', recipe);
    // Por ejemplo:
    // shareRecipe(recipe);
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

// Función auxiliar para construir el contexto según la intención
const buildAIContext = (
  intent: QueryIntent, 
  recipe?: Recipe, 
  suggestedRecipes: Recipe[] = []
): string => {
  let context = '';

  switch (intent.type) {
    case 'ingredient_info':
      if (intent.entities?.ingredient) {
        context = `Información sobre el ingrediente: ${intent.entities.ingredient}`;
      }
      break;
    case 'cooking_technique':
      if (intent.entities?.technique) {
        context = `Explicación sobre la técnica: ${intent.entities.technique}`;
      }
      break;
    case 'nutrition_info':
      if (recipe) {
        context = `
          Información nutricional de la receta:
          - Calorías: ${recipe.calories}
          - Proteínas: ${recipe.proteins}
          - Carbohidratos: ${recipe.carbohydrates}
          - Grasas: ${recipe.fats}
        `;
      }
      break;
    default:
      if (suggestedRecipes.length > 0) {
        context = `Teniendo en cuenta las siguientes recetas sugeridas: ${
          suggestedRecipes.map(r => r.name).join(', ')
        }`;
      }
  }

  return context;
};