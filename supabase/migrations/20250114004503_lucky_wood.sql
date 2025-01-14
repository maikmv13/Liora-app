/*
  # Fix RLS policies for favorites table

  1. Changes:
    - Drop duplicate policy
    - Add missing indexes
    - Add additional validation
*/

-- Drop duplicate policy if it exists
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON favorites;

-- Create additional index for performance
CREATE INDEX IF NOT EXISTS idx_favorites_recipe ON favorites(recipe_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created ON favorites(created_at DESC);

-- Add validation function for recipe existence
CREATE OR REPLACE FUNCTION check_recipe_exists()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE id = NEW.recipe_id) THEN
    RAISE EXCEPTION 'Recipe with id % does not exist', NEW.recipe_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for recipe validation
DROP TRIGGER IF EXISTS check_recipe_exists_trigger ON favorites;
CREATE TRIGGER check_recipe_exists_trigger
  BEFORE INSERT OR UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION check_recipe_exists();

-- Add comments
COMMENT ON FUNCTION check_recipe_exists IS 'Validates that referenced recipe exists before allowing favorite operations';
COMMENT ON INDEX idx_favorites_recipe IS 'Index to improve recipe lookup performance';
COMMENT ON INDEX idx_favorites_created IS 'Index to improve sorting by creation date';