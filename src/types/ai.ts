import type { Recipe } from './recipe';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIContext {
  favorites: Recipe[];
  weeklyMenu: any[];
  shoppingList: any[];
  userProfile: any;
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  actions?: {
    type: 'recipe_suggestion' | 'meal_plan' | 'health_tip';
    data: any;
  }[];
}