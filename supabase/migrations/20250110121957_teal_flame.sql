/*
  # Add insert policy for profiles table
  
  1. Changes
    - Add policy to allow authenticated users to insert their own profile
*/

-- Add insert policy for profiles table
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add policy to allow authenticated users to read all profiles
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);