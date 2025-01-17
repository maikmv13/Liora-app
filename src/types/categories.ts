import { MealType } from '.';

export const categories = [
  { id: 'Todas', label: 'Todas', emoji: '🍽️' },
  { id: 'Aves', label: 'Aves', emoji: '🍗' },
  { id: 'Carnes', label: 'Carnes', emoji: '🥩' },
  { id: 'Ensaladas', label: 'Ensaladas', emoji: '🥗' },
  { id: 'Fast Food', label: 'Fast Food', emoji: '🍔' },
  { id: 'Legumbres', label: 'Legumbres', emoji: '🫘' },
  { id: 'Pastas y Arroces', label: 'Pastas y Arroces', emoji: '🍝' },
  { id: 'Pescados', label: 'Pescados', emoji: '🐟' },
  { id: 'Sopas y Cremas', label: 'Sopas y Cremas', emoji: '🥣' },
  { id: 'Vegetariano', label: 'Vegetariano', emoji: '🥬' }
] as const;

export const mealTypes: { id: MealType; label: string; emoji: string }[] = [
  { id: 'desayuno', label: 'Desayuno', emoji: '🍳' },
  { id: 'comida', label: 'Comida', emoji: '🍽️' },
  { id: 'snack', label: 'Snack', emoji: '🥨' },
  { id: 'cena', label: 'Cena', emoji: '🌙' }
];

// Orden definido para las categorías
export const categoryOrder = [
  'Carnicería',
  'Pescadería',
  'Charcutería',
  'Vegetales y Legumbres',
  'Frutas',
  'Cereales y Derivados',
  'Lácteos y Derivados',
  'Líquidos y Caldos',
  'Condimentos y Especias',
  'Salsas y Aderezos',
  'Frutos Secos',
  'Otras Categorías'
] as const;

// Definición de categorías de alimentos
export const foodCategories = {
  'Carnicería': [
    'bacon', 'carne de ternera', 'carne picada', 'chorizo', 'filetes de ternera',
    'lomo de cerdo', 'muslos de pollo', 'panceta', 'pechuga de pollo',
    'pollo entero', 'raxo', 'solomillo de cerdo', 'lomo'
  ],
  'Pescadería': [
    'bonito', 'gambas', 'gulas', 'langostinos', 'salmón', 'bacalao'
  ],
  'Charcutería': [
    'jamón ibérico', 'jamón serrano', 'jamón york', 'morcilla'
  ],
  'Vegetales y Legumbres': [
    'aceitunas', 'ajo', 'albahaca fresca', 'apio', 'berenjena', 'boniato',
    'brócoli', 'brotes de espinacas', 'brotes de soja', 'calabacín', 'calabaza',
    'cebolla', 'cebolla roja', 'cebollino', 'chalota', 'champiñones', 'setas',
    'cilantro fresco', 'cogollos de lechuga', 'espinacas', 'guisantes',
    'judías', 'lechuga', 'lentejas', 'maíz', 'patatas', 'pepino',
    'perejil fresco', 'pimiento', 'puerro', 'rúcula', 'tomate',
    'tomate cherry', 'tomate frito', 'zanahoria'
  ],
  'Frutas': [
    'fresas', 'lima', 'limón', 'manzana'
  ],
  'Cereales y Derivados': [
    'arroz', 'espaguetis', 'gnocchi', 'harina', 'macarrones', 'masa de pizza',
    'masa quebrada', 'pan de brioche', 'pan de chapata', 'pan de hamburguesa',
    'pan de molde', 'pan duro', 'pan rallado', 'panecillos de brioche',
    'panko', 'placas de lasaña', 'tortillas de trigo'
  ],
  'Lácteos y Derivados': [
    'mantequilla', 'crema agria', 'pecorino', 'queso', 'queso cheddar',
    'queso crema', 'queso de cabra', 'queso feta', 'queso griego',
    'queso mozzarella', 'queso parmesano', 'queso rallado', 'huevos'
  ],
  'Líquidos y Caldos': [
    'caldo de carne', 'caldo de pescado', 'caldo de pollo', 'caldo de ternera',
    'caldo de verduras', 'leche', 'nata líquida'
  ],
  'Condimentos y Especias': [
    'azafrán', 'azúcar', 'chili en escamas', 'cilantro', 'comino',
    'confitura de fresa', 'eneldo', 'jalapeños', 'jengibre', 'laurel',
    'menta fresca', 'miel', 'especias', 'mostaza', 'nuez moscada',
    'orégano', 'perejil', 'pesto', 'pimentón', 'romero',
    'sazonador barbacoa', 'tomillo'
  ],
  'Salsas y Aderezos': [
    'bechamel', 'guacamole', 'kétchup', 'mayonesa', 'salsa barbacoa',
    'salsa de soja', 'vinagre balsámico', 'vinagre de vino tinto',
    'vino blanco'
  ],
  'Frutos Secos': [
    'almendras', 'arándanos secos', 'cacahuetes', 'nueces', 'pasas'
  ],
  'Otras Categorías': [
    'nachos', 'papel de horno', 'ingredientes al gusto'
  ]
} as const;

export const cuisineTypes = [
  { id: 'italiana', label: 'Italiana', emoji: '🇮🇹' },
  { id: 'mexicana', label: 'Mexicana', emoji: '🇲🇽' },
  { id: 'española', label: 'Española', emoji: '🇪🇸' },
  { id: 'japonesa', label: 'Japonesa', emoji: '🇯🇵' },
  { id: 'china', label: 'China', emoji: '🇨🇳' },
  { id: 'coreana', label: 'Coreana', emoji: '🇰🇷' },
  { id: 'tailandesa', label: 'Tailandesa', emoji: '🇹🇭' },
  { id: 'vietnamita', label: 'Vietnamita', emoji: '🇻🇳' },
  { id: 'india', label: 'India', emoji: '🇮🇳' },
  { id: 'mediterránea', label: 'Mediterránea', emoji: '🌊' },
  { id: 'griega', label: 'Griega', emoji: '🇬🇷' },
  { id: 'turca', label: 'Turca', emoji: '🇹🇷' },
  { id: 'libanesa', label: 'Libanesa', emoji: '🇱🇧' },
  { id: 'marroquí', label: 'Marroquí', emoji: '🇲🇦' },
  { id: 'francesa', label: 'Francesa', emoji: '🇫🇷' },
  { id: 'alemana', label: 'Alemana', emoji: '🇩🇪' },
  { id: 'británica', label: 'Británica', emoji: '🇬🇧' },
  { id: 'americana', label: 'Americana', emoji: '🇺🇸' },
  { id: 'tex-mex', label: 'Tex-Mex', emoji: '🌮' },
  { id: 'brasileña', label: 'Brasileña', emoji: '🇧🇷' },
  { id: 'peruana', label: 'Peruana', emoji: '🇵🇪' },
  { id: 'argentina', label: 'Argentina', emoji: '🇦🇷' },
  { id: 'colombiana', label: 'Colombiana', emoji: '🇨🇴' },
  { id: 'venezolana', label: 'Venezolana', emoji: '🇻🇪' },
  { id: 'caribeña', label: 'Caribeña', emoji: '🌴' },
  { id: 'portuguesa', label: 'Portuguesa', emoji: '🇵🇹' },
  { id: 'rusa', label: 'Rusa', emoji: '🇷🇺' },
  { id: 'polaca', label: 'Polaca', emoji: '🇵🇱' },
  { id: 'nórdica', label: 'Nórdica', emoji: '❄️' },
  { id: 'hawaiana', label: 'Hawaiana', emoji: '🌺' },
  { id: 'fusión', label: 'Fusión', emoji: '🔄' },
  { id: 'vegana', label: 'Vegana', emoji: '🌱' },
  { id: 'vegetariana', label: 'Vegetariana', emoji: '🥗' },
  { id: 'sin_gluten', label: 'Sin Gluten', emoji: '🌾' },
  { id: 'tradicional', label: 'Tradicional', emoji: '📜' },
  { id: 'moderna', label: 'Moderna', emoji: '🎯' },
  { id: 'casera', label: 'Casera', emoji: '🏠' },
  { id: 'callejera', label: 'Callejera', emoji: '🛵' },
  { id: 'gourmet', label: 'Gourmet', emoji: '👨‍🍳' },
  { id: 'saludable', label: 'Saludable', emoji: '💪' },
  { id: 'otra', label: 'Otra', emoji: '🍽️' }
] as const;

// Función helper para obtener el emoji de un tipo de cocina
export const getCuisineEmoji = (cuisineType: string) => {
  const cuisine = cuisineTypes.find(c => c.id === cuisineType);
  return cuisine?.emoji || '🍽️';
};