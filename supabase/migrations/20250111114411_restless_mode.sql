-- Actualizar las URLs de las imágenes de las recetas con imágenes reales y accesibles
UPDATE recipes
SET image_url = CASE
  WHEN name = 'Albóndigas caseras de cerdo a la barbacoa'
    THEN 'https://images.pexels.com/photos/6941026/pexels-photo-6941026.jpeg'
  WHEN name = 'Pollo al limón con tomillo'
    THEN 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg'
  WHEN name = 'Pollo al ajillo'
    THEN 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg'
  WHEN name = 'Pollo asado al horno'
    THEN 'https://images.pexels.com/photos/2994900/pexels-photo-2994900.jpeg'
  WHEN name = 'Salmón al horno con verduras'
    THEN 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg'
  WHEN name = 'Ensalada mediterránea'
    THEN 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg'
  ELSE image_url
END;

-- Insertar algunas recetas adicionales con imágenes
INSERT INTO recipes (
  name,
  side_dish,
  meal_type,
  category,
  servings,
  calories,
  energy_kj,
  fats,
  saturated_fats,
  carbohydrates,
  sugars,
  fiber,
  proteins,
  sodium,
  prep_time,
  instructions,
  image_url
) VALUES 
(
  'Pasta primavera',
  'con parmesano rallado',
  'comida',
  'Pasta',
  2,
  '480',
  '2009',
  '12',
  '3.5',
  '78',
  '8',
  '6',
  '18',
  '450',
  '25',
  '{"1": "Cocer la pasta al dente", "2": "Saltear las verduras", "3": "Mezclar todo con la salsa"}'::jsonb,
  'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg'
),
(
  'Sopa de verduras',
  'con crutones',
  'cena',
  'Sopas',
  4,
  '220',
  '921',
  '8',
  '1.2',
  '28',
  '12',
  '8',
  '10',
  '380',
  '40',
  '{"1": "Preparar las verduras", "2": "Cocer a fuego lento", "3": "Triturar y servir"}'::jsonb,
  'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg'
);