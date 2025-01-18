import OpenAI from 'openai';

// En desarrollo, mostramos advertencias en lugar de errores
if (import.meta.env.DEV) {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    console.warn('OpenAI API Key no encontrada en desarrollo. Las claves están configuradas en Netlify para producción.');
  }
  if (!import.meta.env.VITE_OPENAI_ORG_ID) {
    console.warn('OpenAI Organization ID no encontrado en desarrollo. Las claves están configuradas en Netlify para producción.');
  }
}

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'dummy-key-for-dev',
  organization: import.meta.env.VITE_OPENAI_ORG_ID || 'dummy-org-for-dev',
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

// Funciones helper para validación que tienen en cuenta el entorno
export const validateApiKey = () => {
  return import.meta.env.PROD || !!import.meta.env.VITE_OPENAI_API_KEY;
};

export const validateOrgId = () => {
  return import.meta.env.PROD || !!import.meta.env.VITE_OPENAI_ORG_ID;
};

// Helper para verificar si estamos en un entorno donde OpenAI debería funcionar
export const isOpenAIAvailable = () => {
  return import.meta.env.PROD || (validateApiKey() && validateOrgId());
};