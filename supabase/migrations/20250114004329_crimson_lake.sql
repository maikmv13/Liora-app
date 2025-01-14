/*
  # Fix RLS policies for favorites table

  1. Security Changes
    - Drop existing policies
    - Create separate policies for each operation
    - Ensure authenticated users can read all favorites
    - Restrict write operations to own records
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON favorites;

-- Re-enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create separate policies for each operation type
CREATE POLICY "Enable read for authenticated users"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for own records"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

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

-- Add comments
COMMENT ON TABLE favorites IS 'User favorite recipes with personal notes and ratings';
COMMENT ON COLUMN favorites.user_id IS 'Reference to auth.users.id';
COMMENT ON COLUMN favorites.recipe_id IS 'Reference to recipes.id';