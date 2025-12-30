-- Add UPDATE policy for participants table
-- This allows the API to update has_submitted status when availability is submitted

CREATE POLICY "Anyone can update participants"
  ON participants FOR UPDATE
  USING (true);

-- Comment
COMMENT ON POLICY "Anyone can update participants" ON participants IS 'Allows updating participant status (e.g., has_submitted flag)';
