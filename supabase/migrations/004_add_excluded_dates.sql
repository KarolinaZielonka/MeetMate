-- Migration: Add excluded_dates column to events table
-- This allows event creators to exclude specific dates within a date range
-- Excluded dates will appear grayed out and won't be selectable by participants

ALTER TABLE events ADD COLUMN excluded_dates TEXT[] DEFAULT '{}';

COMMENT ON COLUMN events.excluded_dates IS 'Array of dates (YYYY-MM-DD) excluded from availability selection';
