BEGIN;
  -- Verificar si hay valores existentes que no coincidan con el nuevo enum
  CREATE TEMP TABLE invalid_categories AS
  SELECT DISTINCT category 
  FROM recipes 
  WHERE category::text NOT IN (
    'Aves', 'Carnes', 'Ensaladas', 'Fast Food', 'Legumbres', 
    'Pastas y Arroces', 'Pescados', 'Sopas y Cremas', 
    'Vegetariano', 'Desayuno', 'Huevos', 'Snack', 'Otros'
  );

  -- Primero hacemos backup del enum actual
  ALTER TYPE meal_category RENAME TO meal_category_old;

  -- Creamos el nuevo enum con todas las categorías
  CREATE TYPE meal_category AS ENUM (
      'Aves',
      'Carnes',
      'Ensaladas',
      'Fast Food',
      'Legumbres',
      'Pastas y Arroces',
      'Pescados',
      'Sopas y Cremas',
      'Vegetariano',
      'Desayuno',
      'Huevos',
      'Snack',
      'Otros'
  );

  -- Convertimos la columna al nuevo tipo
  ALTER TABLE recipes 
      ALTER COLUMN category TYPE meal_category 
      USING category::text::meal_category;

  -- Eliminamos la tabla temporal antes de eliminar el enum
  DROP TABLE invalid_categories;

  -- Eliminamos el enum antiguo
  DROP TYPE meal_category_old;
COMMIT; 