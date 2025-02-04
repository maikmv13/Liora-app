-- Tipos enumerados
CREATE TYPE exercise_type AS ENUM ('cardio', 'strength', 'flexibility', 'sports');
CREATE TYPE habit_status AS ENUM ('pending', 'completed', 'skipped');
CREATE TYPE gratitude_category AS ENUM ('achievement', 'relationship', 'personal', 'health', 'other');

-- Tabla principal de entradas de salud
CREATE TABLE health_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weight', 'water', 'exercise', 'habit')),
  value NUMERIC NOT NULL, -- peso en kg, agua en ml, ejercicio en minutos
  willpower_points INTEGER NOT NULL DEFAULT 0, -- Puntos ganados por esta entrada
  metadata JSONB DEFAULT '{}'::jsonb, -- Para datos específicos de cada tipo
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de objetivos
CREATE TABLE health_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weight', 'water', 'exercise', 'habit')),
  target_value NUMERIC NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  willpower_reward INTEGER NOT NULL DEFAULT 50, -- Puntos por cumplir el objetivo
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de hábitos
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  target_value INTEGER DEFAULT 1,
  willpower_points INTEGER NOT NULL DEFAULT 10, -- Puntos por completar el hábito
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuración de puntos de voluntad
CREATE TABLE willpower_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  base_points INTEGER NOT NULL, -- Puntos base por tipo de actividad
  multiplier NUMERIC NOT NULL DEFAULT 1.0, -- Multiplicador basado en dificultad/frecuencia
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Datos iniciales de configuración
INSERT INTO willpower_config (type, base_points, multiplier, description) VALUES
('weight', 50, 1.0, 'Puntos por registro de peso'),
('water', 10, 1.0, 'Puntos por registro de agua'),
('exercise', 20, 1.5, 'Puntos por cada 10 minutos de ejercicio'),
('habit', 30, 1.2, 'Puntos base por completar un hábito'),
('gratitude', 10, 1.0, 'Puntos por registro de gratitud diaria');

-- Nueva tabla para registros positivos diarios
CREATE TABLE daily_gratitude (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  category gratitude_category NOT NULL DEFAULT 'other',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  willpower_points INTEGER NOT NULL DEFAULT 10, -- Puntos por registro positivo
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT one_entry_per_day_limit CHECK (
    (SELECT COUNT(*)
     FROM daily_gratitude dg
     WHERE dg.user_id = daily_gratitude.user_id 
     AND dg.date = daily_gratitude.date) <= 3
  )
);

-- Índice para daily_gratitude
CREATE INDEX idx_daily_gratitude_user_date ON daily_gratitude(user_id, date);

-- Política de seguridad para daily_gratitude
CREATE POLICY "Users can manage their own gratitude entries"
ON daily_gratitude FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Habilitar RLS para daily_gratitude
ALTER TABLE daily_gratitude ENABLE ROW LEVEL SECURITY;

-- Actualizar vista de willpower para incluir gratitude
CREATE OR REPLACE VIEW user_willpower_stats AS
SELECT 
  user_id,
  (
    SELECT SUM(willpower_points) 
    FROM (
      SELECT willpower_points FROM health_entries WHERE user_id = he.user_id
      UNION ALL
      SELECT willpower_points FROM daily_gratitude WHERE user_id = he.user_id
    ) all_points
  ) as total_points,
  COUNT(*) FILTER (WHERE date = CURRENT_DATE) as today_entries,
  (
    SELECT SUM(willpower_points) 
    FROM (
      SELECT willpower_points FROM health_entries he2 
      WHERE he2.user_id = he.user_id AND he2.date = CURRENT_DATE
      UNION ALL
      SELECT willpower_points FROM daily_gratitude dg
      WHERE dg.user_id = he.user_id AND dg.date = CURRENT_DATE
    ) today_points
  ) as today_points,
  COUNT(DISTINCT date) as active_days
FROM health_entries he
GROUP BY user_id;

-- Índices
CREATE INDEX idx_health_entries_user_date ON health_entries(user_id, date);
CREATE INDEX idx_health_entries_type ON health_entries(type);
CREATE INDEX idx_health_goals_user ON health_goals(user_id, type) WHERE is_active = true;
CREATE INDEX idx_habits_user ON habits(user_id) WHERE is_active = true;

-- Políticas de seguridad
CREATE POLICY "Users can manage their own health entries"
ON health_entries FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own health goals"
ON health_goals FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own habits"
ON habits FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view willpower config"
ON willpower_config FOR SELECT TO authenticated
USING (true);

-- Habilitar RLS
ALTER TABLE health_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE willpower_config ENABLE ROW LEVEL SECURITY; 