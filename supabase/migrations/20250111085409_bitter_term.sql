-- Añadir columna de imagen a la tabla de recetas
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS image_url text;

-- Actualizar las recetas existentes con imágenes de ejemplo
UPDATE recipes
SET image_url = CASE
  WHEN name = 'Albóndigas caseras de cerdo a la barbacoa'
    THEN 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1000'
  WHEN name = 'Pollo al limón con tomillo'
    THEN 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000'
  WHEN name = 'Pollo al ajillo'
    THEN 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=1000'
  WHEN name = 'Pollo asado al horno'
    THEN 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000'
  ELSE null
END;

-- Añadir dos nuevas recetas con imágenes
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
  'Salmón al horno con verduras',
  'con patatas asadas',
  'cena',
  'Pescados',
  2,
  '450',
  '1884',
  '22',
  '4.5',
  '28',
  '3.2',
  '4.8',
  '42',
  '580',
  '35',
  '{"1": "Precalentar el horno a 200ºC", "2": "Preparar el salmón con especias", "3": "Cortar las verduras", "4": "Hornear todo junto 25 minutos"}'::jsonb,
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000'
),
(
  'Ensalada mediterránea',
  'con pan de centeno',
  'comida',
  'Ensaladas',
  2,
  '320',
  '1339',
  '18',
  '3.2',
  '24',
  '6.8',
  '7.2',
  '16',
  '420',
  '15',
  '{"1": "Lavar y cortar las verduras", "2": "Preparar el aderezo", "3": "Mezclar todo y servir"}'::jsonb,
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000'
);