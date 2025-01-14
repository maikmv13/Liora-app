/*
  # Fix RLS policies for favorites table - Final version

  1. Security Changes
    - Drop all existing policies
    - Add proper foreign key constraint
    - Create simplified RLS policies
    - Add proper indexes
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for authenticated users" ON favorites;
DROP POLICY IF EXISTS "Enable insert for own records" ON favorites;
DROP POLICY IF EXISTS "Enable update for own records" ON favorites;
DROP POLICY IF EXISTS "Enable delete for own records" ON favorites;

-- Re-enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop and recreate foreign key constraint
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_recipe_id_fkey;
ALTER TABLE favorites 
  ADD CONSTRAINT favorites_recipe_id_fkey 
  FOREIGN KEY (recipe_id) 
  REFERENCES recipes(id)
  ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_recipe ON favorites(user_id, recipe_id);

-- Create simplified policies
CREATE POLICY "Enable read access for all authenticated users"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id)
  );

CREATE POLICY "Enable update for own records"
  ON favorites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for own records"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add validation trigger
CREATE OR REPLACE FUNCTION validate_favorite()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_id matches authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot modify favorites for other users';
  END IF;

  -- Ensure recipe exists
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE id = NEW.recipe_id) THEN
    RAISE EXCEPTION 'Recipe does not exist';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_favorite_trigger
  BEFORE INSERT OR UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION validate_favorite();

-- Add comments
COMMENT ON TABLE favorites IS 'User favorite recipes with personal notes and ratings';
COMMENT ON COLUMN favorites.user_id IS 'Reference to auth.users.id';
COMMENT ON COLUMN favorites.recipe_id IS 'Reference to recipes.id';
COMMENT ON COLUMN favorites.rating IS 'User rating from 1-5';
COMMENT ON COLUMN favorites.notes IS 'Personal notes about the recipe';
COMMENT ON COLUMN favorites.tags IS 'User-defined tags for organization';
COMMENT ON COLUMN favorites.last_cooked IS 'When the recipe was last cooked';