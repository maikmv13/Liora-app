/*
  # Add RLS policies for favorites table

  1. Security
    - Enable RLS on favorites table
    - Add policies for authenticated users to:
      - Insert their own favorites
      - Read their own favorites
      - Update their own favorites
      - Delete their own favorites

  2. Changes
    - Enable RLS
    - Create CRUD policies
*/

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
  ON favorites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE favorites IS 'User favorite recipes with personal notes and ratings';
COMMENT ON COLUMN favorites.user_id IS 'Reference to auth.users.id';
COMMENT ON COLUMN favorites.recipe_id IS 'Reference to recipes.id';
COMMENT ON COLUMN favorites.rating IS 'User rating from 1-5';
COMMENT ON COLUMN favorites.notes IS 'Personal notes about the recipe';
COMMENT ON COLUMN favorites.tags IS 'User-defined tags for organization';
COMMENT ON COLUMN favorites.last_cooked IS 'When the recipe was last cooked';