-- Crear tabla de favoritos
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  notes text,
  rating integer CHECK (rating >= 0 AND rating <= 5),
  last_cooked timestamptz,
  tags text[],
  UNIQUE(user_id, recipe_id)
);

-- Habilitar RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "Users can read own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites"
  ON favorites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);