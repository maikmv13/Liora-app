/*
  # Fix RLS policies for favorites table

  1. Security Changes
    - Drop existing policies to ensure clean state
    - Re-enable RLS with proper policies
    - Add more permissive policies for authenticated users
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can update their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;

-- Re-enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create more permissive policies
CREATE POLICY "Enable read access for authenticated users"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON favorites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);