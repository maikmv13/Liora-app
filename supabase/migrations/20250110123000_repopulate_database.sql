-- Primero limpiamos las tablas existentes
DELETE FROM recipe_ingredients;
DELETE FROM recipes;
DELETE FROM ingredients;

-- Actualizar políticas de seguridad para permitir acceso anónimo
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir acceso público a recetas" ON recipes;
CREATE POLICY "Permitir acceso público a recetas"
  ON recipes
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a ingredientes" ON ingredients;
CREATE POLICY "Permitir acceso público a ingredientes"
  ON ingredients
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a recipe_ingredients" ON recipe_ingredients;
CREATE POLICY "Permitir acceso público a recipe_ingredients"
  ON recipe_ingredients
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insertar todas las recetas
INSERT INTO recipes (
  name, side_dish, meal_type, category, servings, 
  calories, energy_kj, fats, saturated_fats, carbohydrates,
  sugars, fiber, proteins, sodium, prep_time, instructions,
  url, pdf_url
) VALUES 
-- Receta 1: Albóndigas
(
  'Albóndigas caseras de cerdo a la barbacoa',
  'con puré de patatas y brócoli salteado',
  'comida',
  'Carnes',
  2,
  '612',
  '2559',
  '24.1',
  '7',
  '58.8',
  '11.4',
  '0.1',
  '32.3',
  '2.36',
  '45',
  '{"Paso 1": "¡Asegúrate de utilizar las cantidades indicadas!", "Paso 2": "En un bol, agrega la carne de cerdo..."}'::jsonb,
  'https://www.hellofresh.es/recipes/albondigas-caseras-de-cerdo-con-salsa-barbacoa-650192f1786cce2df0e0839c',
  'https://www.hellofresh.es/recipecards/card/650192f1786cce2df0e0839c.pdf'
),
-- Receta 2: Pollo al limón
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
);

-- Insertar todos los ingredientes con sus categorías
INSERT INTO ingredients (name, category) VALUES 
  ('Muslos de pollo', 'Carnes'),
  ('Limón', 'Frutas'),
  ('Mostaza', 'Condimentos'),
  ('Miel', 'Condimentos'),
  ('Arroz', 'Cereales'),
  ('Brócoli', 'Vegetales'),
  ('Tomillo', 'Condimentos'),
  ('Cebolla roja', 'Vegetales'),
  ('Harina', 'Cereales'),
  ('Ajo', 'Vegetales'),
  ('Perejil', 'Condimentos'),
  ('Cebolla', 'Vegetales'),
  ('Vinagre balsámico', 'Condimentos'),
  ('Pollo entero', 'Carnes'),
  ('Patatas', 'Vegetales'),
  ('Pimiento rojo', 'Vegetales'),
  ('Pimiento verde', 'Vegetales'),
  ('Romero', 'Condimentos'),
  ('Salsa barbacoa', 'Salsas'),
  ('Sazonador barbacoa', 'Condimentos'),
  ('Caldo de pollo', 'Caldos'),
  ('Panko', 'Cereales'),
  ('Carne de cerdo picada', 'Carnes')
ON CONFLICT (name) DO NOTHING;

-- Relacionar ingredientes con la primera receta (Albóndigas)
WITH recipe_1 AS (SELECT id FROM recipes WHERE name = 'Albóndigas caseras de cerdo a la barbacoa')
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT 
  (SELECT id FROM recipe_1),
  i.id,
  CASE i.name
    WHEN 'Salsa barbacoa' THEN 2
    WHEN 'Sazonador barbacoa' THEN 1
    WHEN 'Caldo de pollo' THEN 1
    WHEN 'Panko' THEN 25
    WHEN 'Carne de cerdo picada' THEN 250
  END,
  CASE i.name
    WHEN 'Salsa barbacoa' THEN 'sobre'
    WHEN 'Sazonador barbacoa' THEN 'sobre'
    WHEN 'Caldo de pollo' THEN 'sobre'
    WHEN 'Panko' THEN 'gramo'
    WHEN 'Carne de cerdo picada' THEN 'gramo'
  END::unit_type
FROM ingredients i
WHERE i.name IN ('Salsa barbacoa', 'Sazonador barbacoa', 'Caldo de pollo', 'Panko', 'Carne de cerdo picada');

-- Relacionar ingredientes con la segunda receta (Pollo al limón)
WITH recipe_2 AS (SELECT id FROM recipes WHERE name = 'Pollo al limón con tomillo')
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT 
  (SELECT id FROM recipe_2),
  i.id,
  CASE i.name
    WHEN 'Muslos de pollo' THEN 280
    WHEN 'Limón' THEN 1
    WHEN 'Arroz' THEN 150
    WHEN 'Brócoli' THEN 250
    WHEN 'Tomillo' THEN 1
    WHEN 'Cebolla roja' THEN 1
    WHEN 'Ajo' THEN 1
  END,
  CASE i.name
    WHEN 'Muslos de pollo' THEN 'gramo'
    WHEN 'Limón' THEN 'unidad'
    WHEN 'Arroz' THEN 'gramo'
    WHEN 'Brócoli' THEN 'gramo'
    WHEN 'Tomillo' THEN 'unidad'
    WHEN 'Cebolla roja' THEN 'unidad'
    WHEN 'Ajo' THEN 'unidad'
  END::unit_type
FROM ingredients i
WHERE i.name IN ('Muslos de pollo', 'Limón', 'Arroz', 'Brócoli', 'Tomillo', 'Cebolla roja', 'Ajo');