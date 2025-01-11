-- Actualizar políticas de seguridad para permitir acceso anónimo
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir acceso público a recetas" ON recipes;
CREATE POLICY "Permitir acceso público a recetas"
  ON recipes
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir acceso público a ingredientes" ON ingredients;
CREATE POLICY "Permitir acceso público a ingredientes"
  ON ingredients
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir acceso público a recipe_ingredients" ON recipe_ingredients;
CREATE POLICY "Permitir acceso público a recipe_ingredients"
  ON recipe_ingredients
  FOR SELECT
  USING (true);