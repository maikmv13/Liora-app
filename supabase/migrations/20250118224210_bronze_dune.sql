/*
  # Update chat history table

  1. Changes
    - Add session_id column with default value
    - Make session_id not nullable
    - Add index on session_id for better query performance

  2. Security
    - Enable RLS
    - Add policy for authenticated users
*/

-- Add session_id column with default value
ALTER TABLE chat_history 
ADD COLUMN session_id UUID NOT NULL DEFAULT gen_random_uuid();

-- Add index for better performance
CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own chat history"
ON chat_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
ON chat_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages"
ON chat_history FOR DELETE
TO authenticated
USING (auth.uid() = user_id);