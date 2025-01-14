/*
  # Final fix for favorites table RLS policies
  
  1. Changes:
    - Drop all existing policies
    - Create new simplified policies
    - Add proper authentication checks
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON favorites;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON favorites;
DROP POLICY IF EXISTS "Enable update for own records" ON favorites;
DROP POLICY IF EXISTS "Enable delete for own records" ON favorites;

-- Re-enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "favorites_select_policy" 
ON favorites FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "favorites_insert_policy"
ON favorites FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_update_policy"
ON favorites FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_policy"
ON favorites FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Add proper indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_user ON favorites(recipe_id, user_id);

-- Add comments
COMMENT ON POLICY favorites_select_policy ON favorites IS 'Allow authenticated users to view all favorites';
COMMENT ON POLICY favorites_insert_policy ON favorites IS 'Allow users to add their own favorites';
COMMENT ON POLICY favorites_update_policy ON favorites IS 'Allow users to update their own favorites';
COMMENT ON POLICY favorites_delete_policy ON favorites IS 'Allow users to delete their own favorites';