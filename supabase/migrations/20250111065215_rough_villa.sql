-- Eliminar todas las políticas existentes de profiles
DROP POLICY IF EXISTS "Enable insert for authentication" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;

-- Crear nuevas políticas más permisivas
CREATE POLICY "Enable insert for new users"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable update for own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Asegurarse de que RLS está habilitado pero con políticas permisivas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Asegurarse de que el rol authenticated tiene los permisos necesarios
GRANT ALL ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;