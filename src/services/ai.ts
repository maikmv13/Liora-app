import OpenAI from 'openai';
import type { Message, AIContext, AIResponse } from '../types/ai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_ORG_ID = import.meta.env.VITE_OPENAI_ORG_ID;

if (!OPENAI_API_KEY) {
  console.error('Error: VITE_OPENAI_API_KEY no está configurada');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  organization: OPENAI_ORG_ID || undefined,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
  Eres Liora, una asistente nutricional experta y amigable. Tu objetivo es ayudar a los usuarios a mantener una alimentación saludable y equilibrada.
  
  Instrucciones específicas:
  - Proporciona respuestas concisas y directas
  - Usa lenguaje simple y cotidiano
  - Enfócate en sugerencias prácticas y realizables
  - Basa tus recomendaciones en las recetas disponibles
  
  Evita:
  - Dar consejos médicos específicos
  - Hacer recomendaciones extremas
  - Usar lenguaje técnico complejo
  - Respuestas largas o divagaciones
`.trim();

export async function getAIResponse(messages: Message[], context: AIContext): Promise<AIResponse> {
  try {
    console.log('Enviando mensaje a OpenAI con contexto:', context);
    const contextMessage = formatContext(context);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: contextMessage },
        ...messages.map(msg => ({
          role: msg.role as any, // 'user' | 'assistant' | 'system'
          content: msg.content
        }))
      ],
      temperature: 0.3,
      max_tokens: 300,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    console.log('Respuesta de OpenAI:', completion.choices[0].message);
    const response = completion.choices[0].message.content || '';

    return {
      text: response,
      suggestions: extractSuggestions(response),
      actions: extractActions(response)
    };
  } catch (error) {
    console.error('Error detallado en AI Service:', error);
    throw error;
  }
}

function formatContext(context: AIContext): string {
  const { favorites, weeklyMenu, shoppingList, userProfile } = context;
  console.log('Formateando contexto:', context);
  
  return `
    Contexto actual del usuario:
    - Nombre: ${userProfile?.full_name || 'Usuario'}
    - Favoritos: ${favorites.length} recetas
    - Menú Semanal: ${weeklyMenu.length} comidas
    - Lista de Compra: ${shoppingList.length} items
  `.trim();
}

function extractSuggestions(response: string): string[] {
  const suggestions = response.split('\n')
    .filter(line => line.startsWith('- ') || line.startsWith('* '))
    .map(line => line.slice(2).trim());
  
  return suggestions.slice(0, 3);
}

function extractActions(response: string): AIResponse['actions'] {
  const actions: AIResponse['actions'] = [];
  
  const recipeMatch = response.match(/Receta sugerida: (.*?)(?:\n|$)/);
  if (recipeMatch) {
    actions.push({
      type: 'recipe_suggestion',
      data: { name: recipeMatch[1] }
    });
  }

  return actions;
}