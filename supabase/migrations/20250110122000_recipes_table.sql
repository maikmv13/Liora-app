/*
  # Create recipes table and related structures
  
  1. New Tables
    - `recipes`
      - Todos los campos necesarios para almacenar la información de las recetas
    - `ingredients`
      - Para almacenar los ingredientes de forma normalizada
    - `recipe_ingredients`
      - Tabla de relación entre recetas e ingredientes
*/

-- Crear tipo enum para unidades
CREATE TYPE unit_type AS ENUM (
  'sobre', 'gramo', 'unidad', 'pizca', 'cucharada', 'cucharadita'
);

-- Crear tipo enum para categorías
CREATE TYPE meal_category AS ENUM (
  'Carnes', 'Pescados', 'Vegetariano', 'Pasta', 'Sopas', 'Ensaladas'
);

-- Crear tipo enum para tipos de comida
CREATE TYPE meal_type AS ENUM (
  'desayuno', 'comida', 'cena', 'snack'
);

-- Crear tabla de recetas
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  side_dish text,
  meal_type meal_type NOT NULL,
  category meal_category NOT NULL,
  servings integer NOT NULL,
  calories text,
  energy_kj text,
  fats text,
  saturated_fats text,
  carbohydrates text,
  sugars text,
  fiber text,
  proteins text,
  sodium text,
  prep_time text,
  instructions jsonb NOT NULL,
  url text,
  pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de ingredientes
CREATE TABLE ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

-- Crear tabla de relación recetas-ingredientes
CREATE TABLE recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  ingredient_id uuid REFERENCES ingredients ON DELETE CASCADE,
  quantity numeric NOT NULL,
  unit unit_type NOT NULL,
  UNIQUE(recipe_id, ingredient_id)
);

-- Habilitar RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Todos pueden leer recetas"
  ON recipes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden modificar recetas"
  ON recipes FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM profiles 
    WHERE user_type = 'nutritionist'
  ));

-- Políticas similares para ingredientes
CREATE POLICY "Todos pueden leer ingredientes"
  ON ingredients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden modificar ingredientes"
  ON ingredients FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM profiles 
    WHERE user_type = 'nutritionist'
  ));

-- Políticas para recipe_ingredients
CREATE POLICY "Todos pueden leer recipe_ingredients"
  ON recipe_ingredients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden modificar recipe_ingredients"
  ON recipe_ingredients FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM profiles 
    WHERE user_type = 'nutritionist'
  ));

-- Trigger para updated_at en recipes
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();
