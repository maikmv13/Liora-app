-- Modificar la tabla de favoritos para usar el nombre de la receta como referencia
ALTER TABLE favorites
DROP CONSTRAINT IF EXISTS favorites_recipe_id_fkey,
ALTER COLUMN recipe_id TYPE text,
ADD CONSTRAINT favorites_recipe_id_fkey 
  FOREIGN KEY (recipe_id) 
  REFERENCES recipes(name)
  ON DELETE CASCADE;

-- Actualizar las políticas de favoritos
DROP POLICY IF EXISTS "Users can read own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

-- Crear nuevas políticas más permisivas
CREATE POLICY "Enable read access for own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own favorites"
  ON favorites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);