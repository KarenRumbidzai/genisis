-- =====================================================
-- GENESI DATABASE SCHEMA FOR SUPABASE
-- =====================================================
-- This schema creates all the tables needed for the Genesi
-- fertility wellness platform.
-- 
-- To use this:
-- 1. Go to your Supabase dashboard
-- 2. Open the SQL Editor
-- 3. Create a "New Query"
-- 4. Paste this entire file
-- 5. Click "Run"
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Stores user profile information
-- Links to Supabase Auth users
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  email TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 60),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  cycle_length INTEGER DEFAULT 28,
  last_period_date DATE,
  avatar_url TEXT,
  bio TEXT,
  location TEXT DEFAULT 'Zimbabwe'
);

-- =====================================================
-- FERTILITY CHECK RESULTS TABLE
-- Stores results from the fertility assessment
-- =====================================================
CREATE TABLE fertility_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Info
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  
  -- Cycle Health
  cycle_type TEXT CHECK (cycle_type IN ('regular', 'irregular')),
  cycle_length INTEGER,
  missed_periods BOOLEAN DEFAULT FALSE,
  
  -- Symptoms
  pain_level TEXT CHECK (pain_level IN ('none', 'mild', 'moderate', 'severe')),
  heavy_bleeding BOOLEAN DEFAULT FALSE,
  acne BOOLEAN DEFAULT FALSE,
  excess_hair BOOLEAN DEFAULT FALSE,
  fatigue BOOLEAN DEFAULT FALSE,
  pain_during_cycle BOOLEAN DEFAULT FALSE,
  weight_issue BOOLEAN DEFAULT FALSE,
  
  -- History
  known_fibroids BOOLEAN DEFAULT FALSE,
  previous_pregnancy BOOLEAN DEFAULT FALSE,
  miscarriages BOOLEAN DEFAULT FALSE,
  past_infection BOOLEAN DEFAULT FALSE,
  
  -- Trying Duration
  trying_time TEXT CHECK (trying_time IN ('< 6 months', '6-12 months', '1+ year')),
  
  -- Results
  primary_issue TEXT,
  secondary_issue TEXT,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high')),
  confidence_level TEXT CHECK (confidence_level IN ('low', 'moderate', 'high')),
  recommendations JSONB DEFAULT '[]'::jsonb,
  personalized_advice JSONB DEFAULT '[]'::jsonb
);

-- =====================================================
-- FERTILITY LOGS TABLE
-- Daily tracking of symptoms, mood, and cycle data
-- =====================================================
CREATE TABLE fertility_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  log_date DATE NOT NULL,
  
  -- Mood (1-5 scale or text)
  mood TEXT CHECK (mood IN ('terrible', 'low', 'okay', 'good', 'great')),
  
  -- Flow
  flow_level TEXT CHECK (flow_level IN ('none', 'light', 'medium', 'heavy')),
  
  -- Cervical Mucus
  mucus_type TEXT CHECK (mucus_type IN ('none', 'sticky', 'creamy', 'eggwhite', 'watery')),
  
  -- Basal Body Temperature
  temperature DECIMAL(4,2),
  
  -- Symptoms (stored as array)
  symptoms TEXT[] DEFAULT '{}',
  
  -- Quick Actions
  had_sex BOOLEAN DEFAULT FALSE,
  took_meds BOOLEAN DEFAULT FALSE,
  
  -- Notes
  notes TEXT,
  
  -- Ensure one log per day per user
  UNIQUE(user_id, log_date)
);

-- =====================================================
-- OVULATION LOGS TABLE
-- For ovulation tracking with predictions
-- =====================================================
CREATE TABLE ovulation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  log_date DATE NOT NULL,
  
  -- Period tracking
  period BOOLEAN DEFAULT FALSE,
  flow TEXT CHECK (flow IN ('none', 'light', 'medium', 'heavy')),
  
  -- Fertility signs
  mucus TEXT CHECK (mucus IN ('none', 'sticky', 'creamy', 'eggwhite', 'watery')),
  temperature DECIMAL(4,2),
  ovulation_test BOOLEAN DEFAULT FALSE,
  
  -- Intercourse tracking
  had_sex BOOLEAN DEFAULT FALSE,
  
  -- Notes
  notes TEXT,
  
  -- Ensure one log per day per user
  UNIQUE(user_id, log_date)
);

-- =====================================================
-- MEAL PLANS TABLE
-- Stores fertility-focused meal plans
-- =====================================================
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('general', 'pcos', 'fibroids', 'ivf_prep', 'post_surgery', 'ovulation', 'hormonal')),
  duration_days INTEGER DEFAULT 7,
  is_premium BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  meals JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- SAVED MEAL PLANS TABLE
-- Links users to their saved meal plans
-- =====================================================
CREATE TABLE saved_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, meal_plan_id)
);

-- =====================================================
-- ARTICLES TABLE
-- Stores educational content
-- =====================================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tag TEXT,
  category TEXT CHECK (category IN ('causes', 'nutrition', 'herbs', 'medical', 'wellness', 'stories')),
  excerpt TEXT,
  read_time TEXT,
  featured BOOLEAN DEFAULT FALSE,
  conditions TEXT[] DEFAULT '{}',
  body JSONB DEFAULT '[]'::jsonb,
  author TEXT DEFAULT 'Genesi Team',
  image_url TEXT
);

-- =====================================================
-- CYCLE PREDICTIONS TABLE
-- Stores predicted cycle data
-- =====================================================
CREATE TABLE cycle_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  predicted_ovulation DATE,
  predicted_period_start DATE,
  predicted_period_end DATE,
  fertile_window_start DATE,
  fertile_window_end DATE,
  
  confidence_score DECIMAL(3,2),
  algorithm_version TEXT DEFAULT 'v1.0'
);

-- =====================================================
-- USER SETTINGS TABLE
-- Store user preferences
-- =====================================================
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  email_notifications BOOLEAN DEFAULT TRUE,
  cycle_reminders BOOLEAN DEFAULT TRUE,
  ovulation_alerts BOOLEAN DEFAULT TRUE,
  daily_logging_reminder BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '09:00:00',
  
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'en'
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- These ensure users can only access their own data
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fertility_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fertility_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ovulation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Fertility Checks: Users can only access their own results
CREATE POLICY "Users can view own fertility checks" 
  ON fertility_checks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertility checks" 
  ON fertility_checks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fertility checks" 
  ON fertility_checks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fertility checks" 
  ON fertility_checks FOR DELETE 
  USING (auth.uid() = user_id);

-- Fertility Logs: Users can only access their own logs
CREATE POLICY "Users can view own fertility logs" 
  ON fertility_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertility logs" 
  ON fertility_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fertility logs" 
  ON fertility_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fertility logs" 
  ON fertility_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- Ovulation Logs: Users can only access their own logs
CREATE POLICY "Users can view own ovulation logs" 
  ON ovulation_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ovulation logs" 
  ON ovulation_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ovulation logs" 
  ON ovulation_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ovulation logs" 
  ON ovulation_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- Saved Meals: Users can only access their own saved meals
CREATE POLICY "Users can view own saved meals" 
  ON saved_meals FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved meals" 
  ON saved_meals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved meals" 
  ON saved_meals FOR DELETE 
  USING (auth.uid() = user_id);

-- Cycle Predictions: Users can only access their own predictions
CREATE POLICY "Users can view own cycle predictions" 
  ON cycle_predictions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycle predictions" 
  ON cycle_predictions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- User Settings: Users can only access their own settings
CREATE POLICY "Users can view own settings" 
  ON user_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
  ON user_settings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
  ON user_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Articles: Everyone can read (no RLS needed for public content)
-- But we still enable RLS for future flexibility
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view articles" 
  ON articles FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Meal Plans: Everyone can read (no RLS needed for public content)
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meal plans" 
  ON meal_plans FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fertility_logs_updated_at 
  BEFORE UPDATE ON fertility_logs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ovulation_logs_updated_at 
  BEFORE UPDATE ON ovulation_logs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at 
  BEFORE UPDATE ON articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON user_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_fertility_checks_user_id ON fertility_checks(user_id);
CREATE INDEX idx_fertility_checks_created_at ON fertility_checks(created_at);
CREATE INDEX idx_fertility_logs_user_id ON fertility_logs(user_id);
CREATE INDEX idx_fertility_logs_log_date ON fertility_logs(log_date);
CREATE INDEX idx_ovulation_logs_user_id ON ovulation_logs(user_id);
CREATE INDEX idx_ovulation_logs_log_date ON ovulation_logs(log_date);
CREATE INDEX idx_saved_meals_user_id ON saved_meals(user_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_featured ON articles(featured);
CREATE INDEX idx_articles_slug ON articles(slug);

-- =====================================================
-- SEED DATA (Sample Articles)
-- =====================================================
INSERT INTO articles (slug, title, tag, category, excerpt, read_time, featured, body) VALUES
(
  'fibroids-and-fertility',
  'Why fibroid location matters more than size',
  'Fibroids',
  'causes',
  'At 26, a doctor handed me surrogacy and adoption papers. I left that office and cried...',
  '4 min read',
  true,
  '[
    {"type": "lead", "text": "At 26, a doctor handed me surrogacy and adoption papers. I left that office and cried. I felt like a broken machine."},
    {"type": "p", "text": "Growing up in Zimbabwe, painful periods were treated as a silent burden. By 16, I had fibroids that should have raised alarms."},
    {"type": "h2", "text": "Understanding Fibroids"},
    {"type": "p", "text": "Fibroids are non-cancerous growths that develop in or around the uterus. They affect up to 80% of African women by age 50."}
  ]'::jsonb
),
(
  'moringa-fertility',
  'Moringa: the Zimbabwean superfood that supports egg quality',
  'Nutrition',
  'nutrition',
  'Moringa has been growing quietly in Zimbabwean backyards for generations...',
  '5 min read',
  false,
  '[
    {"type": "lead", "text": "Moringa has been growing quietly in Zimbabwean backyards for generations. Science is now catching up."},
    {"type": "p", "text": "Moringa oleifera - known as mupanga in Zimbabwe - is one of the most nutrient-dense plants on earth."}
  ]'::jsonb
),
(
  'causes-of-infertility',
  'Understanding the causes of female infertility',
  'Education',
  'causes',
  'Infertility is not a punishment. It is a medical condition - and many causes are diagnosable...',
  '5 min read',
  false,
  '[
    {"type": "lead", "text": "Infertility is not a punishment. It is a medical condition - and many causes are diagnosable, treatable, and workable."},
    {"type": "h2", "text": "The Most Common Causes"},
    {"type": "list", "items": ["Uterine fibroids", "Ovulation problems", "Blocked fallopian tubes", "Endometriosis", "Hormonal imbalance"]}
  ]'::jsonb
);

-- Seed sample meal plans
INSERT INTO meal_plans (title, description, category, duration_days, tags) VALUES
(
  '7-Day Fertility Boost Meal Plan',
  'A week of nutrient-dense meals featuring Zimbabwean fertility foods like muboora, matemba, and hwakwe.',
  'general',
  7,
  ARRAY['zimbabwean', 'balanced', 'whole-foods']
),
(
  'PCOS-Friendly Nutrition Plan',
  'Low glycemic index meals to help manage insulin resistance and support hormone balance.',
  'pcos',
  14,
  ARRAY['pcos', 'low-gi', 'hormone-balance']
),
(
  'Pre-IVF Preparation Diet',
  'Optimize egg quality and uterine health in the 3 months before IVF.',
  'ivf_prep',
  30,
  ARRAY['ivf', 'egg-quality', 'antioxidants']
);

-- =====================================================
-- END OF SCHEMA
-- =====================================================
