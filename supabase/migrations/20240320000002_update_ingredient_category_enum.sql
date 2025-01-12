BEGIN;
  -- Primero, eliminar la columna category
  ALTER TABLE ingredients 
    DROP COLUMN category;

  -- Eliminar el tipo enum existente
  DROP TYPE IF EXISTS ingredient_category;

  -- Crear el nuevo tipo enum
  CREATE TYPE ingredient_category AS ENUM (
    'Carnicería',
    'Cereales y Derivados',
    'Charcutería',
    'Condimentos y Especias',
    'Frutas',
    'Frutos Secos',
    'Ingredientes al gusto',
    'Lácteos, Huevos y Derivados',
    'Legumbres',
    'Líquidos y Caldos',
    'Otras Categorías',
    'Pescadería',
    'Salsas y Aderezos',
    'Vegetales y Legumbres',
    'Aceites',
    'Cafés e infusiones',
    'Confituras'
  );

  -- Añadir la nueva columna category con el tipo correcto
  ALTER TABLE ingredients 
    ADD COLUMN category ingredient_category 
    DEFAULT 'Otras Categorías'::ingredient_category 
    NOT NULL;

COMMIT; 