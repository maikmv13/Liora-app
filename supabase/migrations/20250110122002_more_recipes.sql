/*
  # Add more sample recipes
  
  1. Changes
    - Add three new chicken recipes with their ingredients
*/

-- Primero limpiamos las tablas existentes
DELETE FROM recipe_ingredients;
DELETE FROM recipes;
DELETE FROM ingredients;

-- Luego insertamos las recetas nuevas
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
  url,
  pdf_url
) VALUES 
(
  'Pollo al limón con tomillo',
  'y Arroz',
  'comida',
  'Carnes',
  2,
  '531',
  '2223',
  '6.68',
  '1.55',
  '79.21',
  '10.73',
  '0.49',
  '38.46',
  '400',
  '45',
  '{"1": "Precalienta el horno a 180ºC", "2": "Pela la cebolla y córtala por la mitad", "3": "Corta el limón y exprime", "4": "Agrega los muslos de pollo", "5": "Cocina el arroz", "6": "Sirve todo junto"}'::jsonb,
  'https://www.hellofresh.es/recipes/pollo-limon-arroz-verduras-6373c35108cf0b02479225cf',
  'https://www.hellofresh.es/recipecards/card/pollo-limon-arroz-verduras-6373c35108cf0b02479225cf-39969b5d.pdf'
),
(
  'Pollo al ajillo',
  'con Arroz y Perejil',
  'comida',
  'Carnes',
  2,
  '539',
  '2256',
  '5',
  '1.4',
  '71.1',
  '4.2',
  '0.4',
  '30.4',
  '400',
  '35 min',
  '{"1": "Llena un cazo con el agua para el arroz", "2": "Pela y corta a láminas el ajo", "3": "Cuando el pollo esté listo", "4": "Pica finamente la mitad del perejil"}',
  'https://www.hellofresh.es/recipes/pollo-al-ajillo-640f51570565a60137055b72',
  'https://www.hellofresh.es/recipecards/card/pollo-al-ajillo-640f51570565a60137055b72-1d98e696.pdf'
),
(
  'Pollo asado al horno',
  'con Patatas y Pimiento rojo',
  'comida',
  'Carnes',
  2,
  '620',
  '2595',
  '35',
  '10',
  '35',
  '7',
  '6',
  '45',
  '500',
  '90 min',
  '{"1": "Precalienta el horno a 200ºC", "2": "Pela las Patatas y córtalas", "3": "Corta los Pimiento rojo", "4": "Pela y pica los ajos", "5": "Coloca el pollo en una bandeja", "6": "Mezcla las Patatas y los Pimiento rojo"}',
  '',
  ''
);

-- Insertar nuevos ingredientes
INSERT INTO ingredients (name) VALUES 
  ('Muslos de pollo'),
  ('Limón'),
  ('Mostaza'),
  ('Miel'),
  ('Arroz'),
  ('Brócoli'),
  ('Tomillo'),
  ('Cebolla roja'),
  ('Harina'),
  ('Ajo'),
  ('Perejil'),
  ('Cebolla'),
  ('Vinagre balsámico'),
  ('Pollo entero'),
  ('Patatas'),
  ('Pimiento rojo'),
  ('Pimiento verde'),
  ('Romero')
ON CONFLICT (name) DO NOTHING;

-- Relacionar ingredientes con la primera receta (Pollo al limón)
WITH recipe_1 AS (SELECT id FROM recipes WHERE name = 'Pollo al limón con tomillo')
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT 
  (SELECT id FROM recipe_1),
  i.id,
  CASE i.name
    WHEN 'Muslos de pollo' THEN 280
    WHEN 'Limón' THEN 1
    WHEN 'Mostaza' THEN 1
    WHEN 'Miel' THEN 2
    WHEN 'Arroz' THEN 150
    WHEN 'Brócoli' THEN 250
    WHEN 'Tomillo' THEN 1
    WHEN 'Cebolla roja' THEN 1
    WHEN 'Harina' THEN 10
    WHEN 'Ajo' THEN 1
  END,
  CASE i.name
    WHEN 'Muslos de pollo' THEN 'gramo'
    WHEN 'Limón' THEN 'unidad'
    WHEN 'Mostaza' THEN 'sobre'
    WHEN 'Miel' THEN 'cucharada'
    WHEN 'Arroz' THEN 'gramo'
    WHEN 'Brócoli' THEN 'gramo'
    WHEN 'Tomillo' THEN 'unidad'
    WHEN 'Cebolla roja' THEN 'unidad'
    WHEN 'Harina' THEN 'gramo'
    WHEN 'Ajo' THEN 'unidad'
  END::unit_type
FROM ingredients i
WHERE i.name IN ('Muslos de pollo', 'Limón', 'Mostaza', 'Miel', 'Arroz', 'Brócoli', 'Tomillo', 'Cebolla roja', 'Harina', 'Ajo');

-- Relacionar ingredientes con la segunda receta (Pollo al ajillo)
WITH recipe_2 AS (SELECT id FROM recipes WHERE name = 'Pollo al ajillo')
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT 
  (SELECT id FROM recipe_2),
  i.id,
  CASE i.name
    WHEN 'Muslos de pollo' THEN 250
    WHEN 'Arroz' THEN 150
    WHEN 'Perejil' THEN 1
    WHEN 'Cebolla' THEN 1
    WHEN 'Tomillo' THEN 1
    WHEN 'Ajo' THEN 3
    WHEN 'Harina' THEN 20
  END,
  CASE i.name
    WHEN 'Muslos de pollo' THEN 'gramo'
    WHEN 'Arroz' THEN 'gramo'
    WHEN 'Perejil' THEN 'unidad'
    WHEN 'Cebolla' THEN 'unidad'
    WHEN 'Tomillo' THEN 'unidad'
    WHEN 'Ajo' THEN 'unidad'
    WHEN 'Harina' THEN 'gramo'
  END::unit_type
FROM ingredients i
WHERE i.name IN ('Muslos de pollo', 'Arroz', 'Perejil', 'Cebolla', 'Tomillo', 'Ajo', 'Harina');

-- Relacionar ingredientes con la tercera receta (Pollo asado)
WITH recipe_3 AS (SELECT id FROM recipes WHERE name = 'Pollo asado al horno')
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT 
  (SELECT id FROM recipe_3),
  i.id,
  CASE i.name
    WHEN 'Pollo entero' THEN 1500
    WHEN 'Patatas' THEN 800
    WHEN 'Pimiento rojo' THEN 2
    WHEN 'Pimiento verde' THEN 2
    WHEN 'Romero' THEN 1
    WHEN 'Tomillo' THEN 1
    WHEN 'Limón' THEN 1
  END,
  CASE i.name
    WHEN 'Pollo entero' THEN 'gramo'
    WHEN 'Patatas' THEN 'gramo'
    WHEN 'Pimiento rojo' THEN 'unidad'
    WHEN 'Pimiento verde' THEN 'unidad'
    WHEN 'Romero' THEN 'unidad'
    WHEN 'Tomillo' THEN 'unidad'
    WHEN 'Limón' THEN 'unidad'
  END::unit_type
FROM ingredients i
WHERE i.name IN ('Pollo entero', 'Patatas', 'Pimiento rojo', 'Pimiento verde', 'Romero', 'Tomillo', 'Limón'); 