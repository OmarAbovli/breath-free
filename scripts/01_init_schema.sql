-- Quit Vape App - Initial Database Schema
-- This script creates all necessary tables for the vaping cessation support app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  addiction_level INTEGER CHECK (addiction_level >= 1 AND addiction_level <= 10),
  ai_personality TEXT, -- e.g., 'supportive', 'direct', 'gentle'
  daily_goal_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quit Plans table
CREATE TABLE IF NOT EXISTS quit_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  target_quit_date DATE,
  motivation_statement TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaks table (tracks consecutive days without vaping)
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_vape_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Usage Logs table (tracks when user was tempted or used vape)
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN ('temptation', 'relapse', 'victory')),
  description TEXT,
  triggered_by TEXT,
  location TEXT,
  time_of_day TEXT,
  feeling_before TEXT,
  feeling_after TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cravings table (tracks individual cravings and interventions)
CREATE TABLE IF NOT EXISTS cravings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  intensity_level INTEGER CHECK (intensity_level >= 1 AND intensity_level <= 10),
  trigger TEXT,
  location TEXT,
  time_of_day TEXT,
  breathing_completed BOOLEAN DEFAULT FALSE,
  ai_chat_engaged BOOLEAN DEFAULT FALSE,
  duration_seconds INTEGER,
  was_successful BOOLEAN, -- true if user resisted craving
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Memory table (stores conversation history and user preferences for personalization)
CREATE TABLE IF NOT EXISTS ai_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_history JSONB, -- stores message history for context
  common_triggers JSONB, -- array of user's common triggers
  successful_strategies JSONB, -- array of strategies that worked for user
  personal_insights JSONB, -- AI's learned insights about user
  last_conversation TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quit_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cravings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view/edit their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Quit Plans policies
CREATE POLICY "Users can view own quit plans" ON quit_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create quit plans" ON quit_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quit plans" ON quit_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can view own streaks" ON streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON streaks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create streaks" ON streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage Logs policies
CREATE POLICY "Users can view own logs" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create logs" ON usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cravings policies
CREATE POLICY "Users can view own cravings" ON cravings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create cravings" ON cravings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cravings" ON cravings
  FOR UPDATE USING (auth.uid() = user_id);

-- AI Memory policies
CREATE POLICY "Users can view own memory" ON ai_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own memory" ON ai_memory
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create memory" ON ai_memory
  FOR INSERT WITH CHECK (auth.uid() = user_id);
