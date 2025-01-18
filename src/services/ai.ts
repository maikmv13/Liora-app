import OpenAI from 'openai';

// Configuración de OpenAI
const config: { apiKey: string; organization?: string } = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || ''
};

// Solo añadimos el organization ID si está presente
if (import.meta.env.VITE_OPENAI_ORG_ID) {
  config.organization = import.meta.env.VITE_OPENAI_ORG_ID;
}

// En desarrollo, mostramos advertencias
if (import.meta.env.DEV) {
  if (!config.apiKey) {
    console.warn('OpenAI API Key no encontrada en desarrollo.');
  }
}

export const openai = new OpenAI({
  ...config,
  dangerouslyAllowBrowser: true
});

// Tipos de respuesta comunes
export interface OpenAIResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

// Funciones helper para validación
export const validateApiKey = () => {
  return !!config.apiKey;
};

// Helper para verificar si OpenAI está disponible
export const isOpenAIAvailable = () => {
  return validateApiKey();
};