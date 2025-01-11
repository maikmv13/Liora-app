-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Enable insert for new users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable delete for own profile" ON profiles;

-- Asegurarse de que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de perfil al registrarse
CREATE POLICY "Enable profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política para leer perfiles (necesario para login y verificación)
CREATE POLICY "Enable profile reading"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para actualizar perfil propio
CREATE POLICY "Enable profile update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política para eliminar perfil propio
CREATE POLICY "Enable profile deletion"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Asegurar que la tabla profiles tiene la columna user_id como NOT NULL
ALTER TABLE profiles 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN full_name SET NOT NULL,
  ALTER COLUMN user_type SET NOT NULL;

-- Asegurar que el trigger de updated_at existe
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

-- Asegurar que los permisos están correctamente configurados
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;