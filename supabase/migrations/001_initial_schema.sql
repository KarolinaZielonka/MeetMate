-- MeetSync Initial Database Schema
-- This migration creates the core tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  password_hash VARCHAR(255), -- bcrypt hash if password set
  creator_name VARCHAR(100),
  is_locked BOOLEAN DEFAULT FALSE, -- true when admin calculates result
  calculated_date DATE, -- the chosen optimal date
  share_url VARCHAR(50) UNIQUE NOT NULL -- short code for sharing
);

-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  has_submitted BOOLEAN DEFAULT FALSE,
  session_token UUID UNIQUE DEFAULT uuid_generate_v4() -- to prevent duplicate entries
);

-- Availability table
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'unavailable', 'maybe')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, date)
);

-- Indexes for performance
CREATE INDEX idx_events_share_url ON events(share_url);
CREATE INDEX idx_participants_event ON participants(event_id);
CREATE INDEX idx_availability_participant ON availability(participant_id);
CREATE INDEX idx_availability_date ON availability(participant_id, date);

-- Row-Level Security (RLS) Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Events are viewable by anyone with the link
CREATE POLICY "Events are viewable by anyone with the link"
  ON events FOR SELECT
  USING (true);

-- Anyone can insert events
CREATE POLICY "Anyone can create events"
  ON events FOR INSERT
  WITH CHECK (true);

-- Anyone can add participants (after password check if needed)
CREATE POLICY "Anyone can add participants"
  ON participants FOR INSERT
  WITH CHECK (true);

-- Participants are viewable by anyone with event access
CREATE POLICY "Participants are viewable by anyone"
  ON participants FOR SELECT
  USING (true);

-- Anyone can insert availability
CREATE POLICY "Anyone can add availability"
  ON availability FOR INSERT
  WITH CHECK (true);

-- Availability is viewable by anyone with event access
CREATE POLICY "Availability is viewable by anyone"
  ON availability FOR SELECT
  USING (true);

-- Anyone can update their own availability
CREATE POLICY "Anyone can update availability"
  ON availability FOR UPDATE
  USING (true);

-- Comments
COMMENT ON TABLE events IS 'Stores event metadata and configuration';
COMMENT ON TABLE participants IS 'Stores participants for each event';
COMMENT ON TABLE availability IS 'Stores availability selections for each participant';
COMMENT ON COLUMN events.share_url IS 'Unique shareable URL identifier (e.g., sunny-dolphin-42)';
COMMENT ON COLUMN participants.session_token IS 'UUID token for session management without user accounts';
COMMENT ON COLUMN availability.status IS 'Three-state availability: available, maybe, or unavailable';
