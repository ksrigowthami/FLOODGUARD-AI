/*
# FloodGuard AI - Complete Database Schema

## Overview
Creates the full backend schema for FloodGuard AI, a flood early warning system.
All tables support multi-user access with Supabase Auth. Public monitoring data
(risk zones, weather, stations, etc.) is readable by anon+authenticated.
User-specific data (alerts read state, SOS requests, settings, chat history)
is owner-scoped to the authenticated user.

## Tables Created

1. **risk_zones** - Geographic flood risk zones with live risk levels
2. **monitoring_stations** - Sensor stations reporting rainfall/water level
3. **rainfall_readings** - Hourly rainfall data (24h history)
4. **water_level_readings** - Water level time-series data
5. **weather_data** - Current weather conditions + forecast
6. **ai_predictions** - 24/48/72h rainfall prediction time-series
7. **ai_model_status** - AI model metadata (accuracy, confidence, uptime)
8. **prediction_model_data** - Risk score, confidence, factor analysis, timeline
9. **alerts** - Flood/rainfall/system alerts with read tracking
10. **historical_floods** - Yearly flood records (2018-2025)
11. **historical_monthly** - Monthly rainfall & water level data
12. **emergency_contacts** - Police/fire/ambulance/helpline numbers
13. **shelters** - Relief shelters with capacity/occupancy
14. **hospitals** - Hospitals with bed availability
15. **sos_requests** - Emergency SOS distress signals (user-scoped)
16. **user_settings** - Per-user app preferences (user-scoped)
17. **chat_messages** - Chatbot conversation history (user-scoped)

## Security
- Public data tables: RLS enabled, anon+authenticated can SELECT
- User-scoped tables: RLS enabled, authenticated users can CRUD their own rows
- All tables use auth.uid() for ownership checks where applicable
*/

-- ============ PUBLIC MONITORING DATA ============

CREATE TABLE IF NOT EXISTS risk_zones (
  id serial PRIMARY KEY,
  name text NOT NULL,
  lat numeric(10,4) NOT NULL,
  lng numeric(10,4) NOT NULL,
  risk text NOT NULL DEFAULT 'low' CHECK (risk IN ('low','moderate','high','critical')),
  population integer NOT NULL DEFAULT 0,
  water_level numeric(5,2) NOT NULL DEFAULT 0,
  rainfall numeric(6,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE risk_zones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_risk_zones" ON risk_zones;
CREATE POLICY "anon_select_risk_zones" ON risk_zones FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS monitoring_stations (
  id text PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'online' CHECK (status IN ('online','warning','offline')),
  rainfall numeric(6,2) NOT NULL DEFAULT 0,
  water_level numeric(5,2) NOT NULL DEFAULT 0,
  last_update text NOT NULL DEFAULT 'just now',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE monitoring_stations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_stations" ON monitoring_stations;
CREATE POLICY "anon_select_stations" ON monitoring_stations FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS rainfall_readings (
  id serial PRIMARY KEY,
  time_label text NOT NULL,
  rainfall numeric(6,2) NOT NULL DEFAULT 0,
  cumulative numeric(8,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rainfall_readings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_rainfall" ON rainfall_readings;
CREATE POLICY "anon_select_rainfall" ON rainfall_readings FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS water_level_readings (
  id serial PRIMARY KEY,
  time_label text NOT NULL,
  level numeric(5,2) NOT NULL DEFAULT 0,
  threshold numeric(5,2) NOT NULL DEFAULT 9.5,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE water_level_readings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_water_levels" ON water_level_readings;
CREATE POLICY "anon_select_water_levels" ON water_level_readings FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS weather_data (
  id serial PRIMARY KEY,
  temp numeric(5,2) NOT NULL,
  humidity integer NOT NULL,
  wind_speed integer NOT NULL,
  wind_direction text NOT NULL DEFAULT 'SW',
  pressure integer NOT NULL,
  visibility numeric(4,1) NOT NULL,
  condition text NOT NULL,
  icon text NOT NULL DEFAULT 'rain',
  forecast jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_weather" ON weather_data;
CREATE POLICY "anon_select_weather" ON weather_data FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS ai_predictions (
  id serial PRIMARY KEY,
  horizon text NOT NULL CHECK (horizon IN ('24h','48h','72h')),
  hour_label text NOT NULL,
  predicted numeric(6,2) NOT NULL,
  actual numeric(6,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_predictions" ON ai_predictions;
CREATE POLICY "anon_select_predictions" ON ai_predictions FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS ai_model_status (
  id serial PRIMARY KEY,
  model text NOT NULL,
  status text NOT NULL DEFAULT 'online',
  accuracy numeric(5,2) NOT NULL DEFAULT 94.2,
  confidence numeric(5,2) NOT NULL DEFAULT 91.5,
  predictions_today integer NOT NULL DEFAULT 127,
  last_training text NOT NULL DEFAULT 'Aug 28, 2026',
  uptime text NOT NULL DEFAULT '99.8%',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_model_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_ai_status" ON ai_model_status;
CREATE POLICY "anon_select_ai_status" ON ai_model_status FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS prediction_model_data (
  id serial PRIMARY KEY,
  risk_score integer NOT NULL DEFAULT 78,
  confidence numeric(5,2) NOT NULL DEFAULT 91.5,
  factors jsonb NOT NULL DEFAULT '[]',
  timeline jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prediction_model_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_pred_model" ON prediction_model_data;
CREATE POLICY "anon_select_pred_model" ON prediction_model_data FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS historical_floods (
  id serial PRIMARY KEY,
  year integer NOT NULL UNIQUE,
  rainfall integer NOT NULL,
  flood_days integer NOT NULL,
  affected integer NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low','moderate','high','critical')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE historical_floods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_historical_floods" ON historical_floods;
CREATE POLICY "anon_select_historical_floods" ON historical_floods FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS historical_monthly (
  id serial PRIMARY KEY,
  month text NOT NULL,
  rainfall integer NOT NULL,
  water_level numeric(5,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE historical_monthly ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_historical_monthly" ON historical_monthly;
CREATE POLICY "anon_select_historical_monthly" ON historical_monthly FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id serial PRIMARY KEY,
  name text NOT NULL,
  number text NOT NULL,
  icon text NOT NULL DEFAULT 'phone',
  color text NOT NULL DEFAULT '#3b82f6',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_emergency_contacts" ON emergency_contacts;
CREATE POLICY "anon_select_emergency_contacts" ON emergency_contacts FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS shelters (
  id serial PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  capacity integer NOT NULL,
  occupied integer NOT NULL DEFAULT 0,
  lat numeric(10,4) NOT NULL,
  lng numeric(10,4) NOT NULL,
  distance text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_shelters" ON shelters;
CREATE POLICY "anon_select_shelters" ON shelters FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS hospitals (
  id serial PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  beds integer NOT NULL,
  available integer NOT NULL,
  lat numeric(10,4) NOT NULL,
  lng numeric(10,4) NOT NULL,
  distance text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_hospitals" ON hospitals;
CREATE POLICY "anon_select_hospitals" ON hospitals FOR SELECT TO anon, authenticated USING (true);

-- ============ ALERTS (public read) ============

CREATE TABLE IF NOT EXISTS alerts (
  id text PRIMARY KEY,
  title text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low','moderate','high','critical')),
  zone text NOT NULL,
  time timestamptz NOT NULL DEFAULT now(),
  message text NOT NULL,
  type text NOT NULL DEFAULT 'flood',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_alerts" ON alerts;
CREATE POLICY "anon_select_alerts" ON alerts FOR SELECT TO anon, authenticated USING (true);

-- ============ USER-SCOPED DATA ============

CREATE TABLE IF NOT EXISTS alert_read_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id text NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(alert_id, user_id)
);

ALTER TABLE alert_read_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_read_states" ON alert_read_states;
CREATE POLICY "select_own_read_states" ON alert_read_states FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_read_states" ON alert_read_states;
CREATE POLICY "insert_own_read_states" ON alert_read_states FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_read_states" ON alert_read_states;
CREATE POLICY "update_own_read_states" ON alert_read_states FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_read_states" ON alert_read_states;
CREATE POLICY "delete_own_read_states" ON alert_read_states FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS sos_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text,
  location text,
  people integer NOT NULL DEFAULT 1,
  urgency text NOT NULL DEFAULT 'critical' CHECK (urgency IN ('critical','high','moderate')),
  lat numeric(10,6),
  lng numeric(10,6),
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sos_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_sos" ON sos_requests;
CREATE POLICY "select_own_sos" ON sos_requests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sos" ON sos_requests;
CREATE POLICY "insert_own_sos" ON sos_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sos" ON sos_requests;
CREATE POLICY "update_own_sos" ON sos_requests FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sos" ON sos_requests;
CREATE POLICY "delete_own_sos" ON sos_requests FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() UNIQUE,
  alert_sound boolean NOT NULL DEFAULT true,
  push_notif boolean NOT NULL DEFAULT true,
  email_notif boolean NOT NULL DEFAULT false,
  auto_refresh boolean NOT NULL DEFAULT true,
  dark_mode boolean NOT NULL DEFAULT true,
  risk_threshold boolean NOT NULL DEFAULT true,
  ai_predictions boolean NOT NULL DEFAULT true,
  data_sharing boolean NOT NULL DEFAULT false,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_settings" ON user_settings;
CREATE POLICY "select_own_settings" ON user_settings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_settings" ON user_settings;
CREATE POLICY "insert_own_settings" ON user_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_settings" ON user_settings;
CREATE POLICY "update_own_settings" ON user_settings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_settings" ON user_settings;
CREATE POLICY "delete_own_settings" ON user_settings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  role text NOT NULL CHECK (role IN ('user','bot')),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chat" ON chat_messages;
CREATE POLICY "select_own_chat" ON chat_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_chat" ON chat_messages;
CREATE POLICY "insert_own_chat" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_chat" ON chat_messages;
CREATE POLICY "delete_own_chat" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_ai_predictions_horizon ON ai_predictions(horizon);
CREATE INDEX IF NOT EXISTS idx_alert_read_states_user ON alert_read_states(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_requests_user ON sos_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
