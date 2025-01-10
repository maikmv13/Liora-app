// Orden definido para las categorías
export const categoryOrder = [
  'Frutas y Verduras',
  'Carnes',
  'Pescados y Mariscos',
  'Lácteos y Huevos',
  'Panadería',
  'Pasta y Arroz',
  'Legumbres',
  'Condimentos y Especias',
  'Conservas',
  'Bebidas',
  'Snacks y Dulces',
  'Otros'
] as const;

// Definición de categorías de alimentos
export const foodCategories = {
  'Frutas y Verduras': [
    'manzana', 'plátano', 'naranja', 'limón', 'tomate', 'lechuga', 'cebolla', 'ajo',
    'zanahoria', 'pimiento', 'pepino', 'calabacín', 'berenjena', 'patata', 'espinaca'
  ],
  'Carnes': [
    'pollo', 'ternera', 'cerdo', 'cordero', 'pavo', 'jamón', 'chorizo', 'salchicha',
    'hamburguesa', 'carne picada'
  ],
  'Pescados y Mariscos': [
    'salmón', 'atún', 'merluza', 'bacalao', 'dorada', 'lubina', 'gambas', 'mejillones',
    'calamares', 'pulpo'
  ],
  'Lácteos y Huevos': [
    'leche', 'yogur', 'queso', 'huevos', 'mantequilla', 'nata', 'requesón', 'crema'
  ],
  'Panadería': [
    'pan', 'baguette', 'pan rallado', 'harina', 'levadura', 'masa'
  ],
  'Pasta y Arroz': [
    'pasta', 'espagueti', 'macarrones', 'arroz', 'fideos', 'cuscús', 'quinoa'
  ],
  'Legumbres': [
    'garbanzos', 'lentejas', 'judías', 'alubias', 'guisantes', 'habas'
  ],
  'Condimentos y Especias': [
    'sal', 'pimienta', 'aceite', 'vinagre', 'orégano', 'tomillo', 'romero',
    'perejil', 'albahaca', 'curry', 'pimentón'
  ],
  'Conservas': [
    'tomate frito', 'atún en lata', 'sardinas', 'maíz', 'aceitunas', 'pepinillos'
  ],
  'Bebidas': [
    'agua', 'vino', 'cerveza', 'refresco', 'zumo'
  ],
  'Snacks y Dulces': [
    'galletas', 'chocolate', 'patatas fritas', 'frutos secos', 'caramelos'
  ],
  'Otros': [] // Categoría por defecto para ingredientes no clasificados
} as const;