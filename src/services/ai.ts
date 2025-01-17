import OpenAI from 'openai';
import type { AIContext, AIResponse } from '../types/ai';

// Check for API key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_ORG_ID = import.meta.env.VITE_OPENAI_ORG_ID;

let openai: OpenAI | null = null;

// Only initialize if API key is available
if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    organization: OPENAI_ORG_ID,
    dangerouslyAllowBrowser: true // Add this flag for browser usage
  });
}

export class AIService {
  private context: string;
  private systemPrompt: string;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = Boolean(openai);
    this.systemPrompt = `
      Eres Liora, una asistente nutricional experta y amigable. Tu objetivo es ayudar a los usuarios a mantener una alimentación saludable y equilibrada.
      
      Tienes acceso a:
      - Las recetas favoritas del usuario
      - Su historial de menús
      - Sus objetivos nutricionales
      - Sus estadísticas de alimentación
      
      Tus respuestas deben ser:
      1. Personalizadas según el contexto del usuario
      2. Basadas en principios nutricionales sólidos
      3. Prácticas y fáciles de implementar
      4. Empáticas y motivadoras
      
      Evita:
      - Dar consejos médicos específicos
      - Hacer recomendaciones extremas
      - Usar lenguaje técnico complejo
      
      Si no tienes suficiente información para una respuesta precisa, pide amablemente más detalles.
    `.trim();

    this.context = '';
  }

  async chat(message: string, context: AIContext): Promise<AIResponse> {
    try {
      // Check if OpenAI is configured
      if (!this.isConfigured) {
        return {
          text: "Lo siento, el asistente de IA no está configurado en este momento. Por favor, contacta con el soporte técnico.",
          suggestions: [
            "Puedes seguir usando la aplicación normalmente",
            "El asistente estará disponible pronto",
            "Mientras tanto, explora nuestras recetas"
          ]
        };
      }

      // Update context with user data
      this.updateContext(context);

      const completion = await openai!.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: this.systemPrompt 
          },
          { 
            role: "system", 
            content: this.context 
          },
          { 
            role: "user", 
            content: message 
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      });

      const response = completion.choices[0].message.content || '';

      return {
        text: response,
        suggestions: this.extractSuggestions(response),
        actions: this.extractActions(response)
      };
    } catch (error) {
      console.error('Error en chat IA:', error);
      return {
        text: "Lo siento, hay un problema temporal con el asistente. Por favor, inténtalo de nuevo más tarde.",
        suggestions: [
          "Puedes seguir usando la aplicación normalmente",
          "Intenta de nuevo en unos minutos",
          "Si el problema persiste, contacta con soporte"
        ]
      };
    }
  }

  private updateContext(context: AIContext): void {
    const { favorites, weeklyMenu, shoppingList, userProfile } = context;

    this.context = `
      Contexto actual del usuario:
      
      Perfil:
      - Nombre: ${userProfile?.full_name || 'Usuario'}
      - Tipo: ${userProfile?.user_type || 'standard'}
      
      Recetas Favoritas: ${favorites.length} recetas
      ${favorites.slice(0, 5).map(recipe => `- ${recipe.name}`).join('\n')}
      
      Menú Semanal: ${weeklyMenu.length} comidas planificadas
      Lista de Compra: ${shoppingList.length} items
      
      Esta información debe usarse para personalizar las respuestas.
    `.trim();
  }

  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        suggestions.push(line.slice(2).trim());
      }
    }
    
    return suggestions.slice(0, 3); // Limit to top 3 suggestions
  }

  private extractActions(response: string): AIResponse['actions'] {
    const actions: AIResponse['actions'] = [];
    
    // Extract recipe suggestions
    const recipeMatch = response.match(/Receta sugerida: (.*?)(?:\n|$)/);
    if (recipeMatch) {
      actions.push({
        type: 'recipe_suggestion',
        data: { name: recipeMatch[1] }
      });
    }

    // Extract health tips
    const tipMatch = response.match(/Consejo de salud: (.*?)(?:\n|$)/);
    if (tipMatch) {
      actions.push({
        type: 'health_tip',
        data: { tip: tipMatch[1] }
      });
    }

    return actions;
  }
}

export const ai = new AIService();