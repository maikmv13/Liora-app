-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Enable profile creation" ON profiles;
DROP POLICY IF EXISTS "Enable profile reading" ON profiles;
DROP POLICY IF EXISTS "Enable profile update" ON profiles;
DROP POLICY IF EXISTS "Enable profile deletion" ON profiles;

-- Asegurarse de que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de perfil al registrarse (más permisiva)
CREATE POLICY "Enable profile creation"
  ON profiles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para leer perfiles (necesario para login y verificación)
CREATE POLICY "Enable profile reading"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Política para actualizar perfil propio
CREATE POLICY "Enable profile update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para eliminar perfil propio
CREATE POLICY "Enable profile deletion"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Asegurar que los permisos están correctamente configurados
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Asegurar que la tabla favorites tiene las políticas correctas
DROP POLICY IF EXISTS "Enable read access for own favorites" ON favorites;
DROP POLICY IF EXISTS "Enable insert for own favorites" ON favorites;
DROP POLICY IF EXISTS "Enable update for own favorites" ON favorites;
DROP POLICY IF EXISTS "Enable delete for own favorites" ON favorites;

CREATE POLICY "Enable read access for own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own favorites"
  ON favorites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Asegurar que las columnas requeridas son NOT NULL
ALTER TABLE profiles 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN full_name SET NOT NULL,
  ALTER COLUMN user_type SET NOT NULL;

-- Asegurar que el trigger de updated_at existe y funciona
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();