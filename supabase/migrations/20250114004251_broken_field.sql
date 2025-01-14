/*
  # Fix RLS policies for favorites table - Final attempt

  1. Security Changes
    - Drop all existing policies
    - Re-enable RLS with simplified policies
    - Add basic policy for all authenticated users
    - Add specific policies for user operations
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON favorites;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON favorites;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON favorites;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON favorites;

-- Re-enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create a single policy for all operations
CREATE POLICY "Enable all operations for authenticated users"
  ON favorites
  FOR ALL
  TO authenticated
  USING (
    CASE
      WHEN CURRENT_OPERATION = 'SELECT' THEN true
      ELSE auth.uid() = user_id
    END
  )
  WITH CHECK (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE favorites IS 'User favorite recipes with personal notes and ratings';
COMMENT ON COLUMN favorites.user_id IS 'Reference to auth.users.id';
COMMENT ON COLUMN favorites.recipe_id IS 'Reference to recipes.id';