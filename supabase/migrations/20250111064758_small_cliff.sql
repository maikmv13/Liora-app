-- Eliminar políticas existentes de profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;

-- Crear nuevas políticas más permisivas para profiles
CREATE POLICY "Enable insert for authentication"
  ON profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Enable update for users based on user_id"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
  ON profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Asegurarse de que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;