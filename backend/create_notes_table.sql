-- ============================================
-- RUN THIS SQL IN SUPABASE SQL EDITOR
-- ============================================

-- Notes table (investigation documentation)
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'wallet', 'pattern')),
    entity_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes(project_id, entity_type, entity_id);

-- Enable RLS (Row Level Security)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe to re-run)
DROP POLICY IF EXISTS notes_select ON notes;
DROP POLICY IF EXISTS notes_insert ON notes;
DROP POLICY IF EXISTS notes_delete ON notes;

-- RLS Policies for notes (access through project)
CREATE POLICY notes_select ON notes FOR SELECT
    USING (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

CREATE POLICY notes_insert ON notes FOR INSERT
    WITH CHECK (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
        AND created_by = auth.uid()
    );

CREATE POLICY notes_delete ON notes FOR DELETE
    USING (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
        AND created_by = auth.uid()
    );

-- Verify table was created
SELECT 'Notes table created successfully!' AS status;
