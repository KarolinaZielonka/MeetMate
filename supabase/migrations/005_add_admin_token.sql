-- Security Enhancement: Add admin_token for event creator authentication
-- This migration addresses critical security vulnerabilities:
-- 1. Prevents unauthorized DELETE operations
-- 2. Prevents unauthorized LOCK/REOPEN operations
-- 3. Ensures only event creators can perform admin actions

-- Add admin_token column for event creator authentication
ALTER TABLE events ADD COLUMN admin_token UUID DEFAULT uuid_generate_v4();

-- Create index for admin_token lookups
CREATE INDEX idx_events_admin_token ON events(admin_token);

-- Add comment documenting the purpose
COMMENT ON COLUMN events.admin_token IS 'Secret token for event admin operations (DELETE, LOCK, REOPEN). Only returned to creator on event creation.';

-- Note: RLS policies use USING(true) because authorization is handled at the API layer
-- The admin_token is verified server-side before allowing DELETE/UPDATE operations
-- This approach allows the anon client to read events while the admin client handles mutations
