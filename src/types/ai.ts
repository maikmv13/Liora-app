import type { Recipe } from './recipe';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type ContextCategory = 
  | 'recipes'
  | 'shopping'
  | 'nutrition'
  | 'planning'
  | 'general';

export interface AIContext {
  userProfile: any;
  favorites: any[];
  weeklyMenu: any[];
  shoppingList: any[];
  categories: ContextCategory[];
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  actions?: {
    type: 'recipe_suggestion' | 'meal_plan' | 'health_tip';
    data: any;
  }[];
}