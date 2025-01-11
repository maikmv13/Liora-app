-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Todos pueden leer recetas" ON recipes;
DROP POLICY IF EXISTS "Solo admins pueden modificar recetas" ON recipes;
DROP POLICY IF EXISTS "Todos pueden leer ingredientes" ON ingredients;
DROP POLICY IF EXISTS "Solo admins pueden modificar ingredientes" ON ingredients;
DROP POLICY IF EXISTS "Todos pueden leer recipe_ingredients" ON recipe_ingredients;
DROP POLICY IF EXISTS "Solo admins pueden modificar recipe_ingredients" ON recipe_ingredients;

-- Crear nuevas políticas que permiten lectura anónima
CREATE POLICY "Permitir lectura anónima de recetas"
  ON recipes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir lectura anónima de ingredientes"
  ON ingredients
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir lectura anónima de recipe_ingredients"
  ON recipe_ingredients
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Políticas para modificación (solo para nutricionistas)
CREATE POLICY "Solo nutricionistas pueden modificar recetas"
  ON recipes
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE user_type = 'nutritionist'
    )
  );

CREATE POLICY "Solo nutricionistas pueden modificar ingredientes"
  ON ingredients
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE user_type = 'nutritionist'
    )
  );

CREATE POLICY "Solo nutricionistas pueden modificar recipe_ingredients"
  ON recipe_ingredients
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles 
      WHERE user_type = 'nutritionist'
    )
  );