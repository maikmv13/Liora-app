import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../services/ai';
import { useActiveProfile } from '../hooks/useActiveProfile';
import { searchRecipes } from '../services/recipes';
import type { Recipe } from '../types';

// ------------------------------------------------------------------
// 1. Tipos de mensaje e intención
// ------------------------------------------------------------------
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Tipos de intención que manejamos
type DetectedIntent = {
  type:
    | 'recipe_search'
    | 'ingredient_based_search'
    | 'meal_type_search'
    | 'recipe_step'
    | 'ingredient_info'
    | 'cooking_technique'
    | 'nutrition_info'
    | 'general';
  confidence: number;
  entities?: {
    recipe?: string;
    ingredient?: string;
    technique?: string;
    step?: number;
  };
};

// ------------------------------------------------------------------
// 2. Función para clasificar intención con GPT (JSON puro)
// ------------------------------------------------------------------
async function classifyIntent(userMessage: string): Promise<DetectedIntent> {
  const classificationPrompt = `
Eres un sistema experto que clasifica consultas culinarias en uno de estos tipos:
- recipe_search
- ingredient_based_search
- meal_type_search
- recipe_step
- ingredient_info
- cooking_technique
- nutrition_info
- general

Devuelve solo JSON con esta forma:
{
  "type": "una_de_las_opciones",
  "confidence": 1,
  "entities": {
    "recipe": "",
    "ingredient": "",
    "technique": "",
    "step": 0
  }
}
Ningún texto adicional.

Consulta del usuario: "${userMessage}"
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Responde solo con JSON. Nada de explicaciones.'
        },
        {
          role: 'user',
          content: classificationPrompt
        }
      ],
      temperature: 0.0,
      max_tokens: 300
    });

    const rawContent = response.choices[0].message?.content || '{}';
    return JSON.parse(rawContent) as DetectedIntent;
  } catch (error) {
    console.error('Error en classifyIntent:', error);
    // Retornamos algo por defecto
    return { type: 'general', confidence: 1, entities: {} };
  }
}

// ------------------------------------------------------------------
// 3. Función para generar respuesta de GPT en "modo general"
// ------------------------------------------------------------------
async function generateGPTText(
  conversation: Message[],
  userMessage: string
): Promise<string> {
  const systemPrompt = `
Eres un asistente culinario experto a nivel general.
Responde con información útil sobre cocina.
No menciones tu proceso interno ni la clasificación.
  `;

  const lastMessages = conversation.slice(-4).map((msg) => ({
    role: msg.role,
    content: msg.content
  }));

  const finalUserContent = `Pregunta del usuario: "${userMessage}"`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...lastMessages,
        { role: 'user', content: finalUserContent }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message?.content?.trim() || '';
  } catch (error) {
    console.error('Error en generateGPTText:', error);
    return 'Lo siento, no pude procesar tu solicitud en este momento.';
  }
}

// ------------------------------------------------------------------
// 4. Función para generar respuesta de GPT en "modo receta concreta"
// ------------------------------------------------------------------
async function generateRecipeGPTText(
  conversation: Message[],
  userMessage: string,
  recipe: Recipe
): Promise<string> {
  // Modificamos el prompt de sistema para ser más flexible
  const systemPrompt = `
Eres un asistente culinario experto.
Tu foco principal es esta receta, pero puedes:
- Sugerir alternativas para sus ingredientes
- Recomendar recetas similares o variaciones
- Dar consejos de preparación y técnicas
- Responder preguntas nutricionales

Receta principal:
- Nombre: ${recipe.name}
- Guarnición: ${recipe.side_dish ?? ''}
- Categoría: ${recipe.category ?? ''}
- Calorías: ${recipe.calories ?? ''}
- Ingredientes (primeros 5): ${
    recipe.recipe_ingredients
      ?.slice(0, 5)
      .map((ri) => `${ri.quantity ?? ''} ${ri.unit ?? ''} ${ri.ingredient?.name ?? ''}`)
      .join(', ') || ''
  }
- Instrucciones (resumen): ${
    typeof recipe.instructions === 'string'
      ? recipe.instructions.slice(0, 300)
      : JSON.stringify(recipe.instructions).slice(0, 300)
  }...
`;

  const lastMessages = conversation.slice(-4).map((msg) => ({
    role: msg.role,
    content: msg.content
  }));

  const finalUserContent = `
Pregunta del usuario: "${userMessage}"
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...lastMessages,
        { role: 'user', content: finalUserContent }
      ],
      temperature: 0.6,
      max_tokens: 500
    });

    return response.choices[0].message?.content?.trim() || '';
  } catch (error) {
    console.error('Error en generateRecipeGPTText:', error);
    return 'Lo siento, no pude procesar tu solicitud en este momento.';
  }
}

// ------------------------------------------------------------------
// 5. useAI Hook (unificado para modo general y modo receta)
// ------------------------------------------------------------------
export function useAI(recipe?: Recipe) {
  const { id, isHousehold } = useActiveProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Función para generar preguntas frecuentes sobre una receta
  const generateRecipeQuestions = useCallback(async (recipeData: Recipe): Promise<string[]> => {
    const recipeContext = `
      Receta: ${recipeData.name}
      Acompañamiento: ${recipeData.side_dish}
      Tipo de comida: ${recipeData.meal_type}
      Categoría: ${recipeData.category}
      
      Información nutricional:
      - Porciones: ${recipeData.servings}
      - Calorías: ${recipeData.calories}
      - Energía (KJ): ${recipeData.energy_kj}
      - Proteínas: ${recipeData.proteins}
      - Carbohidratos: ${recipeData.carbohydrates}
        · Azúcares: ${recipeData.sugars}
        · Fibra: ${recipeData.fiber}
      - Grasas: ${recipeData.fats}
        · Grasas saturadas: ${recipeData.saturated_fats}
      - Sodio: ${recipeData.sodium}
      
      Tiempos:
      - Preparación: ${recipeData.prep_time}
      
      Ingredientes:
      ${recipeData.recipe_ingredients?.map(ing => 
        `- ${ing.quantity} ${ing.unit} ${ing.ingredients?.name}`
      ).join('\n')}
      
      Instrucciones detalladas:
      ${recipeData.instructions}
    `;

    const prompt = `
      Como chef experto, genera 5 preguntas cortas sobre esta receta.
      Las preguntas deben ser cortas enfocándote en:

      - Técnicas de preparación y puntos críticos
      - Dudas sobre las instrucciones
      - Métodos de conservación
      
      Contexto de la receta:
      ${recipeContext}

      Formato: Devuelve solo las preguntas, una por línea, sin números ni viñetas.
      Las preguntas deben ser específicas para esta receta y sus características únicas.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto culinario. Genera preguntas naturales y útiles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      const questions = response.choices[0].message?.content
        ?.trim()
        .split('\n')
        .filter(q => q.length > 0)
        .map(q => q.replace(/^[0-9-.*]\s*/, '')) // Eliminar cualquier numeración
        || [];

      return questions;
    } catch (error) {
      console.error('Error generando preguntas:', error);
      return [
        '¿Qué ingredientes necesito?',
        '¿Cuánto tiempo tarda en prepararse?',
        '¿Cómo puedo conservar este plato?'
      ];
    }
  }, []);

  // Cargar historial de chat (puedes distinguir si es "general" o "por receta" en tu DB)
  useEffect(() => {
    const loadChat = async () => {
      try {
        const matchField = isHousehold ? 'household_id' : 'user_id';

        let query = supabase
          .from('chat_history')
          .select('*')
          .eq(matchField, id)
          .order('timestamp', { ascending: true });

        if (recipe) {
          // Filtramos por la receta específica (si así lo guardas en tu DB)
          query = query.eq('recipe_id', recipe.id);
        } else {
          // Filtramos por "modo general"
          query = query.is('recipe_id', null);
        }

        const { data, error: dbError } = await query;

        if (dbError) throw dbError;
        if (data) {
          const loadedMessages: Message[] = data.map((row: any) => ({
            id: row.id,
            role: row.role,
            content: row.content,
            timestamp: row.timestamp
          }));
          setMessages(loadedMessages);
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    };

    loadChat();
  }, [id, isHousehold, recipe]);

  // ------------------------------------------------------------------
  // 5.1. Enviar mensaje al chat
  // ------------------------------------------------------------------
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        setLoading(true);

        // 1) Creamos mensaje de usuario
        const userMsg: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, userMsg]);
        await saveMessageToDB(userMsg);

        // 2) Clasificamos (para decidir si hay búsqueda, step, etc.)
        const intent = await classifyIntent(content);
        console.log('Intent detectado:', intent);

        // 3) Lógica de respuesta según haya recipe o no:
        if (!recipe) {
          // =======================
          // MODO CHAT GENERAL
          // =======================
          switch (intent.type) {
            case 'recipe_search':
            case 'ingredient_based_search':
            case 'meal_type_search': {
              // Buscar recetas en DB
              const found = await searchRecipes(content);
              if (found.length > 0) {
                // Muestra tarjetas (o al menos un texto con resultados)
                await addAssistantMessage(`He encontrado ${found.length} recetas. Aquí las primeras:`);
                // ... en tu implementación previa mostrabas "cards".
                // Puedes hacerlo con un estado que renderice luego 
                // un componente con esas cards. 
                // Aquí simplemente mostramos texto (por brevedad).
                const top3 = found.slice(0, 3);
                for (const r of top3) {
                  await addAssistantMessage(`• ${r.name} - ${r.calories ?? 'sin calorías'} kcal`);
                }
              } else {
                await addAssistantMessage('No encontré recetas que coincidan con tu búsqueda.');
              }
              break;
            }

            default:
              // Generamos texto normal con GPT
              const textReply = await generateGPTText(messages, content);
              await addAssistantMessage(textReply);
              break;
          }
        } else {
          // =======================
          // MODO RECIPE CONCRETA (modificado para ser más flexible)
          // =======================
          switch (intent.type) {
            case 'recipe_search':
            case 'ingredient_based_search':
            case 'meal_type_search':
              // Ahora permitimos búsquedas relacionadas
              const recipeReply = await generateRecipeGPTText(
                messages,
                `Basándote en ${recipe.name}, ${content}`,
                recipe
              );
              await addAssistantMessage(recipeReply);
              break;

            case 'ingredient_info':
              // Permitimos preguntas sobre alternativas de ingredientes
              const ingredientReply = await generateRecipeGPTText(
                messages,
                `Sobre los ingredientes de ${recipe.name}: ${content}`,
                recipe
              );
              await addAssistantMessage(ingredientReply);
              break;

            case 'recipe_step':
              if (intent.entities?.step) {
                const stepNumber = intent.entities.step;
                const stepQuestion = `
                  Revisando el paso ${stepNumber} de ${recipe.name}. 
                  ${content}
                `;
                const stepReply = await generateRecipeGPTText(messages, stepQuestion, recipe);
                await addAssistantMessage(stepReply);
              } else {
                const generalStepReply = await generateRecipeGPTText(messages, content, recipe);
                await addAssistantMessage(generalStepReply);
              }
              break;

            default:
              // Cualquier otro tipo de pregunta
              const generalReply = await generateRecipeGPTText(messages, content, recipe);
              await addAssistantMessage(generalReply);
              break;
          }
        }
      } catch (err) {
        console.error('Error en sendMessage:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [messages, recipe]
  );

  // ------------------------------------------------------------------
  // 5.2. Guardar mensaje en la DB
  // ------------------------------------------------------------------
  async function saveMessageToDB(msg: Message) {
    try {
      const matchField = isHousehold ? 'household_id' : 'user_id';

      const payload: any = {
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        [matchField]: id
      };

      if (recipe) {
        payload.recipe_id = recipe.id;
      }

      const { error: dbError } = await supabase
        .from('chat_history')
        .insert([payload]);

      if (dbError) {
        console.error('Error saving message:', dbError);
      }
    } catch (err) {
      console.error('Error saveMessageToDB:', err);
    }
  }

  // ------------------------------------------------------------------
  // 5.3. Añadir mensaje de Asistente
  // ------------------------------------------------------------------
  async function addAssistantMessage(content: string) {
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, assistantMsg]);
    await saveMessageToDB(assistantMsg);
  }

  // ------------------------------------------------------------------
  // 5.4. askAboutStep (atajo directo si ya sabemos step e instrucción)
  // ------------------------------------------------------------------
  const askAboutStep = useCallback(
    async (stepNumber: number, instruction: string) => {
      if (!recipe) {
        // Si no hay receta, no hacemos nada
        console.warn('askAboutStep: No recipe context available');
        return;
      }
      setLoading(true);
      try {
        const question = `Estoy revisando el paso ${stepNumber}: "${instruction}". ¿Podrías explicarlo más a fondo?`;
        await sendMessage(question);
      } finally {
        setLoading(false);
      }
    },
    [recipe, sendMessage]
  );

  // ------------------------------------------------------------------
  // 5.5. clearMessages: Borrado del historial
  // ------------------------------------------------------------------
  const clearMessages = useCallback(async () => {
    try {
      const matchField = isHousehold ? 'household_id' : 'user_id';
      let query = supabase.from('chat_history').delete().eq(matchField, id);

      if (recipe) {
        query = query.eq('recipe_id', recipe.id);
      } else {
        query = query.is('recipe_id', null);
      }

      const { error: dbError } = await query;
      if (dbError) throw dbError;

      setMessages([]);
    } catch (err) {
      console.error('Error clearing messages:', err);
      setError(err as Error);
    }
  }, [id, isHousehold, recipe]);

  // ------------------------------------------------------------------
  // Retornamos lo necesario
  // ------------------------------------------------------------------
  return {
    messages,
    loading,
    error,
    sendMessage,
    askAboutStep,
    clearMessages,
    generateRecipeQuestions
  };
}
