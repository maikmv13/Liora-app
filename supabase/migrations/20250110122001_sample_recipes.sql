-- Insertar receta de ejemplo
WITH recipe_insert AS (
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
    instructions,
    url,
    pdf_url
  ) VALUES (
    'Albóndigas caseras de cerdo a la barbacoa',
    'con puré de patatas y brócoli salteado',
    'comida',
    'Carnes',
    2,
    '612 kcal',
    '2559 kJ',
    '24.1 g',
    '7 g',
    '58.8 g',
    '11.4 g',
    '0.1 g',
    '32.3 g',
    '2.36 mg',
    '{"Paso 1": "¡Asegúrate de utilizar las cantidades indicadas...", "Paso 2": "En un bol, agrega la carne de cerdo..."}'::jsonb,
    'https://www.hellofresh.es/recipes/albondigas-caseras-de-cerdo-con-salsa-barbacoa-650192f1786cce2df0e0839c',
    'https://www.hellofresh.es/recipecards/card/650192f1786cce2df0e0839c.pdf'
  ) RETURNING id
),
ingredients_insert AS (
  INSERT INTO ingredients (name) VALUES 
    ('Salsa barbacoa'),
    ('Sazonador barbacoa'),
    ('Caldo de pollo'),
    ('Panko'),
    ('Carne de cerdo picada')
  ON CONFLICT (name) DO NOTHING
  RETURNING id, name
)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT 
  (SELECT id FROM recipe_insert),
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
FROM ingredients_insert i; 