BEGIN;
  -- Primero hacemos backup del enum actual
  ALTER TYPE unit_type RENAME TO unit_type_old;

  -- Creamos el nuevo enum con todas las unidades permitidas
  CREATE TYPE unit_type AS ENUM (
    'gramo',
    'unidad',
    'cucharadita',
    'cucharada',
    'mililitro',
    'sobre',
    'rebanada',
    'vaso',
    'pizca',
    'litro',
    'hoja'
  );

  -- Convertimos la columna al nuevo tipo
  ALTER TABLE recipe_ingredients 
    ALTER COLUMN unit TYPE unit_type 
    USING unit::text::unit_type;

  -- Eliminamos el enum antiguo
  DROP TYPE unit_type_old;
COMMIT; 