-- Tipos enumerados
CREATE TYPE exercise_type AS ENUM ('cardio', 'strength', 'flexibility', 'sports');
CREATE TYPE habit_frequency AS ENUM ('daily', 'weekdays', 'weekends', 'custom');
CREATE TYPE day_time AS ENUM ('morning', 'afternoon', 'evening', 'custom');
CREATE TYPE mood_type AS ENUM ('great', 'good', 'meh', 'bad', 'awful');
CREATE TYPE gratitude_category AS ENUM ('achievement', 'relationship', 'personal', 'health', 'other');
CREATE TYPE habit_category AS ENUM (
  'health',
  'exercise',
  'nutrition',
  'personal',
  'productivity',
  'mindfulness',
  'relationships',
  'other'
);

-- Tabla principal de entradas de salud
CREATE TABLE health_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weight', 'water', 'exercise')),
  value NUMERIC NOT NULL, -- peso en kg, agua en ml, ejercicio en minutos
  metadata JSONB DEFAULT '{}'::jsonb,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  willpower_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de objetivos de salud
CREATE TABLE health_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weight', 'water', 'exercise')),
  target_value NUMERIC NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')),
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
  category habit_category NOT NULL DEFAULT 'other',
  frequency habit_frequency NOT NULL DEFAULT 'daily',
  custom_days INTEGER[], -- [1,2,3,4,5,6,7] donde 1 es lunes
  day_time day_time NOT NULL DEFAULT 'morning',
  custom_time TIME, -- Para horario personalizado
  willpower_points INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de seguimiento de hábitos y gratitud
CREATE TABLE daily_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  habit_id UUID REFERENCES habits(id),
  type TEXT NOT NULL CHECK (type IN ('habit', 'mood', 'gratitude')),
  value TEXT NOT NULL,
  notes TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_of_day day_time NOT NULL DEFAULT 'morning',
  willpower_points INTEGER NOT NULL DEFAULT 10,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Constraint para máximo 3 gratitudes por día
  CONSTRAINT max_three_gratitude_per_day 
    CHECK (
      type != 'gratitude' OR
      (SELECT COUNT(*) 
       FROM daily_tracking dt 
       WHERE dt.user_id = daily_tracking.user_id 
       AND dt.date = daily_tracking.date 
       AND dt.type = 'gratitude') <= 3
    ),
  -- Solo un registro por hábito por día
  UNIQUE(habit_id, date) WHERE type = 'habit'
);

-- Tabla de categorías de hábitos
CREATE TABLE habit_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Datos iniciales de categorías
INSERT INTO habit_categories (name, description, icon) VALUES
('Salud', 'Hábitos relacionados con la salud física y mental', 'heart'),
('Ejercicio', 'Actividades físicas y deportivas', 'dumbbell'),
('Nutrición', 'Alimentación y hábitos alimenticios', 'utensils'),
('Desarrollo Personal', 'Crecimiento y aprendizaje', 'book'),
('Productividad', 'Gestión del tiempo y tareas', 'clock'),
('Mindfulness', 'Meditación y consciencia', 'sun'),
('Relaciones', 'Conexiones sociales y familia', 'users'),
('Otros', 'Otros tipos de hábitos', 'star');

-- Índices
CREATE INDEX idx_health_entries_user_date ON health_entries(user_id, date);
CREATE INDEX idx_health_entries_type ON health_entries(type);
CREATE INDEX idx_health_goals_user ON health_goals(user_id, type) WHERE is_active = true;
CREATE INDEX idx_habits_user ON habits(user_id) WHERE is_active = true;
CREATE INDEX idx_daily_tracking_user_date ON daily_tracking(user_id, date);
CREATE INDEX idx_daily_tracking_habit ON daily_tracking(habit_id) WHERE type = 'habit';
CREATE INDEX idx_daily_tracking_type_date ON daily_tracking(type, date);

-- Políticas de seguridad
ALTER TABLE health_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tracking ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can manage their own daily tracking"
ON daily_tracking FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Vista de estadísticas
CREATE VIEW user_stats AS
SELECT 
  user_id,
  SUM(willpower_points) as total_points,
  COUNT(*) FILTER (WHERE date = CURRENT_DATE) as today_entries,
  SUM(willpower_points) FILTER (WHERE date = CURRENT_DATE) as today_points,
  COUNT(DISTINCT date) as active_days
FROM (
  SELECT user_id, date, willpower_points FROM health_entries
  UNION ALL
  SELECT user_id, date, willpower_points FROM daily_tracking
) all_entries
GROUP BY user_id; 