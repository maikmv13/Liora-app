/** Tipos de comidas disponibles */
export const MEAL_TYPES = {
  BREAKFAST: 'desayuno',
  LUNCH: 'comida',
  SNACK: 'snack',
  DINNER: 'cena'
} as const;

/** Tipo para las comidas */
export type MealType = typeof MEAL_TYPES[keyof typeof MEAL_TYPES];

/** Lista de días de la semana */
export const DAYS = [
  'Lunes', 
  'Martes', 
  'Miércoles', 
  'Jueves', 
  'Viernes', 
  'Sábado', 
  'Domingo'
] as const;

/** Tipo para los días de la semana */
export type WeekDay = typeof DAYS[number];

/** Mapeo de días en inglés a español */
export const DAY_MAPPING: Record<string, WeekDay> = {
  'monday': 'Lunes',
  'tuesday': 'Martes',
  'wednesday': 'Miércoles',
  'thursday': 'Jueves',
  'friday': 'Viernes',
  'saturday': 'Sábado',
  'sunday': 'Domingo'
};

export const MEAL_MAPPING: Record<MealType, string> = {
  'desayuno': 'breakfast',
  'comida': 'lunch',
  'snack': 'snack',
  'cena': 'dinner'
};